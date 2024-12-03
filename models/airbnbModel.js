const mongoose = require('mongoose');

const airbnbSchema = new mongoose.Schema({
  name: String,
  summary: String,
  description: String,
  images: {
    picture_url: String,
    thumbnail_url: String,
  },
  host: {
    host_name: String,
    host_url: String,
    host_location: String,
    host_about: String,
    host_thumbnail_url: String,
    host_picture_url: String,
  },
  address: {
    street: String,
    suburb: String,
    country: String,
    location: {
      type: { type: String, default: 'Point' },
      coordinates: [Number],
    },
  },
  price: Number,
  minimum_nights: Number,
  maximum_nights: Number,
  guests_included: Number,
  reviews: Array,
  listing_url: String,
});

const AirBnB = mongoose.model('AirBnB', airbnbSchema);

module.exports = AirBnB;
