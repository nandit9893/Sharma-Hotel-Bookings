import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomStandard: {
      type: String,
      required: true,
    },
    roomType: {
      type: String,
      required: true,
      enum: ["Flat", "Room"],
    },
    size: {
      type: Number,
      required: true,
    },
    bedType: {
      type: String,
      required: true,
      enum: ["Single", "Double", "Queen", "King"],
    },
    amenities: {
      type: [String],
      required: true,
    },
    furnished: {
      type: Boolean,
      required: true,
    },
    imageURLs: {
      type: [String],
      required: true,
    },
    pricePerNight: {
      type: Number,
      required: true,
    },
    numberOfRooms: {
      type: Number,
      required: function () {
        return this.roomType === "Flat";
      },
    },
    hasKitchen: {
      type: Boolean,
      required: function () {
        return this.roomType === "Flat";
      },
    },
    hotelID: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const RoomDetails = mongoose.model("RoomDetails", roomSchema);

export default RoomDetails;
