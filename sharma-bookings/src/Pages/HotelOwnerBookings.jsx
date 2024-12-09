import axios from "axios";
import React, { useEffect, useState } from "react";
import URL from "../assets/URL.js";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const HotelOwnerBookings = () => {
  const { hotelID } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [bookings, setBookings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [hotelName, setHotelName] = useState("");

  useEffect(() => {
    const getAllHotelBookings = async () => {
      if (hotelID) {
        const newURL = `${URL}/sharma/resident/stays/hotel/owner/get/all/hotel/owner/bookings/${hotelID}`;
        try {
          setLoading(true);
          const token = localStorage.getItem("accessToken");
          const response = await axios.get(newURL, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.data.success && response.data.data.length > 0) {
            setHotelName(response.data.data[0].hotelName)
            setBookings(response.data.data);
            setError(false);
          } else {
            setError(true);
            setBookings([]);
          }
        } catch (error) {
          setError(true);
        } finally {
          setLoading(false);
        }
      }
    };

    getAllHotelBookings();
  }, [hotelID]);

  return (
    <div className="flex sm:p-10 p-2 flex-col">
      {loading && ( <p className="mx-auto text-xl text-red-600 font-semibold">Server is uploaded on render (free service) Loading...</p> )}
      {error && ( <p className="mx-auto text-xl text-red-600 font-semibold">Error while loading data.</p> )}
      <h1 className="text-center mx-auto text-6xl text-green-700 my-2" style={{ fontFamily: '"Mogra", system-ui' }}>{hotelName}</h1>
      <div className="my-4 flex flex-col mx-auto sm:gap-0 gap-2">
        <div className="flex flex-col sm:flex-row justify-between w-full sm:w-[600px]">
          <p className="sm:text-2xl text-lg font-semibold text-black">Owner Name</p>
          <p className="sm:text-3xl text-xl font-semibold text-slate-700" style={{ fontFamily: '"Itim", cursive '}}>{currentUser.name}</p>
        </div>
        <div className="flex flex-col sm:flex-row justify-between w-full sm:w-[600px]">
          <p className="sm:text-2xl text-lg font-semibold text-black">Owner Email</p>
          <p className="sm:text-3xl text-xl font-semibold text-slate-700" style={{ fontFamily: '"Itim", cursive '}}>{currentUser.email}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {
        bookings && bookings.length > 0 && (
          bookings.map((booking) => (
            <div key={booking._id} className="flex flex-col gap-3 my-4 sm:mx-auto mx-2 justify-between w-[90%] sm:p-5 p-2 border-2 border-gray-400 rounded-lg bg-white">
              <div className="flex justify-between">
                <p className="sm:text-xl text-lg font-semibold">Booking ID</p>
                <p className="sm:text-xl text-lg text-teal-600 font-semibold">{booking.bookingID}</p>
              </div>
              <div className="flex justify-between">
                <p className="sm:text-xl text-lg font-semibold">Customer Name</p>
                <p className="sm:text-xl text-lg text-teal-600 font-semibold">{booking.customerName}</p>
              </div>
              <div className="flex justify-between">
                <p className="sm:text-xl text-lg font-semibold">Customer Phone Number</p>
                <p className="sm:text-xl text-lg text-teal-600 font-semibold">{booking.customerPhoneNumber}</p>
              </div>
              <div className="flex justify-between">
                <p className="sm:text-xl text-lg font-semibold">Date of Booking</p>
                <p className="sm:text-xl text-lg text-teal-600 font-semibold">{booking.dateOfBooking.slice(0, 10)}</p>
              </div>
              <div className="flex justify-between">
                <p className="sm:text-xl text-lg font-semibold">Date of Commencement</p>
                <p className="sm:text-xl text-lg text-teal-600 font-semibold">{booking.dateOfCommencement.slice(0, 10)}</p>
              </div>
              <div className="flex justify-between">
                <p className="sm:text-xl text-lg font-semibold">Room Type</p>
                <p className="sm:text-xl text-lg text-teal-600 font-semibold">{booking.roomType}</p>
              </div>
              <div className="flex justify-between">
                <p className="sm:text-xl text-lg font-semibold">Room Standard</p>
                <p className="sm:text-xl text-lg text-teal-600 font-semibold">{booking.roomStandard}</p>
              </div>
              <div className="flex justify-between">
                <p className="sm:text-xl text-lg font-semibold">Number of Guests</p>
                <p className="sm:text-xl text-lg text-teal-600 font-semibold">{booking.numberOfGuests}</p>
              </div>
              {
                booking.roomType !== "Flat" ?
                (
                  <div className="flex justify-between">
                    <p className="sm:text-xl text-lg font-semibold">Number of Rooms</p>
                    <p className="sm:text-xl text-lg text-teal-600 font-semibold">{booking.numberOfGuests}</p>
                  </div>
                )
                : null
              }
              <div className="flex justify-between">
                <p className="sm:text-xl text-lg font-semibold">Number of Nights</p>
                <p className="sm:text-xl text-lg text-teal-600 font-semibold">{booking.numberOfGuests}</p>
              </div>
              <div className="flex justify-between">
                <p className="sm:text-xl text-lg font-semibold">Payment Status</p>
                <p className={`sm:text-xl text-lg text-white px-2 rounded-md ${booking.isPaymentDone ? "bg-green-500" : "bg-red-600"} font-semibold`}>{booking.isPaymentDone ? "Completed" : "Pending"}</p>
              </div>
              <div className="flex justify-between">
                <p className="sm:text-xl text-lg font-semibold">Total Amount</p>
                <p className="sm:text-xl text-lg text-teal-600 font-semibold">₹ {booking.totalAmount}</p>
              </div>
              <div className="flex justify-between">
                <p className="sm:text-xl text-lg font-semibold">Discount Amount</p>
                <p className="sm:text-xl text-lg text-red-600 font-semibold">- ₹ {booking.discountAmount}</p>
              </div>
            </div>
          ))
        )
      }
      </div>
      <div className=""></div>
    </div>
  );
};

export default HotelOwnerBookings;
