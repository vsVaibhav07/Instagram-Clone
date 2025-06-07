import { MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

const CommentDialog = ({ openComments, setOpenComments, text, setText ,handleTextChange}) => {
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
            src="https://imgs.search.brave.com/7wGR688n4hf75k_8bmL1IO1gBe0_uBP6mnIfwtuBE1U/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMucHJpc21pYy5p/by9sb2NvLWJsb2dz/Lzc5MzI4Mjg0LWY5/N2ItNDg5Zi05MjRj/LWViM2IxN2UzNGI1/Nl9pbWFnZTIucG5n/P2F1dG89Y29tcHJl/c3MsZm9ybWF0JnJl/Y3Q9MCwwLDE5OTks/MTEyNCZ3PTM4NDAm/Zml0PW1heA"
            alt="PostImage"
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex gap-2 items-center">
              <Avatar className="h-8 w-8 bg-slate-300 p2">
                <AvatarImage
                  src="https://imgs.search.brave.com/sE8MdXvDoqofUi5xFiPekWzRwNvt10-6tUkLkDA7KWA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA5LzE3LzEyLzIz/LzM2MF9GXzkxNzEy/MjM2N19rU3BkcFJK/NUhjbW4wczRXTWRK/YlNacGw3TlJ6d3Vw/VS5qcGc"
                  alt="User_dp"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <h1 className="font-medium text-sm">Username</h1>
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

          <div className="p-4 hover:bg-slate-50 flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" alt="User_dp" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm">
                <span className="font-semibold mr-2">username</span>Lorem ipsum
                dolor sit amet consectetur adipisicing elit.
              </p>
              <div className="flex gap-4 mt-2">
                <span className="text-xs text-gray-500">2d</span>
                <span className="text-xs text-gray-500 cursor-pointer">
                  Reply
                </span>
              </div>
            </div>
          </div>
          <div className="p-4 hover:bg-slate-50 flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" alt="User_dp" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm">
                <span className="font-semibold mr-2">another_user</span>Great
                post! 🔥
              </p>
              <div className="flex gap-4 mt-2">
                <span className="text-xs text-gray-500">1d</span>
                <span className="text-xs text-gray-500 cursor-pointer">
                  Reply
                </span>
              </div>
            </div>
          </div>

<div className="mt-auto border-t p-4">
          <div className="flex items-center gap-3">
            <input 
              value={text} 
              onChange={(e)=>handleTextChange(e)} 
              className="w-full focus:outline-none text-sm" 
              type="text" 
              placeholder="Add a comment..." 
            />
            {text && 
              <button 
                className="text-blue-500 font-semibold text-sm hover:text-blue-600 transition-colors"
              >
                Post
              </button>
            }
          </div>
        </div>

        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
