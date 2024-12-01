require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { connectToDB } = require("./db/db");
const airbnbRoutes = require("./routes/airbnbRoutes");

const app = express();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", airbnbRoutes);

// Connect to Database and Start Server
connectToDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
  });
