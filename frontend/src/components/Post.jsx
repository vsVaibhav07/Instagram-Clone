import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Send,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import CommentDialog from "./CommentDialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { DialogClose } from "@radix-ui/react-dialog";
import { Badge } from "./ui/badge";

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [openComments, setOpenComments] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts, selectedPost } = useSelector((store) => store.post);
  const dispatch = useDispatch();
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [likeCount, setLikeCount] = useState(post?.likes.length);
  const [comments, setComments] = useState(selectedPost?.comments);
  const [bookmarked, setBookmarked] = useState(
    user?.bookmarks?.includes(post?._id)
  );

  const likeOrDislikeHandler = async () => {
    try {
      if (!post) return;
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/post/${post?._id}/${action}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setLiked(!liked);
        liked ? setLikeCount(likeCount - 1) : setLikeCount(likeCount + 1);
        const updatedPosts = posts.map((p) => {
          if (p._id === post._id) {
            return {
              ...p,
              likes: liked
                ? p.likes.filter((id) => id !== user._id)
                : [user._id, ...p.likes],
            };
          }
          return p;
        });
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/post/${post?._id}/comment`,
        { text },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedComments = [...comments, res.data.comment];
        setComments(updatedComments);
        const updatedPosts = posts.map((p) =>
          p._id === selectedPost._id ? { ...p, comments: updatedComments } : p
        );
        dispatch(setPosts(updatedPosts));
        setText("");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/post/${post?._id}/bookmark`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setBookmarked((prev) => !prev);
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/post/delete/${post?._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        const updatedPosts = posts.filter(
          (postItem) => postItem?._id !== post?._id
        );
        dispatch(setPosts(updatedPosts));
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleTextChange = (e) => setText(e.target.value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileHover={{ scale: 1.01 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5,delay: 0.2, ease: "easeOut" }}
      
      className="border border-gray-200 w-full rounded-none sm:rounded-lg my-4 sm:my-6"
    >
     
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex gap-3 items-center">
          <Avatar className="h-8 w-8 ring-2 ring-offset-2 ring-rose-500">
            <AvatarImage
              src={post?.author?.profilePicture || "/defaultDP.webp"}
              alt="User_dp"
            />
            <AvatarFallback>
              <img src="DP" alt="" />
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex gap-1">
              <h1 className="font-semibold text-sm">{post?.author.username}</h1>
              {user?._id === post?.author._id && (
                <Badge className="bg-slate-100">Author</Badge>
              )}
            </div>
            <p className="text-xs text-gray-500">Original audio</p>
          </div>
        </div>

        <Dialog>
          <DialogTrigger>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogTitle className="hidden"></DialogTitle>
          <DialogContent className="bg-white w-[30%]">
            {post?.author._id !== user?._id && (
              <Button className="cursor-pointer hover:bg-slate-200">
                {user?.following.includes(post?.author._id) ? "Unfollow" : "Follow"}
              </Button>
            )}
            <Button className="cursor-pointer hover:bg-slate-200">Add to favorites</Button>
            <DialogClose asChild>
              {user && user?._id === post?.author._id && (
                <Button
                  onClick={async () => await deletePostHandler()}
                  className="cursor-pointer hover:bg-slate-200"
                >
                  Delete
                </Button>
              )}
            </DialogClose>
          </DialogContent>
        </Dialog>
      </div>

    
      <div className="bg-gray-100">
        <img src={post.image} alt="PostImage" />
      </div>

      <div className="p-4">
        <div className="flex justify-between">
          <div className="flex gap-4 mb-2">
            <motion.div
              onClick={likeOrDislikeHandler}
              animate={{ scale: liked ? [1, 1.3, 1] : 1 }}
              transition={{ duration: 0.3 }}
              className="cursor-pointer"
            >
              <Heart
                fill={liked ? "red" : "transparent"}
                stroke={liked ? "red" : "currentColor"}
                className="w-6 h-6 hover:text-gray-500 transition-colors"
              />
            </motion.div>
            <MessageCircle
              onClick={() => {
                dispatch(setSelectedPost(post));
                setOpenComments(true);
              }}
              className="w-6 h-6 hover:text-gray-500 cursor-pointer transition-colors"
            />
            <Send className="w-6 h-6 hover:text-gray-500 cursor-pointer transition-colors" />
          </div>
          <Bookmark
            fill={bookmarked ? "black" : "transparent"}
            onClick={bookmarkHandler}
            className="w-6 h-6 hover:text-gray-500 cursor-pointer transition-colors"
          />
        </div>

        {/* Likes */}
        <p className="text-sm">
          {likeCount > 0 && (
            <>
              Liked by{" "}
              <span className="font-bold">{liked ? "You" : post?.author.username}</span>{" "}
              {likeCount > 1 && (
                <>
                  and <span className="font-bold">{likeCount - 1} Others</span>
                </>
              )}
            </>
          )}
        </p>

        {/* Caption */}
        <p className="text-sm">
          <span className="font-bold pr-1">{post?.author.username}</span>
          {post?.caption}
        </p>

        {/* Comments */}
        {post.comments.length > 0 && (
          <div
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpenComments(true);
            }}
            className="text-gray-600 cursor-pointer"
          >
            View {post?.comments.length > 1 ? `all ${post?.comments.length} comments` : "1 Comment"}
          </div>
        )}

        {/* Comment Dialog */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <CommentDialog
            openComments={openComments}
            setOpenComments={setOpenComments}
            text={text}
            setText={setText}
            handleTextChange={handleTextChange}
            commentHandler={commentHandler}
            comments={comments}
            setComments={setComments}
          />
        </motion.div>

        {/* Add Comment */}
        <div className="flex justify-between mt-2">
          <input
            value={text}
            onChange={handleTextChange}
            className="w-full focus:outline-none"
            type="text"
            placeholder="Add a comment"
          />
          {text && (
            <span onClick={commentHandler} className="text-blue-400 cursor-pointer">
              Post
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Post;
