const express = require('express');
const db = require('./config/db');
const airbnbRoutes = require('./routes/airbnbRoutes');
require('dotenv').config(); // For loading environment variables

const app = express();

// Middleware for JSON parsing
app.use(express.json());

// Use the airbnbRoutes for API routes
app.use('/api', airbnbRoutes);

// Initialize the database connection
db.initialize(process.env.MONGO_URI) // Make sure the MongoDB URI is in your .env file
  .then(() => {
    // Start the server only after DB connection
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch((err) => {
    console.error('Failed to connect to the database:', err);
    process.exit(1); // Exit process with failure
  });

// Handle 404 - Route not found
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler for any other errors
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack to the console
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});
