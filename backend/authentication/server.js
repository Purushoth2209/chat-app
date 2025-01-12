const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');

const app = express();

// Middlewares
app.use(bodyParser.json());

// CORS configuration
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests only from your frontend (localhost:3000)
    credentials: true, // Allow credentials (cookies, authorization headers)
}));

// MongoDB connection with Promise handling
mongoose.connect('mongodb://localhost:27017/chatApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Start the server only after DB connection
    app.listen(5000, () => {
        console.log('Server running on port 5000');
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

// Routes
app.use('/api/auth', authRoutes);
