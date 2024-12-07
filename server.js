const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const db = require('./config/db');
const airbnbRoutes = require('./routes/airbnbRoutes'); // Import routes from airbnbRoutes.js
const hbs = require('hbs');
const multer = require('multer');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Set up multer storage and file naming
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Set the directory for file storage
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate a unique filename
  },
});

const upload = multer({ storage: storage }); // Initialize multer with storage config

// Set Handlebars as the templating engine
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views')); // Views folder location

// Register Handlebars helpers
hbs.registerHelper('eq', (a, b) => (a === b ? 'selected' : ''));
hbs.registerHelper('joinAmenities', (amenities) => amenities.join(', '));
hbs.registerHelper('formatCurrency', (price) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
});

// Serve static files from 'public' and 'uploads' folders
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads')); // Make the uploads folder publicly accessible

const PORT = process.env.PORT;

// Initialize DB connection
db.initialize(process.env.MONGO_URI)
  .then(() => {
    console.log('Database connection established successfully!');
    
    // Use imported routes for Airbnb functionalities
    app.use('/', airbnbRoutes); // Apply routes to the app
  })
  .catch((err) => {
    console.error('Error initializing MongoDB:', err);
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
