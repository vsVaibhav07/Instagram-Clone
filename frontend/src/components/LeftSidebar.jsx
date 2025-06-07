import {
  Heart,
  Home,
  InstagramIcon,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import { useState } from "react";
import CreatePost from "./CreatePost";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const dispatch=useDispatch();
  const { user } = useSelector((store) => store.auth);

  const [openCreatePostDialog,setOpenCreatePostDialog]=useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/user/logout");
      if (res.data.success) {
        dispatch(setAuthUser(null))
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    }
  };

  

  const handleSideBarLinks=(item)=>{
    if(item.text==="Logout")logoutHandler();
    else if(item.text==="Create Post")setOpenCreatePostDialog(true);
    else navigate(item.path);
  };

  const sidebarItems = [
    { icon: <Home />, text: "Home", path: "/" },
    { icon: <Search />, text: "Search", path: "/search" },
    { icon: <TrendingUp />, text: "Explore", path: "/explore" },
    { icon: <MessageCircle />, text: "Messages", path: "/messages" },
    { icon: <Heart />, text: "Notifications", path: "/notifications" },
    { icon: <PlusSquare />, text: "Create Post", path: "/createPost" },
    {
      icon: (
        <Avatar>
          <AvatarImage src={user?.profilePicture || "/defaultDP.webp"} />

          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
      path: "/profile",
    },
    { icon: <LogOut />, text: "Logout", path: "/logout" },
  ];

  return (
    <div className="w-64 h-screen bg-white shadow-md flex flex-col justify-between z-50">
      <h1 className="flex items-center text-2xl font-bold p-4 justify-items-center gap-6 text-blue-600 ">
        <InstagramIcon />
        Instagram
      </h1>
      {sidebarItems.map((item, index) => (
        <div
          key={index}
          className="flex items-center px-6 py-4  hover:bg-gray-200 cursor-pointer"
          onClick={() =>handleSideBarLinks(item)}
        >
          <div className="text-xl">{item.icon}</div>
          <span className="ml-2">{item.text}</span>
        </div>
      ))}

      <CreatePost openCreatePostDialog={openCreatePostDialog} setOpenCreatePostDialog={setOpenCreatePostDialog} />
    </div>
  );
};

export default LeftSidebar;
