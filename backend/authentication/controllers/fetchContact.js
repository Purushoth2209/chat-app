const User = require('../models/User'); // Adjust the path based on your project structure

/**
 * Controller to fetch contacts of a user based on profileId.
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

    // Return the contacts array
    res.status(200).json({ contacts: user.contacts || [] });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ message: 'An error occurred while fetching contacts' });
  }
};

module.exports = { fetchContact };
