// db.js
const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017";
const dbName = "mydatabase";

let db;

const connectDB = async () => {
  if (db) return db;
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  db = client.db(dbName);
  return db;
};

module.exports = { connectDB };
