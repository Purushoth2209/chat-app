const User = require('../models/User');

// Function to search a user by phone number or username
const searchUser = async (req, res) => {
  const { query } = req.query;  // The query parameter passed in the URL (e.g., ?query=phoneOrUsername)

  if (!query) {
    return res.status(400).json({ message: 'Query parameter is required' });
  }

  try {
    // Search for user by phone number or username
    const user = await User.findOne({
      $or: [{ phoneNumber: query }, { username: query }],
    });

    if (user) {
      return res.json({
        message: 'User found',
        user: { username: user.username, phoneNumber: user.phoneNumber, profileId: user.profileId },  // Include _id to identify the user
      });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error searching for user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { searchUser };  // Ensure it's exported correctly
