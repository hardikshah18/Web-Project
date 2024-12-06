const mongoose = require('mongoose');
const AirBnB = require('../models/airbnbModel'); // Import the AirBnB model

const db = {};

// Initialize the connection to MongoDB Atlas
db.initialize = (connectionString) => {
  return new Promise((resolve, reject) => {
    mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Successfully connected to MongoDB Atlas');
      resolve();
    })
    .catch(err => {
      console.error('Error connecting to MongoDB:', err);
      reject(err);
    });
  });
};

// Add a new AirBnB entry to the database
db.addNewAirBnB = (data) => {
  return new Promise((resolve, reject) => {
    const newAirBnB = new AirBnB(data);
    newAirBnB.save()
      .then(() => {
        console.log('New AirBnB added successfully');
        resolve(newAirBnB);
      })
      .catch(err => {
        console.error('Error adding new AirBnB:', err);
        reject(err);
      });
  });
};

// Get all AirBnBs for a specific page with pagination and optional minimum_nights filter
db.getAllAirBnBs = (page, perPage, minimum_nights) => {
  return new Promise((resolve, reject) => {
    const query = {};
    if (minimum_nights) {
      query.minimum_nights = { $gte: minimum_nights };
    }

    AirBnB.find(query)
      .skip((page - 1) * perPage)  // Skip based on the page and perPage values
      .limit(perPage)  // Limit the number of items per page
      .sort({ _id: 1 })  // Sort by AirBnB_id
      .then(results => {
        resolve(results);
      })
      .catch(err => {
        console.error('Error fetching AirBnBs:', err);
        reject(err);
      });
  });
};

// Get a single AirBnB by its ID
db.getAirBnBById = (id) => {
  return new Promise((resolve, reject) => {
    AirBnB.findById(id)
      .then(result => {
        if (!result) {
          reject(new Error('AirBnB not found'));
        } else {
          resolve(result);
        }
      })
      .catch(err => {
        console.error('Error fetching AirBnB by ID:', err);
        reject(err);
      });
  });
};

// Update an existing AirBnB by its ID
db.updateAirBnBById = (data, id) => {
  return new Promise((resolve, reject) => {
    AirBnB.findByIdAndUpdate(id, data, { new: true })  // Update and return the new object
      .then(updatedAirBnB => {
        if (!updatedAirBnB) {
          reject(new Error('AirBnB not found'));
        } else {
          resolve(updatedAirBnB);
        }
      })
      .catch(err => {
        console.error('Error updating AirBnB by ID:', err);
        reject(err);
      });
  });
};

// Delete an AirBnB by its ID
db.deleteAirBnBById = (id) => {
  return new Promise((resolve, reject) => {
    AirBnB.findByIdAndDelete(id)
      .then(deletedAirBnB => {
        if (!deletedAirBnB) {
          reject(new Error('AirBnB not found'));
        } else {
          resolve(deletedAirBnB);
        }
      })
      .catch(err => {
        console.error('Error deleting AirBnB by ID:', err);
        reject(err);
      });
  });
};

module.exports = db;
