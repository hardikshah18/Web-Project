const express = require('express');
const { body, query, validationResult } = require('express-validator'); // Import express-validator methods
const router = express.Router();
const db = require('../config/db');  // Assuming the database interaction methods are here

// POST: Add a new AirBnB
router.post('/api/AirBnBs', 
  body('name').notEmpty().withMessage('Name is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  async (req, res) => {
    const errors = validationResult(req); // Use validationResult to check for errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const airbnb = await db.addNewAirBnB(req.body);
      res.status(201).json(airbnb);
    } catch (err) {
      res.status(500).json({ message: `Error creating AirBnB: ${err.message}` });
    }
  }
);

// GET: Get AirBnB fees by ID
router.get('/api/AirBnBs/fees/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const airbnb = await db.getAirBnBById(id);
    if (!airbnb) {
      return res.status(404).json({ message: "AirBnB not found" });
    }

    // Extracting the required fee details
    const fees = {
      price: airbnb.price,
      cleaning_fee: airbnb.cleaning_fee,
      security_deposit: airbnb.security_deposit,
      accommodates: airbnb.accommodates,
      extra_people: airbnb.extra_people,
      guests_included: airbnb.guests_included,
      bedroom_beds: airbnb.bedroom_beds,
      address: airbnb.address ? airbnb.address.street : null
    };

    res.status(200).json(fees);
  } catch (err) {
    res.status(500).json({ message: `Error fetching fees: ${err.message}` });
  }
});

// GET: List AirBnBs with pagination, filtering by minimum_nights and location
router.get('/api/AirBnBs', 
  query('page').isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('perPage').isInt({ min: 1 }).withMessage('PerPage must be a positive integer'),
  query('minimum_nights').optional().isInt({ min: 1 }).withMessage('Minimum nights must be a positive integer'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { page = 1, perPage = 5, minimum_nights, location } = req.query;
    const parsedPage = parseInt(page);
    const parsedPerPage = parseInt(perPage);

    try {
      const airbnbs = await db.getAllAirBnBs(
        parsedPage,
        parsedPerPage,
        minimum_nights,
        location
      );
      res.status(200).json(airbnbs);
    } catch (err) {
      res.status(500).json({ message: `Error fetching AirBnBs: ${err.message}` });
    }
  }
);

// GET: Get an AirBnB by ID
router.get('/api/AirBnBs/:id', async (req, res) => {
  try {
    const airbnb = await db.getAirBnBById(req.params.id);
    if (!airbnb) {
      return res.status(404).json({ message: "AirBnB not found" });
    }
    res.status(200).json(airbnb);
  } catch (err) {
    res.status(500).json({ message: `Error fetching AirBnB: ${err.message}` });
  }
});

// PUT: Update an AirBnB by ID
router.put('/api/AirBnBs/:id', async (req, res) => {
  try {
    const updatedAirBnB = await db.updateAirBnBById(req.body, req.params.id);
    if (!updatedAirBnB) {
      return res.status(404).json({ message: "AirBnB not found" });
    }
    res.status(200).json(updatedAirBnB);
  } catch (err) {
    res.status(500).json({ message: `Error updating AirBnB: ${err.message}` });
  }
});

// DELETE: Delete an AirBnB by ID
router.delete('/api/AirBnBs/:id', async (req, res) => {
  try {
    const deletedAirBnB = await db.deleteAirBnBById(req.params.id);
    if (!deletedAirBnB) {
      return res.status(404).json({ message: "AirBnB not found" });
    }
    res.status(204).json({ message: "AirBnB deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: `Error deleting AirBnB: ${err.message}` });
  }
});

// Search for AirBnBs based on query parameters
router.get('/airbnbSearch', async (req, res) => {
  const { page = 1, perPage = 5, minimum_nights } = req.query;

  // Parse the values to ensure they are integers
  const pageNumber = parseInt(page, 10);
  const perPageNumber = parseInt(perPage, 10);
  const minimumNights = minimum_nights ? parseInt(minimum_nights, 10) : null;

  let query = {};

  // Filter by minimum_nights if provided
  if (minimumNights) {
    query.minimum_nights = { $gte: minimumNights };
  }

  try {
    const airbnbs = await db.getAllAirBnBs(pageNumber, perPageNumber, query);
    res.json(airbnbs);
  } catch (err) {
    res.status(500).json({ message: `Error during search: ${err.message}` });
  }
});

module.exports = router;
