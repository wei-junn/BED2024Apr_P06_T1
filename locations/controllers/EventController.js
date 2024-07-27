// create try catch for each functions
const Event = require("../models/Event");
const sql = require('mssql');

const getAllEvents = async (req, res) => {
  try {
    const Events = await Event.getAllEvents();
    res.json(Events);
  } catch (err) {
    console.error(error);
    res.status(500).send("Error retrieving events");
  }
};

const getEventById = async (req, res) => {
  const EventId = parseInt(req.params.id);
  try {
    const event = await Event.getEventById(EventId);
    if (!event) {
      return res.status(404).send("Event not found");
    }
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving Event");
  }
};

const createEvents = async (req, res) => {
  const newEvent = req.body

  try {
    const createdEvent = await Event.createEvent(newEvent);
    res.status(201).json(createdEvent);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating event");
  }
};

const updateEvent = async (req, res) => {
  const EventId = parseInt(req.params.id);
  const newEventData = req.body;

  try {
    const updatedEvent = await Event.updateEvent(EventId, newEventData);
    if (!updatedEvent) {
      return res.status(404).send("Event not found");
    }
    res.json(updatedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating event");
  }
};

const deleteEvent = async (req, res) => {
  const EventId = parseInt(req.params.id);

  try {
    const success = await Event.deleteEvent(EventId);
    if (!success) {
      return res.status(404).send("Event not found");
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting event");
  }

};

const searchEvents = async (req, res) => {
    const searchTerm = req.query.searchTerm; 
  
    try {    
      const Events = await Event.searchEvents(searchTerm);
      res.json(Events);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error searching for events" });
    }
  }


module.exports = {
  getAllEvents,
  getEventById,
  createEvents,
  updateEvent,
  deleteEvent,
  searchEvents
}