import { Router } from "express";
import { sendVerificationToEmailAndPhone, verifyOTPSentToPhoneOrEmail } from "../controllers/booking.controller.js";
import { verifyUserJWT } from "../middleware/auth.middlewares.js";
import { bookHotel } from "../controllers/bookingfinal.contorllers.js";

const bookingRouter = Router();

bookingRouter.route("/send/email/mobile").post(verifyUserJWT, sendVerificationToEmailAndPhone);
bookingRouter.route("/verify/email/mobile").post(verifyUserJWT, verifyOTPSentToPhoneOrEmail);
bookingRouter.route("/book/hotel").post(verifyUserJWT, bookHotel);

export default bookingRouter;