const express = require("express");
const router = express.Router();
const {
  addNewAirBnB,
  getAllAirBnBs,
  getAirBnBById,
  updateAirBnBById,
  deleteAirBnBById,
  getAirBnBFeesById
} = require("../controllers/airbnbController"); 

router.post("/api/AirBnBs", addNewAirBnB);
router.get("/api/AirBnBs", getAllAirBnBs);
router.get("/api/AirBnBs/:id", getAirBnBById);
router.put("/api/AirBnBs/:id", updateAirBnBById);
router.delete("/api/AirBnBs/:id", deleteAirBnBById);
router.get("/api/AirBnBs/fees/:id", getAirBnBFeesById);

router.get("/airbnbSearch", (req, res) => {
  res.render("airbnbSearch", { layout: "main", title: "AirBnB Search" });
});

router.post("/airbnbSearch", async (req, res) => {
  const { page, perPage, minimum_nights } = req.body;
  try {
    const AirBnB = require("../models/airbnbModel");

    const query = minimum_nights ? { minimum_nights: Number(minimum_nights) } : {};
    const airbnbs = await AirBnB.find(query)
      .skip((Number(page) - 1) * Number(perPage))
      .limit(Number(perPage))
      .sort({ _id: 1 });

    const totalAirbnbs = await AirBnB.countDocuments(query);
    const totalPages = Math.ceil(totalAirbnbs / perPage);

    res.render("airbnbResults", {
      layout: "main",
      title: "Filtered AirBnB Results",
      airbnbs,
      query: { page, perPage, minimum_nights },
      totalPages,
      previousPage: Math.max(1, page - 1),
      nextPage: Math.min(totalPages, Number(page) + 1),
    });
  } catch (error) {
    res.status(500).send("Error fetching results: " + error.message);
  }
});

module.exports = router;
