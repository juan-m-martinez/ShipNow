const express = require("express");
const mockController = require("../controllers/mock.controller");

const router = express.Router();

router.get("/users", mockController.getMockUsers);
router.get("/couriers", mockController.getMockCouriers);
router.get("/data", mockController.getMockDataset);
router.post("/seed", mockController.seedMockDataset);

module.exports = router;
