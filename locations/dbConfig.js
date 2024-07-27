module.exports = {
    user: "user", // Replace with your SQL Server login username
    password: "User123", // Replace with your SQL Server login password
    server: "localhost",
    database: "location_api",
    trustServerCertificate: true,
    options: {
      port: 1433, // Default SQL Server port
      connectionTimeout: 60000, // Connection timeout in milliseconds
    },
  };