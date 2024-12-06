import HotelOwner from "../models/hotelowner.models.js";
import APIError from "../utils/APIError.js";
import APIResponse from "../utils/APIResponse.js";
import HotelDetails from "../models/hotelDetails.models.js"; 

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await HotelOwner.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new APIError(
      500,
      "Something went wrong while generating access token and refresh token"
    );
  }
};

const hotelOwnerRegister = async (req, res) => {
  const { name, email, password } = req.body;
  console.log(n)
  if (!name.trim()) {
    return res.status(400).json({
      success: false,
      message: "Name is required",
    });
  }
  if (!email.trim()) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }
  if (!password.trim()) {
    return res.status(400).json({
      success: false,
      message: "Password is required",
    });
  }
  try {
    const existedUser = await HotelOwner.findOne({ email });
    if (existedUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }
    const newUser = await HotelOwner.create({
      email,
      name,
      password,
    });
    const createdUser = await HotelOwner.findById(newUser._id).select(
      "-password -refreshToken"
    );
    if (!createdUser) {
      return res.status(404).json({
        success: false,
        message: "Something went wrong while creating the Hotel Owner",
      });
    }
    return res.status(201).json({
      success: true,
      message: "Hotel Owner created successfully",
      data: createdUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occured while registering the Hotel Owner",
      error: error.message,
    });
  }
};

const hotelOnwerLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }
  try {
    const user = await HotelOwner.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );
    const loggedInUser = await HotelOwner.findById(user._id).select(
      "-password -refreshToken"
    );
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    };
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new APIResponse(
          200,
          {
            user: loggedInUser,
            accessToken,
            refreshToken,
          },
          "Hotel owner logged in successfully"
        )
      );
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occured while logging in",
      error: error.message,
    });
  }
};

const hotelOwnerLogout = async (req, res) => {
  try {
    await HotelOwner.findByIdAndUpdate(
      req.user._id,
      {
        $unset: {
          refreshToken: "",
        },
      },
      {
        new: true,
      }
    );
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    };
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new APIResponse(200, {}, "User logged out successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new APIError(500, "Something went wrong whle logging out"));
  }
};

const hotelOwnerGoogleSignInSignOut = async (req, res) => {
  const { name, email } = req.body;
  try {
    const existedHotelOwner = await HotelOwner.findOne({ email: email });
    if (existedHotelOwner) {
      const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        existedHotelOwner._id
      );
      const loggedInHotelOwner = await HotelOwner.findById(
        existedHotelOwner._id
      ).select("-password -refreshToken");
      const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      };
      return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
          new APIResponse(
            200,
            {
              user: loggedInHotelOwner,
              accessToken,
              refreshToken,
            },
            "Hotel Owner logged in successfully"
          )
        );
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const newHotelOwner = await HotelOwner.create({
        password: generatedPassword,
        name,
        email,
      });
      const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        newHotelOwner._id
      );
      const createdHotelOwner = await HotelOwner.findById(
        newHotelOwner._id
      ).select("-password -refreshToken");
      const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      };
      return res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
          new APIResponse(
            201,
            {
              user: createdHotelOwner,
              accessToken,
              refreshToken,
            },
            "Hotel Owner registered and logged in successfully"
          )
        );
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while registering the user",
      error: error.message,
    });
  }
};

const hotelOwnerUpdateProfile = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hotelOwner = await HotelOwner.findById(req.user?._id);
    if (!hotelOwner) {
      return res.status(404).json({
        success: false,
        message: "Hotel owner not found",
      });
    }
    if (name) hotelOwner.name = name;
    if (email) hotelOwner.email = email;
    if (password) hotelOwner.password = password;
    await hotelOwner.save();
    const updatedOwner = await HotelOwner.findById(req.user._id).select(
      "-password"
    );
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedOwner,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating profile",
      error: error.message,
    });
  }
};

const hotelOwnerDeleteAccount = async (req, res) => {
  try {
    const hotelOwner = await HotelOwner.findById(req.user._id);
    if (!hotelOwner) {
      return res.status(404).json({
        success: false,
        message: "Hotel Owner not found",
      });
    }
    await HotelOwner.findByIdAndDelete(req.user._id);
    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
      data: hotelOwner,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the account",
      error: error.message,
    });
  }
};

const getHotelID = async (req, res) => {
  try {
    const hotelOwnerID = req.user._id;  
    if (!hotelOwnerID) {
      return res.status(409).json({
        success: false,
        message: "Hotel owner ID not found",
      });
    }
    const hotelData = await HotelDetails.findOne({ hotelOwnerID: hotelOwnerID });
    if (!hotelData) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found for the provided owner ID",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Hotel ID fetched successfully",
      data: hotelData._id,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching hotel data",
      error: error.message,
    });
  }
};


export {
  hotelOnwerLogin,
  hotelOwnerRegister,
  hotelOwnerLogout,
  hotelOwnerGoogleSignInSignOut,
  hotelOwnerUpdateProfile,
  hotelOwnerDeleteAccount,
  getHotelID,
};
