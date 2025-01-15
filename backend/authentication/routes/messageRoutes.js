// routes/messageRoutes.js
const express = require('express');
const { sendMessage, updateMessageStatus } = require('../controllers/messageController');

const router = express.Router();

// Route to send a message
router.post('/send', async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;
    const message = await sendMessage(senderId, receiverId, content);
    res.status(200).json({ message });
  } catch (err) {
    res.status(500).json({ error: 'Error sending message' });
  }
});

// Route to update message status (read/delivered)
router.post('/updateStatus', async (req, res) => {
  try {
    const { messageId, status } = req.body;
    await updateMessageStatus(messageId, status);
    res.status(200).json({ message: 'Message status updated' });
  } catch (err) {
    res.status(500).json({ error: 'Error updating message status' });
  }
});

module.exports = router;
