import React, { useState } from "react";
import OAuth from "../Components/OAuth";
import URL from "../assets/URL.js";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignupHotelOwner = () => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
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
    const newURL = `${URL}/sharma/resident/stays/hotel/owner/register`;
    try {
      setLoading(true);
      const response = await axios.post(newURL, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if(response.data.success) {
        setSuccessMessage(response.data.message);
        setData({
          name: "",
          email: "",
          password: "",
        });
        setError(null);
        setTimeout(() => {
          navigate("/login-hotel-owner");
        }, 1000);
      } else {
        setError("An error occured. Please try again");
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("No response from the server");
      }
    }
    setLoading(false);
  };

  return (
    <div className="p-3 border-2 sm:rounded-lg sm:border-blue-300 my-12 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up Hotel</h1>
      <form onSubmit={submitHandler} className="flex flex-col gap-4">
        <input type="text" placeholder="owner name" className="border p-3 rounded-lg" id="name" name="name" value={data.name} required onChange={inputChangeHandler} />
        <input type="email" placeholder="owner email" className="border p-3 rounded-lg" id="email" name="email" value={data.email} required onChange={inputChangeHandler} />
        <input type="password" placeholder="password" className="border p-3 rounded-lg" id="password" name="password" value={data.password} required onChange={inputChangeHandler} />
        <button disabled={loading} type="submit" className="bg-slate-700 text-white p-3 rounded-lg hover:opacity-95 disabled:opacity-80">{loading ? "SIGNINIG..." : "SIGN IN"}</button>
        <OAuth state={"owner"} />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Already have an account?</p>
        <Link to="/login-hotel-owner"><span className="text-blue-700">Sign Up</span></Link>
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

export default SignupHotelOwner;
