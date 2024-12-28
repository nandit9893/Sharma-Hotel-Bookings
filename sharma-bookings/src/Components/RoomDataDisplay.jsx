import React, { useEffect, useState } from "react";
import URL from "../assets/URL.js";
import { FaCheck, FaBed, FaSpa  } from "react-icons/fa";
import { MdApartment, MdMeetingRoom, MdTv, MdOutlineChair, MdKitchen } from "react-icons/md";
import { IoWifi, IoSnowOutline } from "react-icons/io5";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { selectRoom } from "../Redux/User/UserSlice.js";

const RoomDataDisplay = ({hotelID}) => {
    const { currentUser } = useSelector((state) => state.user);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [roomData, setRoomData] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [selectedRoomID, setSelectedRoomID] = useState(null);
    const dispatch = useDispatch();

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

    useEffect(()=> {
      setSelectedRoom(null);
      dispatch(selectRoom(null)); 
    }, []);

    const amenityIcons = {
        "Free WiFi": <IoWifi className="text-xl text-green-700 font-bold" />,
        "AC": <IoSnowOutline className="text-xl text-green-700 font-bold" />,
        "TV": <MdTv className="text-xl text-green-700 font-bold" />,
        "Massage": <FaSpa className="text-xl text-green-700 font-bold" />,
    };

    const selectedRoomData = (room) => {
      if (selectedRoomID === room._id) {
        setSelectedRoomID(null);
        dispatch(selectRoom(null)); 
      } else {
        if (selectedRoomID !== room._id) {
          setSelectedRoomID(room._id);
          dispatch(selectRoom(room)); 
        }
      }
    };
    
  return (
    <div className="my-10 w-[320px] sm:w-auto p-2 sm:p-3">
      <h1 className="text-3xl font-bold my-2">Choose your room</h1>
      {
        roomData && roomData.length > 0 && (
          roomData.map((room) => (
          <div className="border-2 my-4 rounded-lg border-gray-300 bg-slate-100" key={room._id}>
            <p className="px-4 py-1 text-white font-semibold rounded-t-lg" style={{background: "linear-gradient(to right, #2D2D2D, #BEBEBE)"}}><span className="items-center mr-2 text-yellow-300">{"★".repeat(1)}</span>SELECT CATEGORY</p>
            <div className="flex flex-col">
              <div className="flex justify-between p-2">
                <div className="flex flex-col p-2 sm:gap-2 gap-0">
                  <h2 className="font-bold text-gray-500 sm:text-4xl text-2xl" style={{ fontFamily: "Faculty Glyphic, sans-serif" }}>{room.roomStandard}</h2>
                  <div className="flex flex-col sm:flex-row px-1 gap-5">
                    <span className="font-semibold text-base text-gray-500">Size {room.size} sqm</span>
                    {
                      room.roomType === "Flat" && room.numberOfRooms ? ( <span className="font-semibold text-base text-gray-500">Number of rooms {room.numberOfRooms}</span> ) : ""
                    }
                  </div>
                  <div className="py-4">
                    <div className="grid gap-2 sm:gap-20 sm:mt-5 mt-2 grid-cols-1 md:grid-cols-2">
                      <div className="flex items-center gap-2">
                        {
                          room.roomType === "Flat" ? <MdApartment className="text-xl md:text-2xl text-green-700" /> : <MdMeetingRoom className="text-xl md:text-2xl text-green-700" />
                        }
                        <p className="text-lg md:text-xl text-black">{room.roomType}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaBed className="text-xl md:text-2xl text-green-700" />
                        <p className="text-lg md:text-xl text-black">{room.bedType}</p>
                      </div>
                    </div>
                    <div className="grid gap-2 sm:gap-20 sm:mt-5 mt-2 grid-cols-1 md:grid-cols-2">
                      <div className="flex items-center gap-2">
                        <MdOutlineChair className="text-xl md:text-2xl text-green-700" />
                        <p className="text-lg md:text-xl text-black">{room.furnished ? "Furnished" : "Unfurnished"}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {
                          room.hasKitchen ? 
                          ( <MdKitchen className="text-xl md:text-2xl text-green-700" /> ) 
                          : 
                          ( <div className="w-4 h-4 bg-red-600 rounded-full"></div> )
                        }
                        <p className="text-lg md:text-xl text-black">{room.hasKitchen ? "Kitchen" : "No Kitchen"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="my-3">
                    <p className="text-black text-3xl font-semibold">Amenities</p>
                    <div className="p-3 sm:gap-1 gap-2 grid grid-cols-2">
                      {
                        room && room.amenities && room.amenities.map((amenity, index) => (
                          <div className="flex items-center gap-2" key={index}>
                            {amenityIcons[amenity.trim()] || null}
                            <p>{amenity.trim()}</p>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 p-1">
                  {
                    room.imageURLs.map((image, index) => (
                      <img src={image} alt="" key={index} className="cursor-pointer sm:w-64 w-72 sm:h-40 h-36 rounded-lg transition-transform duration-300 ease-in-out hover:scale-105" />
                    ))
                  }
                </div>
              </div>
              <hr className="w-full h-[2px] bg-gray-400" />
              <div className="flex justify-between p-3 gap-3 sm:gap-auto">
                <div className="flex flex-col">
                  <div className="flex gap-3 items-center">
                    <p className="text-black text-xl font-semibold">₹{room.pricePerNight}</p>
                    <span className="text-gray-500 line-through decoration-overline">₹{room.pricePerNight + 5000}</span>
                  </div>
                  <div className="flex items-center">
                    <p className="text-gray-500 text-sm">+ {room.pricePerNight/100} taxes & fee</p>
                  </div>
                </div>
                <div onClick={currentUser.role !== "hotel-owner" ? () => selectedRoomData(room) : null} className={`flex gap-5 items-center px-3 sm:px-10 border-[1px] border-gray-500 rounded-lg sm:w-64 w-44 ${ currentUser.role === "hotel-owner" ? "cursor-not-allowed opacity-50" : "cursor-pointer opacity-100"}`}>
                  <FaCheck className={`text-xl p-1 rounded-full ${selectedRoomID === room._id ? "text-white bg-green-600" : "text-black border-black border-2" }`}/>
                  <p className={`font-semibold ${selectedRoomID === room._id ? "text-green-600" : "text-gray-600"}`}>{selectedRoomID === room._id ? "Selected" : "Select"}</p>
                </div>
              </div>
            </div>
          </div>
          ))
        )
      } 
    </div>
  );
};

export default RoomDataDisplay;