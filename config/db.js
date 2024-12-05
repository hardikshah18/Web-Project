const mongoose = require('mongoose');

// Define the AirBnB schema
const airbnbSchema = new mongoose.Schema({
  listing_url: String,
  name: String,
  summary: String,
  space: String,
  description: String,
  neighborhood_overview: String,
  notes: String,
  transit: String,
  access: String,
  interaction: String,
  house_rules: String,
  property_type: String,
  room_type: String,
  bed_type: String,
  minimum_nights: Number,
  maximum_nights: Number,
  cancellation_policy: String,
  last_scraped: Date,
  calendar_last_scraped: Date,
  accommodates: Number,
  bedrooms: Number,
  beds: Number,
  number_of_reviews: Number,
  bathrooms: Number,
  amenities: [String],
  price: Number,
  weekly_price: Number,
  monthly_price: Number,
  cleaning_fee: Number,
  extra_people: Number,
  guests_included: Number,
  images: {
    thumbnail_url: String,
    medium_url: String,
    picture_url: String,
    xl_picture_url: String,
  },
  host: {
    host_id: String,
    host_url: String,
    host_name: String,
    host_location: String,
    host_about: String,
    host_thumbnail_url: String,
    host_picture_url: String,
    host_neighbourhood: String,
    host_is_superhost: Boolean,
    host_has_profile_pic: Boolean,
    host_identity_verified: Boolean,
    host_listings_count: Number,
    host_total_listings_count: Number,
  },
  address: {
    street: String,
    suburb: String,
    government_area: String,
    market: String,
    country: String,
    country_code: String,
  },
  location: {
    type: { type: String },
    coordinates: [Number],
  },
  availability: {
    availability_30: Number,
    availability_60: Number,
    availability_90: Number,
    availability_365: Number,
  },
  review_scores: Object,
  reviews: [Object],
});

const AirBnB = mongoose.model('AirBnB', airbnbSchema, 'listingsAndReviews');
const db = {
  // Initialize MongoDB connection
  initialize: async () => {
    const connectionString = process.env.MONGO_URI;
    try {
      await mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('MongoDB connected successfully');
    } catch (err) {
      console.error('MongoDB connection error:', err.message);
    }
  },

  // Add a new AirBnB listing
  addNewAirBnB: async (data) => {
    const airbnb = new AirBnB(data);
    try {
      await airbnb.save();
      return airbnb;
    } catch (err) {
      throw new Error(`Error adding new AirBnB: ${err.message}`);
    }
  },

  // Get all AirBnBs with pagination and filtering
  getAllAirBnBs: async (page = 1, perPage = 5, minimum_nights, location) => {
    const query = {};

    // Validate and parse minimum_nights
    if (minimum_nights) {
      const minNights = parseInt(minimum_nights);
      if (!isNaN(minNights)) {
        query.minimum_nights = { $gte: minNights };
      } else {
        throw new Error('Invalid minimum_nights value. It must be a number.');
      }
    }

    // Filter for location using case-insensitive regex for flexibility
    if (location) query['address.government_area'] = { $regex: location, $options: 'i' };

    try {
      // Fetch paginated and filtered results
      const airbnbs = await AirBnB.find(query)
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort({ name: 1 }); // Sort by name alphabetically

      return airbnbs;
    } catch (err) {
      throw new Error(`Error fetching AirBnBs: ${err.message}`);
    }
  },

  // Get a single AirBnB by ID
  getAirBnBById: async (id) => {
    try {
      const airbnb = await AirBnB.findById(id);
      if (!airbnb) throw new Error('AirBnB not found');
      return airbnb;
    } catch (err) {
      throw new Error(`Error fetching AirBnB by ID: ${err.message}`);
    }
  },

  // Update an existing AirBnB by ID
  updateAirBnBById: async (data, id) => {
    try {
      const airbnb = await AirBnB.findByIdAndUpdate(id, data, { new: true });
      if (!airbnb) throw new Error('AirBnB not found');
      return airbnb;
    } catch (err) {
      throw new Error(`Error updating AirBnB: ${err.message}`);
    }
  },

  // Delete an AirBnB by ID
  deleteAirBnBById: async (id) => {
    try {
      const airbnb = await AirBnB.findByIdAndDelete(id);
      if (!airbnb) throw new Error('AirBnB not found');
      return airbnb;
    } catch (err) {
      throw new Error(`Error deleting AirBnB: ${err.message}`);
    }
  },

  // Count the total number of AirBnBs with filters
  countAirBnBs: async (minimum_nights, location) => {
    const query = {};

    // Validate and parse minimum_nights
    if (minimum_nights) {
      const minNights = parseInt(minimum_nights);
      if (!isNaN(minNights)) {
        query.minimum_nights = { $gte: minNights };
      } else {
        throw new Error('Invalid minimum_nights value. It must be a number.');
      }
    }

    // Filter for location using case-insensitive regex for flexibility
    if (location) query['address.government_area'] = { $regex: location, $options: 'i' };

    try {
      const count = await AirBnB.countDocuments(query);
      return count;
    } catch (err) {
      throw new Error(`Error counting AirBnBs: ${err.message}`);
    }
  },
};

// Export the schema to be used in other files
module.exports = db;
