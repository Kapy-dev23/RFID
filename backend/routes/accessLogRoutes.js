const express = require("express");
const router = express.Router();

const accessLogController = require ("../controllers/accessLogController");

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");

router.get("/", auth, authorize("admin","staff"),accessLogController.getAccessHistory);

router.get("/average", auth, authorize("admin","staff"), accessLogController.getAverageWaitingTime);

module.exports = router;