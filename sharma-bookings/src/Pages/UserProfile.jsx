import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import upload_area from "../assets/upload_area.png";
import URL from "../assets/URL.js";
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, logoutUserFailure, logoutUserStart, logoutUserSuccess, updateUserFailure, updateUserStart, updateUserSuccess } from "../Redux/User/UserSlice.js";
import axios from "axios";
import { FaTrash } from "react-icons/fa";

const UserProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {currentUser, loading, error} = useSelector((state) => state.user);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [deleteProfileImage, setDeleteProfileImage] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    profileImage: "",
  });

  useEffect(() => {
    if (currentUser) {
      const getAllBookings = async () => {
        const newURL = `${URL}/sharma/resident/stays/user/get/all/bookings/${currentUser._id}`;
        try {
          const token = localStorage.getItem("accessToken");
          const response = await axios.get(newURL, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });  
          if (response.data.success && response.data.data.length > 0) {
            setBookings(response.data.data);
          } else {
            setBookings([]); 
          }
        } catch (error) { 
        }
      };
  
      getAllBookings();
    }
  }, [currentUser, URL]);

  const [initialImage, setInitialImage] = useState(null);
  const [image, setImage] = useState(null);  

  useEffect(() => {
    const initializeProfileData = () => {
      if(currentUser) {
        setData({
          username: currentUser.username || "",
          email: currentUser.email || "",
          name: currentUser.name || "",
          password : "",
        });
        setInitialImage(currentUser.profileImage || "");
      }
    };
    initializeProfileData();
  }, [currentUser]);

  const inputChangeHandler = (event) => {
    const {name, value, files} = event.target;
    if(name === "profileImage") {
      setImage(files[0]);
      setImageUploadError(false);
    } else {
      setData((prev) => ({...prev, [name]: value}));
    }
  };

  const submitHandler = async (event) =>{
    event.preventDefault();
    const formData = new FormData();
    if (data.username) {
      formData.append("username", data.username);
    }
    if(data.email) {
      formData.append("email", data.email);
    }
    if(data.password) {
      formData.append("password", data.password);
    }
    if(image) {
      formData.append("profileImage", image);
    }
    const newURL = `${URL}/sharma/resident/stays/user/update/profile`;
    try {
      dispatch(updateUserStart());
      const token = localStorage.getItem("accessToken");
      const response = await axios.patch(newURL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      if(response.data.success) {
        dispatch(updateUserSuccess(response.data.data));
        setUpdateSuccess(true);
        setImageUploadError(false);
      } else {
        dispatch(updateUserFailure(response.data.data.message));
        setUpdateSuccess(false);
        setImageUploadError(true);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        dispatch(updateUserFailure(error.response.data.message));
        setUpdateSuccess(false);
        setImageUploadError(true);
      } else {
        dispatch(updateUserFailure("An error occurred while updating"));
        setUpdateSuccess(false); 
        setImageUploadError(true);
      }
    }
  };

  const logout = async (event) => {
    event.preventDefault();
    const newURL = `${URL}/sharma/resident/stays/user/logout`;
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

  const deleteAccount = async (event) => {
    event.preventDefault();
    const newURL = `${URL}/sharma/resident/stays/user/delete/account`;
    try {
      dispatch(deleteUserStart());
      const token = localStorage.getItem("accessToken");
      const response = await axios.delete(newURL,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
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


  return (
    <div className="p-3 max-w-lg mx-auto flex flex-col">
      <h1 className="text-3xl font-semibold text-center my-7">PROFILE</h1>
      <form onSubmit={submitHandler} className="flex flex-col bg-slate-200 gap-3 border-2 border-black p-3 rounded-lg">
        <label htmlFor="file-input" className="flex flex-col items-center">
          {
            deleteProfileImage ?
            ( <img src={upload_area} className="rounded-lg h-28 w-28 object-cover self-center cursor-pointer mt-2" /> )
            :
            (
              <img src={image ? window.URL.createObjectURL(image) : initialImage} className="rounded-lg h-28 w-28 object-cover self-center cursor-pointer mt-2" alt="" />   
            )
          }
        </label>
        <div className="self-center relative">
          <FaTrash onClick={()=>setDeleteProfileImage(true)} className="cursor-pointer" onMouseEnter={()=>setIsHovered(true)} onMouseLeave={()=>setIsHovered(false)} />
          {
            isHovered ?
            ( <span className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 text-sm bg-gray-800 text-white p-2 rounded whitespace-nowrap">Remove Profile Image</span> )
            :
            null
          }
        </div>
        <p className="text-sm self-center">
          {
            imageUploadError ? 
            (
              <span>Error Image Upload (Profile image must be less than @MB)</span>
            )
            :
            null
          }
        </p>
        <input hidden type="file" name="profileImage" id="file-input" accept="image/*" onChange={inputChangeHandler} />
        <h1 className="text-3xl font-semibold text-center">{data.name}</h1>
        <input type="text" value={data.username} onChange={inputChangeHandler} placeholder="username" id="username" name="username" className="border p-3 rounded-lg" />
        <input type="email" value={data.email} onChange={inputChangeHandler} placeholder="email" id="email" name="email" className="border p-3 rounded-lg" />
        <input type="password" value={data.password} onChange={inputChangeHandler} placeholder="password" id="password" name="password" className="border p-3 rounded-lg" />        
        <button disabled={loading} type="submit" className="bg-blue-300 text-black font-bold text-xl rounded-lg p-3 hover:opacity-95 disabled:opacity-80">{loading ? "Updating..." : "Update"}</button>
      </form>
      <div className="flex mt-5">
        <Link to="/" className="bg-green-700 text-white p-3 rounded-lg text-center hover:opacity-95 w-full">BOOK HOTEL</Link>
      </div>
      <div className="flex justify-between mt-5">
        <span onClick={deleteAccount} className="bg-red-700 text-white p-3 rounded-lg cursor-pointer">Delete Account</span>
        <span onClick={logout} className="bg-red-700 text-white p-3 rounded-lg cursor-pointer">Sign Out</span>
      </div>
      { bookings.length > 0 && ( <span onClick={()=>navigate(`/user/bookings/${currentUser._id}`)} className="bg-slate-700 text-white p-3 rounded-lg cursor-pointer w-full text-center mt-5">Your Bookings</span> ) }
      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className='text-green-700 mt-5'>{updateSuccess ? "User is updated successfully!" : ""}</p>
    </div>
  );
};

export default UserProfile;
