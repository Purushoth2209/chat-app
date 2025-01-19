require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { initializeSocket } = require('./socketio'); // Import your custom Socket.IO setup

const app = express();
const server = http.createServer(app);

// Middleware to handle CORS
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  methods: ['GET', 'POST'],       // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow custom headers
  credentials: true,              // Allow credentials like cookies
}));

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// MongoDB connection using environment variable
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');

    // Setup routes
    app.use('/api/auth', authRoutes); // Routes for authentication and user search
    app.use('/api/messages', messageRoutes); // Routes for messaging

    // Initialize Socket.IO for real-time functionality
    initializeSocket(server);

    // Start the server
    server.listen(5000, () => {
      console.log('Server running on port 5000');
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB Atlas:', err);
  });
