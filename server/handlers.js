const { MongoClient } = require("mongodb");
require("dotenv").config();

const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

//create seats info
const seats = [];
const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
const cols = 12;

rows.forEach((row) => {
  for (let i = 1; i <= cols; i++) {
    seats.push({
      _id: `${row}-${i}`,
      price: 225,
      isBooked: Math.random() > 0.5,
    });
  }
});

const createSeatsDB = async () => {
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();

  const db = client.db("workshop2");

  await db.collection("seats").insertMany(seats);

  client.close();
};

createSeatsDB();

const getSeats = async (req, res) => {};

module.exports = { getSeats };
