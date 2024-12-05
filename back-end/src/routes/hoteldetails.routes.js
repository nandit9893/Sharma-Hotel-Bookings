import { Router } from "express";
import { verifyHotelOwnerJWT } from "../middleware/auth.middlewares.js";
import uploadHotel from "../middleware/uploadHotel.middleware.js";
import { createHotel, getAllHotels, getSearchedWithHotels, getSpecificeHotel, updatSpecificHotel } from "../controllers/hoteldetails.controller.js";

const hotelDetailsRouter = Router();

hotelDetailsRouter.route("/create/hotel").post(verifyHotelOwnerJWT, uploadHotel.array("imageURLs", 10), createHotel);
hotelDetailsRouter.route("/update/hotel/:hotelID").patch(verifyHotelOwnerJWT, uploadHotel.array("imageURLs", 10), updatSpecificHotel);
hotelDetailsRouter.route("/get/specific/:hotelID").get(getSpecificeHotel);
hotelDetailsRouter.route("/get/all/hotels").get(getAllHotels);
hotelDetailsRouter.route("/get/search").get(getSearchedWithHotels);


export default hotelDetailsRouter;