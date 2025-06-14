import Conversation from "../models/conversation.model.js";
import Message from "../models/messsage.model.js";
import { getUserSocketId, io } from "../socketIO/socketIO.js";

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { messageText: message } = req.body;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            });
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });
        if (newMessage) conversation.messages.push(newMessage._id);
        await Promise.all([conversation.save(), newMessage.save()]);

        //implement socketId for real Time Messaging

        const receiverSocketSet = getUserSocketId(receiverId);
       

        if (receiverSocketSet) {
            for (const receiverSocketId of receiverSocketSet) {
                io.to(receiverSocketId).emit('newMessage', newMessage);
            }

        }

        return res.status(200).json({
            success: true,
            newMessage
        });


    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export const getMessages = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate('messages');
        if (!conversation) {
            return res.status(404).json({ message: "New Conversation", success: true, messages: [] });
        }
        return res.status(200).json({
            success: true,
            messages: conversation?.messages
        });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}