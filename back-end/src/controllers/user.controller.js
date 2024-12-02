import User from "../models/user.models.js";
import APIError from "../utils/APIError.js";
import APIResponse from "../utils/APIResponse.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import Booking from "../models/booking.models.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
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

const userRegistration = async (req, res) => {
  const { username, name, email, password } = req.body;
  const profileImageLocalPath = req.file?.path;
  if (!username.trim()) {
    return res.status(400).json({
      success: false,
      message: "Username is required",
    });
  }
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
    const existedUser = await User.findOne({ email });
    if (existedUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }
    let profileImage = "";
    if (profileImageLocalPath) {
      const result = await uploadOnCloudinary(profileImageLocalPath);
      profileImage = result.url;
    } else {
      profileImage =
        "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=";
    }
    const newUser = await User.create({
      username: username.toLowerCase(),
      email,
      name,
      password,
      profileImage,
    });
    const createdUser = await User.findById(newUser._id).select(
      "-password -refreshToken"
    );
    if (!createdUser) {
      return res.status(404).json({
        success: false,
        message: "Something went wrong while creating the user",
      });
    }
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: createdUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occured while registering the user",
      error: error.message,
    });
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }
  try {
    const user = await User.findOne({ email });
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
    const loggedInUser = await User.findById(user._id).select(
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
          "User logged in successfully"
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

const userLogout = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
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

const userGoogleSignInSignOut = async (req, res) => {
  const { name, email } = req.body;
  try {
    const existedUser = await User.findOne({ email: email });
    if (existedUser) {
      const { accessToken, refreshToken } = await generateAccessAndRefreshToken(existedUser._id);
      const loggedInUser = await User.findById(existedUser._id).select(
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
            "User logged in successfully"
          )
        );
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const genertedUserName = name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4);
      const profileImage = "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=";
      const newUser = await User.create({
        username: genertedUserName,
        password: generatedPassword,
        name,
        email,
        profileImage,
      });
      const { accessToken, refreshToken } = await generateAccessAndRefreshToken(newUser._id);
      const createdUser = await User.findById(newUser._id).select(
        "-password -refreshToken"
      );
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
              user: createdUser,
              accessToken,
              refreshToken,
            },
            "User registered and logged in successfully"
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

const userUpdateProfile = async (req, res) => {
  const { username, email, password } = req.body;
  const profileImageLocalPath = req.file?.path;
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = password;
    const defaultProfileImage =
      "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=";
    if (profileImageLocalPath) {
      const isCloudinaryImage =
        user.profileImage?.includes("res.cloudinary.com");
      const isDefaultImage = user.profileImage === defaultProfileImage;
      if (isCloudinaryImage && !isDefaultImage) {
        await deleteFromCloudinary(user.profileImage, "profileImage");
      }
      const { url } = await uploadOnCloudinary(profileImageLocalPath);
      user.profileImage = url;
    } else {
      const isCloudinaryImage =
        user.profileImage?.includes("res.cloudinary.com");
      const isDefaultImage = user.profileImage === defaultProfileImage;
      if (isCloudinaryImage && !isDefaultImage) {
        await deleteFromCloudinary(user.profileImage, "profileImage");
      }
      user.profileImage = defaultProfileImage;
    }
    await user.save();
    const updatedUser = await User.findById(req.user._id).select("-password");
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating profile",
      error: error.message,
    });
  }
};

const userAccountDelete = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (user.profileImage?.includes("res.cloudinary.com")) {
      await deleteFromCloudinary(user.profileImage, "profileImage");
    }
    await User.findByIdAndDelete(req.user._id);
    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the account",
      error: error.message,
    });
  }
};

const getAllUserBookings = async (req, res) => {
  const { customerID } = req.params; 
  if (!customerID) {
    return res.status(400).json({
      success: false,
      message: "User ID is required",
    });
  }
  try {
    const allBookings = await Booking.find({ customerID }); 
    if (allBookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No bookings found for this user",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      data: allBookings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the bookings",
      error: error.message,
    });
  }
};

export {
  userRegistration,
  userLogin,
  userLogout,
  userUpdateProfile,
  userAccountDelete,
  userGoogleSignInSignOut,
  getAllUserBookings,
};
