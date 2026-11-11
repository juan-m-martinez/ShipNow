const express = require("express");
const { testLogger } = require("../controllers/logger.controller");

const router = express.Router();

router.get("/test", testLogger);

module.exports = router;
