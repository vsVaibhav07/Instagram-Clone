import { setSelectedUser } from "@/redux/authSlice";
import { ArrowLeft, MessageCircleMore } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Message from "./Message";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import axios from "axios";
import { setMessages } from "@/redux/chatSlice";


const Messages = () => {
 
  const { user, suggestedUsers, selectedUser } = useSelector(
    (store) => store.auth
  );
  const { onlineUsers,messages } = useSelector((store) => store.chat);
  const dispatch = useDispatch();
  const [messageText, setMessageText] = useState("");


  const sendMessageHandler=async(receiverId)=>{
    try {
      const res=await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/message/send/${receiverId}`,{messageText},{
        headers:{
          'Content-Type':'application/json'
        },
        withCredentials:true
      })
      if(res.data.success){
        setMessageText("");
        dispatch(setMessages([...messages,res.data.newMessage]))

      }
      
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  return (
    <div className=" flex w-full h-[calc(92vh)] overflow-hidden">
      <section className={`${selectedUser?"hidden md:flex":"flex"} md:flex flex-col w-full md:w-1/3 border-r border-gray-200`}>
        <div className="px-6 py-4 text-xl font-bold border-b border-gray-100">
          {user.username}
        </div>

        <div className="flex flex-col gap-1 overflow-y-auto px-2 py-4">
          {suggestedUsers.map((suggestedUser) => (
            <div
              key={suggestedUser._id}
              onClick={() => dispatch(setSelectedUser(suggestedUser))}
              className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer hover:bg-gray-100 ${
                selectedUser?._id === suggestedUser._id
                  ? "bg-gray-100 font-medium"
                  : ""
              }`}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={suggestedUser.profilePicture || "/defaultDP.webp"}
                  alt="User_dp"
                />
                <AvatarFallback>DP</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-lg font-semibold">
                  {suggestedUser?.username}
                </div>

                {onlineUsers.includes(suggestedUser._id) ? (
                  <div className="text-sm text-green-600">Online</div>
                ) : (
                  <div className="text-sm text-gray-500">Offline</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-col flex-1 bg-white relative">
        {selectedUser ? (
          <>
            <div className={`flex items-center gap-4 p-4 border-b border-gray-200 sticky top-0 bg-white z-10`}>
              <ArrowLeft className="cursor-pointer" onClick={() => dispatch(setSelectedUser(null))} />
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={selectedUser?.profilePicture || "/defaultDP.webp"}
                  alt="User_dp"
                />
                <AvatarFallback>DP</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-lg font-semibold">
                  {selectedUser?.username}
                </div>

                {onlineUsers.includes(selectedUser._id) ? (
                  <div className="text-sm text-green-600">Online</div>
                ) : (
                  <div className="text-sm text-gray-500">Offline</div>
                )}
              </div>
            </div>

            <div className={`${selectedUser ? "flex-1" : "hidden"} overflow-y-auto px-4 py-6`}>
              <Message />
            </div>

            <div className="p-4 border-t border-gray-200 bg-white sticky bottom-0 z-10">
              <div className="flex items-center gap-2">
                <input
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                  type="text"
                  placeholder="Type a message..."
                />
              {messageText &&
                <button
              
                  onClick={()=>sendMessageHandler(selectedUser?._id)}
                  className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition"
                >
                  Send
                </button>}
              </div>
            </div>
          </>
        ) : (
          <div className="hiddden md:flex flex-1 items-center justify-center text-gray-500">
            <div className=" hidden md:flex flex-col items-center gap-4">
              <div className="rounded-full border-2 border-gray-400 p-5">
                <MessageCircleMore className="w-10 h-10" />
              </div>
              <p className="text-lg font-medium">
                Select a user to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
