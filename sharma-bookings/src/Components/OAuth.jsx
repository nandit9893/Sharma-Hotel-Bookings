import React from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import URL from "../assets/URL.js";
import app from "../firebase.js";
import axios from "axios";
import { signInSuccess } from "../Redux/User/UserSlice.js";

const OAuth = ({state}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoogleFirebase = async () => {
    const userType = state === "user" ? "user" : "hotel/owner";
    const newURL = `${URL}/sharma/resident/stays/${userType}/google/signin/signup`;
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const { displayName, email } = result.user;
      const response = await axios.post(newURL, {
        name: displayName,
        email,
      });
      if(response.data.success) {
        const { accessToken, user } = response.data.data;
        localStorage.setItem("accessToken", accessToken);
        dispatch(signInSuccess(user));
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <button onClick={handleGoogleFirebase} type="button" className="bg-red-700 text-white p-3 rounded-lg hover:opacity-95">CONTINUE WITH GOOGLE</button>
  );
};

export default OAuth;
