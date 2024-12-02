import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
    },
    customerID: {
      type: String,
      required: true,
    },
    hotelName: {
      type: String,
      required: true,
    },
    hotelID: {
      type: String,
      required: true,
    },
    customerPhoneNumber: {
      type: Number,
      required: true,
    },
    hotelAddress: {
      type: String,
      required: true,
    },
    hotelCity: {
      type: String,
      required: true,
    },
    hotelState: {
      type: String,
      required: true,
    },
    hotelCountry: {
      type: String,
      required: true,
    },
    roomStandard: {
      type: String,
      required: true,
    },
    numberOfRooms: {
      type: Number,
      default: 1,
      min: [1, "Number of rooms must be at least 1"],
    },
    numberOfGuests: {
      type: Number,
      default: 1,
      min: [1, "Number of guests must be at least 1"],
    },
    numberOfNights: {
      type: Number,
      default: 1,
      min: [1, "Number of nights must be at least 1"],
    },
    roomType: {
      type: String,
      enum: ["Flat", "Room"],
      default: "Room",
    },
    dateOfBooking: {
      type: Date,
      default: Date.now,
    },
    dateOfCommencement: {
      type: Date,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    discountAmount: {
      type: Number,
      required: true,
    },
    bookingID: {
      type: String,
      unique: true,
    },
    invoicePDF: {
      type: String,
    },
    isPaymentDone: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
