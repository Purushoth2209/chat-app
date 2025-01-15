const socketIo = require('socket.io');
const { sendMessage, updateMessageStatus } = require('./controllers/messageController');

let onlineUsers = {}; // Track online users

module.exports = function (server) {
  const io = socketIo(server, {
    cors: {
      origin: 'http://localhost:3000', // Frontend URL
      methods: ['GET', 'POST'],       // Allowed HTTP methods
      allowedHeaders: ['Content-Type', 'Authorization'], // Allow custom headers
      credentials: true,              // Allow credentials like cookies or headers
    },
  });

  io.on('connection', (socket) => {
    console.log('User connected: ' + socket.id);

    // Store user's socket ID
    socket.on('setUser', (userId) => {
      onlineUsers[userId] = socket.id;
      console.log(`User ${userId} is online`);
    });

    // Handle message sending
    socket.on('sendMessage', async (messageData) => {
      try {
        console.log('Received message data:', messageData); // Log the message data for debugging

        // Check if all required fields are present
        if (!messageData.senderId || !messageData.receiverId || !messageData.content) {
          console.error('Missing required fields in message data:', messageData);
          return; // Stop processing if data is incomplete
        }

        const { senderId, receiverId, content } = messageData;

        // Save the message to the database
        const message = await sendMessage(senderId, receiverId, content);

        // Deliver the message if the receiver is online
        if (onlineUsers[receiverId]) {
          io.to(onlineUsers[receiverId]).emit('receiveMessage', message);
          await updateMessageStatus(message._id, 'delivered');
        } else {
          console.log('Receiver is offline. Message will be delivered when they come online.');
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });

    // Handle message read receipts
    socket.on('markAsRead', async (messageId) => {
      try {
        await updateMessageStatus(messageId, 'read');
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected: ' + socket.id);

      // Remove user from online users list
      for (const userId in onlineUsers) {
        if (onlineUsers[userId] === socket.id) {
          delete onlineUsers[userId];
          console.log(`User ${userId} is offline`);
          break;
        }
      }
    });
  });
};
