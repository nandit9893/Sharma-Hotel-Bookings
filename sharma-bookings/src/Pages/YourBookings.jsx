import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import URL from "../assets/URL.js";
import axios from "axios";
import { useNavigate } from "react-router-dom"

const YourBookings = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();
  const [showSpecificBooking, setShowSpecificBooking] = useState(false);
  const [specificBookingData, setSpecificBookingData] = useState([]);

  useEffect(() => {
    if (currentUser) {
      const getAllBookings = async () => {
        const newURL = `${URL}/sharma/resident/stays/user/get/all/bookings/${currentUser._id}`;
        try {
          const token = localStorage.getItem("accessToken");
          const response = await axios.get(newURL, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          if (response.data.success && response.data.data.length > 0) {
            console.log(response.data.data)
            setBookings(response.data.data);
          } else {
            setBookings([]); 
          }
        } catch (error) { 
        }
      };
  
      getAllBookings();
    }
  }, [currentUser, URL]);

  const getSpecificBooking = (booking) => {
    setShowSpecificBooking(true);
    setSpecificBookingData(booking);
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col md:flex-row mx-auto items-center justify-between p-3 gap-10">
        <div className="flex justify-center mr-4">
          <img src={currentUser?.profileImage} className="w-48 h-60 rounded-lg" alt="User profile" />
        </div>
        <div className="flex flex-col items-center">
          <p className="font-bold text-4xl">{currentUser?.name}</p>
          <p className="text-gray-600 text-xl font-semibold">{currentUser?.email}</p>
        </div>
      </div>
      <div className="my-4 flex flex-col p-3 gap-5">
        <div className="flex flex-col gap-3 mx-auto">
            <h1 className="font-semibold text-5xl text-green-700" style={{ fontFamily: "Stylish" }}>Your Bookings</h1>
            <hr className="w-full h-1 bg-black border-2 border-dashed" />
        </div>
        {
          showSpecificBooking === false && (
            <div className="flex flex-col my-2 mx-auto gap-2">
              <div className="grid sm:grid-cols-7 grid-cols-4 w-full gap-2">
                  <p className="text-lg sm:p-3 p-1 sm:w-auto w-full border-2 border-black bg-white text-black font-semibold rounded-lg items-center text-center">Booking ID</p>
                  <p className="text-lg sm:p-3 p-1 sm:w-auto w-full border-2 border-black bg-white text-black font-semibold rounded-lg items-center text-center">Hotek Name</p>
                  <p className="text-lg p-3 sm:block hidden border-2 border-black bg-white text-black font-semibold rounded-lg items-center text-center">Hotel Address</p>
                  <p className="text-lg sm:p-3 p-1 sm:w-auto w-full border-2 border-black bg-white text-black font-semibold rounded-lg items-center text-center">Total Amount</p>
                  <p className="text-lg p-3 sm:block hidden border-2 border-black bg-white text-black font-semibold rounded-lg items-center text-center">Commencement Date</p>
                  <p className="text-lg p-3 sm:block hidden border-2 border-black bg-white text-black font-semibold rounded-lg items-center text-center">Payment Status</p>
                  <p className="text-lg sm:p-3 p-1 sm:w-auto w-full border-2 border-black bg-white text-black font-semibold rounded-lg items-center text-center">Invoice</p>
              </div>
              {
                  bookings && bookings.length > 0 && (
                      bookings.map((booking) => (
                          <div className="grid sm:grid-cols-7 grid-cols-4 w-full gap-2" key={booking._id}>
                              <p onClick={()=>getSpecificBooking(booking)} className="text-lg sm:p-3 p-1 sm:w-auto w-full bg-white text-black font-semibold rounded-lg items-center text-center cursor-pointer">{booking.bookingID}</p>
                              <p onClick={()=>navigate(`/view-hotel/${booking.hotelID}`)} className="text-lg sm:p-3 p-1 sm:w-auto w-full bg-white text-black font-semibold rounded-lg items-center text-center cursor-pointer">{booking.hotelName}</p>
                              <p onClick={()=>navigate(`/view-hotel/${booking.hotelID}`)} className="text-lg p-3 sm:block hidden bg-white text-black font-semibold rounded-lg items-center text-center cursor-pointer">{booking.hotelAddress}{", "}{booking.hotelCity}</p>
                              <p className="text-lg sm:p-3 p-1 sm:w-auto w-full bg-white text-black font-semibold rounded-lg items-center text-center">₹ {booking.totalAmount - booking.discountAmount}</p>
                              <p className="text-lg p-3 sm:block hidden bg-white text-black font-semibold rounded-lg items-center text-center">{booking.dateOfCommencement.slice(0, 10)} <br /><span className={`${new Date(booking.dateOfCommencement).getTime() > Date.now() ? "bg-green-700 p-1 px-3 text-white rounded-lg" : "bg-red-700 p-1 px-3 text-white rounded-lg"}`}>{new Date(booking.dateOfCommencement).getTime() > Date.now() ? "Upcoming" : "Completed"}</span></p>
                              <p className={`text-lg p-3 sm:block hidden ${booking.isPaymentDone ? "bg-green-700 text-white" : "bg-red-600 text-white"} font-semibold rounded-lg items-center text-center`}>{booking.isPaymentDone ? "Done" : "Pending"}</p>
                              <a href={booking.invoicePDF} rel="noopener noreferrer" download={`Invoice_${booking.bookingID}.pdf`} target="_blank" className="text-lg sm:p-3 p-1 sm:w-auto w-full bg-white text-green-700 font-semibold rounded-lg items-center text-center">Donwload</a>
                          </div>
                      ))
                  )
              }
            </div>
          )
        }
        {
          showSpecificBooking ? 
          (
            <div className="flex flex-col bg-white p-4 gap-2 sm:mx-auto mx-0 sm:w-[40%] w-full border-2 border-blue-600 rounded-xl">
              <div className="flex justify-between">
                <p className="sm:text-2xl text-xl font-semibold">Booking ID</p>
                <span className="sm:text-2xl text-xl font-semibold text-blue-500" style={{ fontFamily: "Stylish" }}>{specificBookingData.bookingID}</span>
              </div>
              <div className="flex justify-between">
                <p className="sm:text-2xl text-xl font-semibold">Hotel Name</p>
                <span className="sm:text-2xl text-xl font-semibold text-blue-500" style={{ fontFamily: "Stylish" }}>{specificBookingData.hotelName}</span>
              </div>
              <div className="flex justify-between">
                <p className="sm:text-2xl text-xl font-semibold">Hotel Address</p>
                <span className="sm:text-2xl text-xl font-semibold text-blue-500 text-right" style={{ fontFamily: "Stylish" }}>{specificBookingData.hotelAddress}, {specificBookingData.hotelCity}</span>
              </div>
              <div className="flex justify-between">
                <p className="sm:text-2xl text-xl font-semibold">Date of Booking</p>
                <span className="sm:text-2xl text-xl font-semibold text-blue-500" style={{ fontFamily: "Stylish" }}>{specificBookingData.dateOfBooking.slice(0, 10)}</span>
              </div>
              <div className="flex justify-between">
                <p className="sm:text-2xl text-xl  font-semibold">Date of Commencement</p>
                <span className="sm:text-2xl text-xl  font-semibold text-blue-500" style={{ fontFamily: "Stylish" }}>{specificBookingData.dateOfCommencement.slice(0, 10)}</span>
              </div>
              <div className="flex justify-between">
                <p className="sm:text-2xl text-xl  font-semibold">Number of Nights</p>
                <span className="sm:text-2xl text-xl  font-semibold text-blue-500" style={{ fontFamily: "Stylish" }}>{specificBookingData.numberOfNights}</span>
              </div>
              <div className="flex justify-between">
                <p className="sm:text-2xl text-xl  font-semibold">Number of Guests</p>
                <span className="sm:text-2xl text-xl  font-semibold text-blue-500" style={{ fontFamily: "Stylish" }}>{specificBookingData.numberOfGuests}</span>
              </div>
              <div className="flex justify-between">
                <p className="sm:text-2xl text-xl  font-semibold">Number of Rooms</p>
                <span className="sm:text-2xl text-xl  font-semibold text-blue-500" style={{ fontFamily: "Stylish" }}>{specificBookingData.numberOfRooms}</span>
              </div>
              <div className="flex justify-between">
                <p className="sm:text-2xl text-xl font-semibold">Room / Flat Type</p>
                <span className="sm:text-2xl text-xl font-semibold text-blue-500" style={{ fontFamily: "Stylish" }}>{specificBookingData.roomType}</span>
              </div>
              <div className="flex justify-between">
                <p className="sm:text-2xl text-xl font-semibold">Room / Flat Standard</p>
                <span className="sm:text-2xl text-xl font-semibold text-blue-500" style={{ fontFamily: "Stylish" }}>{specificBookingData.roomStandard}</span>
              </div>
              <div className="flex justify-between">
                <p className="sm:text-2xl text-xl font-semibold">Total Amount</p>
                <span className="sm:text-2xl text-xl font-semibold text-blue-500" style={{ fontFamily: "Stylish" }}>₹ {specificBookingData.totalAmount - specificBookingData.discountAmount}</span>
              </div>
              <div className="flex justify-between">
                <p className="sm:text-2xl text-xl font-semibold">Your Discount</p>
                <span className="sm:text-2xl text-xl font-semibold text-red-500" style={{ fontFamily: "Stylish" }}>₹ {specificBookingData.discountAmount}</span>
              </div>
            </div>
          )
          :
          null
        }
      </div>
    </div>
  );
};

export default YourBookings;
