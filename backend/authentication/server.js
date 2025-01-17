const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { initializeSocket } = require('./socketio'); // Properly destructure the exported `initializeSocket` function

const app = express();
const server = http.createServer(app);

// Apply CORS middleware
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  methods: ['GET', 'POST'],       // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow custom headers
  credentials: true,              // Allow credentials like cookies or headers
}));

// Middleware setup
app.use(bodyParser.json()); // Parse incoming JSON requests

// MongoDB connection setup
mongoose.connect('mongodb://localhost:27017/chatApp', {
  useNewUrlParser: true, // These options are deprecated but safe to use for older Mongoose versions
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');

    // Setup routes
    app.use('/api/auth', authRoutes); // Authentication and user search routes
    app.use('/api/messages', messageRoutes); // Messaging routes

    // Initialize Socket.io
    initializeSocket(server);

    // Start the server
    server.listen(5000, () => {
      console.log('Server running on port 5000');
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });
