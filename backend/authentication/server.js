const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');  // Importing the authRoutes (authentication and user search)
const cors = require('cors');

const app = express();

// Middleware setup
app.use(bodyParser.json());  // Parse incoming JSON requests
app.use(cors());  // Enable CORS

// MongoDB connection setup
mongoose.connect('mongodb://localhost:27017/chatApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Routes setup
    app.use('/api/auth', authRoutes);  // Authentication and user search routes

    // Start the server only after DB connection
    app.listen(5000, () => {
      console.log('Server running on port 5000');
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });
