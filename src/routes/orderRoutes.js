const express = require("express");
const orderController = require("../controllers/orderController");

const router = express.Router();

// Order routes
router.post("/orders", orderController.createOrder);
router.get("/orders", orderController.getAllOrders);
router.get("/orders/:id", orderController.getOrderById);
router.delete("/orders/:id", orderController.cancelOrder);

// Process next order in queue
router.post("/process-next-order", orderController.processNextOrder);

module.exports = router;
