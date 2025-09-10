import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { setSelectedUser } from "@/redux/authSlice";

const Search = () => {
  const [query, setQuery] = useState("");
  const { suggestedUsers } = useSelector((state) => state.auth);
  const { posts } = useSelector((state) => state.post);
  const dispatch = useDispatch();

  dispatch(setSelectedUser(null));

  const hashtags = [
    "#reactjs",
    "#codinglife",
    "#photography",
    "#tailwindcss",
    "#devlife",
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users or hashtags..."
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Users Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">People</h2>
        <div className="space-y-4">
          {suggestedUsers &&
            suggestedUsers
              .filter(
                (user) =>
                  user?.fullName?.toLowerCase().includes(query.toLowerCase()) ||
                  user?.username?.toLowerCase().includes(query.toLowerCase())
              )

              .map((suggestedUser) => (
                <div
                  key={suggestedUser._id}
                  className="flex hover:bg-gray-100 p-2 items-center justify-between"
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
                </div>
              ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Posts</h2>
        <div className="grid grid-cols-3 gap-1 sm:gap-3">
          {posts &&
            posts
              .filter(
                (post) =>
                  post?.author?.username
                    ?.toLowerCase()
                    .includes(query.toLowerCase()) ||
                  post?.text?.toLowerCase().includes(query.toLowerCase())
              )
              .map((post) => (
                <Link key={post._id} to={`/post/${post._id}`}>
                  <img
                    className="aspect-square hover:scale-105 object-cover rounded-md"
                    src={post.image}
                    alt=""
                  />
                </Link>
              ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
