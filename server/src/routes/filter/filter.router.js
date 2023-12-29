const express = require("express");
const { CreateFilter, getResultByDestination } = require("./filter.controller");
const router = express.Router();

router.get("/", getResultByDestination);
router.post("/", CreateFilter);

module.exports = { FilterRouter: router };
