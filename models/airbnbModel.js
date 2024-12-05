const mongoose = require("mongoose");

// Use this check to avoid overwriting the model.
if (mongoose.models.AirBnB) {
  module.exports = mongoose.models.AirBnB;
} else {
  const airbnbSchema = new mongoose.Schema({
    description: String,
    name: String,
    price: Number,
    location: {
      type: { type: String },
      coordinates: [Number],
    },
    amenities: [String],
    host: {
      host_id: String,
      host_name: String,
    },
    address: {
      street: String,
      suburb: String,
      country: String,
    },
    minimum_nights: Number,
    maximum_nights: Number,
    reviews: [String], // Example, adjust based on actual reviews structure
  });

  const AirBnB = mongoose.model("AirBnB", airbnbSchema);
  module.exports = AirBnB;
}
