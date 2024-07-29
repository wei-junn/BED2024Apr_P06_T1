//Swagger
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json"); // Import generated spec

const locationsController = require("./controllers/locationsController");
const sql = require("mssql");
const dbConfig = require("./dbConfig");
const bodyParser = require("body-parser");
const validateLocations = require("./middlewares/validateLocations");
const usersController = require("./controllers/usersController");
const eventController = require("./controllers/EventController");
const validateEvents = require("./middlewares/validateEvents");
const path = require("path");

const staticMiddleware = express.static("public"); // Path to the public folder
const app = express();
const port = process.env.PORT || 3000; // Use environment variable or default port

// Include body-parser middleware to handle JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For form data handling

app.use(staticMiddleware); // Mount the static middleware

// Define routes for locations
app.get("/locations", locationsController.getAllLocations);
app.get("/locations/:id", locationsController.getLocationById);
app.post("/locations", validateLocations, locationsController.createLocation); // POST for creating locations (can handle JSON data)
app.put("/locations/:id", validateLocations, locationsController.updateLocation); // PUT for updating locations
app.delete("/locations/:id", locationsController.deleteLocation); // DELETE for deleting locations

// Define routes for users
app.post("/users", usersController.createUser); // Create user
app.get("/users", usersController.getAllUsers); // Get all users
app.get("/users/:id", usersController.getUserById); // Get user by ID
app.put("/users/:id", usersController.updateUser); // Update user
app.delete("/users/:id", usersController.deleteUser); // Delete user
app.get("/users/search", usersController.searchUsers); // Search users
app.get("/users/with-locations", usersController.getUsersWithLocation); // Get users with locations

// Define routes for events
app.get("/events/search", eventController.searchEvents) // search for events
app.get("/events",eventController.getAllEvents) // Get all events
app.get("/events/:id", eventController.getEventById) // Get events by id
app.post("/events", validateEvents, eventController.createEvents) // create new events
app.put("/events/:id", validateEvents, eventController.updateEvent) // update events
app.delete("/events/:id", eventController.deleteEvent) // delete events

// Serve the Swagger UI at a specific route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, async () => {
  try {
    // Connect to the database
    await sql.connect(dbConfig);
    console.log("Database connection established successfully");
  } catch (err) {
    console.error("Database connection error:", err);
    // Terminate the application with an error code (optional)
    process.exit(1); // Exit with code 1 indicating an error
  }

  console.log(`Server listening on port ${port}`);
});


// Close the connection pool on SIGINT signal
process.on("SIGINT", async () => {
  console.log("Server is gracefully shutting down");
  // Perform cleanup tasks (e.g., close database connections)
  await sql.close();
  console.log("Database connection closed");
  process.exit(0); // Exit with code 0 indicating successful shutdown
});
