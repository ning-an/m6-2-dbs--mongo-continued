const router = require("express").Router();
const {
  getSeats,
  bookSeat,
  deleteBooking,
  updateCustomerInfo,
} = require("./handlers");

router.get("/api/seat-availability", getSeats);
router.post("/api/book-seat", bookSeat);
router.put("/api/delete-booking/:id", deleteBooking);
router.put("/api/orders", updateCustomerInfo);

module.exports = router;
