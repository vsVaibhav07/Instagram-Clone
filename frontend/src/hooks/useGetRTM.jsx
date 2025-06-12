import { setMessages } from "@/redux/chatSlice";
import react, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetRTM = () => {
  const dispatch = useDispatch();
  const { socket } = useSelector((store) => store.socketio);
  const { messages } = useSelector((store) => store.chat);
  useEffect(() => {
    
    socket?.on("newMessage", (newMessage) => {
      console.log(newMessage, messages)
      dispatch(setMessages([...messages, newMessage]));
    });
    return ()=>{
        socket?.off('newMessage');
    }
  }, [messages, setMessages]);
};

export default useGetRTM;
