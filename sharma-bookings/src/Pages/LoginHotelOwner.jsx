import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../Components/OAuth";
import { Link, useNavigate } from "react-router-dom";
import URL from "../assets/URL.js";
import { signInFailure, signInStart, signInSuccess } from "../Redux/User/UserSlice";
import axios from "axios";

const LoginHotelOwner = () => {
  const dispatch = useDispatch();
  const {loading, error} = useSelector((state) => state.user);
  const [successMessage, setSuccessMessage] = useState(null);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const inputChangeHandler = (event) => {
    const {name, value} = event.target;
    setData((prev)=>({...prev, [name]: value}));
  };
  const submitHandler = async (event) => {
    event.preventDefault();
    if (!data.email || !data.password) {
      return; 
    }
    const newURL = `${URL}/sharma/resident/stays/hotel/owner/login`;
    try {
      dispatch(signInStart());
      const response = await axios.post(newURL, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data.success) {
        const { accessToken, user } = response.data.data;
        localStorage.setItem("accessToken", accessToken);
        dispatch(signInSuccess(user));
        setSuccessMessage(response.data.data.message);
        setTimeout(() => {
          navigate("/hotel-details");
        }, 1000);
      } else {
        const errorMessage = response.data.message || "An error occurred. Please try again.";
        dispatch(signInFailure(errorMessage));
        return;
      }
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : "No response from the server";
      dispatch(signInFailure(errorMessage));
    }
  };
  

  return (
    <div className="p-3 border-2 sm:rounded-lg sm:border-blue-300 my-12 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In Hotel</h1>
      <form onSubmit={submitHandler} className="flex flex-col gap-4">
        <input type="email" placeholder="owner email" className="border p-3 rounded-lg" id="email" name="email" value={data.email} required onChange={inputChangeHandler} />
        <input type="password" placeholder="password" className="border p-3 rounded-lg" id="password" name="password" value={data.password} required onChange={inputChangeHandler} />
        <button disabled={loading} type="submit" className="bg-slate-700 text-white p-3 rounded-lg hover:opacity-95 disabled:opacity-80">{loading ? "SIGNINIG..." : "SIGN IN"}</button>
        <OAuth state={"owner"} />
      </form>
      <div className="flex gap-2 mt-5">
        <p>New Hotel Owner?</p>
        <Link to="/signup-hotel-owner"><span className="text-blue-700">Sign Up</span></Link>
      </div>
      <div className="flex justify-center">
        {
          error ? 
          ( <p className="text-red-500 mt-5 text-2xl font-semibold text-center">{error}</p> ) 
          : 
          ( <p className="text-green-500 mt-5 text-2xl font-semibold text-center">{successMessage}</p> )
        }
      </div>
    </div>
  );
};

export default LoginHotelOwner;
