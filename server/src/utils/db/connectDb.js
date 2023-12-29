const mongoose = require("mongoose");

async function connectDb() {
  try {
    const MONGO_URI = process.env.MONGO_URI;

    if (!MONGO_URI) {
      throw new Error("MONGO_URI is missing");
    }

    await mongoose.connect(MONGO_URI);
    console.log("DB connected");
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
}

module.exports = { connectDb };
