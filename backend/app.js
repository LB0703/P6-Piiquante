// Importing the different packages
const express = require("express");
const mongoose = require("mongoose");

///////////////////// SECURITY//////////////////////////////
//Dotenv is used to import an environment variable file
require("dotenv").config();

// The sanitize function will strip out any keys that start with '$' in the input
const mongoSanitize = require("express-mongo-sanitize");

// Express-rate-limit is used to limit incoming demand
const rateLimit = require("express-rate-limit");

// Helmet secures Express applications by setting various HTTP headers
const helmet = require("helmet");

const cors = require("cors");

// Importing roads
const saucesRoutes = require("./routes/sauces");
const userRoutes = require("./routes/users");
// Accessing the path of our file system
const path = require("path");

// Launch of express
const app = express();

// Connecting to the MongoDB database
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/test`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));
// CORS: Adding Permissions Middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(express.json());

app.use(mongoSanitize());

// Creating a limiter by calling the rateLimit function
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 500 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter);

app.use(helmet({ crossOriginResourcePolicy: false }));

// Routes expected by the frontend
app.use("/api/sauces", saucesRoutes);
app.use("/api/auth", userRoutes);
// File download middleware 'images of sauces'
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(cors());

module.exports = app;
