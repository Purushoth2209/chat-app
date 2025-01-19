const express = require('express');
const Message = require('../models/Message');
const { sendMessage, updateMessageStatus } = require('../controllers/messageController');

const router = express.Router();

// Route to send a message and save it to the database
router.post('/send', async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;

    // Save message to database
    const newMessage = new Message({
      senderId,
      receiverId,
      content,
      status: 'sent', // Initial status is 'sent'
      timestamp: new Date(),
    });

    await newMessage.save();

    // Emit to the receiver via socket
    const savedMessage = newMessage.toObject();
    savedMessage.timestamp = savedMessage.timestamp.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    // Emit the message to the receiver through socket
    sendMessage(receiverId, savedMessage);

    res.status(200).json({ message: savedMessage });
  } catch (err) {
    res.status(500).json({ error: 'Error sending message' });
  }
});

// Route to update message status (read/delivered)
router.post('/updateStatus', async (req, res) => {
  try {
    const { messageId, status } = req.body;

    // Validate status
    if (!['sent', 'delivered', 'read'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Update the status of the message in the database
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    message.status = status;
    await message.save();

    // Optionally, you can also emit an update via socket to notify the sender
    res.status(200).json({ message: 'Message status updated' });
  } catch (err) {
    res.status(500).json({ error: 'Error updating message status' });
  }
});

module.exports = router;
