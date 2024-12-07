const db = require("../config/db"); // Import the database logic from db.js

// Add a new Airbnb
const addNewAirBnB = async (req, res) => {
  try {
    const result = await db.addNewAirBnB(req.body);
    res.status(201).json({ message: "AirBnB created successfully", airbnb: result });
  } catch (err) {
    res.status(500).json({ error: `Error creating AirBnB: ${err.message}` });
  }
};

const getAllAirBnBs = async (req, res) => {
  const { page = 1, perPage = 6, minimum_nights } = req.query;

  // Parse and validate query parameters
  const parsedPage = parseInt(page);
  const parsedPerPage = parseInt(perPage);

  // Validate page and perPage values
  if (isNaN(parsedPage) || parsedPage < 1) {
    return res.status(400).json({ error: "Invalid page number. Must be a positive integer." });
  }

  if (isNaN(parsedPerPage) || parsedPerPage < 1) {
    return res.status(400).json({ error: "Invalid perPage value. Must be a positive integer." });
  }

  try {
    const airbnbs = await db.getAllAirBnBs(parsedPage, parsedPerPage, minimum_nights);
    const totalRecords = await db.countAirBnBs(minimum_nights); // Get the total number of records for pagination metadata

    res.status(200).json({
      currentPage: parsedPage,
      perPage: parsedPerPage,
      totalRecords,
      totalPages: Math.ceil(totalRecords / parsedPerPage),
      data: airbnbs,
    });
  } catch (err) {
    res.status(500).json({ error: `Error fetching AirBnBs: ${err.message}` });
  }
};

// Get Airbnb by ID
const getAirBnBById = async (req, res) => {
  try {
    const airbnb = await db.getAirBnBById(req.params.id);
    res.status(200).json(airbnb);
  } catch (err) {
    res.status(500).json({ error: `Error fetching AirBnB by ID: ${err.message}` });
  }
};

// Get Airbnb fees by ID
const getAirBnBFeesById = async (req, res) => {
  try {
    const airbnb = await db.getAirBnBById(req.params.id);
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
    const airbnb = await db.updateAirBnBById(req.body, req.params.id);
    res.status(200).json({ message: "AirBnB updated successfully", airbnb });
  } catch (err) {
    res.status(500).json({ error: `Error updating AirBnB: ${err.message}` });
  }
};

// Delete Airbnb by ID
const deleteAirBnBById = async (req, res) => {
  try {
    const result = await db.deleteAirBnBById(req.params.id);
    res.status(200).json({ message: "AirBnB deleted successfully" });
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
