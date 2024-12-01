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
        <Link to="/" className="border-none outline-none">
          <h1 className="font-bold text-lg sm:text-xl md:text-2xl flex flex-col">
            <span className="text-green-600 text-center text-4xl">SHARMA</span>
            <span className="text-gray-700">RESIDENT STAY'S</span>
          </h1>
        </Link>
        <div className="p-3 rounded-lg flex items-center gap-4">
          <FaPhoneAlt className="text-4xl" />
          <div className="flex flex-col items-center p-2">
            <p className="text-xl text-gray-800 font-bold">+91 - 8171923047</p>
            <p className="text-sm text-gray-600 font-bold">Call us to book now</p>
          </div>
        </div>
        <div className={`flex items-center gap-3 ${hideDiv ? "hidden" : ""}`}>
          <button onClick={()=>navigate("/login-hotel-owner")} className="flex items-center mt-2 p-3 bg-white rounded-lg">
            <img src={property_logo} alt="Property logo" className="mr-2 w-8 h-8 rounded-sm" />
            <p className="text-[#777a7f] font-semibold text-xl">List your property</p>
          </button>
        </div>
        <ul className="flex gap-5">
          <Link to="/"><li className="hidden sm:inline text-slate-700 hover:underline hover:text-gray-500 font-semibold text-xl cursor-pointer">HOME</li></Link>
          <Link to="/about"><li className="hidden sm:inline text-slate-700 hover:underline hover:text-gray-500 transition-all 0.5s font-semibold text-xl cursor-pointer">ABOUT</li></Link>
          {
            currentUser ?
            ( currentUser.role === "hotel-owner" ? 
              ( <Link to="/hotel-details"><FaHotel className="w-8 h-8 rounded-full object-cover text-white" alt="" /></Link> )
              :
              ( <Link to="/profile"><img src={currentUser.profileImage} className="w-8 h-8 rounded-full object-cover" alt="" /></Link> )
            )
            :
            (
              <Link to="/login-user"><li className="hidden sm:inline text-slate-700 hover:underline hover:text-gray-500 transition-all 0.5s font-semibold text-xl cursor-pointer">LOGIN</li></Link>
            )
          }
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
