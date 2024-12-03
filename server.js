require("dotenv").config();
const express = require("express");
const cors = require("cors");
const exphbs = require('express-handlebars').engine;
const path = require("path");

const { connectToDB } = require("./db/db");
const airbnbRoutes = require("./routes/airbnbRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Set Handlebars as the template engine
app.engine("hbs", exphbs({ 
  extname: "hbs", 
  defaultLayout: "main",  // This should be your main layout file
  layoutsDir: path.join(__dirname, "views", "layouts") // Ensure the path is correct
}));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views")); // Set views directory

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS, JS, images) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use("/", airbnbRoutes);

// Connect to Database and Start Server
connectToDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
  });
