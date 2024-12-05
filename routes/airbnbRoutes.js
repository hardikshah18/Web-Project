const express = require('express');
const router = express.Router();
const db = require('../config/db');

const AirBnB = require('../models/airbnbModel');

// POST: Add a new AirBnB
router.post('/api/AirBnBs', async (req, res) => {
  try {
    if (!req.body.name || !req.body.price) {
      return res.status(400).json({ message: "Name and price are required" });
    }
    const airbnb = await db.addNewAirBnB(req.body);
    res.status(201).json(airbnb);
  } catch (err) {
    res.status(500).json({ message: `Error creating AirBnB: ${err.message}` });
  }
});

// GET: List AirBnBs with pagination, filtering by minimum_nights and location
router.get('/api/AirBnBs', async (req, res) => {
  const { page = 1, perPage = 5, minimum_nights, location } = req.query;
  if (isNaN(page) || isNaN(perPage)) {
    return res.status(400).json({ message: "Page and perPage must be numbers" });
  }
  try {
    const airbnbs = await db.getAllAirBnBs(
      parseInt(page),
      parseInt(perPage),
      minimum_nights,
      location
    );
    res.status(200).json(airbnbs);
  } catch (err) {
    res.status(500).json({ message: `Error fetching AirBnBs: ${err.message}` });
  }
});

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

// GET: Display search form (for the search page)
router.get('/airbnbSearch', (req, res) => {
  res.render('airbnbSearch', { title: 'Search for AirBnBs' });
});

// POST: Search for AirBnBs using form data
router.post('/airbnbSearch', async (req, res) => {
  try {
    const { page = 1, perPage = 6, minimum_nights, location } = req.body;

    const query = {};
    if (minimum_nights) query.minimum_nights = { $gte: Number(minimum_nights) };
    if (location) query['address.city'] = location;

    const airbnbs = await AirBnB.find(query)
      .skip((page - 1) * perPage)
      .limit(Number(perPage));
    const totalCount = await AirBnB.countDocuments(query);

    res.render('airbnbSearch', {
      airbnbs,
      page: Number(page),
      perPage: Number(perPage),
      totalPages: Math.ceil(totalCount / perPage),
      minimum_nights,
      location,
    });
  } catch (error) {
    res.status(500).send('Error fetching data: ' + error.message);
  }
});


module.exports = router;
