import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Link } from "react-router-dom";
import useGetRTM from "@/hooks/useGetRTM";
import useGetAllMessages from "@/hooks/useGetAllMessages";

const Message = () => {
  useGetAllMessages()
  useGetRTM()
  const { user, selectedUser } = useSelector((store) => store.auth);

   const {messages}=useSelector(store=>store.chat)
 

  const messageEndRef = useRef();
  

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const filteredMessages = messages?.filter(
  (msg) =>
    (msg.senderId === user._id && msg.receiverId === selectedUser._id) ||
    (msg.senderId === selectedUser._id && msg.receiverId === user._id)
);
  

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-3 pb-4">
        <Avatar className="h-20 w-20">
          <AvatarImage
            src={selectedUser?.profilePicture || "/defaultDP.webp"}
            alt="User_dp"
          />
          <AvatarFallback>DP</AvatarFallback>
        </Avatar>
        <div className="font-semibold text-xl">{selectedUser.username}</div>
        
        <Link to={`/profile/${selectedUser._id}`}>
          <button className="px-3 py-1 bg-blue-200 text-sm font-semibold rounded hover:bg-blue-300">
            View Profile
          </button>
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        {filteredMessages?.map((msg) => {
          const isSender = msg.senderId === user._id;
          return (
            <div
              key={msg._id}
              className={`flex items-end ${
                isSender ? "justify-end" : "justify-start"
              }`}
            >
              {!isSender && (
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage
                    src={selectedUser?.profilePicture || "/defaultDP.webp"}
                    alt="User_dp"
                  />
                  <AvatarFallback>DP</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl text-sm shadow-sm ${
                  isSender
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-800 rounded-bl-none"
                }`}
              >
                {msg.message}
              </div>
              {isSender && (
                <Avatar className="h-8 w-8 ml-2">
                  <AvatarImage
                    src={user?.profilePicture || "/defaultDP.webp"}
                    alt="User_dp"
                  />
                  <AvatarFallback>DP</AvatarFallback>
                </Avatar>
              )}
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>
    </div>
  );
};

export default Message;
