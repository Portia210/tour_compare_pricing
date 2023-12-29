const whitelist = ["http://localhost:3000", "http://localhost:5000","http://localhost:8000","http://localhost:5500"];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
    // callback(null, true);
  },
  httpSuccessStatus: 200,
};

module.exports = { corsOptions };
