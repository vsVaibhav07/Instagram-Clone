import sharp from 'sharp';
import cloudinary from '../utils/cloudinary.js';
import Post from '../models/post.model.js';
import User from '../models/user.model.js';
import Comment from '../models/comment.model.js';
import { getUserSocketId, io } from '../socketIO/socketIO.js';


export const addNewPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file;
        const authorId = req.id;

        if (!image) return res.status(400).json({ message: "Image is required" });

        const optimizedImagebuffer = await sharp(image.buffer).resize({ width: 800, heigth: 800, fit: "inside" }).toFormat('jpeg', { quality: 80 }).toBuffer();

        const fileUri = `data:image/jpeg;base64,${optimizedImagebuffer.toString('base64')}`;
        const cloudResponse = await cloudinary.uploader.upload(fileUri);
        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url,
            author: authorId
        });

        const user = await User.findById(authorId);
        if (user) {
            user.posts.push(post._id);
            await user.save();
        }
        await post.populate({ path: 'author', select: '-password' });
        return res.status(201).json({ message: "Post created successfully", post, success: true });
    } catch (error) {
        console.error("Error", error);
    }
}

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).populate({ path: 'author', select: 'username profilePicture' }).populate({ path: 'comments', sort: { createdAt: -1 }, populate: { path: 'author', select: 'username profilePicture' } });

        return res.status(200).json({ message: "Posts fetched successfully", posts, success: true });
    } catch (error) {
        console.error("Error", error);
        return res.status(500).json({ message: "Internal server error", success: false });

    }
}


export const getUserPosts = async (req, res) => {
    try {
        const authorId = req.id;
        const posts = await Post.find({ author: authorId }).sort({ createdAt: -1 }).populate({ path: 'author', select: 'username profilePicture' }).populate({ path: 'comments', sort: { createdAt: -1 }, populate: { path: 'author', select: 'username, profilePicture' } });

        return res.status(200).json({ message: "User posts fetched successfully", posts, success: true });


    } catch (error) {
        console.error("Error", error);
        return res.status(500).json({ message: "Internal server error", success: false });

    }
}


export const likePost = async (req, res) => { 
    try {
        const likeKarneWaleUserKiId = req.id;
        const postId = req.params.id;

        console.log("➡️ Like request received from:", likeKarneWaleUserKiId, "for post:", postId);

        const post = await Post.findById(postId);
        if (!post) {
            console.log("❌ Post not found:", postId);
            return res.status(404).json({ message: "Post not found", success: false });
        }

        await post.updateOne({
            $addToSet: { likes: likeKarneWaleUserKiId }
        });
        await post.save();

        console.log("✅ Post updated with like by:", likeKarneWaleUserKiId);

        // Socket notification section
        const user = await User.findById(likeKarneWaleUserKiId).select('username profilePicture');
        const postOwnerId = post.author.toString();

        console.log("🧾 postOwnerId:", postOwnerId);
        console.log("👤 user who liked:", user);

        if (postOwnerId !== likeKarneWaleUserKiId) {

            const notification = {
                type: 'like',
                userId: likeKarneWaleUserKiId,
                userDetails: user,
                postId,
                message: ` liked your post`
            };

            const postOwnerSocketSet = getUserSocketId(postOwnerId);

            console.log("📦 postOwnerSocketSet:", postOwnerSocketSet);

            if (postOwnerSocketSet instanceof Set && postOwnerSocketSet.size > 0) {
                console.log("📢 Sending notification to socket IDs:", [...postOwnerSocketSet]);
                for (const socketId of postOwnerSocketSet) {
                    io.to(socketId).emit('notification', notification);
                }
            } else {
                console.log("⚠️ Post owner is offline or not connected via socket:", postOwnerId);
            }
        } else {
            console.log("ℹ️ Post owner liked their own post, no notification needed.");
        }

        res.status(200).json({ message: "Post liked successfully", success: true });

    } catch (error) {
        console.error("❗Error in likePost controller:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};



export const disLikePost = async (req, res) => {
    try {
        const likeKarneWaleUserKiId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found", success: false });
        }
        await post.updateOne({
            $pull: { likes: likeKarneWaleUserKiId }
        });
        await post.save();

        //implement socketID feature for real time notification here
        const user = await User.findById(likeKarneWaleUserKiId).select('username profilePicture');
        const postOwnerId = post.author.toString();
        if (postOwnerId !== likeKarneWaleUserKiId) {

            const notification = {
                type: 'dislike',
                userId: likeKarneWaleUserKiId,
                userDetails: user,
                postId,
                message: `removed like from your post`
            }
            const postOwnerSocketSet = getUserSocketId(postOwnerId);
             if (postOwnerSocketSet instanceof Set && postOwnerSocketSet.size > 0) {
                for (const socketId of postOwnerSocketSet) {
                    io.to(socketId).emit('notification', notification);
                }
            }

        }

        res.status(200).json({ message: "Post disliked successfully", success: true });

    } catch (error) {
        console.error("Error", error);
        return res.status(500).json({ message: "Internal server error", success: false });

    }
}


export const addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const commentKarneWaleUserKiId = req.id;

        const { text } = req.body;
        const post = await Post.findById(postId);
        if (!text || !post) {
            return res.status(400).json({ message: "Text and Post are required", success: false });
        }
        const comment = await Comment.create({
            text,
            author: commentKarneWaleUserKiId,
            post: postId
        })
        await comment.populate({ path: 'author', select: 'username profilePicture' });

        post.comments.push(comment._id);
        await post.save();

        return res.status(201).json({ message: "Comment added", comment, success: true });


    } catch (error) {
        console.error("Error", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

export const getCommentsOfPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const comments = await Comment.find({ post: postId }).sort({ createdAt: -1 }).populate({ path: 'author', select: 'username profilePicture' });
        if (!comments) {
            return res.status(404).json({ message: "Comments not found", success: false });
        }
        return res.status(200).json({ message: "Comments fetched successfully", comments, success: true });
    } catch (error) {
        console.error("Error", error);
        return res.status(500).json({ message: "Internal server error", success: false });

    }
}

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found", success: false });
        }
        if (post.author.toString() !== authorId) {
            return res.status(403).json({ message: "You are not authorized to delete this post", success: false });
        }
        await Post.findByIdAndDelete(postId);
        await User.findByIdAndUpdate(authorId, {
            $pull: { posts: postId }
        });

        await Comment.deleteMany({ post: postId });

        return res.status(200).json({ message: "Post deleted successfully", success: true });
    } catch (error) {
        console.error("Error", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}


export const bookMarkPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;
        const post = await Post.findById(postId);
        const user = await User.findById(authorId);
        if (!post || !user) {
            return res.status(404).json({ message: "Post/User not found", success: false });
        }
        if (user.bookmarks.includes(postId)) {
            await user.updateOne({
                $pull: { bookmarks: postId }
            });
            await user.save();
            return res.status(200).json({ message: "Post removed from bookmarks", success: true });
        }
        user.bookmarks.push(postId);
        await user.save();

        return res.status(200).json({ message: "Post bookmarked successfully", success: true });
    } catch (error) {
        console.error("Error", error);
        return res.status(500).json({ message: "Internal server error", success: false });

    }
}