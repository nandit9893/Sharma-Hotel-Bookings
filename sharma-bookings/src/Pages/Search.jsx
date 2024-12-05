import React, { useEffect, useState } from "react";
import { MdLocationOn } from "react-icons/md"
import { FaCalendarAlt } from "react-icons/fa";
import "react-calendar/dist/Calendar.css";
import URL from "../assets/URL.js";
import Calender from "react-calendar";
import "../index.css";
import { useNavigate } from "react-router-dom";
import "../index.css";
import axios from "axios";
import HotelItem from "../Components/HotelItem.jsx";

const Search = () => {
  const navigate = useNavigate();
  const [borderPreview, setBorderPreview] = useState(false);
  const [displayCalendar, setDisplayCalendar] = useState(false);
  const [date, setDate] = useState(Date.now());
  const [loading, setLoading] = useState(false);
  const [hotelsData, setHotelsData] = useState([]);
  const [rooomSearchDataError, setRoomSearchDataError] = useState(false);
  const [roomSearchData, setRoomSearchData] = useState({
    bedType: "",
    roomType: "",
    pricePerNight: 0,
    hasKitchen: false,
    furnished: false,
  });
  const [hotelSearchData, setHotelSearchData] = useState({
    searchTerm: "",
    minPrice: 0,
    maxPrice: 0,
    startingPrice: 0,
    order: "desc",
    sort: "created_at",
  });

  useEffect(()=> {
    if(hotelSearchData.searchTerm.length > 0 ) {
      setBorderPreview(false);
    }
  }, [hotelSearchData.searchTerm]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm", hotelSearchData.searchTerm);
    const minPriceFromUrl = urlParams.get("minPrice", hotelSearchData.minPrice);
    const maxPriceFromUrl = urlParams.get("maxPrice", hotelSearchData.maxPrice);
    const startingPriceFromUrl = urlParams.get("startingPrice", hotelSearchData.startingPrice);
    const sortFromUrl = urlParams.get("sort", hotelSearchData.sort);
    const orderFromUrl = urlParams.get("order", hotelSearchData.order);
    if(searchTermFromUrl || minPriceFromUrl || maxPriceFromUrl || startingPriceFromUrl || sortFromUrl || orderFromUrl) {
      setHotelSearchData({
        searchTerm: searchTermFromUrl || "",
        minPrice: minPriceFromUrl || "",
        maxPrice: maxPriceFromUrl || "",
        startingPrice: startingPriceFromUrl || "",
        order: orderFromUrl || "",
        sort: sortFromUrl || "",
      });
    };
    const fetchHotels = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const newURL = `${URL}/sharma/resident/stays/hotel/data/get/search?${searchQuery}`;
      try {
        const response = await axios.get(newURL);
        if(response.data.success) {
          setHotelsData(response.data.data);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    const bedTypeFromUrl = urlParams.get("bedType", roomSearchData.bedType);
    const roomTypeFromUrl = urlParams.get("roomType", roomSearchData.roomType);
    const pricePerNightFromUrl = urlParams.get("pricePerNight", roomSearchData.pricePerNight);
    const furnishedFromUrl = urlParams.get("furnished", roomSearchData.furnished);
    const hasKitchenFromUrl = urlParams.get("hasKitchen", roomSearchData.hasKitchen);
    if(bedTypeFromUrl || roomTypeFromUrl || pricePerNightFromUrl || furnishedFromUrl || hasKitchenFromUrl) {
      setRoomSearchData({
        bedType: bedTypeFromUrl || "",
        roomType: roomTypeFromUrl || "",
        pricePerNight: pricePerNightFromUrl || "",
        furnished: furnishedFromUrl || "",
        hasKitchen: hasKitchenFromUrl || "",
      });
    };
    fetchHotels();
  },[location.search]);

  const inputChangeHandlerHotels = (event) => {
    const { name, value } = event.target;
    if (name === "searchTerm" || name === "minPrice" || name === "maxPrice" || name === "startingPrice") {
      setHotelSearchData((prev) => ({ ...prev, [name]: value }));
    } else if (name === "sort_order") {
      const sort = event.target.value.split("_")[0] || "created_at";
      const order = event.target.value.split("_")[1] || "desc";
      setHotelSearchData({...hotelSearchData, sort, order});
    }
  };  

  const searhOnTheBasisOfHotels = (event) => {
    event.preventDefault();
    if(hotelSearchData.searchTerm.length === 0) {
      setBorderPreview(true);
      return;
    } else if(hotelSearchData.searchTerm.length > 0) {
      setBorderPreview(false);
    }
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", hotelSearchData.searchTerm);
    urlParams.set("minPrice", hotelSearchData.minPrice);
    urlParams.set("maxPrice", hotelSearchData.maxPrice);
    urlParams.set("startingPrice", hotelSearchData.startingPrice);
    urlParams.set("sort", hotelSearchData.sort);
    urlParams.set("order", hotelSearchData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search-hotel?${searchQuery}`);
  };

  const inputChangeHandlerRooms = (event) => {
    if(event.target.name === "flat" || event.target.name === "room") {
      setRoomSearchData({...roomSearchData, roomType: event.target.name});
    }
    if(event.target.name === "king" || event.target.name === "queen" || event.target.name === "double" || event.target.name === "single") {
      setRoomSearchData({...roomSearchData, bedType: event.target.name});
    }
    if(event.target.name === "furnished" || event.target.name === "hasKitchen") {
      setRoomSearchData({...roomSearchData, [event.target.name]: event.target.checked});
    }
    if(event.target.name === "pricePerNight") {
      setRoomSearchData({...roomSearchData, pricePerNight: event.target.value});
    }
  };

  const searchOnTheBasisOfRooms = (event) => {
    event.preventDefault();
    const isRoomSearchDataAvailable = roomSearchData.bedType || roomSearchData.furnished || roomSearchData.hasKitchen || roomSearchData.pricePerNight > 0 || roomSearchData.roomType;
    if(!isRoomSearchDataAvailable) {
      setRoomSearchDataError(true);
      return;
    }
    setRoomSearchDataError(false);
    const existingParams = new URLSearchParams(location.search);
    if (roomSearchData.pricePerNight > 0) {
      existingParams.set("pricePerNight", roomSearchData.pricePerNight);
    }
    if (roomSearchData.furnished) {
      existingParams.set("furnished", roomSearchData.furnished);
    }
    if (roomSearchData.hasKitchen) {
      existingParams.set("hasKitchen", roomSearchData.hasKitchen);
    }
    if (roomSearchData.roomType) {
      existingParams.set("roomType", roomSearchData.roomType);
    }
    if (roomSearchData.bedType) {
      existingParams.set("bedType", roomSearchData.bedType);
    }
    const searchQuery = existingParams.toString();
    navigate(`/search-hotel?${searchQuery}`);
    fetchHotelsByRoomsCriteria();
  };

  const fetchHotelsByRoomsCriteria = async () => {
    setLoading(true);
    const searchQuery = urlParams.toString();
    const newURL = `${URL}/sharma/resident/stays/hotel/room/get/search/rooms?${searchQuery}`;
    try {
      const response = await axios.get(newURL);
      if(response.data.success) {
        setHotelsData(response.data.data);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-5 flex flex-col sm:px-10 p-3 relative">
      <div className="flex flex-col lg:flex-row justify-center sm:flex-row items-center sm:gap-0 gap-4">
        <div className={`flex justify-evenly sm:rounded-none rounded-md sm:gap-4 gap-0 sm:p-4 p-2 items-center ${borderPreview ? "border-[1px] border-red-600 rounded-l-md zigzag-animation shadow-[0_0_0_1px_#f00]" : "border-2 rounded-l-md"} bg-white px-3 sm:w-80 w-64`}>
          <MdLocationOn className="text-2xl sm:block hidden" />
          <input type="text" className="text-xl text-black outline-none bg-white w-full"  placeholder="Search hotels, cities" name="searchTerm" value={hotelSearchData.searchTerm} onChange={inputChangeHandlerHotels}/>
        </div>
        <div className="flex sm:p-4 p-2 gap-5 sm:rounded-none rounded-md justify-evenly bg-white items-center sm:w-80 w-64 cursor-pointer" onClick={()=>setDisplayCalendar(true)}>
          <FaCalendarAlt className="text-2xl w-1/4" />
          <p className="sm:text-xl text-lg font-semibold w-3/4">
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
        <div className="flex sm:p-4 p-2 justify-evenly bg-green-600 items-center rounded-r-md hover:bg-green-700 transition duration-300 sm:w-80 w-64 sm:rounded-none rounded-md">
            <button type="submit" className="px-10 text-xl text-white font-semibold border-none outline-none" onClick={searhOnTheBasisOfHotels}>Search</button>
        </div>
        {
          displayCalendar && (
            <Calender className="rounded-md absolute top-28 left-4 lg:left-auto lg:right-[500px] w-full lg:w-62 max-w-xs lg:max-w-lg bg-white p-3 z-50" onChange={(newDate)=>{setDate(newDate); setDisplayCalendar(false)}} value={date}/>
          )
        }
      </div>
      <hr className="w-auto h-[2px] bg-gray-200 mt-5"/>
      <div className="flex flex-col sm:flex-row sm:px-5 px-2 h-auto md:h-[600px]">
        <div className="flex flex-col h-[600px] overflow-y-auto cursor-pointer scrollbar scrollbar-thumb-[#4B5563] scrollbar-track-[#E5E7EB] pr-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold mt-2">Filters</h2>
            <h2 className="text-xl my-1 font-semibold">Search your favourite hotels <br /> for vacation !</h2>
            <div className="flex gap-1 items-center justify-between">
              <p className="text-xl">Min Price</p>
              <input type="number" className="rounded-lg p-2 outline-none sm:w-44 w-20" name="minPrice" value={hotelSearchData.minPrice} min="0" onChange={inputChangeHandlerHotels} />
            </div>
            <div className="flex gap-1 items-center justify-between">
              <p className="text-xl">Max Price</p>
              <input type="number" className="rounded-lg p-2 outline-none sm:w-44 w-20" name="maxPrice" value={hotelSearchData.maxPrice} min="0" onChange={inputChangeHandlerHotels} />
            </div>
            <div className="flex gap-1 items-center justify-between">
              <p className="text-xl">Starting Price</p>
              <input type="number" className="rounded-lg p-2 outline-none sm:w-44 w-20" name="startingPrice" value={hotelSearchData.startingPrice} min="0" onChange={inputChangeHandlerHotels} />
            </div>
            <div className="flex gap-1 items-center justify-between">
              <p className="sm:text-xl text-lg">Sort by</p>
              <select name="sort_order" id="sort_order" className="rounded-lg p-2 w-44 outline-none" defaultValue={"created_at"} onChange={inputChangeHandlerHotels}>
                <option value="regularPrice_desc">Price low to high</option>
                <option value="regularPrice_asc">Price high to low</option>
                <option value="createdAt_desc">Latest Hotels</option>
                <option value="createdAt_asc">Oldest Hotels</option>
              </select>
            </div>
          </div>
          <div className="w-full bg-gray-600 h-10 my-5 rounded-lg">
            <p className="text-white text-center p-1">Room Category ⬇</p>
          </div>
          <form onSubmit={searchOnTheBasisOfRooms} className="flex flex-col gap-2">
            <h2 className="text-2xl my-1 font-semibold">Search your favourite rooms</h2>
            <div className="flex items-center justify-between">
              <label className="text-xl">Room type : </label>
              <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                <div className="flex gap-2 items-center">
                  <span className="text-lg">Room</span>
                  <input type="checkbox" name="room" id="room" onChange={inputChangeHandlerRooms} value={roomSearchData.roomType === "room"} checked={roomSearchData.roomType === "room"} className="w-5 h-5 cursor-pointer" />
                </div>
                <div className="flex gap-2 items-center">
                  <span className="text-lg">Apartment</span>
                  <input type="checkbox" name="flat" id="flat" onChange={inputChangeHandlerRooms} value={roomSearchData.roomType === "flat"} checked={roomSearchData.roomType === "flat"} className="w-5 h-5 cursor-pointer" />
                </div>
              </div>
            </div>
            <div className="flex gap-4 items-start justify-between my-4">
              <label className="text-xl">Bed type:</label>
              <div className="flex flex-col">
                <div className="flex justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">Single</span>
                    <input type="checkbox" name="single" id="single" onChange={inputChangeHandlerRooms} value={roomSearchData.bedType === "single"} checked={roomSearchData.bedType === "single"} className="w-5 h-5 cursor-pointer" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">Double</span>
                    <input type="checkbox" name="double" id="double" onChange={inputChangeHandlerRooms} value={roomSearchData.bedType === "double"} checked={roomSearchData.bedType === "double"} className="w-5 h-5 cursor-pointer" />
                  </div>
                </div>
                <div className="flex justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">Queen</span>
                    <input type="checkbox" name="queen" id="queen" onChange={inputChangeHandlerRooms} value={roomSearchData.bedType === "queen"} checked={roomSearchData.bedType === "queen"} className="w-5 h-5 cursor-pointer" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">King</span>
                    <input type="checkbox" name="king" id="king" onChange={inputChangeHandlerRooms} value={roomSearchData.bedType === "king"} checked={roomSearchData.bedType === "king"} className="w-5 h-5 cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex gap-2 items-center justify-between">
                <p className="text-lg">Furnished</p>
                <input type="checkbox" name="furnished" id="furnished" onChange={inputChangeHandlerRooms} value={roomSearchData.furnished} checked={roomSearchData.furnished} className="w-5 h-5 cursor-pointer" />
              </div>
              <div className="flex gap-2 items-center justify-between">
                <p className="text-lg">Kitchen</p>
                <input type="checkbox" name="hasKitchen" id="hasKitchen" onChange={inputChangeHandlerRooms} value={roomSearchData.hasKitchen} checked={roomSearchData.hasKitchen} className="w-5 h-5 cursor-pointer" />
              </div>
            </div>
            <div className="flex gap-5 items-center justify-between">
              <p className="text-lg">Price per night</p>
              <input type="number" className="rounded-lg p-2 outline-none sm:w-48 w-20" name="pricePerNight" id="pricePerNight" value={roomSearchData.pricePerNight} onChange={inputChangeHandlerRooms} placeholder="₹" min="0" />
            </div>
            <button type="submit" className="bg-green-600 p-2 rounded-lg text-white my-2 hover:bg-green-700 transition duration-300">Search</button>
          </form>
        </div>
        <hr className="w-60 h-[5px] bg-gray-300 mx-5 lg:w-[2px] lg:h-[500px] sm:w-full sm:h-[2px]" />
        <div className="flex flex-col">
          <h1 className="text-3xl font-semibold text-center text-slate-700 my-2">Hotels Result</h1>
          <div className="p-2 space-y-10 max-h-[600px] overflow-y-auto scrollbar-hide">
            {
              !loading && hotelsData.length === 0 && 
              (
                <p className="text-xl text-slate-700">No hotels found!</p>
              )
            }
            {
              loading && 
              (
                <p className="text-xl text-slate-700">Loading...</p>
              )
            }
            {
              !loading && hotelsData && hotelsData.map((hotel) => {
                return <HotelItem key={hotel._id} hotel={hotel} />
              })
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
