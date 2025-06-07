import jwt from 'jsonwebtoken';

const isAuthenticated=async(req,res,next)=>{
    try {
        const token=req.cookies.token;
        if(!token){
            return res.status(401).json({
                message: "Not Authenticated",
                success: false
            });
        } 
        const decoded=jwt.verify(token, process.env.SECRET_KEY); 
        if(!decoded){
            return res.status(401).json({
                message: "Invalid Token",
                success: false
            });
        }
        req.id= decoded.userId;
        next();
    } catch (error) {
        console.log("error", error);
    }
}

export default isAuthenticated;