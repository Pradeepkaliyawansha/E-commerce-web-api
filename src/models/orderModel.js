const { v4: uuidv4 } = require("uuid");
const inventoryModel = require("./inventoryModel");

// In-memory orders database
const orders = [];

/**
 * Create a new order
 * @param {Object} orderData - Order details
 * @returns {Object} - Created order
 */
function createOrder(orderData) {
  const { customerInfo, products } = orderData;

  // Validate incoming data
  if (
    !customerInfo ||
    !products ||
    !Array.isArray(products) ||
    products.length === 0
  ) {
    throw new Error("Invalid order data");
  }

  // Check inventory availability for each product
  for (const item of products) {
    const product = inventoryModel.getProduct(item.productId);

    if (!product) {
      const error = new Error(`Product with ID ${item.productId} not found`);
      error.unavailableProducts = [item.productId];
      throw error;
    }

    if (product.quantity < item.quantity) {
      const error = new Error(
        `Insufficient quantity for product ${product.name}`
      );
      error.unavailableProducts = [item.productId];
      throw error;
    }
  }

  // Create new order
  const order = {
    id: uuidv4(),
    customerInfo,
    products: products.map((item) => {
      const productDetails = inventoryModel.getProduct(item.productId);
      return {
        productId: item.productId,
        name: productDetails ? productDetails.name : "Unknown Product",
        price: productDetails ? productDetails.price : 0,
        quantity: item.quantity,
      };
    }),
    totalAmount: calculateTotal(products),
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  orders.push(order);
  return order;
}

/**
 * Calculate order total
 * @param {Array} products - Order products
 * @returns {Number} - Total amount
 */
function calculateTotal(products) {
  return products.reduce((total, item) => {
    const product = inventoryModel.getProduct(item.productId);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);
}

/**
 * Get all orders
 * @returns {Array} - All orders
 */
function getAllOrders() {
  return [...orders];
}

/**
 * Get order by ID
 * @param {String} id - Order ID
 * @returns {Object|null} - Order details or null if not found
 */
function getOrderById(id) {
  return orders.find((order) => order.id === id) || null;
}

/**
 * Update order status
 * @param {String} id - Order ID
 * @param {String} status - New status
 * @returns {Object|null} - Updated order or null if not found
 */
function updateOrderStatus(id, status) {
  const order = orders.find((order) => order.id === id);
  if (!order) {
    return null;
  }

  order.status = status;
  order.updatedAt = new Date().toISOString();

  return order;
}

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};
