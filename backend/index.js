import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoute from './routes/user.route.js'; 
import postRoute from './routes/post.route.js';
import { app,server } from './socketIO/socketIO.js';
import messageRoute from './routes/message.route.js';
import dotenv from 'dotenv'
import connectDb from './utils/db.js';
dotenv.config({})



app.use(cors( {
  origin: process.env.FRONTEND_URL,
  credentials: true, 
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Backend is running!' });
});

const PORT = process.env.PORT || 3000;

app.use('/api/v1/user',userRoute);
app.use('/api/v1/post',postRoute);
app.use('/api/v1/message',messageRoute);

server.listen(PORT,()=>{
  connectDb();
  console.log(`Server is running on port ${PORT}`);
}
);
export default app;