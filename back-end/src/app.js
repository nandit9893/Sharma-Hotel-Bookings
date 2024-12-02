import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import hotelRouter from "./routes/hotel.routes.js";
import hotelDetailsRouter from "./routes/hoteldetails.routes.js";
import roomRouter from "./routes/room.routes.js";
import bookingRouter from "./routes/booking.routes.js";
const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("/public"));
app.use(cookieParser());

app.use("/sharma/resident/stays/user", userRouter);
app.use("/sharma/resident/stays/hotel/owner", hotelRouter);
app.use("/sharma/resident/stays/hotel/data", hotelDetailsRouter);
app.use("/sharma/resident/stays/hotel/room", roomRouter);
app.use("/sharma/resident/stays/hotel/booking", bookingRouter);

export default app;
