import React, { useEffect } from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import URL from "../assets/URL.js";
import app from "../firebase.js";
import axios from "axios";
import { signInSuccess } from "../Redux/User/UserSlice.js";

const OAuth = ({ state }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = getAuth(app);

  const handleGoogleFirebase = async () => {
    const userType = state === "user" ? "user" : "hotel/owner";
    const newURL = `${URL}/sharma/resident/stays/${userType}/google/signin/signup`;

    try {
      const provider = new GoogleAuthProvider();
      if (window.innerWidth <= 768) {
        await signInWithRedirect(auth, provider); 
      } else {
        const result = await signInWithPopup(auth, provider); 
        const { displayName, email } = result.user;
        const response = await axios.post(newURL, {
          name: displayName,
          email,
        });
        if (response.data.success) {
          const { accessToken, user } = response.data.data;
          localStorage.setItem("accessToken", accessToken);
          dispatch(signInSuccess(user));
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
    }
  };

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          const { displayName, email } = result.user;
          const userType = state === "user" ? "user" : "hotel/owner";
          const newURL = `${URL}/sharma/resident/stays/${userType}/google/signin/signup`;
          const response = await axios.post(newURL, {
            name: displayName,
            email,
          });
          if (response.data.success) {
            const { accessToken, user } = response.data.data;
            localStorage.setItem("accessToken", accessToken);
            dispatch(signInSuccess(user));
            navigate("/");
          }
        }
      } catch (error) {
        console.error("Error handling redirect result:", error);
      }
    };

    handleRedirectResult();
  }, [auth, dispatch, navigate, state]);

  return (
    <button
      onClick={handleGoogleFirebase}
      type="button"
      className="bg-red-700 text-white p-3 rounded-lg hover:opacity-95"
    >
      CONTINUE WITH GOOGLE
    </button>
  );
};

export default OAuth;
