// In-memory storage for inventory
const inventory = [];

exports.initializeInventory = () => {
  // Sample products for the inventory
  const sampleProducts = [
    { id: "p1", name: "Laptop", price: 999.99, quantity: 10 },
    { id: "p2", name: "Smartphone", price: 499.99, quantity: 20 },
    { id: "p3", name: "Headphones", price: 99.99, quantity: 30 },
    { id: "p4", name: "Keyboard", price: 49.99, quantity: 15 },
    { id: "p5", name: "Mouse", price: 29.99, quantity: 25 },
  ];

  // Clear previous inventory and add new products
  inventory.length = 0;
  inventory.push(...sampleProducts);

  console.log("Inventory initialized with sample products");
};

exports.getAllProducts = () => {
  return inventory;
};

exports.getProduct = (productId) => {
  return inventory.find((product) => product.id === productId);
};

exports.updateProductQuantity = (productId, quantityChange) => {
  const productIndex = inventory.findIndex(
    (product) => product.id === productId
  );

  if (productIndex !== -1) {
    inventory[productIndex].quantity += quantityChange;
    return inventory[productIndex];
  }

  return null;
};
