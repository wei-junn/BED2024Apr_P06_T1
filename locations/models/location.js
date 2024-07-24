const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Location {
  constructor(id, name, street_address, postal_code, tel_num) {
    this.id = id;
    this.name = name;
    this.street_address = street_address;
    this.postal_code = postal_code;
    this.tel_num = tel_num;
  }
  

  static async getAllLocations() {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `SELECT * FROM Locations`; // Replace with your actual table name
    const request = connection.request();
    const result = await request.query(sqlQuery);
    connection.close();
    return result.recordset.map(
      (row) => new Location(row.id, row.name, row.street_address, row.postal_code, row.tel_num)
    ); // Convert rows to Locations objects
  }

  static async getLocationById(id) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `SELECT * FROM Locations WHERE id = @id`; // Parameterized query
    const request = connection.request();
    request.input("id", id);
    const result = await request.query(sqlQuery);
    connection.close();
    return result.recordset[0]
      ? new Location(
          result.recordset[0].id,
          result.recordset[0].name,
          result.recordset[0].street_address,
          result.recordset[0].postal_code,
          result.recordset[0].tel_num
        )
      : null; // Handle location not found
  }

  static async createLocation(newLocationData) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `INSERT INTO Locations (name, street_address, postal_code, tel_num) VALUES (@name, @street_address, @postal_code, @tel_num); SELECT SCOPE_IDENTITY() AS id;`; // Retrieve ID of inserted record
    const request = connection.request();
    request.input("name", newLocationData.name);
    request.input("street_address", newLocationData.street_address);
    request.input("postal_code", newLocationData.postal_code);
    request.input("tel_num", newLocationData.tel_num);
    const result = await request.query(sqlQuery);
    connection.close();
    return this.getLocationById(result.recordset[0].id); // Retrieve the newly created location using its ID
  }

  static async updateLocation(id, newLocationData) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `UPDATE Locations SET name = @name, street_address = @street_address, postal_code = @postal_code, tel_num = @tel_num WHERE id = @id`; // Parameterized query
    const request = connection.request();
    request.input("id", id);
    request.input("name", newLocationData.name);
    request.input("street_address", newLocationData.street_address);
    request.input("postal_code", newLocationData.postal_code);
    request.input("tel_num", newLocationData.tel_num);
    await request.query(sqlQuery);
    connection.close();
    return this.getLocationById(id); // Returning the updated location data
  }

  static async deleteLocation(id) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `DELETE FROM Locations WHERE id = @id`; // Parameterized query
    const request = connection.request();
    request.input("id", id);
    const result = await request.query(sqlQuery);
    connection.close();
    return result.rowsAffected > 0; // Indicate success based on affected rows
  }
}


module.exports = Location;
