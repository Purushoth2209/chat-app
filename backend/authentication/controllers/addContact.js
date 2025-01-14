const User = require('../models/User'); // Import the User model

// Function to add a new contact to the logged-in user's contact list
const addContact = async (req, res) => {
  const { profileId, contactName, contactProfileId, contactPhoneNumber } = req.body;

  // Check if profileId and contact details are provided
  if (!profileId || !contactName || !contactProfileId || !contactPhoneNumber) {
    return res.status(400).json({ message: 'profileId and contact information (contactName, contactProfileId, contactPhoneNumber) are required' });
  }

  try {
    // Find the user based on the custom `profileId` field
    const user = await User.findOne({ profileId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the contact already exists in the user's contact list
    const contactExists = user.contacts.some(contact => contact.profileId === contactProfileId);
    if (contactExists) {
      return res.status(400).json({ message: 'Contact already exists in the contact list' });
    }

    // Create a new contact object
    const newContact = {
      username: contactName,       // Contact's name
      profileId: contactProfileId, // Contact's unique profile ID
      phoneNumber: contactPhoneNumber, // Contact's phone number
    };

    // Add the new contact to the user's contact list
    user.contacts.push(newContact);

    // Save the updated user document in the database
    await user.save();

    // Respond with a success message
    return res.status(200).json({ message: 'Contact added successfully' });
  } catch (error) {
    console.error('Error adding contact:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { addContact };
