// controllers/messageController.js
const Message = require('../models/Message'); // Assuming you have a Message model

// Save message to the database
async function sendMessage(senderId, receiverId, content) {
  try {
    const message = new Message({
      sender: senderId,
      receiver: receiverId,
      content,
      status: 'sent', // Initial status is 'sent'
      createdAt: new Date(),
    });

    await message.save();
    return message;
  } catch (err) {
    console.error('Error saving message:', err);
    throw err;
  }
}

// Update the message status (delivered or read)
async function updateMessageStatus(messageId, status) {
  try {
    const message = await Message.findById(messageId);
    if (!message) throw new Error('Message not found');

    message.status = status;
    await message.save();
  } catch (err) {
    console.error('Error updating message status:', err);
    throw err;
  }
}

module.exports = {
  sendMessage,
  updateMessageStatus,
};
