const User = require("../models/user");

// Create a new user
async function createUser(req, res) {
    try {
      const userData = req.body;
      const newUser = await User.createUser(userData);
      res.status(201).json({
        message: 'User created successfully',
        user: newUser
      });
    } catch (err) {
      res.status(500).json({
        message: 'Error creating user',
        error: err.message
      });
    }
  }
  
  // Get all users
  async function getAllUsers(req, res) {
    try {
      const users = await User.getAllUsers();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({
        message: 'Error retrieving users',
        error: err.message
      });
    }
  }
  
  // Get user by ID
  async function getUserById(req, res) {
    try {
      const userId = req.params.id;
      const user = await User.getUserById(userId);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({
          message: 'User not found'
        });
      }
    } catch (err) {
      res.status(500).json({
        message: 'Error retrieving user',
        error: err.message
      });
    }
  }
  
  // Update a user
  async function updateUser(req, res) {
    try {
      const userId = req.params.id;
      const updatedData = req.body;
      const updatedUser = await User.updateUser(userId, updatedData);
      res.status(200).json({
        message: 'User updated successfully',
        user: updatedUser
      });
    } catch (err) {
      res.status(500).json({
        message: 'Error updating user',
        error: err.message
      });
    }
  }
  
  // Delete a user
  async function deleteUser(req, res) {
    try {
      const userId = req.params.id;
      await User.deleteUser(userId);
      res.status(200).json({
        message: 'User deleted successfully'
      });
    } catch (err) {
      res.status(500).json({
        message: 'Error deleting user',
        error: err.message
      });
    }
  }

  async function searchUsers(req, res) {
    const searchTerm = req.query.searchTerm; // Extract search term from query params
  
    try {    
      const users = await User.searchUsers(searchTerm);
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error searching users" });
    }
  }

  async function getUsersWithBooks(req, res) {
    try {
      const users = await User.getUsersWithBooks();
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching users with books" });
    }
  }
  
  
  module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    searchUsers,
    getUsersWithBooks
  };

