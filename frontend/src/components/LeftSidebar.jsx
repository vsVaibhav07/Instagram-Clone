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

import { setAuthUser } from "@/redux/authSlice";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CreatePost from "./CreatePost";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const { likeNotification = [] } = useSelector(
    (store) => store.realTimeNotification || {}
  );

  const [openCreatePostDialog, setOpenCreatePostDialog] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/logout`);
      if (res.data.success) {
        dispatch(setAuthUser(null));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleSideBarLinks = (item) => {
    if (item.text === "Logout") logoutHandler();
    else if (item.text === "Create Post") setOpenCreatePostDialog(true);
    else if (!item.notification) navigate(item.path);
  };

  const sidebarItems = [
    { icon: <Home />, text: "Home", path: "/" },
    { icon: <Search />, text: "Search", path: "/search" },
    { icon: <TrendingUp />, text: "Explore", path: "/explore" },
    { icon: <MessageCircle />, text: "Messages", path: "/messages" },
    {
      icon: <Heart />,
      text: "Notifications",
      notification: true,
    },
    { icon: <PlusSquare />, text: "Create Post", path: "/createPost" },
    {
      icon: (
        <Avatar className="h-6 w-6">
          <AvatarImage src={user?.profilePicture || "/defaultDP.webp"} />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
      path: `/profile/${user?._id}`,
    },
    { icon: <LogOut />, text: "Logout", path: "/logout" },
  ];

  return (
    <div className="w-64 h-screen bg-white shadow-md flex flex-col justify-between z-50 overflow-y-auto sticky top-0">
      <div>
        <h1 className="flex items-center text-2xl font-bold p-4 gap-3 text-blue-600">
          <InstagramIcon /> Instagram
        </h1>

        {sidebarItems.map((item, index) => {
          const hasNotifications =
            item.notification && likeNotification?.length > 0;

          const iconWithBadge = (
            <div className="relative">
              {item.icon}
              {hasNotifications && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full h-4 w-4 flex items-center justify-center">
                  {likeNotification.length}
                </span>
              )}
            </div>
          );

          if (item.notification) {
            return (
              <Popover key={index}>
                <PopoverTrigger asChild>
                  <div className="relative flex items-center px-6 py-4 hover:bg-gray-100 cursor-pointer">
                    <div className="text-xl">{iconWithBadge}</div>
                    <span className="ml-3 text-sm font-medium">
                      {item.text}
                    </span>
                  </div>
                </PopoverTrigger>

                <PopoverContent className="w-80 p-3 bg-white shadow-lg rounded-lg border border-gray-200">
                  <p className="text-sm font-semibold mb-2 text-gray-800">
                    Notifications
                  </p>

                  {likeNotification.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No new notifications
                    </p>
                  ) : (
                    likeNotification.map((notif, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-none"
                      >
                        <Link to={`profile/${notif?.userDetails?._id}`}>
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={
                              notif?.userDetails?.profilePicture ||
                              "/defaultDP.webp"
                            }
                          />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar></Link>
                        
                        <div className="text-sm text-gray-700 leading-tight">
                          <Link to={`profile/${notif?.userDetails?._id}`}className="font-medium">
                            {notif?.userDetails?.username}
                          </Link>{" "}
                          {notif?.message}
                        </div>
                      </div>
                    ))
                  )}
                </PopoverContent>
              </Popover>
            );
          }

          return (
            <div
              key={index}
              className="relative flex items-center px-6 py-4 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSideBarLinks(item)}
            >
              <div className="text-xl">{item.icon}</div>
              <span className="ml-3 text-sm font-medium">{item.text}</span>
            </div>
          );
        })}
      </div>

      {/* Create Post Dialog */}
      <CreatePost
        openCreatePostDialog={openCreatePostDialog}
        setOpenCreatePostDialog={setOpenCreatePostDialog}
      />
    </div>
  );
};

export default LeftSidebar;
