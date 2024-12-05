const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const db = require('./config/db');
const routes = require('./routes/airbnbRoutes');
const hbs = require('hbs');

dotenv.config();

const AirBnB = require('./models/airbnbModel'); 

const app = express();
app.use(cors());
app.use(express.json());

// Set Handlebars as the templating engine
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));  // Views folder location

// Define the eq helper
hbs.registerHelper('eq', function(a, b) {
  return a === b ? 'selected' : ''; // Return 'selected' if true, otherwise an empty string
});

// Register a custom helper to join amenities
hbs.registerHelper('joinAmenities', function(amenities) {
  return amenities.join(", ");
});

hbs.registerHelper('formatCurrency', function(price) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
});

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;

// API Route to fetch all AirBnBs (for API use)
app.get('/api/AirBnBs', async (req, res) => {
  const { page = 1, perPage = 5, minimum_nights } = req.query;

  try {
    // Log query parameters
    console.log('Query Parameters:', { page, perPage, minimum_nights });

    // Call the getAllAirBnBs function with the query parameters
    const airbnbs = await db.getAllAirBnBs(parseInt(page), parseInt(perPage), minimum_nights);
    
    // Log the result from DB query
    console.log('AirBnBs:', airbnbs);

    if (airbnbs.length > 0) {
      return res.json(airbnbs);
    } else {
      return res.status(404).json({ message: 'No AirBnBs found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error' });
  }
});

// Render all data page
app.get('/all-data', async (req, res) => {
  try {
    const listings = await AirBnB.find(); // Fetch all listings from the database
    res.render('all-data', { title: 'All Listings', airbnbs: listings }); // Pass listings as airbnbs
  } catch (err) {
    console.error('Error fetching data:', err.message);
    res.status(500).send('Internal Server Error');
  }
});

// Render edit form for AirBnB
app.get('/edit/:id', async (req, res) => {
  const { id } = req.params;  // Get the listing ID from the URL
  try {
    const listing = await Airbnb.findById(id);  // Find the listing by ID
    if (!listing) {
      return res.status(404).send('Listing not found');
    }
    // Render the edit page with the listing data
    res.render('edit', { listing });  // Assuming 'edit' is your Handlebars template for editing
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Handle updating AirBnB data
app.post('/update/:id', async (req, res) => {
  try {
    const updatedData = {
      name: req.body.name,
      address: {
        city: req.body.city,
      },
      price: req.body.price,
    };

    await AirBnB.findByIdAndUpdate(req.params.id, updatedData); // Update the listing
    res.redirect('/all-data'); // Redirect to the all-data page
  } catch (err) {
    console.error('Error updating listing:', err.message);
    res.status(500).send('Internal Server Error');
  }
});

// Handle deleting an AirBnB
app.get('/delete/:id', async (req, res) => {
  try {
    await AirBnB.findByIdAndDelete(req.params.id); // Delete the listing by ID
    res.redirect('/all-data'); // Redirect back to the all-data page
  } catch (err) {
    console.error('Error deleting listing:', err.message);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/login', (req, res) => {
  res.render('login');  // Renders the login page (login.hbs)
});

// Render form to add new AirBnB
app.get('/add-new', (req, res) => {
  res.render('add-new');
});

// Handle adding new AirBnB
app.post('/add-new', async (req, res) => {
  const { name, price, location } = req.body;
  const newAirbnb = {
    name,
    price,
    address: { city: location },
    // Add more fields as required
  };

  try {
    await db.addNewAirBnB(newAirbnb);
    res.redirect('/all-data');
  } catch (error) {
    res.status(500).send('Error adding data');
  }
});

app.get('/', async (req, res) => {
  try {
    const airbnbs = await AirBnB.find();
    
    // Preprocess amenities to join them into a string
    airbnbs.forEach(airbnb => {
      airbnb.amenities = airbnb.amenities.join(", ");
    });

    res.render('home', { airbnbs });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Server error');
  }
});

app.get('/airbnbSearch', async (req, res) => {
  const { page = 1, perPage = 5, minimum_nights } = req.query;

  const parsedPage = parseInt(page);
  const parsedPerPage = parseInt(perPage);

  if (isNaN(parsedPage) || parsedPage < 1) {
    return res.status(400).json({ error: "Invalid page number." });
  }

  if (isNaN(parsedPerPage) || parsedPerPage < 1) {
    return res.status(400).json({ error: "Invalid perPage value." });
  }

  // Initialize query object for filtering
  const query = {};

  // Filter by minimum nights if provided
  if (minimum_nights) {
    const minNights = parseInt(minimum_nights);
    if (isNaN(minNights) || minNights < 1) {
      return res.status(400).json({ error: "Invalid minimum_nights value." });
    }
    query.minimum_nights = { $gte: minNights };
  }

  try {
    // Fetch data from the database
    const airbnbs = await AirBnB.find(query)
      .skip((parsedPage - 1) * parsedPerPage)
      .limit(parsedPerPage)
      .sort({ _id: 1 });

    // Get total number of records matching the query
    const totalRecords = await AirBnB.countDocuments(query);

    // Calculate pagination info
    const totalPages = Math.ceil(totalRecords / parsedPerPage);
    const previousPage = parsedPage > 1 ? parsedPage - 1 : null;
    const nextPage = parsedPage < totalPages ? parsedPage + 1 : null;

    // Render the airbnbResults.hbs page with pagination data and AirBnB listings
    res.render('airbnbResults', {
      title: 'AirBnB Search Results',
      airbnbs,
      page: parsedPage,
      perPage: parsedPerPage,
      totalPages,
      previousPage,
      nextPage,
      query, // Pass query params to be shown in the form (e.g., min nights)
    });
  } catch (err) {
    console.error('Error fetching AirBnBs:', err);
    res.status(500).json({ error: `Error fetching AirBnBs: ${err.message}` });
  }
});


// Initialize DB connection and start server
db.initialize(process.env.MONGO_URI)
  .then(() => {
    app.use(routes); // Use the routes for the API

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error initializing MongoDB:', err);
  });
