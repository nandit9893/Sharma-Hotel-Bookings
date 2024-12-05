import React, { useEffect, useState } from "react";
import axios from "axios";
import URL from "../assets/URL.js";
import { MdLocationOn, MdTv, MdLocalParking, MdMeetingRoom, MdApartment } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { IoWifi, IoSnowOutline, IoBasketballOutline, IoPeopleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const HotelItem = ({ hotel }) => {
  const [mainImage, setMainImage] = useState(hotel.imageURLs[0]);
  const [hotelLuxuryNess, setHotelLuxuryNess] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [hotelHaveRoom, setHotelHaveRoom] = useState(false);
  const [hotelHaveFlat, setHotelHaveFlat] = useState(false);

  useEffect(() => {
    if (hotel) {
        findLuxurios(hotel.startingPrice);
      }
  }, [hotel]);

  const findLuxurios = (startingPrice) => {
    if (startingPrice > 50000) {
      setHotelLuxuryNess("Luxurious");
    } else if (startingPrice > 20000) {
      setHotelLuxuryNess("Business");
    } else if (startingPrice > 10000) {
      setHotelLuxuryNess("Medium");
    } else {
      setHotelLuxuryNess("Economic");
    }
  };

  useEffect(() => {
    if(hotel) {
      getRoomData(hotel._id)
    }
  }, [hotel]);

  const getRoomData = async (hotelID) => {
    const newURL = `${URL}/sharma/resident/stays/hotel/room/get/all/rooms/${hotelID}`;
    try {
      setLoading(true);
      const response = await axios.get(newURL);
      if(response.data.success) {
        const roomType = response.data.data;
        const resultFlat = roomType.some((item) => ["Flat"].includes(item.roomType));
        const resultRoom = roomType.some((item) => ["Room"].includes(item.roomType));
        setHotelHaveFlat(resultFlat);
        setHotelHaveRoom(resultRoom);
        setLoading(false);
      } 
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const amenityIcons = {
    "Free WiFi": <IoWifi className="text-xl text-green-700 font-bold" />,
    "AC": <IoSnowOutline className="text-xl text-green-700 font-bold" />,
    "Play Ground": <IoBasketballOutline className="text-xl text-green-700 font-bold" />,
    "Parking": <MdLocalParking className="text-xl text-green-700 font-bold" />,
    "TV": <MdTv className="text-xl text-green-700 font-bold" />,
    "Club": <IoPeopleOutline className="text-xl text-green-700 font-bold" />,
  };

  return (
    <div className="my-2 flex flex-col md:flex-row relative gap-5 bg-white p-2 w-full"> 
      <div className="flex flex-col sm:flex-row gap-1 w-full">
        <div className="flex relative overflow-hidden">
          <img src={mainImage} alt="Hotel Thumbnail" className="w-full h-48 sm:w-80 sm:h-72 object-cover cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105"/>
          <p onClick={() => window.open(mainImage)} className="absolute bottom-2 left-20 bg-black/75 cursor-pointer text-white py-1 px-2 rounded-lg">View in big size</p>
        </div>
        <div className="hidden md:grid md:grid-cols-2 md:gap-1">
        {
          hotel.imageURLs.slice(0, 8).map((url, index) => (
              <img src={url} alt={`Hotel ${index}`} key={index} className="md:w-14 md:h-16 h-20 w-full object-cover cursor-pointer" onClick={() => setMainImage(url)}/>
          ))
        }
        </div>
      </div>
      <div className="flex flex-col w-full p-4">
        <Link to={`/view-hotel/${hotel._id}`} target="_blank" className="flex justify-between">
          <div className="flex flex-col">
          <h3 className="text-2xl font-semibold text-center sm:text-left">{hotel.hotelName}</h3>
            <div className="flex gap-2 items-center">
              <MdLocationOn className="text-green-700 text-xl" />
              <p className="text-lg font-normal">{hotel.address}{", "}{hotel.city}</p>
            </div>  
          </div>
        </Link>  
        <div className="flex flex-col sm:flex-row gap-5 my-2">
            <p className="bg-gray-100 font-semibold p-1 px-2 rounded-md">{hotelLuxuryNess}</p>
            <p className="bg-gray-100 font-semibold p-1 px-2 rounded-md">Starting Price ₹{hotel.startingPrice}</p>
            <div className="flex items-center gap-2 p-1 px-2 bg-gray-100 rounded-md">
                <FaPhoneAlt />
                <p className="font-semibold">{hotel.phoneNumber}</p>
            </div>
        </div>
        <div className="flex flex-col my-1">
          <h2 className="text-2xl font-semibold mb-3">Amenities</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3">
          {
            hotel && hotel.amenities.slice(0, 3).map((amenity, index) => (
              <div className="flex items-center  gap-0 sm:gap-2" key={index}>
                {amenityIcons[amenity.trim()] || null}
                <p className="text-lg font-normal text-slate-700">{amenity.trim()}</p>
              </div>
            ))
          }
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between mt-5 gap-5 sm:gap-10">
          <div className="flex gap-4 items-center">
            <div className="flex gap-1 items-center">
              { hotelHaveRoom ? ( <MdMeetingRoom className="text-green-700 text-xl"/> ) : null }
              { hotelHaveRoom ? ( <p className="text-black text-xl">Room</p>) : null }
            </div>
            <div className="flex gap-1 items-center">
              { hotelHaveFlat ? ( <MdApartment className="text-green-700 text-xl"/> ) : null }
              { hotelHaveFlat ? ( <p className="text-black text-xl">Apartment</p>) : null }
            </div>
          </div>
          <div className="flex gap-4 justify-between">
            <Link to={`/view-hotel/${hotel._id}`} rel="noopener noreferrer" className="border-2 border-black text-xl text-black p-1 px-5">View</Link>
            <Link to={`/book-hotel/${hotel._id}`} target="_blank" rel="noopener noreferrer" className="bg-green-700 p-2 px-5 text-white font-bold">Book</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelItem;
