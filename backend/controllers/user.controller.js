import User from "../models/user.model.js";
import Post from "../models/post.model.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import getDataUri from "../utils/datauri.js";
 

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(401).json({
                message: "All fields are required",
                success: false
            });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({
                message: "email already registered",
                success: false,
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            username,
            email,
            password: hashedPassword
        })
        return res.status(201).json({
            message: "User Registered Successfully",
            success: true
        })

    } catch (error) {
        console.log("error", error);

    }
}


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: "All fields are required",
                success: false
            })
        }
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({
                message: "User Not Found",
                success: false
            })
        }
        const isPasswordMatched=await bcrypt.compare(password,user.password)
        if(!isPasswordMatched){
             return res.status(401).json({
                message:"Incorrect email or Password",
                success:false
            })
        }
         const token=await jwt.sign({userId:user._id},process.env.SECRET_KEY,{expiresIn:'1d'});

         const populatedPosts= await Promise.all(user.posts.map(async (postId) => { 
            const post=await Post.findById(postId) 
            if(post.author.equals(user._id)){
                return post ;
            }
            return null;
         }))



         user={
            _id:user._id,
            username:user.username,
            email:user.email,
            profilePicture:user.profilePicture,
            bio:user.bio,
            gender:user.gender,
            followers:user.followers,
            following:user.following,
            posts:populatedPosts,
            bookmarks:user.bookmarks

        }

       
        return res.cookie('token',token,{httpOnly:true,sameSite:'strict',maxAge:1*24*60*60*1000}).json({
            message:`Welcome back ${user.username}`,
            success:true,
            user
        })
       

    } catch (error) {
       console.error("Login error:", error);
  return res.status(500).json({
    message: "Login Failed",
    success: false
  });
    }
}


export const logout=async(_,res)=>{
    try {
        return res.cookie("token","",{maxAge:0}).json({
            message:"Logged out Successfully",
            success:true
        })
    } catch (error) {
        console.log('error',error)
    }
}


export const getProfile=async (req,res)=>{
    try {
        const userId=req.params.id;
        let user= await User.findById(userId).select("-password");
        return res.status(200).json({
            user,
            success:true
        })
    } catch (error) {
        console.log('error',error)
    }
}


export const editProfile=async (req,res)=>{
    try {
        const userId=req.id;
        const{bio,gender}=req.body;
        const profilePicture=req.file
        let cloudResponse;
        if(profilePicture){
            const fileUri=getDataUri(profilePicture); 
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }
        const user=await User.findById(userId).select("-password");
        if(!user){
            return res.status(404).json({
                message:"User Not Found",
                success:false
            })
        }
        if(bio) user.bio=bio;
        if(gender) user.gender=gender;
        if(profilePicture) user.profilePicture=cloudResponse.secure_url;

        await user.save();
        return res.status(200).json({
            message:"Profile Updated Successfully",
            success:true,
            user
        })
    } catch (error) {
        console.error(error)
    }
}



export const getSuggestedUsers = async (req, res) => {
    try {
        const suggestedUsers=await User.find({_id:{$ne:req.id}}).select("-password");
        if(!suggestedUsers){
            return res.status(404).json({
                message:"No Suggested Users Found",
                success:false
            })
        }
        return res.status(200).json({
            message:"Suggested Users Found",
            success:true,
            users:suggestedUsers
        })
    } catch (error) {
        console.log('error',error);
    }
}


export const followOrUnfollow= async (req, res) => {
    try {
        const followKarneWala=req.id;
        const jiskoFollowKaruga=req.params.id;
        if(followKarneWala===jiskoFollowKaruga){
            return res.status(401).json({
                message:"You cannot follow/Unfollow yourself",
                success:false
            })
        }
        const user=await User.findById(followKarneWala);
        const targetUser=await User.findById(jiskoFollowKaruga);
        if(!user || !targetUser){
            return res.status(404).json({
                message:"User Not Found",
                success:false
            })
        } 
        const isFollowing=user.following.includes(jiskoFollowKaruga);  //checks followinng me hai ya nahi
        if(isFollowing){
            // Unfollow
            await Promise.all([
                User.updateOne({_id:followKarneWala},{$pull:{following:jiskoFollowKaruga}}),
                User.updateOne({_id:jiskoFollowKaruga},{$pull:{followers:followKarneWala}})
            ])
            return res.status(200).json({
                message:"Unfollowed Successfully",
                success:true
            })
        }
        else{
            // Follow
            await Promise.all([
                User.updateOne({_id:followKarneWala},{$push:{following:jiskoFollowKaruga}}),
                User.updateOne({_id:jiskoFollowKaruga},{$push:{followers:followKarneWala}})
            ])
            return res.status(200).json({
                message:"Followed Successfully",
                success:true
            })
        } 

    } catch (error) { 
        console.log('error', error);
        
    }
}