const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: { type: String, required: true }, // Profile ID of the sender
  receiverId: { type: String, required: true }, // Profile ID of the receiver
  content: { type: String, required: true }, // Message content
  timestamp: { type: Date, default: Date.now }, // Time the message was sent
});

module.exports = mongoose.model('Message', messageSchema);
