const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register a new user
exports.registerUser = async (req, res) => {
    const { phoneNumber, password, username } = req.body;
    if (!phoneNumber || !password || !username) {
        return res.status(400).json({ message: 'Phone number, username, and password are required' });
    }

    try {
        // Check if user exists
        const existingUser = await User.findOne({ phoneNumber });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this phone number already exists' });
        }

        // Generate profile ID
        const profileId = `user-${Date.now()}`;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({
            phoneNumber,
            password: hashedPassword,
            profileId,
            username
        });

        // Save user to the database
        await user.save();

        // Generate JWT token
        const token = jwt.sign({ profileId: user.profileId, phoneNumber: user.phoneNumber, username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });

        res.status(201).json({ token, profileId: user.profileId, username: user.username, message: 'Registration successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Login user
exports.loginUser = async (req, res) => {
    const { phoneNumber, password } = req.body;

    if (!phoneNumber || !password) {
        return res.status(400).json({ message: 'Phone number and password are required' });
    }

    try {
        const user = await User.findOne({ phoneNumber });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Compare password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ profileId: user.profileId, phoneNumber: user.phoneNumber, username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });

        console.log('Sending response:', { message: 'Login successful', token: token });
        res.status(200).json({ token, profileId: user.profileId, username: user.username, message: 'Login successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
