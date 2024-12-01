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

module.exports = router;