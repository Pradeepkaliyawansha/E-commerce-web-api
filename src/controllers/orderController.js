const orderModel = require("../models/orderModel");
const inventoryModel = require("../models/inventoryModel");
const orderQueue = require("../utils/orderQueue");

exports.createOrder = (req, res, next) => {
  try {
    const orderData = req.body;

    // Validate input data
    if (
      !orderData.customerInfo ||
      !orderData.products ||
      !Array.isArray(orderData.products) ||
      orderData.products.length === 0
    ) {
      return res.status(400).json({
        message:
          "Invalid order data. Customer information and at least one product are required.",
      });
    }

    // Check inventory availability for each product
    for (const item of orderData.products) {
      const product = inventoryModel.getProduct(item.productId);

      if (!product) {
        return res
          .status(404)
          .json({ message: `Product with ID ${item.productId} not found` });
      }

      // Check if sufficient quantity is available
      if (product.quantity < item.quantity) {
        return res.status(400).json({
          message: `Insufficient quantity for product ${product.name}. Available: ${product.quantity}, Requested: ${item.quantity}`,
        });
      }
    }

    // Create the order
    const newOrder = orderModel.createOrder(orderData);

    // Update inventory
    orderData.products.forEach((item) => {
      inventoryModel.updateProductQuantity(item.productId, -item.quantity);
    });

    // Add to processing queue
    orderQueue.addOrder(newOrder.id);

    return res.status(201).json(newOrder);
  } catch (error) {
    next(error);
  }
};

exports.getAllOrders = (req, res, next) => {
  // Get all orders from the model
  try {
    const orders = orderModel.getAllOrders();
    return res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

exports.getOrderById = (req, res, next) => {
  // Extract order ID from request parameters
  try {
    const orderId = req.params.id;
    const order = orderModel.getOrderById(orderId);

    if (!order) {
      return res
        .status(404)
        .json({ message: `Order with ID ${orderId} not found` });
    }

    return res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

exports.cancelOrder = (req, res, next) => {
  try {
    const orderId = req.params.id;
    // Find order in the database
    const order = orderModel.getOrderById(orderId);

    if (!order) {
      return res
        .status(404)
        .json({ message: `Order with ID ${orderId} not found` });
    }

    if (order.status === "processed") {
      return res
        .status(400)
        .json({ message: "Cannot cancel a processed order" });
    }

    if (order.status === "canceled") {
      return res.status(400).json({ message: "Order is already canceled" });
    }

    // Return items to inventory
    order.products.forEach((item) => {
      inventoryModel.updateProductQuantity(item.productId, item.quantity);
    });

    // Remove from queue if present
    orderQueue.removeOrder(orderId);

    // Update order status
    const updatedOrder = orderModel.updateOrderStatus(orderId, "canceled");

    return res.status(200).json({
      message: "Order canceled successfully",
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

exports.processNextOrder = (req, res, next) => {
  try {
    // Get the next order ID from the queue
    const nextOrderId = orderQueue.getNextOrder();

    if (!nextOrderId) {
      return res.status(200).json({ message: "No orders in the queue" });
    }

    // Update order status to "processed"
    const processedOrder = orderModel.updateOrderStatus(
      nextOrderId,
      "processed"
    );
    orderQueue.removeOrder(nextOrderId);

    return res.status(200).json({
      message: "Order processed successfully",
      order: processedOrder,
    });
  } catch (error) {
    next(error);
  }
};
