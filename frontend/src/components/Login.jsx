import { useState } from 'react'; 
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { motion } from 'framer-motion';
import { Instagram, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';
import { useEffect } from 'react';

const Login = () => {
  const navigate=useNavigate();
  const {user}=useSelector(store=>store.auth);
  useEffect(()=>{
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/health`, {withCredentials:true})
    if(user){
    navigate('/');
    }
  },[])
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const dispatch=useDispatch();
  const [loading,setLoading]=useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
  
    try {
        setLoading(true);
        const res=await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/login`, formData,{headers:{'Content-Type': 'application/json'},withCredentials:true});
        if(res.data.success){
          
          dispatch(setAuthUser(res.data.user));
            navigate('/');
            toast.success(res.data.message);
            setFormData({
                email: '',
                password: ''
            });
        }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-200 px-4">
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md space-y-6 border border-gray-200"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-indigo-600">
            <Instagram className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Instagram</h1>
          </div>
          <p className="text-gray-500 text-sm">Login to Your Account</p>
        </div>

    

        <div>
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition duration-200"
          />
        </div>

        <div>
          <Label htmlFor="password" className="text-sm font-medium">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition duration-200"
          />
        </div>

        {
            loading ?(
                <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold tracking-wide rounded-lg transition" >
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Logging in...
                </Button>
            ):
            (
                 <Button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold tracking-wide rounded-lg transition"
        >
          Login
        </Button>

            )

        }

       

        <p className="text-center text-sm text-gray-600">
          Don't have an account? <Link to="/signup" className="text-indigo-600 hover:underline">Signup</Link>
        </p>
      </motion.form>
    </div>
  );
};

export default Login;
