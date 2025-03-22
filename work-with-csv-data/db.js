import sqlite3 from "sqlite3";
const sqlite3Verbose = sqlite3.verbose();

const defaultDbFilePath = "./db/population.db";

export function connectToDatabase(dbFilePath) {
  // connect db
  const db = new sqlite3Verbose.Database((dbFilePath = defaultDbFilePath));
  console.log("Connected to the database successfully");
  return db;
}

export function initDatabase(dbFilePath = defaultDbFilePath) {
  // init db
  const db = new sqlite3Verbose.Database(dbFilePath);
  console.log({ db });

  // init tables
  db.run(`
    CREATE TABLE migration
    (
      year_month       VARCHAR(10),
      month_of_release VARCHAR(10),
      passenger_type   VARCHAR(50),
      direction        VARCHAR(20),
      sex              VARCHAR(10),
      age              VARCHAR(50),
      estimate         INT
    )
  `);
  console.log("Created database successfully");
  return db;
}
