/* Postgrator CLI connects to our database by reading a configuration file 
containing the database URL as the value for a connectionString setting. */

/* Let's make a configuration file that reads the database connection information from the .env file. */

require('dotenv').config();

module.exports = {
  "migrationsDirectory": "migrations",
  "driver": "pg",
  "connectionString": process.env.DB_URL,
}