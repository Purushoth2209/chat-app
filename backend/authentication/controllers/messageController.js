const Message = require('../models/Message'); // Assuming you have a Message model
const User = require('../models/User'); // Assuming you have a User model

// Save message to the database
async function sendMessage(senderId, receiverId, content) {
  try {
    console.log(`Saving message from ${senderId} to ${receiverId}`); // Debug log

    const message = new Message({
      sender: senderId,
      receiver: receiverId,
      content,
      status: 'sent', // Initial status is 'sent'
      createdAt: new Date(),
    });

    await message.save();
    console.log('Message saved successfully to the database.'); // Debug log
    return message;
  } catch (err) {
    console.error('Error saving message:', err); // Debug log
    throw err;
  }
}

// Update the message status (delivered or read)
async function updateMessageStatus(messageId, status) {
  try {
    console.log(`Updating message status for message ID: ${messageId} to ${status}`); // Debug log

    const message = await Message.findById(messageId);
    if (!message) throw new Error('Message not found');

    message.status = status;
    await message.save();
    console.log('Message status updated successfully.'); // Debug log
  } catch (err) {
    console.error('Error updating message status:', err); // Debug log
    throw err;
  }
}

// Update user online status
const updateUserOnlineStatus = async (userId, isOnline) => {
  try {
    console.log(`Updating online status for user ${userId} to ${isOnline}`); // Debug log
    await User.findByIdAndUpdate(userId, { isOnline });
    console.log(`User ${userId} online status updated to ${isOnline}`); // Debug log
  } catch (error) {
    console.error('Error updating user online status:', error); // Debug log
    throw error;
  }
};

module.exports = {
  sendMessage,
  updateMessageStatus,
  updateUserOnlineStatus
};
