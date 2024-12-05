const AirBnB = require("../models/airbnbModel");

// Add a new Airbnb
const addNewAirBnB = async (req, res) => {
  try {
    const airbnb = new AirBnB(req.body);
    const result = await airbnb.save();
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

  // Build query object for filtering
  const query = {};

  // Handle minimum_nights filter
  if (minimum_nights) {
    const minNights = parseInt(minimum_nights);
    if (isNaN(minNights) || minNights < 1) {
      return res.status(400).json({ error: "Invalid minimum_nights value. It must be a positive integer." });
    }
    query.minimum_nights = { $gte: minNights };
  }

  try {
    // Fetch paginated and filtered AirBnB listings
    const airbnbs = await AirBnB.find(query)
      .skip((parsedPage - 1) * parsedPerPage)  // Pagination offset
      .limit(parsedPerPage)                   // Limit the number of results per page
      .sort({ _id: 1 });                      // Sort by ID in ascending order for consistency

    // Count the total number of matching records for pagination metadata
    const totalRecords = await AirBnB.countDocuments(query);

    // Return paginated results with metadata
    res.status(200).json({
      currentPage: parsedPage,
      perPage: parsedPerPage,
      totalRecords,
      totalPages: Math.ceil(totalRecords / parsedPerPage),
      data: airbnbs,
    });
  } catch (err) {
    console.error('Error fetching AirBnBs:', err);  // Log error for debugging
    res.status(500).json({ error: `Error fetching AirBnBs: ${err.message}` });
  }
};


// Get Airbnb by ID
const getAirBnBById = async (req, res) => {
  try {
    const airbnb = await AirBnB.findById(req.params.id);
    if (!airbnb) {
      return res.status(404).json({ error: "AirBnB not found" });
    }
    res.status(200).json(airbnb);
  } catch (err) {
    res.status(500).json({ error: `Error fetching AirBnB by ID: ${err.message}` });
  }
};

// Get Airbnb fees by ID
const getAirBnBFeesById = async (req, res) => {
  try {
    const airbnb = await AirBnB.findById(req.params.id);
    if (!airbnb) {
      return res.status(404).json({ error: "AirBnB not found" });
    }
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
    const airbnb = await AirBnB.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!airbnb) {
      return res.status(404).json({ error: "AirBnB not found" });
    }
    res.status(200).json({ message: "AirBnB updated successfully", airbnb });
  } catch (err) {
    res.status(500).json({ error: `Error updating AirBnB: ${err.message}` });
  }
};

// Delete Airbnb by ID
const deleteAirBnBById = async (req, res) => {
  try {
    const result = await AirBnB.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: "AirBnB not found" });
    }
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
