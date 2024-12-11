import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaCalendarAlt } from "react-icons/fa";
import Calendar from "react-calendar";
import axios from "axios";
import URL from "../assets/URL.js";
import "react-calendar/dist/Calendar.css";

const BookingPreviewData = ({ hotelID }) => {
  const { selectedRoom, currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [hotelData, setHotelData] = useState(null);
  const [date, setDate] = useState(Date.now());
  const [showCalendar, setShowCalendar] = useState(false);
  const [roomTypeAvailable, setRoomTypeAvailable] = useState([]);

  useEffect(() => {
    const getSpecificHotel = async () => {
      const newURL = `${URL}/sharma/resident/stays/hotel/data/get/specific/${hotelID}`;
      try {
        setLoading(true);
        const response = await axios.get(newURL);
        if (response.data.success) {
          setHotelData(response.data.data);
          setError(false);
        } else if (response.data.success === false && response.data.statusCode === 404) {
          setError(true);
        }
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    getSpecificHotel();
  }, [hotelID]);

  useEffect(() => {
    const getRoomData = async () => {
      const newURL = `${URL}/sharma/resident/stays/hotel/room/get/all/rooms/${hotelID}`;
      try {
        setLoading(true);
        const response = await axios.get(newURL);
        if(response.data.success) {
          const getRoomType = response.data.data.map((item)=>item.roomStandard);
          setRoomTypeAvailable(getRoomType);
          setError(false);
        } else if(response.data.success === false && response.data.statusCode === 404) {
          setError(true);
        }
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    getRoomData();
  }, [hotelID]);

  return (
    <div className="flex flex-col gap-3 relative overflow-visible">
      <div className="flex justify-between px-5 py-2 rounded-t-lg" style={{ background: "linear-gradient(to right, red, white)" }}>
        {
          currentUser === null ? 
          (
            <>
              <p className="text-white font-semibold text-lg">Login now to book hotel</p>
              <Link to="/login-user" className="bg-red-600 px-3 py-1 text-white font-semibold text-xl opacity-75 rounded-md">Login</Link> 
            </>
          )
          :
          null
        }
      </div>
      <div className="flex justify-start p-5 gap-5">
        <div className="flex flex-col">
          <p className="text-2xl font-semibold text-gray-500">Starting Price</p>
          {hotelData && hotelData.startingPrice && <p className="text-3xl font-semibold text-center">₹ {hotelData.startingPrice}</p>}
        </div>
      </div>
      <div className="flex justify-between p-5 gap-3">
        <div onClick={()=>setShowCalendar((prev)=>!prev)} className="w-full cursor-pointer flex items-center gap-2 border-2 border-gray-200 p-2 rounded-md">
          <FaCalendarAlt className="text-xl" />
              <p className="text-sm font-semibold">
                {
                  new Intl.DateTimeFormat("en-US", {
                    weekday: "short",
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }).format(date)
                }
          </p>
        </div>
        <div className="w-52 flex items-center gap-2 border-2 border-gray-200 p-2 rounded-md">
          <p className="text-center text-sm font-semibold">1 Room, </p>
          <p className="text-center text-sm font-semibold">1 Guest</p>
        </div>
        {
          showCalendar && (
            <div className="cursor-pointer absolute z-20 top-64 bg-white shadow-lg rounded-md mt-2">
              <Calendar onChange={(newDate)=>{setDate(newDate); setShowCalendar(false)}} value={date} />
            </div>
          )
        }
      </div>
      <div className="flex flex-col p-5 items-center">
        <p className="text-center text-2xl font-semibold items-center">Room / Flat</p>
        <span className="font-semibold">Standard</span>
        {
          roomTypeAvailable && (
            <div className="grid grid-cols-3 gap-4 w-full mt-4">
              {
                roomTypeAvailable.map((roomType, index) => (
                  <div key={index} className="p-3 border rounded-lg text-center">
                    <p>{roomType}</p>
                  </div>
                ))
              }
            </div>
          )
        }
      </div>
      {/* <div className="px-5">
        <p className="bg-green-600 rounded-lg p-3 text-white font-semibold text-2xl text-center">Continue to Book</p>
      </div> */}
    </div>
  );
};

export default BookingPreviewData;
