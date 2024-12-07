const mongoose = require("mongoose");

// Check if the model exists to avoid overwriting it
if (mongoose.models.AirBnB) {
  module.exports = mongoose.models.AirBnB;
} else {
  const reviewScoresSchema = new mongoose.Schema({
    accuracy: { type: Number, min: 1, max: 10 },
    cleanliness: { type: Number, min: 1, max: 10 },
    checkin: { type: Number, min: 1, max: 10 },
    communication: { type: Number, min: 1, max: 10 },
    location: { type: Number, min: 1, max: 10 },
    value: { type: Number, min: 1, max: 10 },
    rating: { type: Number, min: 1, max: 100 },
  }, { _id: false });

  const reviewSchema = new mongoose.Schema({
    review_id: String,
    reviewer_name: String,
    comments: String,
    date: Date,
  }, { _id: false });

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
      type: { type: String, enum: ['Point'], required: true },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    availability: {
      availability_30: Number,
      availability_60: Number,
      availability_90: Number,
      availability_365: Number,
    },
    review_scores: reviewScoresSchema,
    reviews: [reviewSchema],
  });

  const AirBnB = mongoose.model("AirBnB", airbnbSchema);
  module.exports = AirBnB;
}
