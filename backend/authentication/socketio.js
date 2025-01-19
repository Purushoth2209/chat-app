const { Server } = require('socket.io');
const Message = require('./models/Message'); // Import your Message schema

// User-to-socket mapping
const userSockets = new Map();
let io; // Declare io globally

// Initialize Socket.io with the server
const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Adjust this based on your client URL
      methods: ["GET", "POST"],
    },
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Register the user's profileId with their socketId
    socket.on('register', async (profileId) => {
      console.log(`Registering profileId: ${profileId} with socketId: ${socket.id}`);
      userSockets.set(profileId, socket.id);

      // Fetch undelivered messages from the database
      const undeliveredMessages = await Message.find({ receiverId: profileId }).sort({ timestamp: 1 });
      undeliveredMessages.forEach((msg) => {
        const messageWithTime = {
          ...msg.toObject(),
          timestamp: new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        };
        socket.emit('receiveMessage', messageWithTime); // Emit undelivered messages with formatted time
      });

      // Optionally delete delivered messages from the database
      await Message.deleteMany({ receiverId: profileId });
    });

    // Handle sending a message from one user to another
    socket.on('sendMessage', async ({ senderId, receiverId, content }) => {
      console.log(`Message from ${senderId} to ${receiverId}: ${content}`);

      try {
        // Save the message to the database first
        const savedMessage = await Message.create({
          senderId,
          receiverId,
          content,
          timestamp: new Date(),
        });

        console.log(`Message saved to database: ${savedMessage}`);

        // Fetch the saved message from the database
        const fetchedMessage = await Message.findById(savedMessage._id);

        const messageWithTime = {
          ...fetchedMessage.toObject(),
          timestamp: new Date(fetchedMessage.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        };

        const receiverSocketId = userSockets.get(receiverId);
        if (receiverSocketId) {
          // Deliver the message to the recipient in real-time
          io.to(receiverSocketId).emit('receiveMessage', messageWithTime);
        } else {
          // Receiver is offline; message remains stored in the database for later delivery
          console.log(`User ${receiverId} is offline. Message will be delivered later.`);
        }
      } catch (error) {
        console.error('Error saving or delivering message:', error);
      }
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      for (let [profileId, socketId] of userSockets) {
        if (socketId === socket.id) {
          userSockets.delete(profileId);
          console.log(`Removed profileId: ${profileId} association`);
          break;
        }
      }
    });
  });

  return io; // Return io object after initialization
};

module.exports = { initializeSocket, userSockets, io }; // Export io and userSockets mapping
