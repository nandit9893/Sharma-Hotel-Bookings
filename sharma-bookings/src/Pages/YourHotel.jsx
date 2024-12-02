import React, { useEffect, useState } from 'react';
import URL from "../assets/URL.js";
import axios from "axios";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import { FaShare, FaPhoneAlt, FaGlobe, FaMapMarkerAlt } from "react-icons/fa";
import { IoWifi, IoSnowOutline, IoBasketballOutline } from "react-icons/io5";
import logo from "../assets/logo.png";
import { IoPeopleOutline } from "react-icons/io5"
import { MdLocationOn, MdLocalParking, MdTv } from "react-icons/md";
import "swiper/css/bundle";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { useParams } from "react-router-dom";
import RoomDataDisplay from "../Components/RoomDataDisplay.jsx";
import BookingPreviewData from "../Components/BookingPreviewData.jsx";

const YourHotel = () => {
  SwiperCore.use([Navigation]);
  const { hotelID } = useParams();
  const [menu, setMenu] = useState("allPlaces");
  const [hotelData, setHotelData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);
  const [hotelLuxuryNess, setHotelLuxuryNess] = useState("");
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [cinemaHalls, setCinemaHalls] = useState([]);
  const [famousTouristPlaces, setFamousTouristPlaces] = useState([]);
  const [transportationFacilities, setTransportationFacilities] = useState([]);
  const [allPlaces, setAllPlaces] = useState([]);

  const amenityIcons = {
    "Free WiFi": <IoWifi className="text-xl mr-2" />,
    "AC": <IoSnowOutline className="text-xl mr-2" />,
    "Play Ground": <IoBasketballOutline className="text-xl mr-2" />,
    "Parking": <MdLocalParking className="text-xl mr-2" />,
    "TV": <MdTv className="text-xl mr-2" />,
    "Club": <IoPeopleOutline className="text-xl mr-2" />,
  };

  useEffect(() => {
    const getSpecificHotel = async () => {
      const newURL = `${URL}/sharma/resident/stays/hotel/data/get/specific/${hotelID}`;
      try {
        setLoading(true);
        const response = await axios.get(newURL);
        if (response.data.success) {
          setFamousTouristPlaces(response.data.data.famousTouristPlaces);
          setRestaurants(response.data.data.restaurants);
          setTransportationFacilities(response.data.data.transportationFacilities);
          setCinemaHalls(response.data.data.cinemaHalls);
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
    if(hotelData) {
      const allPlacesSet = [...hotelData.restaurants, ...hotelData.famousTouristPlaces, ...hotelData.transportationFacilities, ...hotelData.cinemaHalls];
      setAllPlaces(allPlacesSet);
    }
  }, [hotelData]);

  useEffect(() => {
    if (hotelData) {
      findLuxurios(parseInt(hotelData.startingPrice));
    }
  }, [hotelData]);

  useEffect(() => {
    if(hotelData) {
      findTime(hotelData.checkInTime, hotelData.checkOutTime);
    }
  }, [hotelData]);

  const findTime = (checkIn, checkOut) => {
    const formatTime = (time) => {
      let [hours, minutes] = time.split(":");
      hours = parseInt(hours, 10);
      const period = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12; 
      return `${hours}:${minutes} ${period}`;
    };
    setCheckInTime(formatTime(checkIn));
    setCheckOutTime(formatTime(checkOut));
  };


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

  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && <p className="text-center my-7 text-2xl">Something went wrong!</p>}
      {hotelData && !loading && !error && (
        <div>
          <Swiper navigation>
            {
              hotelData.imageURLs.map((url) => (
                <SwiperSlide key={url}>
                  <div className="h-[550px]" style={{background: `url(${url}) center no-repeat`, backgroundSize: "cover", objectFit: "contain",}}></div>
                </SwiperSlide>
              ))
            }
          </Swiper>
          <div className="absolute top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer mt-5">
            <FaShare className="text-slate-500" onClick={() => {navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => {setCopied(false);}, 2000);}}/>
          </div>
          {
            copied && 
            (  <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">Link copied!</p> )
          }
        </div>
      )}
      <div className="my-10 mx-auto flex justify-evenly relative">
        <div className="flex flex-col">
          <div className="flex flex-1 gap-10">
            <div className="flex flex-col">
              {
                hotelData && hotelData.hotelName && (
                  <h1 className="text-5xl font-semibold" style={{ fontFamily: "Stylish" }}>
                    {hotelData.hotelName}
                  </h1>
                )
              }
              {
                hotelData && hotelData.address && (
                  <div className="flex items-center gap-2">
                    <MdLocationOn className="text-green-500 text-2xl" />
                    <p className="text-gray-600">{hotelData.address}</p>
                  </div>
                )
              }
              <div className="flex gap-2">
                {hotelData && hotelData.startingPrice && <span className="bg-gray-200 font-semibold p-2 my-2 w-20 text-sm">{hotelLuxuryNess}</span>}
                {hotelData && hotelData.startingPrice && <span className="bg-gray-200 font-semibold p-2 my-2 text-sm">Starting Price ₹{hotelData.startingPrice} onwards</span>}
                <div className="flex gap-2 items-center p-2 my-2 bg-gray-200">
                  <FaPhoneAlt />
                  {hotelData && hotelData.phoneNumber && <span className="font-semibold text-sm">{hotelData.phoneNumber}</span>}
                </div>
              </div>
              <div className="flex justify-between p-3">
                <div className="flex gap-5 items-center bg-gray-200 p-3 rounded-lg">
                  <FaMapMarkerAlt className="text-xl text-green-500"/>
                  {hotelData && hotelData.state && <p className="font-bold">{hotelData.city ? hotelData.city : ""}, {hotelData.state}</p>}
                </div>
                <div className="flex gap-5 items-center bg-gray-200 p-3 rounded-lg">
                  <FaGlobe className="text-xl text-green-500"/>
                  {hotelData && hotelData.country && <p className="font-bold">{hotelData.country}</p>}
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <p className="text-white bg-green-500 py-1 px-3 text-xl font-bold">4{"★".repeat(4)}</p>
              <p className="text-gray-500 bg-white p-1 text-center">790 Ratings</p>
            </div>
          </div>
          <div className="p-2 max-w-2xl mt-10">
            { hotelData && hotelData.description && <p className="font-medium text-xl" style={{ fontFamily: '"Geist", sans-serif' }}>{hotelData.description}</p>}
          </div>
          <div className="my-10">
            <h1 className="text-3xl font-bold">Amenities</h1>
            {
              hotelData && hotelData.amenities && (
                <div className="max-w-2xl gap-1 mt-5 grid grid-cols-3 border-2 rounded-md border-gray-300 bg-slate-100 p-3">
                  {
                    hotelData.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center">
                        {amenityIcons[amenity.trim()] || null}
                        <p>{amenity.trim()}</p>
                      </div>
                    ))
                  }
                </div>
              )
            }
          </div>
          <div className="my-15">
            <h1 className="text-3xl font-bold">Hotel Timing</h1>
            <div className="flex gap-16 my-4 justify-start p-3 max-w-2xl border-2 rounded-md border-gray-300 bg-slate-100">
              <div className="flex flex-col">
                <h3 className="text-black text-xl font-semibold">Check-in</h3>
                <p className="border-2 border-gray-200 font-semibold px-2 py-1">{checkInTime}</p>
              </div>
              <hr className="w-[2px] h-16 bg-gray-200" />
              <div className="flex flex-col">
                <h3 className="text-black text-xl font-semibold">Check-out</h3>
                <p className="border-2 border-gray-200 font-semibold px-2 py-1">{checkOutTime}</p>
              </div>
            </div>
            <div className="mt-5 flex-col flex">
              <h1 className="text-3xl my-4 font-bold">Hotel Guidelines</h1>
              <div className="flex gap-2 items-center">
                &bull;<p className="font-semibold">Couples are welcome</p>
              </div>
              <div className="flex gap-2 items-center">
                &bull;<p className="font-semibold">Guests can check in using any local or outstation ID proof (PAN card not accepted).</p>
              </div>
              <div className="flex gap-2 items-center">
                &bull;<p className="font-semibold">This hotel is serviced under the trade name of Hotel Park Palace as per quality standards <br /> of SHARMA RESIDENT STAY'S.</p>
              </div>
            </div>
          </div>
          <RoomDataDisplay hotelID={hotelID}/>
          <div className="my-10 max-w-2xl">
            <h1 className="text-3xl font-bold">Near by places</h1>
            <div className="border-2 border-gray-300 max-w-1xl rounded-lg my-3 p-2 bg-slate-100">
              <div className="flex flex-1 p-2 items-center gap-5">
                <div className="w-5 h-5 bg-red-500 rounded-full"></div>
                {
                  hotelData && hotelData.hotelName && (
                    <h1 className="text-xl font-semibold">{hotelData.hotelName}</h1>
                  )
                }
              </div>
              <div className="flex flex-1 p-2 items-center gap-5">
                <MdLocationOn className="text-2xl" />
                <input type="text" className="border-2 border-gray-200 py-2 px-4 bg-[#F1F5F1] w-64" placeholder="Find distance from a place" />
              </div>
              <div className="flex flex-col">
                <div className="flex flex-1 p-2 gap-4">
                  { allPlaces && allPlaces.length > 0 && ( <span onClick={()=>setMenu("allPlaces")} className={`text-lg font-semibold cursor-pointer ${menu === "allPlaces" ? "text-red-500" : null}`}>All Places{menu === "allPlaces" ? (<hr className="w-auto h-1 bg-red-500"/>) : null}</span> )}
                  { hotelData && hotelData.famousTouristPlaces.length > 0 && ( <span onClick={()=>setMenu("famousTouristPlaces")} className={`text-lg font-semibold cursor-pointer ${menu === "famousTouristPlaces" ? "text-red-500" : null}`}>Famous Tourist Places{menu === "famousTouristPlaces" ? (<hr className="w-auto h-1 bg-red-500"/>) : null}</span> )}
                  { hotelData && hotelData.restaurants.length > 0 && ( <span onClick={()=>setMenu("restaurants")} className={`text-lg font-semibold cursor-pointer ${menu === "restaurants" ? "text-red-500" : null}`}>Restaurants{menu === "restaurants" ? (<hr className="w-auto h-1 bg-red-500"/>) : null}</span> )}
                  { hotelData && hotelData.cinemaHalls.length > 0 && ( <span onClick={()=>setMenu("cinemaHalls")} className={`text-lg font-semibold cursor-pointer ${menu === "cinemaHalls" ? "text-red-500" : null}`}>Cinema Halls{menu === "cinemaHalls" ? (<hr className="w-auto h-1 bg-red-500"/>) : null}</span> )}
                  { hotelData && hotelData.transportationFacilities.length > 0 && ( <span onClick={()=>setMenu("transportationFacilities")} className={`text-lg font-semibold cursor-pointer ${menu === "transportationFacilities" ? "text-red-500" : null}`}>Trasportation{menu === "transportationFacilities" ? (<hr className="w-auto h-1 bg-red-500"/>) : null}</span> )}
                </div>
                <hr className="w-full h-[2px] bg-gray-200" />
                <div className="flex justify-around p-2 bg-blue-100">
                  <div className="flex flex-col py-2 px-1 w-2/4 ">
                  {
                    allPlaces.length > 0 &&
                    (
                      menu === "allPlaces" && allPlaces.map((place, index) => (
                        <div className="flex justify-between items-center" key={index}>
                          <p className="font-semibold">{place.name}</p>
                          <p className="font-semibold text-gray-600 cursor-pointer">{place.distance} km</p>
                        </div>
                      ))
                    )
                  }
                  {
                    famousTouristPlaces.length > 0 && 
                    (
                      menu === "famousTouristPlaces" && famousTouristPlaces.map((touristPlace) => (
                        <div className="flex justify-between items-center" key={touristPlace._id}>
                          <p className="font-semibold">{touristPlace.name}</p>
                          <p className="font-semibold text-gray-600 cursor-pointer">{touristPlace.distance} km</p>
                        </div>
                      ))
                    )
                  }
                  {
                    restaurants.length > 0 && 
                    (
                      menu === "restaurants" && restaurants.map((restaurantPlace) => (
                        <div className="flex justify-between items-center" key={restaurantPlace._id}>
                          <p className="font-semibold">{restaurantPlace.name}</p>
                          <p className="font-semibold text-gray-600 cursor-pointer">{restaurantPlace.distance} km</p>
                        </div>
                      ))
                    )
                  }
                  {
                    transportationFacilities.length > 0 && 
                    (
                      menu === "transportationFacilities" && transportationFacilities.map((transportationFacility) => (
                        <div className="flex justify-between items-center" key={transportationFacility._id}>
                          <p className="font-semibold">{transportationFacility.name}</p>
                          <p className="font-semibold text-gray-600 cursor-pointer">{transportationFacility.distance} km</p>
                        </div>
                      ))
                    )
                  }
                  {
                    cinemaHalls.length > 0 && 
                    (
                      menu === "cinemaHalls" && cinemaHalls.map((cinemaHallPlace) => (
                        <div className="flex justify-between items-center" key={cinemaHallPlace._id}>
                          <p className="font-semibold">{cinemaHallPlace.name}</p>
                          <p className="font-semibold text-gray-600 cursor-pointer">{cinemaHallPlace.distance} km</p>
                        </div>
                      ))
                    )
                  }
                  </div>
                  <div className="flex justify-center items-center">
                    <img src={logo} alt="" className="rounded-lg w-[300px] h-[200px] shadow-lg" style={{boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.1), 0px -3px 5px rgba(0, 0, 0, 0.1), 3px 0px 5px rgba(0, 0, 0, 0.1), -3px 0px 5px rgba(0, 0, 0, 0.1)"}}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-96 rounded-lg bg-white h-[550px] sticky top-5 bottom-10" style={{boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.1), 0px -3px 5px rgba(0, 0, 0, 0.1), 3px 0px 5px rgba(0, 0, 0, 0.1), -3px 0px 5px rgba(0, 0, 0, 0.1)"}}>
          <BookingPreviewData hotelID={hotelID} />
        </div>
      </div>
    </main>
  );
};

export default YourHotel;
