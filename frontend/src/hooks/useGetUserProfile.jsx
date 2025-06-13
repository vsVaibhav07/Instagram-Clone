import { setUserProfile } from "@/redux/authSlice";
import axios from "axios";
import react,{useEffect}from 'react';
import { useDispatch } from "react-redux";

const useGetUserProfile=(userId)=>{

    const dispatch=useDispatch()
    useEffect(() => {
      const fetchUserProfile=async()=>{
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/${userId}/profile`,{withCredentials:true});
            if(res.data.success){
                dispatch(setUserProfile(res.data.user));
            }
        } catch (error) {
            console.log(error);
        }
      }

      fetchUserProfile()

    }, [userId])
}

export default useGetUserProfile