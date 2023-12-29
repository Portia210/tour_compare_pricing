const express = require("express");
const { connectDb } = require("./utils/db/connectDb");
const { FilterRouter } = require("./routes/filter/filter.router");
const cors = require("cors");
const { corsOptions } = require("./utils/cors/corsOptions");

const app = express();

require("dotenv").config();
const PORT = process.env.PORT || 5000;


// connect to db
connectDb();

// middlewares
app.use(cors("*"))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routers
app.use("/api/filters",FilterRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
