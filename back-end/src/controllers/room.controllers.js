import HotelDetails from "../models/hotelDetails.models.js";
import HotelOwner from "../models/hotelowner.models.js";
import RoomDetails from "../models/roomdetails.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const roomTypeData = ["Flat", "Room"];
const bedTypeData = ["Single", "Double", "Queen", "King"];

const createRoom = async (req, res) => {
  const {
    roomType,
    roomStandard,
    size,
    bedType,
    ammenities,
    pricePerNight,
    numberOfRooms,
    hasKitchen,
    hotelID,
  } = req.body;
  let { furnished } = req.body;
  if (!roomType?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Room type is required",
    });
  }
  if (!roomStandard?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Room Standard is required",
    });
  }
  if (!roomTypeData.includes(roomType)) {
    return res.status(400).json({
      success: false,
      message: "Room type must be Flat or Room",
    });
  }
  if (!size?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Size of room is required",
    });
  }
  if (!hotelID?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Hotel ID of room is required",
    });
  }
  if (!bedType?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Bed type is required",
    });
  }
  if (!bedTypeData.includes(bedType)) {
    return res.status(400).json({
      success: false,
      message: "Bed type must be Single, Double, Queen, King",
    });
  }
  if (!ammenities || ammenities.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Amenities are required",
    });
  }
  if (typeof furnished !== "boolean") {
    furnished = furnished === "true";
    if (furnished !== true && furnished !== false) {
      return res.status(400).json({
        success: false,
        message: "Furnished status is required",
      });
    }
  }
  if (!pricePerNight?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Price per night is required",
    });
  }
  if (roomType === "Flat" && !numberOfRooms?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Room numbers are required when room type is flat",
    });
  }
  if (roomType === "Flat" && !hasKitchen?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Kitchen is required when room type is flat",
    });
  }

  try {
    const hotelOwnerID = await HotelOwner.findById(req.user._id);
    if (!hotelOwnerID) {
      return res.status(401).json({
        success: false,
        message: "Not eligible to add room",
      });
    }

    const roomExisted = await RoomDetails.findOne({ hotelID, roomStandard });
    if (roomExisted) {
      return res.status(401).json({
        success: false,
        message: "Room with this standard already exists",
      });
    }

    let imageURLs = [];
    try {
      if (req.files && req.files.length > 0) {
        const uploadPromises = req.files.map((file) =>
          uploadOnCloudinary(file.path)
        );
        const uploadResults = await Promise.all(uploadPromises);
        uploadResults.forEach((result) => {
          if (result && result.secure_url) imageURLs.push(result.secure_url);
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error uploading images",
        error: error.message,
      });
    }

    const newRoomCreated = await RoomDetails.create({
      roomType,
      roomStandard,
      size: parseInt(size),
      bedType,
      amenities: Array.isArray(ammenities)
        ? ammenities
        : ammenities.split(", "),
      furnished,
      pricePerNight: parseInt(pricePerNight),
      numberOfRooms: numberOfRooms ? parseInt(numberOfRooms) : 1,
      hasKitchen,
      hotelID,
      imageURLs,
    });
    await newRoomCreated.save();

    return res.status(201).json({
      success: true,
      message: "Room created successfully",
      data: newRoomCreated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating the room",
      error: error.message,
    });
  }
};

const getAllHotelRooms = async (req, res) => {
  const { hotelID } = req.params;
  try {
    const roomDataAvailable = await RoomDetails.find({ hotelID });
    if (roomDataAvailable.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Room data not available",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Rooms retrieved successfully",
      data: roomDataAvailable,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching rooms",
      error: error.message,
    });
  }
};

const getSearchedWithRooms = async (req, res) => {
  try {
    let query = {};

    if (req.query.roomType && req.query.roomType !== "all") {
      query.roomType = req.query.roomType.charAt(0).toUpperCase() + req.query.roomType.slice(1).toLowerCase();
    }

    if (req.query.bedType && req.query.bedType !== "all") {
      query.bedType = req.query.bedType.charAt(0).toUpperCase() + req.query.bedType.slice(1).toLowerCase();
    }

    if (req.query.furnished) {
      if (req.query.furnished === undefined || req.query.furnished === "false") {
        query.furnished = { $in: [false, true] };
       }
    }

    if (req.query.hasKitchen) {
      if (req.query.hasKitchen === undefined || req.query.hasKitchen === "false") {
        query.hasKitchen = { $in: [false, true] };
       }
    }

    if (req.query.pricePerNight) {
      query.pricePerNight = { $lte: parseInt(req.query.pricePerNight) };
    }

    const rooms = await RoomDetails.find(query);
    if (!rooms || rooms.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No rooms available based on the selected criteria.",
      });
    }

    const hotelIDs = [...new Set(rooms.map((room) => room.hotelID))];
    const hotels = await HotelDetails.find({ _id: { $in: hotelIDs } });

    res.status(200).json({
      success: true,
      count: rooms.length,
      data: hotels,
      message: "Hotels fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export { createRoom, getAllHotelRooms, getSearchedWithRooms };
