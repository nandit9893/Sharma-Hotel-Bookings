import React from "react";
import Navbar from "../src/Components/Navbar";
import { Routes, Route } from "react-router-dom";
import Home from "../src/Pages/Home";
import About from "../src/Pages/About";
import LoginHotelOwner from "../src/Pages/LoginHotelOwner";
import LoginUser from "../src/Pages/LoginUser";
import SignupHotelOwner from "../src/Pages/SignupHotelOwner";
import SignupUser from "../src/Pages/SignupUser";
import PrivateRoute from "./Components/PrivateRoute";
import Hotel from "./Pages/YourHotel";
import AddYourHotel from "./Pages/AddYourHotel";
import UpdateYourHotel from "./Pages/UpdateYourHotel";
import UserProfile from "./Pages/UserProfile";
import HotelDetails from "./Pages/HotelDetails";
import BookHotel from "./Pages/BookHotel";
import YourHotel from "./Pages/YourHotel";
import AddRoomData from "./Pages/AddRoomData";
import UpdateRoom from "./Pages/UpdateRoom";
import Search from "./Pages/Search";
import YourBookings from "./Pages/YourBookings";

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/search-hotel" element={<Search />} />
        <Route path="/login-hotel-owner" element={<LoginHotelOwner />} />
        <Route path="/login-user" element={<LoginUser />} />
        <Route path="/hotel/:hotelID" element={<Hotel />} />
        <Route path="/signup-hotel-owner" element={<SignupHotelOwner />} />
        <Route path="/signup-user" element={<SignupUser />} />
        <Route path="/view-hotel/:hotelID" element={<YourHotel />} />
        <Route element={<PrivateRoute requiredRole="hotel-owner" />}>
          <Route path="/add-hotel" element={<AddYourHotel />} />
          <Route path="/update-hotel/:hotelID" element={<UpdateYourHotel />} />
          <Route path="/hotel-details" element={<HotelDetails />} />
          <Route path="/add-room" element={<AddRoomData />} />
          <Route path="/update-room" element={<UpdateRoom />} />          
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/book-hotel/:hotelID" element={<BookHotel/>} />
          <Route path="/user/bookings/:customerID" element={<YourBookings />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
