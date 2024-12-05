import React, { useState } from "react";
import OAuth from "../Components/OAuth";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {signInFailure, signInStart, signInSuccess} from "../Redux/User/UserSlice.js";
import URL from "../assets/URL.js";
import axios from "axios";

const LoginUser = () => {
  const dispatch = useDispatch();
  const [successMessage, setSuccessMessage] = useState(null);
  const {loading, error} = useSelector((state) => state.user);
  const [data, setData] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const inputChangeHandler = (event) => {
    const {name, value} = event.target;
    setData((prev)=>({...prev, [name]: value}));
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    if (!data.email || !data.password) {
      dispatch(signInFailure("Email and password are required."));
      return;
    }    
    const newURL = `${URL}/sharma/resident/stays/user/login`;
    try {
      dispatch(signInStart());
      const response = await axios.post(newURL, data);
      if (response.data.success) {
        const { accessToken, user } = response.data.data;
        localStorage.setItem("accessToken", accessToken);
        dispatch(signInSuccess(user));
        setSuccessMessage(response.data.data.message);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        const errorMessage = response.data.message || "An error occurred. Please try again.";
        dispatch(signInFailure(errorMessage));
      }
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.message
        : "No response from the server";
      dispatch(signInFailure(errorMessage));
    }
  };
  

  return (
    <div className="p-3 border-2 sm:border-blue-300 sm:rounded-lg my-12 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In Customer</h1>
      <form onSubmit={submitHandler} className="flex flex-col gap-4">
        <input type="email" placeholder="email" className="border p-3 rounded-lg" id="email" name="email" value={data.email} required onChange={inputChangeHandler} />
        <input type="password" placeholder="password" className="border p-3 rounded-lg" id="password" name="password" value={data.password} required onChange={inputChangeHandler} />
        <button disabled={loading} type="submit" className="bg-slate-700 text-white p-3 rounded-lg hover:opacity-95 disabled:opacity-80">{loading ? "SIGNINIG..." : "SIGN IN"}</button>
        <OAuth state={"user"} />
      </form>
      <div className="flex gap-2 mt-5">
        <p>New Customer?</p>
        <Link to="/signup-user"><span className="text-blue-700">Sign Up</span></Link>
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


export default LoginUser;
