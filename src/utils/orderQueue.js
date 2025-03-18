// Simple order processing queue
const queue = [];

/**
 * Add an order to the queue
 * @param {String} orderId - Order ID
 */
function addOrder(orderId) {
  queue.push({
    orderId,
    addedAt: new Date().toISOString(),
  });
}

/**
 * Get the next order in the queue
 * @returns {String|null} - Order ID or null if queue is empty
 */
function getNextOrder() {
  if (queue.length === 0) {
    return null;
  }

  return queue[0].orderId;
}

/**
 * Remove an order from the queue
 * @param {String} orderId - Order ID to remove
 * @returns {Boolean} - True if order was found and removed
 */
function removeOrder(orderId) {
  const initialLength = queue.length;
  const index = queue.findIndex((item) => item.orderId === orderId);

  if (index !== -1) {
    queue.splice(index, 1);
    return true;
  }

  return false;
}

/**
 * Check if queue is empty
 * @returns {Boolean} - True if queue is empty
 */
function isQueueEmpty() {
  return queue.length === 0;
}

/**
 * Get all orders in the queue
 * @returns {Array} - All orders in queue
 */
function getQueueStatus() {
  return [...queue];
}

module.exports = {
  addOrder,
  getNextOrder,
  removeOrder,
  isQueueEmpty,
  getQueueStatus,
};
