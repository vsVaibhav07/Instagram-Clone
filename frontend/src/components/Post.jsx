import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Send,
} from "lucide-react";
import { useState } from "react";
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
import { setPosts } from "@/redux/postSlice";
import { DialogClose } from "@radix-ui/react-dialog";

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [openComments, setOpenComments] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();
  const [liked, setLiked] = useState(post.likes.includes(user._id) || false);
  const [likeCount, setLikeCount] = useState(post?.likes.length);

  const likeOrDislikeHandler = async () => {
    if (!post) return;
    const action = liked ? "dislike" : "like";
    const res = await axios.get(
      `http://localhost:8000/api/v1/post/${post._id}/${action}`,
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
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/post/delete/${post?._id}`,
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
      console.log("error", error);
      toast.error(error.response.data.message);
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };
  return (
    <div className="border border-gray-200 w-full rounded-none sm:rounded-lg my-4 sm:my-6">
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
            <h1 className="font-semibold text-sm">{post.author.username}</h1>
            <p className="text-xs text-gray-500">Original audio</p>
          </div>
        </div>

        <Dialog>
          <DialogTrigger>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogTitle className="hidden"></DialogTitle>

          <DialogContent className="bg-white w-[30%]">
            <Button className="cursor-pointer hover:bg-slate-200">
              Unfollow
            </Button>
            <Button className="cursor-pointer hover:bg-slate-200">
              Add to favorites
            </Button>
            <DialogClose asChild>
              {user && user._id === post.author._id && (
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
      <div className=" bg-gray-100">
        <img src={post.image} alt="PostImage" />
      </div>
      <div className="p-4">
        <div className="flex justify-between">
          <div className="flex gap-4 mb-2">
            <Heart
              fill={liked ? "red" : "transparent"}
              stroke={liked ? "red" : "currentColor"}
              onClick={() => likeOrDislikeHandler()}
              className="w-6 h-6 hover:text-gray-500 cursor-pointer transition-colors"
            />
            <MessageCircle
              onClick={() => setOpenComments(true)}
              className="w-6 h-6 hover:text-gray-500 cursor-pointer transition-colors"
            />
            <Send className="w-6 h-6 hover:text-gray-500 cursor-pointer transition-colors" />
          </div>
          <Bookmark className="w-6 h-6 hover:text-gray-500 cursor-pointer transition-colors" />
        </div>
        <p className="text-sm">
          {likeCount > 0 && (
            <>
              Liked by{" "}
              <span className="font-bold">
                {liked ? user.username : post.author.username}
              </span>{" "}
              {likeCount > 1 && (
                <>
                  and <span className="font-bold">{likeCount - 1} Others</span>
                </>
              )}
            </>
          )}
        </p>

        <p className="text-sm">
          {" "}
          <span className="font-bold pr-1">{post.author.username}</span>
          {post.caption}
        </p>

        <p
          onClick={() => setOpenComments(true)}
          className="text-gray-600 cursor-pointer"
        >
          View all 10 comments
        </p>
        <CommentDialog
          openComments={openComments}
          setOpenComments={setOpenComments}
          text={text}
          setText={setText}
          handleTextChange={handleTextChange}
        />
        <div className="flex justify-between">
          <input
            value={text}
            onChange={(e) => handleTextChange(e)}
            className="w-full focus:outline-none"
            type="text"
            placeholder="Add a comment"
          />
          {text ? (
            <span className="text-blue-400 cursor-pointer">Post</span>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
