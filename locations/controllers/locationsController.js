const Location = require("../models/location");

const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.getAllLocations();
    res.json(locations);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving locations");
  }
};

const getLocationById = async (req, res) => {
  const locationId = parseInt(req.params.id);
  try {
    const location = await Location.getLocationById(locationId);
    if (!location) {
      return res.status(404).send("Location not found");
    }
    res.json(location);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving location");
  }
};

const createLocation = async (req, res) => {
  const newLocation = req.body;
  try {
    const createdLocation = await Location.createLocation(newLocation);
    res.status(201).json(createdLocation);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating location");
  }
};

const updateLocation = async (req, res) => {
  const locationId = parseInt(req.params.id);
  const newLocationData = req.body;
  try {
    const updatedLocation = await Location.updateLocation(locationId, newLocationData);
    if (!updatedLocation) {
      return res.status(404).send("Location not found");
    }
    res.json(updatedLocation);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating location");
  }
};

const deleteLocation = async (req, res) => {
  const locationId = parseInt(req.params.id);
  try {
    const success = await Location.deleteLocation(locationId);
    if (!success) {
      return res.status(404).send("Location not found");
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting location");
  }
};

module.exports = {
  getAllLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
};


