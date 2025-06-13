import { readFileAsDataUrl } from "@/lib/utils";
import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";

const CreatePost = ({ openCreatePostDialog, setOpenCreatePostDialog }) => {
  const imageRef = useRef();
  const [imagePreview, setImagePreview] = useState("");
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { posts } = useSelector((store) => store.post);

  const { user } = useSelector((store) => store.auth);

  const fileChangeHandler = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const dataUrl = await readFileAsDataUrl(selectedFile);
      setImagePreview(dataUrl);
    }
  };

  const createPostHandler = async () => {
    if (!file) {
      toast.error("Media required");
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);
    if (imagePreview) formData.append("image", file);

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/post/addpost`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts]));
        toast.success(res.data.message);
        setOpenCreatePostDialog(false);
        setCaption("");
        setImagePreview("");
        setFile("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={openCreatePostDialog}>
      <DialogContent
        onInteractOutside={() => setOpenCreatePostDialog(false)}
        className="bg-white  w-full max-w-xl p-6 rounded-2xl space-y-4"
      >
        <DialogTitle className="text-xl font-bold text-center">
          Create New Post
        </DialogTitle>

        {/* User info */}
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={user?.profilePicture || "/defaultDP.webp"} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{user?.username}</p>
            <p className="text-sm text-gray-500">{user?.bio}</p>
          </div>
        </div>

        {/* Caption input */}
        <textarea
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          rows={2}
          className="w-full lg p-3 outline-none focus:outline-none overflow-hidden resize-none"
        />

        {/* Image preview */}
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full max-h-72 object-cover rounded-lg"
          />
        )}

        {/* File input */}
        <input
          type="file"
          ref={imageRef}
          onChange={fileChangeHandler}
          accept="image/*,video/*"
          className="hidden"
        />
        <button
          type="button"
          onClick={() => imageRef.current.click()}
          className="text-sm text-blue-600 hover:underline"
        >
          Select Media from Device
        </button>

        {/* Submit button */}
        <div className="pt-4">
          <Button
            onClick={createPostHandler}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-purple-500 hover:to-pink-500 text-white font-semibold tracking-wide"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Posting...
              </>
            ) : (
              "Post"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
