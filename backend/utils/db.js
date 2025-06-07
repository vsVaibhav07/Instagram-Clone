import mongoose from 'mongoose'

const connectDb = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database Connected Successfully");
    } catch (error) {
        console.log("Database Connection Error",error)
    }
}
export default connectDb