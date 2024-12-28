import { Router } from "express";
import { verifyHotelOwnerJWT } from "../middleware/auth.middlewares.js";
import { createRoom, getAllHotelRooms, getSearchedWithRooms, getSpecifiRoomOfHotel, updateRoomData } from "../controllers/room.controllers.js";
import uploadRoom from "../middleware/uploadRoom.middleware.js";

const roomRouter = Router();

roomRouter.route("/create/room").post(verifyHotelOwnerJWT, uploadRoom.array("imageURLs", 2), createRoom);
roomRouter.route("/get/all/rooms/:hotelID").get(getAllHotelRooms);
roomRouter.route("/get/search/rooms").get(getSearchedWithRooms);
roomRouter.route("/specific/room/hotel/:hotelID/:roomID").get(verifyHotelOwnerJWT, getSpecifiRoomOfHotel);
roomRouter.route("/update/room/:hotelID/:roomID").patch(verifyHotelOwnerJWT, updateRoomData);

export default roomRouter;