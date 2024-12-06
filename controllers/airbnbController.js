const express = require('express');
const db = require('../config/db');
const AirBnB = require('../models/airbnbModel');

const router = express.Router();

// Add a new Airbnb
const addNewAirBnB = async (req, res) => {
  try {
    const airbnb = await db.add(req.body);
    res.status(201).json({ message: "AirBnB created successfully", airbnb });
  } catch (err) {
    res.status(500).json({ error: `Error creating AirBnB: ${err.message}` });
  }
};

// Get all AirBnBs with pagination and filtering
const getAllAirBnBs = async (req, res) => {
  const { page = 1, perPage = 6, minimum_nights, location } = req.query;

  const query = {};
  if (minimum_nights) {
    const minNights = parseInt(minimum_nights);
    if (isNaN(minNights)) {
      return res.status(400).json({ error: "Invalid minimum_nights value. It must be a number." });
    }
    query.minimum_nights = { $gte: minNights };
  }
  if (location) {
    query['address.government_area'] = { $regex: location, $options: 'i' };
  }

  try {
    const airbnbs = await db.find(query, { page, perPage });
    const totalRecords = await db.count(query);
    res.status(200).json({
      currentPage: parseInt(page),
      perPage: parseInt(perPage),
      totalRecords,
      totalPages: Math.ceil(totalRecords / perPage),
      data: airbnbs,
    });
  } catch (err) {
    res.status(500).json({ error: `Error fetching AirBnBs: ${err.message}` });
  }
};

// Get Airbnb by ID
const getAirBnBById = async (req, res) => {
  try {
    const airbnb = await db.findById(req.params.id);
    if (!airbnb) return res.status(404).json({ error: "AirBnB not found" });
    res.status(200).json(airbnb);
  } catch (err) {
    res.status(500).json({ error: `Error fetching AirBnB: ${err.message}` });
  }
};

// Get Airbnb fees by ID
const getAirBnBFeesById = async (req, res) => {
  try {
    const airbnb = await db.findById(req.params.id);
    if (!airbnb) return res.status(404).json({ error: "AirBnB not found" });

    const fees = {
      price: airbnb.price,
      cleaning_fee: airbnb.cleaning_fee,
      security_deposit: airbnb.security_deposit,
      accommodates: airbnb.accommodates,
      extra_people: airbnb.extra_people,
      guests_included: airbnb.guests_included,
      address: airbnb.address ? airbnb.address.street : null,
    };
    res.status(200).json(fees);
  } catch (err) {
    res.status(500).json({ error: `Error fetching fees: ${err.message}` });
  }
};

// Update Airbnb by ID
const updateAirBnBById = async (req, res) => {
  try {
    const airbnb = await db.updateById(req.params.id, req.body);
    if (!airbnb) return res.status(404).json({ error: "AirBnB not found" });
    res.status(200).json({ message: "AirBnB updated successfully", airbnb });
  } catch (err) {
    res.status(500).json({ error: `Error updating AirBnB: ${err.message}` });
  }
};

// Delete Airbnb by ID
const deleteAirBnBById = async (req, res) => {
  try {
    const result = await db.deleteById(req.params.id);
    if (!result) return res.status(404).json({ error: "AirBnB not found" });
    res.status(204).json({ message: "AirBnB deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: `Error deleting AirBnB: ${err.message}` });
  }
};

module.exports = {
  addNewAirBnB,
  getAllAirBnBs,
  getAirBnBById,
  getAirBnBFeesById,
  updateAirBnBById,
  deleteAirBnBById,
};
