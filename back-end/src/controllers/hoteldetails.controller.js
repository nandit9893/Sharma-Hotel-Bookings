import HotelDetails from "../models/hotelDetails.models.js";
import HotelOwner from "../models/hotelowner.models.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";

const createHotel = async (req, res) => {
  const {
    hotelName,
    description,
    address,
    country,
    state,
    city,
    pinCode,
    phoneNumber,
    amenities,
    checkInTime,
    checkOutTime,
    startingPrice,
    range,
    restaurants,
    famousTouristPlaces,
    cinemaHalls,
    transportationFacilities,
  } = req.body;
  const hotelOwnerID = req.user._id;
  const parsedPinCode = parseInt(pinCode);
  const parsedPhoneNumber = parseInt(phoneNumber);
  const parsedStartingPrice = parseInt(startingPrice);
  if (!hotelName?.trim())
    return res.status(400).json({
      success: false,
      message: "Hotel Name is missing",
    });
  if (!description?.trim())
    return res.status(400).json({
      success: false,
      message: "Description of hotel is missing",
    });
  if (!address?.trim())
    return res.status(400).json({
      success: false,
      message: "Address of hotel is missing",
    });
  if (!country?.trim())
    return res.status(400).json({
      success: false,
      message: "Country of hotel is missing",
    });
  if (!city?.trim())
    return res.status(400).json({
      success: false,
      message: "City of hotel is missing",
    });
  if (!checkInTime?.trim())
    return res.status(400).json({
      success: false,
      message: "Check in time of hotel is missing",
    });
  if (!checkOutTime?.trim())
    return res.status(400).json({
      success: false,
      message: "Check out time of hotel is missing",
    });
  if (!parsedPinCode || isNaN(parsedPinCode))
    return res.status(400).json({
      success: false,
      message: "Valid pincode of hotel",
    });
  if (!parsedPhoneNumber || isNaN(parsedPhoneNumber))
    return res.status(400).json({
      success: false,
      message: "Valid phone number of hotel",
    });
  if (!parsedStartingPrice || isNaN(parsedStartingPrice))
    return res.status(400).json({
      success: false,
      message: "Valid starting price of hotel",
    });
  if (amenities && amenities.length < 0) {
    return res.status(400).json({
      success: false,
      message: "Amenities should be in string",
    });
  }
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Images of hotel are required",
    });
  }
  try {
    const ownerExisted = await HotelOwner.findById(req.user._id);
    if (!ownerExisted) {      return res.status(401).json({
        success: false,
        message: "Not authorized to add hotel",
      });
    }

    const hotelExisted = await HotelDetails.findOne({ hotelName: hotelName });
    if (hotelExisted) {
      return res.status(409).json({
        success: false,
        message: "Hotel with the name already exist",
      });
    }

    let imageURLs = [];
    try {
      if (req.files && req.files.length > 0) {
        const uploadPromises = req.files.map((file) => {
          return uploadOnCloudinary(file.path);
        });
        const uploadResults = await Promise.all(uploadPromises);
        uploadResults.forEach((result) => {
          if (result && result.secure_url) {
            imageURLs.push(result.secure_url);
          } else if (result && result.url) {
            imageURLs.push(result.url);
          }
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "An error occurred while uploading images",
        error: error.message,
      });
    }

    const hotel = new HotelDetails({
      hotelName,
      description,
      address,
      country,
      state: state || null,
      city,
      imageURLs,
      pinCode: parsedPinCode,
      phoneNumber: parsedPhoneNumber,
      amenities: amenities.split(","),
      checkInTime,
      checkOutTime,
      startingPrice: parsedStartingPrice,
      range: range ? parseFloat(range) : null,
      hotelOwnerID,
      restaurants: restaurants ? JSON.parse(restaurants) : [],
      cinemaHalls: cinemaHalls ? JSON.parse(cinemaHalls) : [],
      famousTouristPlaces: famousTouristPlaces ? JSON.parse(famousTouristPlaces) : [],
      transportationFacilities: transportationFacilities ? JSON.parse(transportationFacilities) : [],
    });
    await hotel.save();
    const hotelID = `HTL_${hotel._id.toString().slice(-5)}`;
    hotel.hotelID = hotelID;
    await hotel.save();
    return res.status(201).json({
      success: true,
      message: "Hotel created successfully",
      data: hotel,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while creating the hotel",
      error: error.message,
    });
  }
};

const getSpecificeHotel = async (req, res) => {
  const { hotelID } = req.params;
  try {
    const hotel = await HotelDetails.findById(hotelID);
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel ID is not valid",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Hotel fetched successfully",
      data: hotel,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while getting the specific hotel",
      error: error.message,
    });
  }
};

const updatSpecificHotel = async (req, res) => {
  const hotelID = req.params.hotelID;
  const {
    description,
    phoneNumber,
    amenities,
    checkInTime,
    checkOutTime,
    startingPrice,
    range,
    restaurants,
    famousTouristPlaces,
    cinemaHalls,
    transportationFacilities,
  } = req.body;
  try {
    const hotel = await HotelDetails.findById(hotelID);
    if (!hotel) {
      return res.status(409).json({
        success: false,
        message: "Hotel does not exist",
      });
    }
    let imageURLs = [...hotel.imageURLs];
    try {
      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        for (const url of hotel.imageURLs) {
          await deleteFromCloudinary(url);
        }
        const uploadPromises = req.files.map((file) =>
          uploadOnCloudinary(file.path)
        );
        const uploadResults = await Promise.all(uploadPromises);
        imageURLs = uploadResults
          .map((result) => result.secure_url || result.url)
          .filter(Boolean);
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "An error occurred while uploading images",
        error: error.message,
      });
    }
    if (description) hotel.description = description;
    if (phoneNumber) hotel.phoneNumber = parseFloat(phoneNumber);
    if (amenities) hotel.amenities = amenities.split(",");
    if (checkInTime) hotel.checkInTime = checkInTime;
    if (checkOutTime) hotel.checkOutTime = checkOutTime;
    if (startingPrice) hotel.startingPrice = parseFloat(startingPrice);
    if (range) hotel.range = parseFloat(range);
    if (restaurants) {
      hotel.restaurants = [];
      hotel.restaurants = JSON.parse(restaurants)
    }
    if (cinemaHalls) {
      hotel.cinemaHalls = [];
      hotel.cinemaHalls = JSON.parse(cinemaHalls);
    }
    if (famousTouristPlaces) {
      hotel.famousTouristPlaces = [];
      hotel.famousTouristPlaces = JSON.parse(famousTouristPlaces);
    }
    if (transportationFacilities) {
      hotel.transportationFacilities = [];
      hotel.transportationFacilities = JSON.parse(transportationFacilities);
    }
    hotel.imageURLs = imageURLs;
    await hotel.save();
    return res.status(200).json({
      success: true,
      message: "Hotel updated successfully",
      data: hotel,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the hotel",
      error: error.message,
    });
  }
};

const getAllHotels = async (req, res) => {
  try {
    const allHotels = await HotelDetails.find();
    if (!allHotels || allHotels.length === 0) {
      return res.status(409).json({
        success: false,
        message: "No hotels available",
      });
    }
    return res.status(201).json({
      success: true,
      message: "All hotels fetcheds successfully",
      data: allHotels,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro while fetching hotels",
      error: error.message,
    });
  }
};

const getSearchedWithHotels = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 3;
    const startIndex = parseInt(req.query.startIndex) || 0;
    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order === "desc" ? 1 : -1;
    const startingPrice = req.query.startingPrice ? parseFloat(req.query.startingPrice) : null; 
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : null;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : null;

    let query = {};

    if (minPrice !== null && maxPrice !== null) {
      query.startingPrice = { $gte: minPrice, $lte: maxPrice }; 
    } else if (minPrice !== null) {
      query.startingPrice = { $gte: minPrice };
    } else if (maxPrice !== null) {
      query.startingPrice = { $lte: maxPrice };
    }

    if (startingPrice !== null) {
      query.startingPrice = startingPrice;
    }
    if (searchTerm) {
      query.$or = [
        { hotelName: { $regex: searchTerm, $options: "i" } },
        { country: { $regex: searchTerm, $options: "i" } },
        { state: { $regex: searchTerm, $options: "i" } },
        { city: { $regex: searchTerm, $options: "i" } },
        { address: { $regex: searchTerm, $options: "i" } },
        { "famousTouristPlaces.name": { $regex: searchTerm, $options: "i" } },
        { "cinemaHalls.name": { $regex: searchTerm, $options: "i" } },
        { "restaurants.name": { $regex: searchTerm, $options: "i" } },
        { "transportationFacilities.name": { $regex: searchTerm, $options: "i" } },
      ];
    }

    const hotels = await HotelDetails.find(query)
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return     res.status(200).json({
      success: true,
      message: "Hotels fetched successfully",
      data: hotels,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while getting results",
      error: error.message,
    });
  }
};

export {
  createHotel,
  getSpecificeHotel,
  updatSpecificHotel,
  getAllHotels,
  getSearchedWithHotels,
};
