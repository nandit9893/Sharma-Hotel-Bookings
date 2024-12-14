import React, { useEffect, useState } from "react";
import header from "../assets/header.jpg";
import sleep from "../assets/sleep.webp";
import world_map from "../assets/world_map.jpg";
import logo from "../assets/logo.png";
import URL from "../assets/URL.js";
import { MdLocationOn } from "react-icons/md"
import { FaCalendarAlt } from "react-icons/fa";
import axios from "axios";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useNavigate } from "react-router-dom";
import "../index.css";
import "react-calendar/dist/Calendar.css";
import Calender from "react-calendar";
import Footer from "../Components/Footer.jsx";

const Home = () => {
  SwiperCore.use([Navigation]);
  const [errorEmail, setErrorEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [visible, setVisible] = useState(true);
  const [hotelImages, setHotelImages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [allPlacesMergerd, setAllPlacesMerged] = useState(null);
  const [placesPreview, setPlacesPreview] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [borderPreview, setBorderPreview] = useState(false);
  const [displayCalendar, setDisplayCalendar] = useState(false);
  const [date, setDate] = useState(Date.now());

  useEffect(() => {
    const getAllHotelsData = async () => {
      const newURL = `${URL}/sharma/resident/stays/hotel/data/get/all/hotels`;
      try {
        setLoading(true);
        const response = await axios.get(newURL);
        if(response.data.success) {
          const allImages = response.data.data.map((item) => item.imageURLs).flat();
          setHotelImages(allImages);
          const allPlaces = response.data.data.map((item) => (
            [
              item.hotelName,
              item.address.split(", ").slice(0, 2).join(", "),
              item.city,
              item.state || null,
              item.country,
              item.restaurants.length > 0 ? item.restaurants.map((restaurant) => restaurant.name).join(", ") : "",
              item.famousTouristPlaces.length > 0 ? item.famousTouristPlaces.map((place) => place.name).join(", ") : "",
              item.transportationFacilities.length > 0 ? item.transportationFacilities.map((facility) => facility.type).join(", ") : "",
              item.cinemaHalls.length > 0 ? item.cinemaHalls.map((hall) => hall.name).join(", ") : ""
            ]
            .filter(value => value !== null && value !== "") 
          )).flat();
          setAllPlacesMerged(allPlaces);   
          setLoading(false);         
        };
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    getAllHotelsData();
  }, []);

  useEffect(() => {
    const intervalID = setInterval(() => {
      setVisible((prev) => !prev);
    }, 1000);
    return () => clearInterval(intervalID);
  }, []);

  const inputEmailHandler = (event) => {
    setEmail(event.target.value);
  };

  const sumbitEmailHanlder = (event) => {
    event.preventDefault();
    if(email === "")  {
      setErrorEmail(true);
    }
  };

  useEffect(() => {
    if(searchTerm.length === 0) {
      setPlacesPreview(false);
    } else if(searchTerm.length > 0) {
      setBorderPreview(false);
    }
  }, [searchTerm]);
  
  const inputChangeHandler = (event) => {
    setSearchTerm(event.target.value);
    setPlacesPreview(true);
  };

  const selectPlaces = (item) => {
    setSearchTerm(item);
    setPlacesPreview(false);
  };

  const navigateToSearchPage = () => {
    if(searchTerm.length === 0) {
      setBorderPreview(true);
      return;
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set("searchTerm", searchTerm);
      const searchQuery = urlParams.toString();
      navigate(`/search-hotel?${searchQuery}`);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl =  urlParams.get("searchTerm", searchTerm);
    if(searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <div className="flex flex-col gap-14 relative">
      <div className="flex flex-col w-full sm:h-72 h-[400px]" style={{background: "linear-gradient(to right, #2D2D2D, #BEBEBE)"}}>
        <div className="mx-auto my-10 bg-gray-600 sm:p-4 p-3 rounded-md w-72 sm:w-auto"  style={{ boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.3)" }}>
          <p className="text-white text-lg font-bold sm:text-3xl">Over 174,000+ hotels and homes across 35+ countries</p>
        </div>
        <div className="flex flex-col lg:flex-row justify-center sm:flex-row items-center sm:gap-0 gap-4">
          <div className={`flex justify-evenly sm:rounded-none rounded-md sm:gap-4 gap-0 sm:p-4 p-2 items-center ${borderPreview ? "border-[1px] border-red-600 rounded-l-md zigzag-animation shadow-[0_0_0_1px_#f00]" : "border-2 rounded-l-md"} bg-white px-3 sm:w-80 w-64`}>
            <MdLocationOn className="text-2xl sm:block hidden" />
            <input type="text" className="text-xl text-black outline-none bg-white w-full"  placeholder="Search hotels, cities" name="searchTerm" value={searchTerm} onChange={inputChangeHandler}/>
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
            <button type="button" className="px-10 text-xl text-white font-semibold border-none outline-none" onClick={navigateToSearchPage}>Search</button>
          </div>
        </div>
        {
          borderPreview ? ( <p className="bg-white text-red-600 py-1 px-3 my-1 w-64 mx-auto lg:mx-96 lg:static absolute top-[350px] left-8">Please select the places or hotels</p>) : null
        }
        {
          placesPreview && allPlacesMergerd && allPlacesMergerd.length > 0 && 
          (
            <div className="rounded-md absolute top-52 left-14 lg:left-72 w-72 bg-white p-3 z-50 overflow-y-auto max-h-60">
              {
                allPlacesMergerd.map((item, index) => (
                  <div key={index} className="flex gap-5 cursor-pointer p-1 items-center hover:bg-blue-600 hover:text-white text-black rounded-lg" onClick={()=>selectPlaces(item)}>
                    <MdLocationOn className="text-xl flex-shrink-0" />
                    <p className="text-sm font-semibold my-1 overflow-hidden text-ellipsis whitespace-nowrap items-center">{item}</p>
                  </div>
                ))
              }
            </div>
          )
        }
        {
          displayCalendar && (
            <Calender className="rounded-md absolute top-52 left-4 lg:left-auto lg:right-[500px] w-20 lg:w-62 max-w-full bg-white p-3 z-50"    onChange={(newDate)=>{setDate(newDate); setDisplayCalendar(false)}} value={date} />
          )
        }
      </div>
      {loading && <p className="text-center my-1 text-2xl">Server is uploaded on render (using free service) Loading...</p>}
      {error && <p className="text-center my-7 text-2xl">Something went wrong!</p>}
      {
        !loading && !error && (
          <div>
            <Swiper navigation>
              {
                hotelImages && hotelImages.map((url) => (
                  <SwiperSlide key={url}>
                    <div className="h-[250px] lg:h-[550px]" style={{background: `url(${url}) center no-repeat`, backgroundSize: "cover", objectFit: "contain",}}></div>
                  </SwiperSlide>
                ))
              }
            </Swiper>
          </div>
        )
      }
      <div className="my-2 flex justify-center sm:p-10 p-0 w-full">
        <div className="relative w-full sm:px-10">
          <img src={header} className="w-full sm:h-[400px] h-72 rounded-lg brightness-50" alt="Header" />
          <button className="absolute top-28 sm:top-80 bg-white sm:p-3 p-1 px-2 rounded-md sm:w-52 w-36 sm:left-14 right-10 hover:opacity-75 transition duration-300"><p className="text-2xl font-bold">Book Now</p></button>
          <h1 className="absolute sm:top-10 sm:left-32 sm:text-5xl text-2xl top-10 left-4 font-bold text-white">Get ready for the <br /> ultimate vacation!</h1>
          <span className="absolute sm:top-44 sm:right-60 sm:text-3xl font-bold text-white left-14 top-36 text-2xl sm:left-auto">Up to</span>
          <h1 className="absolute sm:top-52 sm:right-32 sm:text-8xl text-6xl top-44 left-20 sm:left-auto font-bold text-white">75%</h1>
          <span className="absolute left-48 top-56 sm:left-auto sm:top-64 sm:right-20 sm:text-3xl font-bold text-white">off</span>
        </div>
      </div>
      <div className="mx-auto w-full sm:flex sm:justify-between sm:border-2 border-gray-300 max-w-max p-3 rounded-md">
        <div className="p-2">
          <img src={sleep} className="sm:w-60 w-full h-60 rounded-md" alt="" />
        </div>
        <div className="flex flex-col p-5 px-5">
          <div className="p-2 flex flex-col items-center justify-center gap-2">
            <p className="text-3xl font-bold text-black">Get access to exclusive deals</p>
            <p className="text-xl">Only the best deals reach your inbox</p>
          </div>
          <div className="p-2 flex flex-col gap-5">
            <div className="p-1 h-16">
              <input type="text" placeholder="e.g., john@email.com" onChange={inputEmailHandler} value={email} className={`w-full rounded-md p-2 border-2 ${errorEmail ? "border-red-600" : "border-black"} outline-none px-2`} />
              {
                errorEmail ? ( <p className="text-red-600 px-2">Enter a valid email</p> ) : ""
              }
            </div>
            <div className="p-1">
              <button onClick={sumbitEmailHanlder} className="w-full bg-red-600 rounded-lg p-3 font-bold text-white hover:bg-red-700 transition duration-300">Notify me</button>
            </div>
          </div>
        </div>
      </div>
      <div className="my-5 sm:flex p-4 bg-gray-200">
        <div className="relative mb-14 sm:mb-0">
          <img src={world_map} alt="" className="sm:w-full w-auto mix-blend-color-burn" />
          <img src={logo} className={`w-10 h-10 p-1 bg-white border-1 border-white rounded-full ${ visible ? "opacity-100" : "opacity-0"} transition duration-500 ease-in-out absolute top-24 right-20`} alt="" />
          <img src={logo} className={`w-10 h-10 p-1 bg-white border-1 border-white rounded-full ${ visible ? "opacity-0" : "opacity-100"} transition duration-500 ease-in-out absolute top-20 right-40`} alt="" />
          <img src={logo} className={`w-10 h-10 p-1 bg-white border-1 border-white rounded-full sm:block hidden ${ visible ? "opacity-100" : "opacity-0"} transition duration-500 ease-in-out absolute top-40 left-28`} alt="" />
          <img src={logo} className={`w-10 h-10 p-1 bg-white border-1 border-white rounded-full sm:block hidden ${ visible ? "opacity-0" : "opacity-100"} transition duration-500 ease-in-out absolute top-44 right-20`} alt="" />
          <img src={logo} className={`w-10 h-10 p-1 bg-white border-1 border-white rounded-full ${ visible ? "opacity-100" : "opacity-0"} transition duration-500 ease-in-out absolute top-20 left-20`} alt="" />
          <img src={logo} className={`w-10 h-10 p-1 bg-white border-1 border-white rounded-full ${ visible ? "opacity-0" : "opacity-100"} transition duration-500 ease-in-out absolute top-10 left-40`} alt="" />
          <img src={logo} className={`w-10 h-10 p-1 bg-white border-1 border-white rounded-full ${ visible ? "opacity-100" : "opacity-0"} transition duration-500 ease-in-out absolute top-40 left-40`} alt="" />
          <img src={logo} className={`w-10 h-10 p-1 bg-white border-1 border-white rounded-full ${ visible ? "opacity-0" : "opacity-100"} transition duration-500 ease-in-out absolute top-20 right-60`} alt="" />
          <img src={logo} className={`w-10 h-10 p-1 bg-white border-1 border-white rounded-full sm:block hidden ${ visible ? "opacity-100" : "opacity-0"} transition duration-500 ease-in-out absolute top-40 left-96`} alt="" />
          <img src={logo} className={`w-10 h-10 p-1 bg-white border-1 border-white rounded-full sm:block hidden ${ visible ? "opacity-0" : "opacity-100"} transition duration-500 ease-in-out absolute top-60 left-96`} alt="" />
          <img src={logo} className={`w-10 h-10 p-1 bg-white border-1 border-white rounded-full sm:block hidden ${ visible ? "opacity-100" : "opacity-0"} transition duration-500 ease-in-out absolute sm:top-72 top-32 left-96`} alt="" />
          <img src={logo} className={`w-10 h-10 p-1 bg-white border-1 border-white rounded-full ${ visible ? "opacity-0" : "opacity-100"} transition duration-500 ease-in-out absolute sm:top-72 top-32 right-24`} alt="" />
        </div>
        <div className="sm:p-10 gap-10 p-0">
          <h1 className="text-3xl font-semibold">There's an SHARMA RESIDENT STAY'S around. Always.</h1>
          <h3 className="text-2xl font-semibold mt-4" style={{ fontFamily: "Stylish" }}>Your journey, our dedication, you enjoy, we care!</h3>
          <div className="flex sm:gap-10 gap-3 py-5">
            <div className="flex flex-col">
              <p className="text-black sm:text-5xl text-3xl font-bold">40+</p>
              <span className="text-gray-500">Countries</span>
            </div>
            <span className="sm:text-6xl text-3xl text-gray-500 font-sans">/</span>
            <div className="flex flex-col">
              <p className="text-black sm:text-5xl text-3xl font-bold">174,000+</p>
              <span className="text-gray-500">hotels and homes</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
