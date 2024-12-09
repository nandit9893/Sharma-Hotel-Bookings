import { Router } from "express";
import { getAllHotelOwnerBookings, getHotelID, hotelOnwerLogin, hotelOwnerDeleteAccount, hotelOwnerGoogleSignInSignOut, hotelOwnerLogout, hotelOwnerRegister, hotelOwnerUpdateProfile } from "../controllers/hotel.controller.js";
import { verifyHotelOwnerJWT } from "../middleware/auth.middlewares.js";

const hotelRouter = Router();

hotelRouter.route("/register").post(hotelOwnerRegister);
hotelRouter.route("/login").post(hotelOnwerLogin);
hotelRouter.route("/logout").post(verifyHotelOwnerJWT, hotelOwnerLogout);
hotelRouter.route("/google/signin/signup").post(hotelOwnerGoogleSignInSignOut);
hotelRouter.route("/update/profile").patch(verifyHotelOwnerJWT, hotelOwnerUpdateProfile);
hotelRouter.route("/delete/account").delete(verifyHotelOwnerJWT, hotelOwnerDeleteAccount);
hotelRouter.route("/get/hotel/id").get(verifyHotelOwnerJWT, getHotelID);
hotelRouter.route("/get/all/hotel/owner/bookings/:hotelID").get(verifyHotelOwnerJWT, getAllHotelOwnerBookings);

export default hotelRouter;