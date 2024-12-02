import { Router } from "express";
import {
  userGoogleSignInSignOut,
  userAccountDelete,
  userLogin,
  userLogout,
  userRegistration,
  userUpdateProfile,
  getAllUserBookings,
} from "../controllers/user.controller.js";

import uploadProfileImage from "../middleware/uploadProfileImage.middleware.js";
import { verifyUserJWT } from "../middleware/auth.middlewares.js";

const userRouter = Router();

userRouter.route("/register").post(uploadProfileImage.single("profileImage"), userRegistration);
userRouter.route("/login").post(userLogin);
userRouter.route("/logout").post(verifyUserJWT, userLogout);
userRouter.route("/google/signin/signup").post(userGoogleSignInSignOut);
userRouter.route("/update/profile").patch(verifyUserJWT, uploadProfileImage.single("profileImage"), userUpdateProfile);
userRouter.route("/delete/account").delete(verifyUserJWT, userAccountDelete);
userRouter.route("/get/all/bookings/:customerID").get(verifyUserJWT, getAllUserBookings);

export default userRouter;
