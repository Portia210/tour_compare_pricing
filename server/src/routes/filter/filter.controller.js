const { Filter } = require("../../models/filter.model");
const { FilterResults } = require("../../models/filterResults");
const { bookingExtractor } = require("../../utils/scrappers/bookingScrapper");
const { compare } = require("../../utils/scrappers/compare");
const { travelorExtractor } = require("../../utils/scrappers/travelorScrapper");

// GET /api/filters?destination=... - Get filterResults by destination
async function getResultByDestination(req, res) {
  const { destination } = req.query;

  try {
    const filter = await Filter.findOne({
      destination: destination.toLowerCase(),
    }).lean();

    if (!filter) {
      return res.status(404).json({ message: "Filter Not Found" });
    }

    const filterResult = await FilterResults.findOne({ filterId: filter._id }).lean();

    if (!filterResult) {
      return res.status(404).json({ message: "Results Not Found" });
    }

    const response = {
      destination: filter.destination,
      date: filter.date,
      numberOfAdults: filter.numberOfAdults,
      numberOfChildren: filter.numberOfChildren,
      kidsAge: filter.kidsAge,
      comparisionResult: filterResult.comparisionResult,
    }

    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Invalid Input" });
  }
}

// POST /api/filters - Create a new filter
async function CreateFilter(req, res) {
  try {
    const payload = {
      ...req.body,
      destination: req.body.destination.toLowerCase(),
    };

    const filter = await Filter.create(payload);

    const bookingResult = await bookingExtractor(payload);

    const travelorResult = await travelorExtractor(payload);

    const comparisionResult = compare({ bookingResult, travelorResult });

    await FilterResults.create({
      filterId: filter._id,
      bookingResult,
      travelorResult,
      comparisionResult,
    });

    return res.status(200).json(comparisionResult);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Invalid Input" });
  }
}

module.exports = { CreateFilter, getResultByDestination };
