// const db = require("../config/db"); // Import the database logic from db.js

// // Add a new Airbnb
// const addNewAirBnB = async (req, res) => {
//   try {
//     const result = await db.addNewAirBnB(req.body);
//     res.status(201).json({ message: "AirBnB created successfully", airbnb: result });
//   } catch (err) {
//     res.status(500).json({ error: `Error creating AirBnB: ${err.message}` });
//   }
// };

// const getAllAirBnBs = async (req, res) => {
//   const { page = 1, perPage = 6, minimum_nights } = req.query;

//   // Parse and validate query parameters
//   const parsedPage = parseInt(page);
//   const parsedPerPage = parseInt(perPage);

//   // Validate page and perPage values
//   if (isNaN(parsedPage) || parsedPage < 1) {
//     return res.status(400).json({ error: "Invalid page number. Must be a positive integer." });
//   }

//   if (isNaN(parsedPerPage) || parsedPerPage < 1) {
//     return res.status(400).json({ error: "Invalid perPage value. Must be a positive integer." });
//   }

//   try {
//     const airbnbs = await db.getAllAirBnBs(parsedPage, parsedPerPage, minimum_nights);
//     const totalRecords = await db.countAirBnBs(minimum_nights); // Get the total number of records for pagination metadata

//     res.status(200).json({
//       currentPage: parsedPage,
//       perPage: parsedPerPage,
//       totalRecords,
//       totalPages: Math.ceil(totalRecords / parsedPerPage),
//       data: airbnbs,
//     });
//   } catch (err) {
//     res.status(500).json({ error: `Error fetching AirBnBs: ${err.message}` });
//   }
// };

// // Get Airbnb by ID
// const getAirBnBById = async (req, res) => {
//   try {
//     const airbnb = await db.getAirBnBById(req.params.id);
//     res.status(200).json(airbnb);
//   } catch (err) {
//     res.status(500).json({ error: `Error fetching AirBnB by ID: ${err.message}` });
//   }
// };

// // Get Airbnb fees by ID
// // const getAirBnBFeesById = async (req, res) => {
// //   try {
// //     const airbnb = await db.getAirBnBById(req.params.id);
// //     const fees = {
// //       price: airbnb.price,
// //       cleaning_fee: airbnb.cleaning_fee,
// //       security_deposit: airbnb.security_deposit,
// //       accommodates: airbnb.accommodates,
// //       extra_people: airbnb.extra_people,
// //       guests_included: airbnb.guests_included,
// //       address: airbnb.address ? airbnb.address.street : null,
// //     };
// //     res.status(200).json(fees);
// //   } catch (err) {
// //     res.status(500).json({ error: `Error fetching fees: ${err.message}` });
// //   }
// // };

// // Update Airbnb by ID
// const updateAirBnBById = async (req, res) => {
//   try {
//     const airbnb = await db.updateAirBnBById(req.body, req.params.id);
//     res.status(200).json({ message: "AirBnB updated successfully", airbnb });
//   } catch (err) {
//     res.status(500).json({ error: `Error updating AirBnB: ${err.message}` });
//   }
// };

// // Delete Airbnb by ID
// const deleteAirBnBById = async (req, res) => {
//   try {
//     const result = await db.deleteAirBnBById(req.params.id);
//     res.status(200).json({ message: "AirBnB deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ error: `Error deleting AirBnB: ${err.message}` });
//   }
// };

// module.exports = {
//   addNewAirBnB,
//   getAllAirBnBs,
//   getAirBnBById,
//   // getAirBnBFeesById,
//   updateAirBnBById,
//   deleteAirBnBById,
// };

const AirBnB = require("../models/airbnbModel");
const mongoose = require("mongoose");

// Add a new AirBnB
const addNewAirBnB = async (req, res) => {
  try {
    console.log(req.body);  // Log the incoming body
    // No need to manually extract _id from the body if MongoDB handles it
    const airbnbData = req.body;  // Just use the body directly
    // Create a new AirBnB document
    const airbnb = new AirBnB(airbnbData);
    // Save the document to the database
    const result = await airbnb.save();
    res.status(201).json({ message: "AirBnB created successfully", airbnb: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all AirBnBs with pagination and optional filtering
const getAllAirBnBs = async (req, res) => {
  const { page = 1, perPage = 6, minimum_nights } = req.query;
  const query = minimum_nights ? { minimum_nights: minimum_nights } : {};
  try {
    const airbnbs = await AirBnB.find(query)
      .skip((page - 1) * perPage)
      .limit(Number(perPage))
      .sort({ _id: 1 });
    const totalRecords = await AirBnB.countDocuments(query);
    
    res.render("home", {
      airbnbs,
      currentPage: Number(page),
      totalPages: Math.ceil(totalRecords / perPage),
      perPage: perPage
    });
  } catch (err) {
    res.status(500).render("error", { message: "Error fetching AirBnBs", error: err.message });
  }
};
// Get AirBnB by ID
const getAirBnBById = async (req, res) => {
  try {
    const id = req.params.id; // Extract the ID from request parameters
    const airbnb = await AirBnB.findOne({ _id: id });  // Query based on the custom _id
    if (!airbnb) {
      return res.status(404).json({ error: "AirBnB not found" });
    }

    // You can either extract specific fields or just pass the whole airbnb object
    // const airbnbDetails = {
    //   listing_url: airbnb.listing_url,
    //   description: airbnb.description,
    //   neighborhood_overview: airbnb.neighborhood_overview,
    //   cancellation_policy: airbnb.cancellation_policy,
    //   property_type: airbnb.property_type,
    //   minimum_nights: airbnb.minimum_nights,
    //   room_type: airbnb.room_type,
    //   accommodates: airbnb.accommodates,
    //   price: airbnb.price,
    //   images: airbnb.images,
    //   review_score_value: airbnb.review_scores ? airbnb.review_scores.review_scores_value : null,
    //   amenities: airbnb.amenities,
    // };

    // Send the AirBnB details as a response
    res.render('detail', { listing: airbnb });  // Pass 'airbnb' object to the view as 'listing'
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Controller method to get AirBnB fees
const getAirBnBFeesById = async (req, res) => {
  try {
    const id = req.params.id; // Extract the ID from request parameters
    const airbnb = await AirBnB.findOne({ _id: id });  // Query based on the custom _id
    if (!airbnb) {
      return res.status(404).json({ error: "AirBnB not found" });
    }
    // Extract and return the necessary fee details
    const feeDetails = {
      price: airbnb.price,
      cleaning_fee: airbnb.cleaning_fee,
      security_deposit: airbnb.security_deposit,
      accommodates: airbnb.accommodates,
      extra_people: airbnb.extra_people,
      guests_included: airbnb.guests_included,
      bedrooms: airbnb.bedrooms,
      beds: airbnb.beds,
      street: airbnb.address ? airbnb.address.street : null // Make sure address exists
    };

    // Send the fee details in the response
    res.status(200).json(feeDetails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update AirBnB by ID
const updateAirBnBById = async (req, res) => {
    try {
      const updatedAirBnB = await AirBnB.findByIdAndUpdate(req.params.id, req.body, { new: true });
      // If no AirBnB document is found with the given _id, return a 404 error
    if (!updatedAirBnB) {
      return res.status(404).json({ error: "AirBnB not found" });
    }
    // Return the updated AirBnB document
    res.status(200).json({ message: "AirBnB updated successfully", updatedAirBnB });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  };
  

// Delete AirBnB by ID
const deleteAirBnBById = async (req, res) => {
    try {
      const result = await AirBnB.findByIdAndDelete(req.params.id);
      // If no AirBnB document is found with the given _id, return a 404 error
    if (!result) {
      return res.status(404).json({ error: "AirBnB not found" });
    }

    // Return a success message
    res.status(200).json({ message: "AirBnB deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
  

module.exports = {
  addNewAirBnB,
  getAllAirBnBs,
  getAirBnBById,
  updateAirBnBById,
  deleteAirBnBById,
  getAirBnBFeesById,
};
