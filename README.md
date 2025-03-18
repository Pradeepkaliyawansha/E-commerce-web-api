# E-commerce API

A simple RESTful API for an e-commerce system, built with Node.js and Express. This API allows for creating and managing orders, handling inventory, and processing orders through a queue system.

## Getting Started

### Prerequisites

- Node.js (v20)
- npm (Node Package Manager)

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/e-commerce-api.git
```

2. Install dependencies

```bash
npm install
```

3. Start the server

```bash
npm start
```

The server will start on port 3000 by default. You can change this by setting the PORT environment variable.

## Design Decisions

### Architecture

The application follows a basic MVC (Model-View-Controller) pattern:

- **Models**: Handle data storage and business logic
- **Controllers**: Process requests and send responses
- **Routes**: Define API endpoints

### Data Storage

The application uses in-memory storage for simplicity. In a production environment, this would be replaced with a database. As the preference we can add database with minimal changes.

### Order Processing

Orders follow a simple lifecycle:

1. Orders are created with "pending" status
2. They are added to a processing queue
3. Orders can be processed one at a time, changing their status to "processed"
4. Orders can be canceled if not yet processed

### Inventory Management

The inventory system:

- Tracks product quantities
- Automatically updates when orders are created or canceled
- Prevents orders from being placed if insufficient inventory is available

## Assumptions

- The API is for demonstration purposes and not intended for production use
- Authentication and authorization are not implemented
- The system doesn't persist data between server restarts
- All operations are synchronous for simplicity
- Order IDs are UUID v4 strings
- Products have fixed prices and don't support variations

## API Endpoints

### Order Management

#### Create an Order

- **Endpoint**: `POST /api/orders`
- **Description**: Creates a new order and adds it to the processing queue
- **Request Body**:

```json
{
  "customerInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "address": "123 Main St"
  },
  "products": [
    {
      "productId": "p1",
      "quantity": 1
    },
    {
      "productId": "p2",
      "quantity": 2
    }
  ]
}
```

- **Response**: Returns the created order with a unique ID

#### Get All Orders

- **Endpoint**: `GET /api/orders`
- **Description**: Retrieves all orders in the system
- **Response**: Returns an array of order objects

#### Get Order by ID

- **Endpoint**: `GET /api/orders/:id`
- **Description**: Retrieves a specific order by its ID
- **Response**: Returns the order object if found, or 404 if not found

#### Cancel an Order

- **Endpoint**: `DELETE /api/orders/:id`
- **Description**: Cancels an order, returns products to inventory, and removes it from the queue
- **Response**: Returns the canceled order or an error if the order is already processed

### Order Processing

#### Process Next Order

- **Endpoint**: `POST /api/process-next-order`
- **Description**: Processes the next order in the queue, changing its status to "processed"
- **Response**: Returns the processed order or a message if the queue is empty

## Error Handling

The API returns appropriate status codes and error messages:

- `400 Bad Request`: Invalid input data
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server-side error

Detailed error messages are provided in the response body.
