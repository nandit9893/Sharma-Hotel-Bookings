import jwt from "jsonwebtoken";
import APIError from "../utils/APIError.js";
import User from "../models/user.models.js";
import HotelOwner from "../models/hotelowner.models.js";

const verifyUserJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json(new APIError(401, "Unauthorized request"));
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        if (!user) {
            return res.status(401).json(new APIError(401, "Invalid Access Token"));
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json(new APIError(401, error.message || "Invalid access token"));
    }
};

const verifyHotelOwnerJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json(new APIError(401, "Unauthorized request"));
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await HotelOwner.findById(decodedToken?._id).select("-password -refreshToken");
        if (!user) {
            return res.status(401).json(new APIError(401, "Invalid Access Token"));
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json(new APIError(401, error.message || "Invalid access token"));
    }
};

export {verifyUserJWT, verifyHotelOwnerJWT};