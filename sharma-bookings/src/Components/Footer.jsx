import React from "react";
import property_logo from "../assets/property.png";
import apple_play_store from "../assets/apple_play_store.png";
import google_play_store from "../assets/google_play_store.png";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <div className="sm:pt-6 sm:pb-5 sm:pl-14 sm:pr-14 p-5 bg-[#777a7f]">
      <div className="flex justify-between">
        <div className="flex items-center">
          <div className="flex flex-col mr-8">
            <h1 className="font-bold text-lg sm:text-xl md:text-2xl flex flex-col">
              <span className="text-white sm:text-4xl text-2xl text-center">SHARMA</span>
              <span className="text-white text-center">RESIDENT STAY'S</span>
            </h1>
          </div>
          <p className="text-white font-bold text-xl sm:inline-block hidden">World's leading chain of hotels and homes</p>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-white font-bold text-xl sm:inline-block hidden">Join our network and grow your business!</p>
          <button onClick={() => navigate("/login-hotel-owner")} className="sm:flex sm:items-center mt-2 p-2 bg-white rounded-lg sm:space-x-2 flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
            <img src={property_logo} alt="Property logo" className="w-8 h-8 rounded-sm sm:mr-2 sm:order-first order-last mx-auto" />
            <p className="text-[#777a7f] font-semibold text-center sm:text-left">List your property</p>
          </button>
        </div>
      </div>
      <hr className="text-white w-full bg-white mt-6 mb-6" />
      <div className="flex sm:flex-row flex-col justify-between">
        <div className="mt-4">
            <p className="text-white">Download SHARMA RESIDENT STAY'S app for exciting offers.</p>
            <div className="flex p-2 mt-8 justify-between">
                <img src={apple_play_store} className="sm:w-44 w-32 border-2 border-white rounded-lg cursor-pointer" alt="" />
                <img src={google_play_store} className="sm:w-44 w-32 border-2 border-white rounded-lg cursor-pointer" alt="" />
            </div>
        </div>
        <hr className="border-l-2 border-white h-36 my-4 hidden sm:block" />
        <div className="flex gap-8">
            <ul className="text-white">
                <li className="mt-4 cursor-pointer hover:underline">About Us</li>
                <li className="mt-4 cursor-pointer hover:underline">Teams / Careers</li>
                <li className="mt-4 cursor-pointer hover:underline">Blogs</li>
                <li className="mt-4 cursor-pointer hover:underline">Support</li>
            </ul>
            <ul className="text-white">
                <li className="mt-4 cursor-pointer hover:underline">Official SHARMA RESIDENCY STAY's Blog</li>
                <li className="mt-4 cursor-pointer hover:underline">Investor Relations</li>
                <li className="mt-4 cursor-pointer hover:underline">SHARMA RESIDENCY STAY's Circle</li>
                <li className="mt-4 cursor-pointer hover:underline">SHARMA RESIDENCY STAY's Frames</li>
            </ul>
        </div>
        <hr className="border-l-2 border-white h-36 my-4 hidden sm:block" />
        <div className="flex gap-8">
            <ul className="text-white">
                <li className="mt-4 cursor-pointer hover:underline">Terms and conditions</li>
                <li className="mt-4 cursor-pointer hover:underline">Guest Policies</li>
                <li className="mt-4 cursor-pointer hover:underline">Privacy Policy</li>
                <li className="mt-4 cursor-pointer hover:underline">Trust and Safety</li>
            </ul>
            <ul className="text-white">
                <li className="mt-4 cursor-pointer hover:underline">Cyber Security</li>
                <li className="mt-4 cursor-pointer hover:underline">Cyber Security Awareness</li>
                <li className="mt-4 cursor-pointer hover:underline">Responsible Disclosure</li>
                <li className="mt-4 cursor-pointer hover:underline">Adverties your Homes</li>
            </ul>
        </div>
      </div>
      <hr className="text-white w-full bg-white mt-6 mb-6" />
      <div className="flex flex-col">
        <p className="text-white text-xl font-semibold sm:block hidden">Every part of the world <span className="text-3xl font-bold">SHARMA RESIDENCY STAY's </span>hotels and rooms are avilable!!</p>
        <div className="grid grid-cols-2 gap-4 md:flex md:flex-nowrap md:justify-between">
          <ul className="w-full sm:w-auto">
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Hotels near me</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Hotels in Goa</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Hotels in Puri</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Hotels in Mahabaleshwar</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Hotels in Jaipur</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Hotels in Shimla</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Hotels in Manali</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Hotels in Udaipur</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Hotels in Mussoorie</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Hotels in Pondicherry</li>
          </ul>
          <ul className="w-full sm:w-auto">
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Hotels in Delhi</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Hotels in Mumbai</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Hotels in Nainital</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Hotels in Lonavala</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Hotels in Munnar</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Hotels in Bangalore</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Hotels in Mysore</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Hotels in Darjeeling</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Hotels in Mount Abu</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Hotels in Kodaikanal</li>
          </ul>
          <ul className="w-full sm:w-auto">
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Hotels in Hyderabad</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Hotels in Pune</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Hotels in Chandigarh</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Hotels in Shirdi</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Hotels in Agra</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Hotels in Gangtok</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Hotels in Coorg</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Hotels in Chennai</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Hotels in Tirupati</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Hotels in Dalhousie</li>
          </ul>
          <ul className="w-full sm:w-auto">
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Hotels in Haridwar</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Hotels in Kolkata</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Hotels in Ahmedabad</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Hotels in Shillong</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Hotels in Rishikesh</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Hotels in Varanasi</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Hotels in Gurgaon</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Hotels in Mandarmoni</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Hotels in Daman</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Hotels in Yercaud</li>
          </ul>
          <ul className="w-full sm:w-auto">
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Hotels in Amritsar</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Hotels in Madurai</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Hotels in Coimbatore</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Hotels in Kasauli</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Hotels in Dehradun</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Travel Guide</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">All Cities Hotels</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Coupons</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">SHARMA RESIDENCY STAY's Hotel UK</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">SHARMA RESIDENCY STAY's Hotel USA</li>
          </ul>
          <ul className="w-full sm:w-auto">
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">SHARMA RESIDENCY STAY's Hotel Mexico</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">SHARMA RESIDENCY STAY's Hotel Brasil</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Hotels in Japan</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">SHARMA RESIDENCY STAY's Hotel Indonesia</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">SHARMA RESIDENCY STAY's Vacation Homes in Europe</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Homes in Scandinavia</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Homes in Southern Europe</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Belvilla Holiday Homes</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Traum Vacation Apartments</li>
              <li className="mt-4 text-white font-semibold hover:underline cursor-pointer">Traum Holiday Homes</li>
          </ul>
        </div>
      </div>
      <hr className="text-white w-full bg-white mt-8 mb-8" />
      <div className="flex sm:flex-row flex-col justify-between gap-5">
        <div className="flex gap-4">
            <a href="https://www.facebook.com/nandit.sharma.399" target="_blank"><FaFacebook className="text-white text-3xl"/></a>      
            <a href="https://www.instagram.com/nanditsharma063?igsh=OHZjenBvbTZ4aTN4" target="_blank"><FaInstagram className="text-white text-3xl"/></a>
            <a href="https://github.com/nandit9893" target="_blank"><FaGithub className="text-white text-3xl"/></a>
            <a href="https://www.linkedin.com/in/nandit-sharma-9a0174203/" target="_blank"><FaLinkedinIn className="text-white text-3xl" /></a>
            <a href="https://x.com/classy9893" target="_blank"><FaTwitter className="text-white text-3xl"/></a>
            <a href=""><FaYoutube className="text-white text-3xl"/></a>
        </div>
        <div className="flex justify-center">
            <p className="text-white font-semibold text-center">2023-24 &copy; All Rights Reserved</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
