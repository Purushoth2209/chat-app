const User = require('../models/User'); // Adjust the path based on your project structure
const Message = require('../models/Message'); // Import the Message schema

/**
 * Controller to fetch contacts of a user with unread message counts.
 * Query parameter: profileId
 */
const fetchContact = async (req, res) => {
  const { profileId } = req.query;

  // Check if profileId is provided
  if (!profileId) {
    return res.status(400).json({ message: 'profileId is required' });
  }

  try {
    // Find the user by profileId
    const user = await User.findOne({ profileId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const contactsWithUnreadCounts = await Promise.all(
      user.contacts.map(async (contact) => {
        const unreadCount = await Message.countDocuments({
          senderId: contact.profileId,
          receiverId: profileId,
          isRead: false,
        });

        return {
          ...contact.toObject(),
          unreadCount, // Add the unread count for each contact
        };
      })
    );

    // Return the contacts array with unread counts
    res.status(200).json({ contacts: contactsWithUnreadCounts });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ message: 'An error occurred while fetching contacts' });
  }
};

module.exports = { fetchContact };
