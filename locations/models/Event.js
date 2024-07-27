const sql = require("mssql");
const dbConfig = require("../dbConfig");

// do the class for event
class Event {
    constructor(EventId, EventName, EventDescription, TimeStart, TimeEnd, locationid) {
      this.EventId = EventId;
      this.EventName = EventName
      this.EventDescription = EventDescription;
      this.TimeStart = TimeStart;
      this.TimeEnd = TimeEnd;
      this.locationid = locationid;
    }

    // do functions for the events (get all event, create events)
    static async getAllEvents() {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `SELECT * FROM Events`;
    
        const request = connection.request();
        const result = await request.query(sqlQuery);
    
        connection.close();
    
        return result.recordset.map(
          (row) => new Event(row.EventId, row.EventName, row.EventDescription, row.TimeStart, row.TimeEnd, row.locationid)
        ); // Convert rows to Event objects
    }

    static async getEventById(id) {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `SELECT * FROM Events WHERE Eventid = @id`; // Parameterized query
    
        const request = connection.request();
        request.input("id", id);
        const result = await request.query(sqlQuery);
    
        connection.close();
    
        return result.recordset[0]
          ? new Event(
              result.recordset[0].EventId,
              result.recordset[0].EventName,
              result.recordset[0].EventDescription,
              result.recordset[0].TimeStart,
              result.recordset[0].TimeEnd
            )
          : null; // Handle event not found
    }

    static async createEvent(newEventData) {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `INSERT INTO Events (EventName, EventDescription, TimeStart, TimeEnd, AdminId, locationid) VALUES (@EventName, @EventDescription, @TimeStart, @TimeEnd, @AdminId, @locationid); SELECT SCOPE_IDENTITY() AS id;`; // Retrieve ID of inserted record
    
        const request = connection.request();
        request.input("EventName", newEventData.EventName);
        request.input("EventDescription", newEventData.EventDescription);
        request.input("TimeStart", newEventData.TimeStart);
        request.input("TimeEnd", newEventData.TimeEnd);
        request.input("AdminId", newEventData.AdminId);
        request.input("locationid", newEventData.locationid);
        const result = await request.query(sqlQuery);
    
        connection.close();
    
        return this.getEventById(result.recordset[0].id);
      }

      static async updateEvent(EventId, newEventData) {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `UPDATE Events SET EventName = @EventName, EventDescription = @EventDescription WHERE Eventid = @Eventid`; // Parameterized query
    
        const request = connection.request();
        request.input("Eventid", EventId);
        request.input("EventName", newEventData.EventName || null); 
        request.input("EventDescription", newEventData.EventDescription || null);
        request.input("TimeStart", newEventData.TimeStart || null);
        request.input("TimeEnd", newEventData.TimeEnd || null);
    
        await request.query(sqlQuery);
    
        connection.close();
    
        return this.getEventById(EventId); // returning the updated event data
      }
    
      static async deleteEvent(EventId) {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `DELETE FROM Events WHERE Eventid = @Eventid`; 
    
        const request = connection.request();
        request.input("Eventid", EventId);
        const result = await request.query(sqlQuery);
    
        connection.close();
    
        return result.rowsAffected > 0; // Indicate success based on affected rows
      }

      static async searchEvents(searchTerm) {
        const connection = await sql.connect(dbConfig);
    
        try {
          const query = `
           SELECT 
            E.EventId,
            E.EventName,
            E.EventDescription,
            E.TimeStart,
            E.TimeEnd,
            L.Name AS LocationName,
            L.StreetAddress,
            L.PostalCode,
            L.TelNum,
            E.AdminId
          FROM 
            Events E
          JOIN 
            Location L ON E.LocationId = L.Id
          WHERE 
            E.EventName LIKE '%${searchTerm}%' OR
            L.Id IN (
                SELECT Id
                FROM Location
                WHERE 
                    Name LIKE '%${searchTerm}%' OR
                    StreetAddress LIKE '%${searchTerm}%' OR
                    PostalCode LIKE '%${searchTerm}%'
            );

          `;
    
          const result = await connection.request().query(query);
          console.log(result.recordset);
          return result.recordset;
        } catch (error) {
          throw new Error("Error searching for events"); // Or handle error differently
        } finally {
          await connection.close(); // Close connection even on errors
        }
      }

      static async GetEventAllWithLocation (){
        const connection = await sql.connect(dbConfig);
        const query = `SELECT 
        e.EventId,
        e.EventName,
        e.EventDescription,
        e.TimeStart,
        e.TimeEnd,
        l.Name as LocationName,
        l.StreetAddress,
        l.PostalCode
        FROM 
          Events e
        JOIN 
        Location l ON e.locationid = l.Id;`

        const result = await connection.request().query(query);
        console.log(result.recordset);
        return result.recordset;
      }
}

module.exports = Event;