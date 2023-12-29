const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const filterResultsSchema = new mongoose.Schema(
  {
    filterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Filter",
    },
    bookingResult: [
      {
        _id: {
          type: String, // Assuming uuidv4 returns a string UUID
          default: uuidv4,
        },
        // Add other properties as needed
        booking_title: {
          type: String,
          required: true,
        },
        booking_price: {
          type: String,
          required: true,
        },
        booking_rate: {
          type: String,
        },
        booking_stars: {
          type: String,
        },
        booking_distance: {
          type: String,
        },
        booking_link: {
          type: String,
          required: true,
        },
      },
    ],

    travelorResult: [
      {
        _id: {
          type: String, // Assuming uuidv4 returns a string UUID
          default: uuidv4,
        },
        // Add other properties as needed
        title: {
          type: String,
        },
        price: {
          type: String,
        },
        travellor_link: {
          type: String,
        },
        image: {
          type: String,
        },
      },
    ],

    comparisionResult: [
      {
        _id: {
          type: String, // Assuming uuidv4 returns a string UUID
          default: uuidv4,
        },
        hotel_title: {
          type: String,
        },
        stars: {
          type: String || Number,
        },
        rate: {
          type: Number || String,
        },
        distance: {
          type: String,
        },
        travellor_price: {
          type: Number,
        },
        booking_price: {
          type: Number,
        },
        price_difference: {
          type: Number,
        },
        travellor_link: {
          type: String,
        },
        booking_link: {
          type: String,
        },
        image: {
          type: String,
        },
      },
    ],
  },
  {
    collection: "filterResults",
    timestamps: true,
  }
);

const FilterResults = mongoose.model("FilterResults", filterResultsSchema);

module.exports = { FilterResults };
