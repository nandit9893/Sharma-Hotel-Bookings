import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHotel  } from "react-icons/fa";
import { useSelector } from "react-redux";
import { FaPhoneAlt } from "react-icons/fa";
import property_logo from "../assets/property.png";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {currentUser} = useSelector((state) => state.user);

  const hideDiv = ["/search-hotel"].includes(location.pathname);

  return (
    <header className="bg-blue-100 shadow-lg">
      <div className="flex justify-between items-center max-w-8xl p-2 px-5">
        {
          currentUser?.role !== "hotel-owner" ?
          (
            <Link to="/" className="border-none outline-none cursor-pointer">
              <h1 className="font-bold flex flex-col">
                <span className="text-green-600 text-center sm:text-4xl text-2xl">SHARMA</span>
                <span className="text-gray-700">RESIDENT STAY'S</span>
              </h1>
            </Link>
          )
          :
          (
            <div className="border-none outline-none">
              <h1 className="font-bold flex flex-col">
                <span className="text-green-600 text-center sm:text-4xl text-2xl">SHARMA</span>
                <span className="text-gray-700">RESIDENT STAY'S</span>
              </h1>
            </div>
          )
        }
        <div className="p-3 rounded-lg items-center gap-4 hidden lg:flex">
          <FaPhoneAlt className="text-4xl" />
          <div className="flex flex-col items-center p-2">
            <p className="text-xl text-gray-800 font-bold">+91 - 8171923047</p>
            <p className="text-sm text-gray-600 font-bold">Call us to book now</p>
          </div>
        </div>
        <div className={`hidden lg:flex items-center gap-3 ${hideDiv ? "hidden" : ""}`}>
          <button onClick={()=>navigate("/login-hotel-owner")} className="flex items-center mt-2 p-3 bg-white rounded-lg">
            <img src={property_logo} alt="Property logo" className="mr-2 w-8 h-8 rounded-sm" />
            <p className="text-[#777a7f] font-semibold text-xl">List your property</p>
          </button>
        </div>
        <div className="flex sm:gap-5 gap-0">
          <Link to="/"><p className="hidden sm:inline text-slate-700 hover:underline hover:text-gray-500 font-semibold text-xl cursor-pointer">HOME</p></Link>
          <Link to="/about"><p className="hidden sm:inline text-slate-700 hover:underline hover:text-gray-500 transition-all 0.5s font-semibold text-xl cursor-pointer">ABOUT</p></Link>
          {
            currentUser ?
            ( currentUser.role === "hotel-owner" ? 
              ( <Link to="/hotel-details"><FaHotel className="w-8 h-8 rounded-full object-cover text-white" alt="" /></Link> )
              :
              ( <img src={currentUser.profileImage} className="w-8 h-8 rounded-full object-cover" alt="" onClick={()=>navigate("/profile")} /> )
            )
            :
            (
              <Link to="/login-user"><p className="text-slate-700 hover:underline hover:text-gray-500 transition-all 0.5s font-semibold text-xl cursor-pointer">LOGIN</p></Link>
            )
          }
        </div>
      </div>
    </header>
  );
};

export default Navbar;
