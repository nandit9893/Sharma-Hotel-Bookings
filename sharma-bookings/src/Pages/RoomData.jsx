import React, { useEffect, useState } from "react";
import URL from "../assets/URL.js";
import { useNavigate, useParams } from "react-router-dom";
import { MdApartment, MdMeetingRoom, MdKitchen, MdOutlineChair, MdTv } from "react-icons/md";
import { FaSquare, FaSpa } from 'react-icons/fa';
import { IoWifi, IoSnowOutline } from "react-icons/io5";
import axios from "axios";

const RoomData = () => {
  const {hotelID} = useParams();
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [hotelName, setHotelName] = useState("");

  useEffect(() => {
    const getSpecificHotel = async () => {
      const newURL = `${URL}/sharma/resident/stays/hotel/data/get/specific/${hotelID}`;
      try {
        setLoading(true);
        const response = await axios.get(newURL);
        if (response.data.success) {
          setHotelName(response.data.data.hotelName);
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
          setRoomData(response.data.data);
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

  const amenityIcons = {
    "Free WiFi": <IoWifi className="text-xl text-green-700 font-bold" />,
    "AC": <IoSnowOutline className="text-xl text-green-700 font-bold" />,
    "TV": <MdTv className="text-xl text-green-700 font-bold" />,
    "Massage": <FaSpa className="text-xl text-green-700 font-bold" />,
  };

  return (
  <div className="flex sm:p-10 p-2 flex-col">
    {loading && ( <p className="mx-auto text-xl text-red-600 font-semibold">Server is uploaded on render (free service) Loading...</p> )}
    {error && ( <p className="mx-auto text-xl text-red-600 font-semibold">Error while loading data.</p> )}
    <h1 className="text-center mx-auto text-4xl font-semibold text-green-700">{hotelName} <span className="text-2xl font-normal">(Rooms)</span></h1>
    {
      roomData && roomData.length > 0 && (
        roomData.map((room) => (
          <div className="flex flex-col md:flex-row gap-5 my-4 mx-auto justify-between w-[45%] p-5 border-2 border-gray-400 rounded-lg bg-white" key={room._id}>
            <div className="flex flex-col gap-4">
              <p className="text-4xl font-semibold text-slate-600">{room.roomStandard}</p>
              <div className="flex gap-2 items-center">
                <FaSquare className="text-2xl font-semibold text-slate-500" />
                <p className="text-2xl font-semibold text-slate-500">{room.size} sq/m</p>
              </div>
              {room.roomType === "Flat" && ( <p className="text-xl font-semibold">Number of rooms {room.numberOfRooms}</p> )}
              <p className="text-xl font-semibold">Price per night ₹ {room.pricePerNight}</p>
              <div className="flex gap-2">
                <p className="text-xl font-semibold">Bed Type : </p>
                <p className="text-xl font-semibold">{room.bedType}</p>
              </div>
              {
                room.roomType === "Flat" ? 
                (
                  <div className="flex gap-2 items-center">
                    <MdApartment className="text-2xl font-semibold text-green-700" />
                    <p className="text-green-700 text-2xl font-semibold">Apartment</p>
                  </div>
                )
                :
                (
                  <div className="flex gap-2 items-center">
                    <MdMeetingRoom className="text-2xl font-semibold text-green-700" />
                    <p className="text-green-700 text-2xl font-semibold">{room.roomType}</p>
                  </div>
                )
              }
              {
                room.hasKitchen ?
                (
                  <div className="flex gap-2 items-center">
                    <MdKitchen className="text-2xl font-semibold text-green-700" />
                    <p className="text-2xl font-semibold text-green-700">Kitchen</p>
                  </div>
                )
                :
                null
              }
              {
                room.furnished ?
                (
                  <div className="flex gap-2 items-center">
                    <MdOutlineChair className="text-2xl font-semibold text-green-700" />
                    <p className="text-2xl font-semibold text-green-700">Furnished</p>
                  </div>
                )
                :
                null
              }
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
              {
                room.imageURLs.map((url, index) => (
                  <img src={url} key={index} className="sm:w-40 sm:h-36 w-32 h-28 rounded-lg transition-transform duration-300 ease-in-out hover:scale-105" alt="" />
                ))
              }
              </div>
              <div className="flex flex-col gap-2 p-3">
                <p className="text-2xl font-semibold text-center text-teal-700">Ammenities</p>
                <div className="p-3 sm:gap-1 gap-2 grid grid-cols-2">
                  {
                    room && room.amenities && room.amenities.map((amenity, index) => (
                      <div className="flex items-center gap-2" key={index}>
                        {amenityIcons[amenity.trim()] || null}
                        <p className="text-xl text-green-700">{amenity.trim()}</p>
                      </div>
                    ))
                  }
                </div>
              </div>
              <button type="button" onClick={()=>navigate(`/update-room-data/${hotelID}/${room._id}`)} className="w-full bg-green-700 text-white p-2 rounded-lg text-xl hover:bg-green-600">UPDATE</button>
            </div>
          </div>
        ))
      )
    }
  </div>
  );
};

export default RoomData;
