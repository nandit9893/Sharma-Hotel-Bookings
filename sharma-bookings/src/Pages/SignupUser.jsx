import React, { useState } from "react";
import OAuth from "../Components/OAuth";
import { Link, useNavigate } from "react-router-dom";
import URL from "../assets/URL.js";
import upload_area from "../assets/upload_area.png";
import axios from "axios";

const SignupUser = () => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    profileImage: ""
  });

  const navigate = useNavigate();

  const handleChange = (event) => {
    const {name, value, files} = event.target;
    if(name === "profileImage") {
      setImage(files[0]);
    } else {
      setData((prev) => ({...prev, [name]: value}));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    if (data.username) {
      formData.append("username", data.username);
    }
    if(data.email) {
      formData.append("email", data.email);
    }
    if(data.name) {
      formData.append("name", data.name);
    }
    if(data.password) {
      formData.append("password", data.password);
    }
    if(image) {
      formData.append("profileImage", image);
    }
    const newURL = `${URL}/sharma/resident/stays/user/register`;
    try {
      setLoading(true);
      const response = await axios.post(newURL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if(response.data.success) {
        setSuccessMessage(response.data.message);
        setData({
          name: "",
          username: "",
          email: "",
          password: "",
          profileImage: "",
        });
        setError(null);
        setTimeout(() => {
          navigate("/login-user");
        }, 1000);
      } else {
        setError("An error occurred. Please try again.")
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("No response from the server");
      }
    }
    setLoading(false);
  };

  return (
    <div className="p-3 border-2 sm:rounded-lg sm:border-blue-300 my-9 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-1">Sign Up Customer</h1>
      <label className="flex flex-col items-center" htmlFor="file-input">
        <img className="rounded-full h-40 w-40 mt-2 self-center cursor-pointer" src={image ? window.URL.createObjectURL(image) : upload_area} alt="" />
        <p className="mb-3 font-semibold">UPLOAD PROFILE IMAGE</p>
      </label>
      <input type="file" hidden name="profileImage" id="file-input" accept="image/*" onChange={handleChange} required />
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input type="text" placeholder="username" className="border py-2 px-3 rounded-lg" id="username" name="username" value={data.username} required onChange={handleChange} />
        <input type="text" placeholder="name" className="border py-2 px-3 rounded-lg" id="name" name="name" value={data.name} required onChange={handleChange} />
        <input type="email" placeholder="email" className="border py-2 px-3 rounded-lg" id="email" name="email" value={data.email} required onChange={handleChange} />
        <input type="password" placeholder="password" className="border py-2 px-3 rounded-lg" id="password" name="password" value={data.password} required onChange={handleChange} />
        <button disabled={loading} type="submit" className="bg-slate-700 text-white p-3 rounded-lg hover:opacity-95 disabled:opacity-80">{loading ? "Loading..." : "SIGN UP"}</button>
        <OAuth state={"user"} />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Already have an account?</p>
        <Link to="/login-user"><span className="text-blue-700">Sign In</span></Link>
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

export default SignupUser;
