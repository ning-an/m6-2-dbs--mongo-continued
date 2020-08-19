const { MongoClient } = require("mongodb");
require("dotenv").config();

const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getSeats = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("workshop2");
  const seats = await db.collection("seats").find().toArray();
  client.close();
  const fommattedSeats = {};
  const bookedSeats = {};
  seats.forEach((seat) => {
    fommattedSeats[seat._id] = { price: seat.price, isBooked: seat.isBooked };
    if (seat.isBooked) {
      bookedSeats[seat._id] = true;
    }
  });
  res.status(200).json({
    seats: fommattedSeats,
    bookedSeats,
    numOfRows: 8,
    seatsPerRow: 12,
  });
};

const bookSeat = async (req, res) => {
  const { seatId, creditCard, expiration, fullName, email } = req.body;

  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("workshop2");
    const seat = await db.collection("seats").findOne({ _id: seatId });
    if (seat.isBooked) {
      throw new Error("This seat has already been booked!");
    } else if (!creditCard || !expiration) {
      throw new Error("Please provide valid cerdit card information!");
    }
    await db
      .collection("seats")
      .updateOne({ _id: seatId }, { $set: { isBooked: true } });
    await db.collection("orders").insertOne({ fullName, email, _id: seatId });
    res.status(200).json({ status: 200, success: true });
    client.close();
  } catch ({ message }) {
    res.status(400).json({ status: 400, message });
  }
};
module.exports = { getSeats, bookSeat };
