const mongoose = require("mongoose");

const FilterSchema = new mongoose.Schema(
  {
    destination: {
      type: String,
      required: true,
    },
    date: {
      checkIn: {
        type: String,
        required: true,
      },
      checkOut: {
        type: String,
        required: true,
      },
    },
    country: {
      type: String,
    },
    currency: {
      type: String,
    },
    priceRange: {
      min: {
        type: Number,
      },
      max: {
        type: Number,
      },
    },
    stars: {
      type: [Number],
    },
    numberOfAdults: {
      type: Number,
      required: true,
    },
    numberOfChildren: {
      type: Number,
      default: 0,
    },
    numberOfRooms: {
      type: Number,
      required: true,
    },
    kidsAge: {
      type: [Number],
      default: [],
    },
    distanceFromCenter: {
      type: Number,
    },
  },
  {
    collection: "filters",
    timestamps: true,
  }
);

const Filter = mongoose.model("Filter", FilterSchema);

module.exports = { Filter };
