import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { setAuthUser } from "../redux/authSlice";

const SuggestedUser = ({ suggestedUser }) => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const [isFollowing, setIsFollowing] = useState(
    user?.following?.includes(suggestedUser?._id)
  );

  useEffect(() => {
    setIsFollowing(user?.following?.includes(suggestedUser?._id));
  }, [user?.following, suggestedUser?._id]);

  const handleFollowUnfollow = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/followOrUnfollow/${suggestedUser._id}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        
        console.log(res.data.user);
        dispatch(setAuthUser(res.data.user));

        setIsFollowing(!isFollowing);

        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || "Action failed");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-between">
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
          <span className="font-medium text-sm">{suggestedUser?.username}</span>
          <span className="text-xs text-gray-400">
            {suggestedUser?.bio || "New to Instagram"}
          </span>
        </div>
      </Link>

      <button
        onClick={handleFollowUnfollow}
        className={`text-xs font-semibold ${
          isFollowing
            ? "text-red-500 hover:text-red-700"
            : "text-blue-500 hover:text-blue-700"
        }`}
      >
        {isFollowing ? "Unfollow" : "Follow"}
      </button>
    </div>
  );
};

export default SuggestedUser;
