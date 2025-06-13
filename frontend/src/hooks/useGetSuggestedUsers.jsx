import { setSuggestedUsers } from "@/redux/authSlice";
import axios from "axios";
import react,{useEffect}from 'react';
import { useDispatch } from "react-redux";

const useGetSuggestedUsers=()=>{

    const dispatch=useDispatch()
    useEffect(() => {
      const fetchSuggestedUsers=async()=>{
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/suggestions`,{withCredentials:true});
            if(res.data.success){
                dispatch(setSuggestedUsers(res.data.users));
            }
        } catch (error) {
            console.log(error);
        }
      }

      fetchSuggestedUsers()

    }, [])
}

export default useGetSuggestedUsers