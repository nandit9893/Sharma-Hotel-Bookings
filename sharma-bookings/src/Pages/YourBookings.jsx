import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import URL from "../assets/URL.js";
import axios from "axios";

const YourBookings = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [bookings, setBookings] = useState([]);

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

  return (
    <div className="flex flex-col">
      <div className="flex mx-auto items-center justify-between p-3 gap-10">
        <div className="flex justify-center mr-4">
          <img src={currentUser?.profileImage} className="w-48 h-52 rounded-lg" alt="User profile" />
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
        <div className="flex flex-col my-2 mx-auto gap-2">
            <div className="grid grid-cols-7 w-full gap-2">
                <p className="text-lg p-3 border-2 border-black bg-white text-black font-semibold rounded-lg items-center text-center">Booking ID</p>
                <p className="text-lg p-3 border-2 border-black bg-white text-black font-semibold rounded-lg items-center text-center">Hotek Name</p>
                <p className="text-lg p-3 border-2 border-black bg-white text-black font-semibold rounded-lg items-center text-center">Hotel Address</p>
                <p className="text-lg p-3 border-2 border-black bg-white text-black font-semibold rounded-lg items-center text-center">Total Amount</p>
                <p className="text-lg p-3 border-2 border-black bg-white text-black font-semibold rounded-lg items-center text-center">Commencement Date</p>
                <p className="text-lg p-3 border-2 border-black bg-white text-black font-semibold rounded-lg items-center text-center">Payment Status</p>
                <p className="text-lg p-3 border-2 border-black bg-white text-black font-semibold rounded-lg items-center text-center">Invoice</p>
            </div>
            {
                bookings && bookings.length > 0 && (
                    bookings.map((booking) => (
                        <div className="grid grid-cols-7 w-full gap-2" key={booking._id}>
                            <p className="text-lg p-3 bg-white text-black font-semibold rounded-lg items-center text-center">{booking.bookingID}</p>
                            <p className="text-lg p-3 bg-white text-black font-semibold rounded-lg items-center text-center">{booking.hotelName}</p>
                            <p className="text-lg p-3 bg-white text-black font-semibold rounded-lg items-center text-center">{booking.hotelAddress}{", "}{booking.hotelCity}</p>
                            <p className="text-lg p-3 bg-white text-black font-semibold rounded-lg items-center text-center">₹ {booking.totalAmount - booking.discountAmount}</p>
                            <p className="text-lg p-3 bg-white text-black font-semibold rounded-lg items-center text-center">{booking.dateOfCommencement.slice(0, 10)} <br /><span>{new Date(booking.dateOfCommencement).getTime() > Date.now() ? "Upcoming" : "Completed"}</span></p>
                            <p className={`text-lg p-3 ${booking.isPaymentDone ? "bg-green-700 text-white" : "bg-red-600 text-white"} font-semibold rounded-lg items-center text-center`}>{booking.isPaymentDone ? "Done" : "Pending"}</p>
                            <a href={booking.invoicePDF} rel="noopener noreferrer" download={`Invoice_${booking.bookingID}.pdf`} target="_blank" className="text-lg p-3 bg-white text-green-700 font-semibold rounded-lg items-center text-center">Donwload Invoice</a>
                        </div>
                    ))
                )
            }
        </div>
      </div>
    </div>
  );
};

export default YourBookings;
