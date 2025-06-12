import { MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const CommentDialog = ({
  openComments,
  setOpenComments,
  text,
  setText,
  handleTextChange,
  commentHandler,
  comments, setComments
}) => {
  const { selectedPost } = useSelector((store) => store.post);


  useEffect(()=>{
    if(selectedPost){
      setComments(selectedPost.comments)
    }
  },[selectedPost])

  return (
    <Dialog open={openComments} onOpenChange={setOpenComments}>
      {" "}
      <DialogContent
        onInteractOutside={() => setOpenComments(false)}
        className="sm:max-w-[890px] h-[90vh] p-0 gap-0 bg-white flex rounded-md overflow-hidden"
      >
        <div className="hidden sm:block w-[500px] bg-black flex-shrink-0">
          <img
            className="w-full h-full object-contain bg-black"
            src={selectedPost?.image}
            alt="PostImage"
          />
        </div>

        <div className="flex flex-col gap-4 w-full">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex gap-2 items-center">
              <Avatar className="h-8 w-8 ring-2 ring-offset-2 ring-rose-500">
                <AvatarImage
                  src={
                    selectedPost?.author?.profilePicture || "/defaultDP.webp"
                  }
                  alt="User_dp"
                />
                <AvatarFallback>
                  <img src="DP" alt="" />
                </AvatarFallback>
              </Avatar>
              <h1 className="font-medium  ">{selectedPost?.author?.username}</h1>
            </div>

            <Dialog>
              <DialogTrigger>
                <MoreHorizontal className="cursor-pointer" />
              </DialogTrigger>
              <DialogContent className="bg-white w-[30%]">
                <Button className="cursor-pointer hover:bg-slate-200">
                  Unfollow
                </Button>
                <Button className="cursor-pointer hover:bg-slate-200">
                  Add to favorites
                </Button>
                <Button className="cursor-pointer hover:bg-slate-200">
                  Delete
                </Button>
              </DialogContent>
            </Dialog>
          </div>

          <div className="p-4 hover:bg-slate-50 flex gap-3 overflow-y-scroll w-full flex-col">
            {comments?.map((comment) => (
               <div className="flex gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  className=""
                  src={comment.author?.profilePicture || "/defaultDP.webp"}
                  alt="User_dp"
                />
                <AvatarFallback>
                  <img src="/defaultDp.webp" alt="" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm">
                  <span className="font-semibold mr-2">{comment.author.username || "username"}</span>{comment.text}
                </p>
                <div className="flex gap-4 mt-2">
                  <span className="text-xs text-gray-500">2d</span>
                  <span className="text-xs text-gray-500 cursor-pointer">
                    Reply
                  </span>
                </div>
              </div>
            </div>
            ))}
           
          </div>
          

          <div className="mt-auto border-t p-4">
            <div className="flex items-center gap-3">
              <input
                value={text}
                onChange={(e) => handleTextChange(e)}
                className="w-full focus:outline-none text-sm"
                type="text"
                placeholder="Add a comment..."
              />
              {text && (
                <button
                  onClick={commentHandler}
                  className="text-blue-500 font-semibold text-sm hover:text-blue-600 transition-colors"
                >
                  Post
                </button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
