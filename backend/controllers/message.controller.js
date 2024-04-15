// Import necessary models
import Conversation from '../models/conversation.model.js';
import Message from '../models/message.model.js';

// Controller function for sending a message
export const sendMessage = async (req, res) => {
    try {
        // Extract necessary data from the request
        const { message } = req.body; // Extract the message from the request body
        const { id: receiverId } = req.params; // Extract the receiver ID from the request parameters
        const senderId = req.user._id; // Extract the sender ID from the authenticated user

        // Find or create the conversation between the sender and receiver
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        // If conversation doesn't exist, create a new one
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        // Create a new message object
        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        });

        // Save the new message to the database
        await newMessage.save();

        // Update the conversation with the new message ID
        if (newMessage) {
            conversation.messages.push(newMessage._id);
            await conversation.save();
        }
        await Promise.all([conversation.save() , newMessage.save()]);

        // Respond with the new message
        res.status(201).json(newMessage);
    } catch (error) {
        // Handle errors and respond with an error message
        console.log("Error in sendMessage controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
export const getMessages = async(req,res) => {
    try{
        const {id:userToChatId} = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: {$all: [senderId , userToChatId] },
        }).populate("messages"); //to get the message content in mongo we use populate

        if(!conversation) return res.status(200).json([]);

        const messages = conversation.messages;

        res.status(200).json(messages);
    }
    catch(error){
        console.log("Error in getMessages controller: ",error.message);
        res.status(500).json({error: " Internal server error"});
    }

}
