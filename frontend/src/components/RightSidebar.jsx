import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const RightSidebar = () => {
  const { user, suggestedUsers } = useSelector((store) => store.auth);

  return (
    <div className="w-full h-screen px-6 pt-10 pb-4 space-y-6 text-sm text-gray-700">
      {/* Current User */}
      <div className="flex items-center gap-4">
        <Link
          to={`/profile/${user?._id}`}
          className="flex items-center gap-3 hover:opacity-90"
        >
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={user?.profilePicture || "/defaultDP.webp"}
              alt="User_dp"
            />
            <AvatarFallback>DP</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold">{user?.username}</span>
            <span className="text-gray-400 text-xs">
              {user?.bio || "Your bio here..."}
            </span>
          </div>
        </Link>
      </div>

      {/* Suggested Users Header */}
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-gray-500">
          Suggested for you
        </span>
        <button className="text-xs font-semibold hover:underline">
          See All
        </button>
      </div>

      {/* Suggested Users List */}
      <div className="space-y-4">
        {suggestedUsers?.map((suggestedUser) => (
          <div
            key={suggestedUser._id}
            className="flex items-center justify-between"
          >
            <Link
              to={`/profile/${suggestedUser._id}`}
              className="flex items-center gap-3 hover:opacity-90"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={suggestedUser?.profilePicture || "/defaultDP.webp"}
                  alt="User_dp"
                />
                <AvatarFallback>DP</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium text-sm">
                  {suggestedUser?.username}
                </span>
                <span className="text-xs text-gray-400">
                  {suggestedUser?.bio || "New to Instagram"}
                </span>
              </div>
            </Link>
            <button className="text-xs font-semibold text-blue-500 hover:text-blue-700">
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RightSidebar;
