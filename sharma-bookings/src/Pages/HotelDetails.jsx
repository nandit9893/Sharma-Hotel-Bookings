import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import URL from "../assets/URL.js";
import { useDispatch, useSelector } from "react-redux";
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, logoutUserFailure, logoutUserStart, logoutUserSuccess, updateUserFailure, updateUserStart, updateUserSuccess } from "../Redux/User/UserSlice";
import axios from "axios";

const HotelDetails = () => {
  const dispatch = useDispatch();
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [hotelID, setHotelID] = useState("");
  const [roomID, setRoomID] = useState("");
  const {currentUser, loading, error} = useSelector((state) => state.user);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const initializeProfileData = () => {
      if(currentUser) {
        setData({
          name: currentUser.name || "",
          email: currentUser.email || "",
          password : "",
        });
      };
    };
    initializeProfileData();
  }, [currentUser]);

  useEffect(() => {
    const getHotelID = async() => {
      const newURL = `${URL}/sharma/resident/stays/hotel/owner/get/hotel/id`;
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(newURL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if(response.data.success) {
          setHotelID(response.data.data);
        } 
      } catch (error) {
        console.log(error);
      }
    };
    getHotelID();
  }, []);

  const inputChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({...prev, [name]: value}));
  };

  const updateOwnerProfile = async (event) => {
    event.preventDefault();
    const newURL = `${URL}/sharma/resident/stays/hotel/owner/update/profile`;
    try {
      dispatch(updateUserStart());
      const token = localStorage.getItem("accessToken");
      const response = await axios.patch(newURL, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if(response.data.success) {
        dispatch(updateUserSuccess(response.data.data));
        setUpdateSuccess(true);
      } else {
        dispatch(updateUserFailure(response.data.data.message));
        setUpdateSuccess(false);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        dispatch(updateUserFailure(error.response.data.message));
        setUpdateSuccess(false);
      } else {
        dispatch(updateUserFailure("An error occurred while updating"));
        setUpdateSuccess(false); 
      }
    }
  };

  const deleteAccount = async (event) => {
    event.preventDefault();
    const newURL = `${URL}/sharma/resident/stays/hotel/owner/delete`;
    try {
      dispatch(deleteUserStart());
      const token = localStorage.getItem("accessToken");
      const response = await axios.delete(newURL, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      if(response.data.success) {
        dispatch(deleteUserSuccess(response.data.data));
        localStorage.removeItem("accessToken");
      } else {
        dispatch(deleteUserFailure(response.data.data.message));
        return;
      }
    } catch (error) {
      if(error.response && error.response.data) {
        dispatch(deleteUserFailure(error.response.data.message));
      } else {
        dispatch(deleteUserFailure("An error occured while deleting"));
      }
    }
  };

  const logOutOwner = async (event) => {
    event.preventDefault();
    const newURL = `${URL}/sharma/resident/stays/hotel/owner/logout`;
    try {
      dispatch(logoutUserStart());
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(newURL, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      if(response.data.success) {
        dispatch(logoutUserSuccess(response.data.data));
        localStorage.removeItem("accessToken");
      } else {
        dispatch(logoutUserFailure(response.data.message));
        return;
      }
    } catch (error) {
      if (error.response && error.response.data) {
        dispatch(deleteUserFailure(error.response.data.message));
      } else {
        dispatch(deleteUserFailure(error.response.data.message));
      }
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-4xl text-sky-500 font-semibold text-center my-7">OWNER PROFILE</h1>
      <form onSubmit={updateOwnerProfile} className="flex flex-col bg-slate-200 gap-2 border-2 border-black p-3 rounded-lg">
        <div className="flex justify-between p-2">
          <p className="text-xl font-semibold p-2">Owner</p>
          <input type="text" name="name" id="name" value={data.name} onChange={inputChangeHandler} className="w-72 border p-2 rounded-lg" placeholder="owner name" />
        </div>
        <div className="flex justify-between p-2">
          <p className="text-xl font-semibold p-2">Email</p>
          <input type="email" name="email" id="email" value={data.email} onChange={inputChangeHandler} className="w-72 border p-2 rounded-lg" placeholder="owner email" />
        </div>
        <div className="flex justify-between p-2">
          <p className="text-xl font-semibold p-2">Password</p>
          <input type="password" name="password" id="password" value={data.password} onChange={inputChangeHandler} className="w-72 border p-2 rounded-lg" placeholder="owner password" />
        </div>
        <button disabled={loading} type="submit" className="bg-slate-500 text-white font-semibold text-xl rounded-lg p-2 hover:opacity-95 disabled:opacity-80 mx-2 mt-2">{ loading ? "UPDATING" : "UPDATE"}</button>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={deleteAccount} className="bg-red-700 text-white p-3 rounded-lg cursor-pointer">Delete Account</span>
        <span onClick={logOutOwner} className="bg-red-700 text-white p-3 rounded-lg cursor-pointer">Sign Out</span>
      </div>
      <p className="text-red-700 mt-5 font-semibold">{error ? error : ""}</p>
      <p className='text-green-700 mt-5 font-semibold'>{updateSuccess ? "User is updated successfully!" : ""}</p>
      <div className="flex mt-5 flex-col gap-3">
        {
          hotelID ? 
          ( <Link to="/add-room" className="bg-green-600 text-white p-3 rounded-lg text-center hover:opacity-95 w-full">ADD ROOMS</Link> )
          :
          ( <Link to="/add-hotel" className="bg-green-600 text-white p-3 rounded-lg text-center hover:opacity-95 w-full">ADD HOTEL</Link> )
        }
        <Link to={`/update-hotel/${hotelID}`} className="bg-green-600 text-white p-3 rounded-lg text-center hover:opacity-95 w-full">UPDATE HOTEL</Link>
        <Link to="/update-room" className="bg-green-600 text-white p-3 rounded-lg text-center hover:opacity-95 w-full">UPDATE ROOMS</Link>        
        <Link to={`/view-hotel/${hotelID}`} className="bg-green-600 text-white p-3 rounded-lg text-center hover:opacity-95 w-full">YOUR HOTEL</Link>
      </div>
    </div>
  );
};

export default HotelDetails;
