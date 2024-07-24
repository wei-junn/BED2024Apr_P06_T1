const sql = require('mssql');
const dbConfig = require("../dbConfig");

const config = {
  user: 'location_api',
  password: '123',
  server: 'localhost', 
  database: 'locations_db',
  options: {
    encrypt: true, // Use this if you're on Windows Azure
    trustServerCertificate: true // Use this if your SQL Server uses a self-signed certificate
  }
};

class User {
  constructor(id, username, email) {
    this.id = id;
    this.username = username;
    this.email = email;
  }

  static async createUser(user) {
    try {
      const pool = await sql.connect(config);
      const result = await pool.request()
        .input('username', sql.VarChar, user.username)
        .input('email', sql.VarChar, user.email)
        .query('INSERT INTO Users (username, email) OUTPUT INSERTED.* VALUES (@username, @email)');
      
      const newUser = result.recordset[0];
      await pool.close();
      return new User(newUser.id, newUser.username, newUser.email);
    } catch (err) {
      console.error('SQL error', err);
      throw err;
    }
  }

  static async getAllUsers() {
    try {
      const pool = await sql.connect(config);
      const result = await pool.request().query('SELECT * FROM Users');
      await pool.close();
      return result.recordset.map(user => new User(user.id, user.username, user.email));
    } catch (err) {
      console.error('SQL error', err);
      throw err;
    }
  }

  static async getUserById(id) {
    try {
      const pool = await sql.connect(config);
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM Users WHERE id = @id');
      await pool.close();
      if (result.recordset.length === 0) return null;
      const user = result.recordset[0];
      return new User(user.id, user.username, user.email);
    } catch (err) {
      console.error('SQL error', err);
      throw err;
    }
  }

  static async updateUser(id, updatedUser) {
    try {
      const pool = await sql.connect(config);
      await pool.request()
        .input('id', sql.Int, id)
        .input('username', sql.VarChar, updatedUser.username)
        .input('email', sql.VarChar, updatedUser.email)
        .query('UPDATE Users SET username = @username, email = @email WHERE id = @id');
      await pool.close();
      return `User with ID ${id} updated successfully`;
    } catch (err) {
      console.error('SQL error', err);
      throw err;
    }
  }

  static async deleteUser(id) {
    try {
      const pool = await sql.connect(config);
      await pool.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM Users WHERE id = @id');
      await pool.close();
      return `User with ID ${id} deleted successfully`;
    } catch (err) {
      console.error('SQL error', err);
      throw err;
    }
  }

  static async searchUsers(searchTerm) {
    const connection = await sql.connect(dbConfig);

    try {
      const query = `
        SELECT *
        FROM Users
        WHERE username LIKE '%${searchTerm}%'
          OR email LIKE '%${searchTerm}%'
      `;

      const result = await connection.request().query(query);
      return result.recordset;
    } catch (error) {
      throw new Error("Error searching users"); // Or handle error differently
    } finally {
      await connection.close(); // Close connection even on errors
    }
  }

  static async getUsersWithLocations() {
    const connection = await sql.connect(dbConfig);

    try {
      const query = `
        SELECT u.id AS user_id, u.username, u.email, b.id AS location_id, b.id, b.name, b.street_address, b.postal_code, b.tel_num
        FROM Users u
        LEFT JOIN UserLocations ub ON ub.user_id = u.id
        LEFT JOIN Locations b ON ub.location_id = b.id
        ORDER BY u.username;
      `;

      const result = await connection.request().query(query);

      // Group users and their locations
      const usersWithLocations = {};
      for (const row of result.recordset) {
        const userId = row.user_id;
        if (!usersWithLocations[userId]) {
          usersWithLocations[userId] = {
            id: userId,
            username: row.username,
            email: row.email,
            locations: [],
          };
        }
        usersWithLocations[userId].locations.push({
          id: row.id,
          name: row.name,
          street_address: row.street_address,
          postal_code: row.postal_code, 
          tel_num: row.tel_num
        });
      }

      return Object.values(usersWithLocations);
    } catch (error) {
      throw new Error("Error fetching users with locations");
    } finally {
      await connection.close();
    }
  }
}

module.exports = User;