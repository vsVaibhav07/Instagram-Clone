import React, { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setAuthUser } from "@/redux/authSlice";

const EditProfile = () => {
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);

  const [input, setInput] = useState({
    profilePicture: user?.profilePicture,
    bio: user?.bio || "",
    gender: user?.gender || "",
  });
  const [previewImage,setPreviewImage]=useState(user?.profilePicture);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {setInput({ ...input, profilePicture: file });
  setPreviewImage(URL.createObjectURL(file));}
  };

  const editProfileHandler = async () => {
    const formData = new FormData();
    formData.append("bio", input.bio);
    formData.append("gender", input.gender);
    if (input.profilePicture && typeof input.profilePicture !== "string") {
      formData.append("profilePicture", input.profilePicture);
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/profile/edit`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast(res.data.message);
        const updatedUser = {
          ...user,
          bio: res.data.user?.bio,
          gender: res.data.user?.gender,
          profilePicture: res.data.user?.profilePicture,
        };
        dispatch(setAuthUser(updatedUser));
        navigate(`/profile/${user._id}`);
      }
    } catch (error) {
      toast(error?.response?.data?.message || "Something went wrong");
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-10 md:p-16">
      <h1 className="text-3xl font-bold mb-10">Edit Profile</h1>

      <div className="flex flex-col gap-10">
        <div className="flex items-center justify-between bg-gray-100 px-6 py-4 rounded-2xl shadow-sm flex-wrap gap-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20 ring-2 ring-blue-400">
              <AvatarImage
                src={previewImage||"/defaultDP.webp"}
                alt="User_dp"
              />
              <AvatarFallback>DP</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xl font-semibold">{user?.username}</p>
              <p className="text-sm text-gray-500">Profile Photo</p>
            </div>
          </div>
          <label className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 cursor-pointer inline-block">
            Change Photo
            <input
              type="file"
              accept="image/*"
              onChange={fileChangeHandler}
              className="hidden"
            />
          </label>
        </div>

        <div className="space-y-6 w-full">
          <div>
            <label className="block text-lg font-medium mb-2">Bio</label>
            <textarea
              onChange={(e) =>
                setInput({ ...input, bio: e.target.value })
              }
              value={input.bio}
              maxLength={150}
              className="w-full h-24 resize-none border border-gray-300 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Write a short bio (max 150 characters)"
            ></textarea>
          </div>

          <div>
            <label htmlFor="gender" className="block text-lg font-medium mb-2">
              Gender
            </label>
            <select
              onChange={(e) =>
                setInput({ ...input, gender: e.target.value })
              }
              value={input.gender}
              id="gender"
              className="w-full h-12 border border-gray-300 rounded-2xl px-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="" disabled>
                Select your gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          {loading ? (
            <button
              disabled
              className="bg-black text-white font-medium px-6 py-2 rounded-lg flex items-center gap-2 cursor-not-allowed opacity-70"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting...
            </button>
          ) : (
            <button
              onClick={editProfileHandler}
              className="bg-black text-white font-medium px-6 py-2 rounded-lg hover:bg-gray-900 transition duration-200"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
