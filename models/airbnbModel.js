// const mongoose = require("mongoose");

// // Check if the model exists to avoid overwriting it
// if (mongoose.models.AirBnB) {
//   module.exports = mongoose.models.AirBnB;
// } else {
//   const reviewScoresSchema = new mongoose.Schema({
//     accuracy: { type: Number, min: 1, max: 10 },
//     cleanliness: { type: Number, min: 1, max: 10 },
//     checkin: { type: Number, min: 1, max: 10 },
//     communication: { type: Number, min: 1, max: 10 },
//     location: { type: Number, min: 1, max: 10 },
//     value: { type: Number, min: 1, max: 10 },
//     rating: { type: Number, min: 1, max: 100 },
//   }, { _id: false });

//   const reviewSchema = new mongoose.Schema({
//     review_id: String,
//     reviewer_name: String,
//     comments: String,
//     date: Date,
//   }, { _id: false });

//   const airbnbSchema = new mongoose.Schema({
//     listing_url: String,
//     name: String,
//     summary: String,
//     space: String,
//     description: String,
//     neighborhood_overview: String,
//     notes: String,
//     transit: String,
//     access: String,
//     interaction: String,
//     house_rules: String,
//     property_type: String,
//     room_type: String,
//     bed_type: String,
//     minimum_nights: Number,
//     maximum_nights: Number,
//     cancellation_policy: String,
//     last_scraped: Date,
//     calendar_last_scraped: Date,
//     accommodates: Number,
//     bedrooms: Number,
//     beds: Number,
//     number_of_reviews: Number,
//     bathrooms: Number,
//     amenities: [String],
//     price: Number,
//     weekly_price: Number,
//     monthly_price: Number,
//     cleaning_fee: Number,
//     extra_people: Number,
//     guests_included: Number,
//     images: {
//       thumbnail_url: String,
//       medium_url: String,
//       picture_url: String,
//       xl_picture_url: String,
//     },
//     host: {
//       host_id: String,
//       host_url: String,
//       host_name: String,
//       host_location: String,
//       host_about: String,
//       host_thumbnail_url: String,
//       host_picture_url: String,
//       host_neighbourhood: String,
//       host_is_superhost: Boolean,
//       host_has_profile_pic: Boolean,
//       host_identity_verified: Boolean,
//       host_listings_count: Number,
//       host_total_listings_count: Number,
//     },
//     address: {
//       street: String,
//       suburb: String,
//       government_area: String,
//       market: String,
//       country: String,
//       country_code: String,
//     },
//     location: {
//       type: { type: String, enum: ['Point'], required: true },
//       coordinates: {
//         type: [Number], // [longitude, latitude]
//         required: true,
//       },
//     },
//     availability: {
//       availability_30: Number,
//       availability_60: Number,
//       availability_90: Number,
//       availability_365: Number,
//     },
//     review_scores: reviewScoresSchema,
//     reviews: [reviewSchema],
//   });

//   const AirBnB = mongoose.model("AirBnB", airbnbSchema);
//   module.exports = AirBnB;
// }


const mongoose = require("mongoose");

const airbnbSchema = new mongoose.Schema({
  _id: { type: String, required: true },  // _id is required
  listing_url: { type: String, default: null },
  name: { type: String, default: null },
  summary: { type: String, default: null },
  space: { type: String, default: null },
  description: { type: String, default: null },
  neighborhood_overview: { type: String, default: null },
  notes: { type: String, default: null },
  transit: { type: String, default: null },
  access: { type: String, default: null },
  interaction: { type: String, default: null },
  house_rules: { type: String, default: null },
  property_type: { type: String, default: null },
  room_type: { type: String, default: null },
  bed_type: { type: String, default: null },
  minimum_nights: { type: Number, default: null },
  maximum_nights: { type: Number, default: null },
  cancellation_policy: { type: String, default: null },
  last_scraped: { type: Date, default: null },
  calendar_last_scraped: { type: Date, default: null },
  first_review: { type: Date, default: null },
  last_review: { type: Date, default: null },
  accommodates: { type: Number, default: null },
  bedrooms: { type: Number, default: null },
  beds: { type: Number, default: null },
  number_of_reviews: { type: Number, default: null },
  bathrooms: { type: Number, default: null },
  amenities: { type: [String], default: [] },
  price: { type: Number, default: null },
  security_deposit: { type: Number, default: null },
  cleaning_fee: { type: Number, default: null },
  extra_people: { type: Number, default: null },
  guests_included: { type: Number, default: null },
  images: {
    thumbnail_url: { type: String, default: null },
    medium_url: { type: String, default: null },
    picture_url: { type: String, default: null },
    xl_picture_url: { type: String, default: null }
  },
  host: {
    host_id: { type: String, default: null },
    host_name: { type: String, default: null },
    host_location: { type: String, default: null },
    host_about: { type: String, default: null },
    host_response_time: { type: String, default: null },
    host_response_rate: { type: String, default: null },
    host_is_superhost: { type: Boolean, default: null }
  },
  address: {
    street: { type: String, default: null },
    suburb: { type: String, default: null },
    government_area: { type: String, default: null },
    market: { type: String, default: null },
    country: { type: String, default: null },
    country_code: { type: String, default: null }
  },
  availability: {
    availability_30: { type: Number, default: null },
    availability_60: { type: Number, default: null },
    availability_90: { type: Number, default: null },
    availability_365: { type: Number, default: null }
  },
  review_scores: {
    review_scores_accuracy: { type: Number, default: null },
    review_scores_cleanliness: { type: Number, default: null },
    review_scores_checkin: { type: Number, default: null },
    review_scores_communication: { type: Number, default: null },
    review_scores_location: { type: Number, default: null },
    review_scores_value: { type: Number, default: null },
    review_scores_rating: { type: Number, default: null }
  },
  reviews: [{
    reviewer_id: { type: String, default: null },
    reviewer_name: { type: String, default: null },
    comments: { type: String, default: null }
  }]
});

const Airbnb = mongoose.model('Airbnb', airbnbSchema, 'listingsAndReviews'); 
module.exports = Airbnb;
