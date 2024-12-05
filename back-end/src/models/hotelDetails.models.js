import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    hotelName: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    state: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    pinCode: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageURLs: {
      type: [String],
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    amenities: {
      type: [String],
      required: true,
    },
    checkInTime: {
      type: String,
      required: true,
    },
    checkOutTime: {
      type: String,
      required: true,
    },
    startingPrice: {
      type: Number,
      required: true,
    },
    range: {
      type: Number,
    },
    restaurants: [
      {
        name: { type: String },
        distance: { type: Number },
      },
    ],
    cinemaHalls: [
      {
        name: { type: String },
        distance: { type: Number },
      },
    ],
    famousTouristPlaces: [
      {
        name: { type: String },
        distance: { type: Number },
      }
    ],
    transportationFacilities: [
      {
        name: { type: String },
        distance: { type: Number },
      },
    ],
    hotelOwnerID: {
      type: String,
      required: true,
      unique: true,
    },
    hotelID: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const HotelDetails = mongoose.model("HotelDetails", hotelSchema);

export default HotelDetails;
