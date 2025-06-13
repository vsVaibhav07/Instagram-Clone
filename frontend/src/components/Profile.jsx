import useGetUserProfile from "@/hooks/useGetUserProfile";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useEffect, useState } from "react";
import { Heart, MessageCircle } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { setUserProfile } from "@/redux/authSlice";

const Profile = () => {
  const { id: userId } = useParams();
  useGetUserProfile(userId);

  const { userProfile, user } = useSelector((store) => store.auth);
  const isOwnProfile = user?._id === userId;
  const [isFollowing, setIsFollowing] = useState(
    user?.following?.includes(userProfile?._id)
  );
  const [activeTab, setActiveTab] = useState("posts");
  const dispatch = useDispatch();

  useEffect(() => {
    if (user && userProfile) {
      setIsFollowing(userProfile.followers.includes(user._id));
    }
  }, [user, userProfile]);

  const handleFollowUnfollow = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/followOrUnfollow/${userProfile._id}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        setIsFollowing(!isFollowing);
        const updatedFollowers = isFollowing
          ? userProfile.followers.filter((id) => id !== user._id)
          : [...userProfile.followers, user._id];
        dispatch(setUserProfile({...userProfile,followers:updatedFollowers}));
      }
      toast.success(res.data.message)
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 w-full">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-10 mb-10">
        <Avatar className="h-36 w-36 ring-2 ring-offset-2 ring-rose-500">
          <AvatarImage
            src={userProfile?.profilePicture || "/defaultDP.webp"}
            alt="User_dp"
          />
          <AvatarFallback>DP</AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-6 flex-wrap">
            <h2 className="text-2xl font-semibold break-all">
              {userProfile?.username}
            </h2>
            {isOwnProfile ? (
              <div className="flex gap-4 flex-wrap">
                <Link to="/account/edit">
                  <button className="px-3 py-1 bg-blue-300 text-sm rounded hover:bg-blue-400">
                    Edit Profile
                  </button>
                </Link>

                <button className="px-3 py-1 bg-blue-300 text-sm rounded hover:bg-blue-400">
                  View Archived
                </button>
                <button className="px-3 py-1 bg-blue-300 text-sm rounded hover:bg-blue-400">
                  Ad Tools
                </button>
              </div>
            ) : isFollowing ? (
              <div
                onClick={() => handleFollowUnfollow()}
                className="flex gap-2"
              >
                <button className="px-4 py-1 text-sm bg-slate-200 rounded hover:bg-blue-500 hover:text-white">
                  Unfollow
                </button>
                <button className="px-4 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
                  Message
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleFollowUnfollow()}
                className="px-4 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Follow
              </button>
            )}
          </div>

          <div className="flex gap-6 text-sm md:text-base">
            <div>
              <span className="font-semibold">
                {userProfile?.posts?.length}
              </span>{" "}
              posts
            </div>
            <div>
              <span className="font-semibold">
                {userProfile?.followers?.length}
              </span>{" "}
              followers
            </div>
            <div>
              <span className="font-semibold">
                {userProfile?.following?.length}
              </span>{" "}
              following
            </div>
          </div>

          <div>
            <p className="text-gray-700 break-words">
              {userProfile?.bio || "No bio added yet."}
            </p>
          </div>
        </div>
      </div>

      <hr className="my-4 border-gray-300" />

      <div>
        <div className="flex gap-4">
          <h3
            onClick={() => setActiveTab("posts")}
            className={`text-lg font-semibold mb-4 cursor-pointer ${
              activeTab === "posts"
                ? "font-bold border-b-2 border-black"
                : "text-gray-500"
            }`}
          >
            Posts
          </h3>
          <h3
            onClick={() => setActiveTab("saved")}
            className={`text-lg font-semibold mb-4 cursor-pointer ${
              activeTab === "saved"
                ? "font-bold border-b-2 border-black"
                : "text-gray-500"
            }`}
          >
            Saved
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {activeTab === "posts"
            ? userProfile?.posts?.map((p) => (
                <div
                  key={p._id}
                  className="group aspect-square relative rounded-lg overflow-hidden"
                >
                  <img
                    src={p.image}
                    alt="Post"
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-60 flex items-center justify-center gap-6 transition-opacity duration-300">
                    <div className="flex items-center gap-1 text-white text-lg font-semibold">
                      <Heart className="w-5 h-5 fill-white" />
                      <span>{p.likes.length}</span>
                    </div>
                    <div className="flex items-center gap-1 text-white text-lg font-semibold">
                      <MessageCircle className="w-5 h-5 fill-white" />
                      <span>{p.comments.length}</span>
                    </div>
                  </div>
                </div>
              ))
            : userProfile.bookmarks.map((p) => (
                 <div
                  key={p._id}
                  className="group aspect-square relative rounded-lg overflow-hidden"
                >
                  <img
                    src={p.image}
                    alt="Post"
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-60 flex items-center justify-center gap-6 transition-opacity duration-300">
                    <div className="flex items-center gap-1 text-white text-lg font-semibold">
                      <Heart className="w-5 h-5 fill-white" />
                      <span>{p.likes.length}</span>
                    </div>
                    <div className="flex items-center gap-1 text-white text-lg font-semibold">
                      <MessageCircle className="w-5 h-5 fill-white" />
                      <span>{p.comments.length}</span>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
