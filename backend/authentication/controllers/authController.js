const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { userSockets, io } = require('../socketio'); // Import userSockets map and io instance

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

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Update isOnline to true
        user.isOnline = true;
        await user.save();

        const token = jwt.sign(
            { profileId: user.profileId, phoneNumber: user.phoneNumber, username: user.username },
            'your_jwt_secret',
            { expiresIn: '1h' }
        );

        res.status(200).json({ token, profileId: user.profileId, username: user.username, message: 'Login successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Logout user and disconnect socket
exports.logoutUser = async (req, res) => {
    const { profileId } = req.body;

    if (!profileId) {
        return res.status(400).json({ message: 'Profile ID is required' });
    }

    try {
        // Find user by profileId
        const user = await User.findOne({ profileId });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Update isOnline to false
        user.isOnline = false;
        await user.save();

        // Disconnect user's socket connection if socketId exists
        const socketId = userSockets.get(profileId);
        if (socketId) {
            if (io) {  // Ensure io is defined before accessing
                const socket = io.sockets.sockets.get(socketId);
                if (socket) {
                    socket.disconnect(); // Disconnect the user
                    console.log(`Disconnected socket for profileId: ${profileId}`);
                } else {
                    console.error(`Socket not found for socketId: ${socketId}`);
                }
            } else {
                console.error("io is not initialized.");
            }

            userSockets.delete(profileId); // Remove from userSockets map
        }

        res.status(200).json({ message: 'Logout successful and connection terminated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
