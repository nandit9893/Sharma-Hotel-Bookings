import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaCalendarAlt } from "react-icons/fa";
import { FaPlus, FaMinus } from "react-icons/fa";
import URL from "../assets/URL.js";
import axios from "axios";
import countryCodes from "../assets/country.code.js";
import Payment from "../Components/Payment.jsx";
import { useSelector } from "react-redux";
import Calendar from "react-calendar";

const BookHotel = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { hotelID } = useParams();
  const [hotelData, setHotelData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState(countryCodes[0].code);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [disableSend, setDisableSend] = useState(false);
  const [timeLeft, setTimeLeft] = useState(29);
  const [emailSent, setEmailSent] = useState(false);
  const [roomData, setRoomData] = useState([]);
  const [date, setDate] = useState(Date.now());
  const [selectRoomType, setSelectRoomType] = useState(false);
  const [OTP, setOTP] = useState("");
  const [OTPLoading, setOTPLoading] = useState(false);
  const [payablePage, setPayablePage] = useState(false);
  const [OTPVerified, setOTPVerified] = useState(false);
  const [lengthOfPhoneNumber, setLengthOfPhoneNumber] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [roomPriceOfTheHotels, setRoomPriceOfTheHotels] = useState([]);
  const [bookingFormData, setBookingFormData] = useState({
    hotelID: "",
    hotelName: "",
    customerPhoneNumber: "",
    customerEmail: "",
    hotelAddress: "",
    hotelCity: "",
    hotelState: "",
    hotelCountry: "",
    customerName: "",
    customerID: "",
    roomStandard: "",
    numberOfRooms: 1,
    numberOfGuests: 1,
    numberOfNights: 1,
    roomType: "",
    dateOfBooking: "",
    dateOfCommencement: "",
    hotelPincode: "",
    hotelPhoneNumber: "",
    totalAmount: 0,
  });

  useEffect(()=>{
    if(bookingFormData.customerPhoneNumber.length > 8 && bookingFormData.customerPhoneNumber.length <= 12) {
      setLengthOfPhoneNumber(true);
    } else {
      setLengthOfPhoneNumber(false);
    }
  }, [bookingFormData.customerPhoneNumber]);

  useEffect(() => {
    const getRoomData = async () => {
      const newURL = `${URL}/sharma/resident/stays/hotel/room/get/all/rooms/${hotelID}`;
      try {
        setLoading(true);
        const response = await axios.get(newURL);
        if(response.data.success) {
          const categoriesOfRooms = response.data.data.map((item) => ({
            roomStandard: item.roomStandard,
            roomType: item.roomType,
            pricePerNight: item.pricePerNight,
          }));
          setRoomPriceOfTheHotels(categoriesOfRooms);
          setRoomData(response.data.data);
          setError(false);
        } else if(response.data.success === false && response.data.statusCode === 404) {
          setError(true);
        }
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    getRoomData();
  }, [hotelID]);

  useEffect(() => {
    let timer;
    if (disableSend) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setDisableSend(false);
            return 29;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [disableSend]);

  useEffect(() => {
    let timer;
    if (emailSent) {
      timer = setTimeout(() => {
        setEmailSent(false);
      }, 30000); 
    }
    return () => clearTimeout(timer);
  }, [emailSent]);

  useEffect(() => {
    const getHotelsData = async () => {
      const newURL = `${URL}/sharma/resident/stays/hotel/data/get/specific/${hotelID}`;
      try {
        setLoading(true);
        const response = await axios.get(newURL);
        if (response.data.success) {
          setHotelData(response.data.data);
          setBookingFormData((prev)=>({
            ...prev,
            hotelID: response.data.data._id,
            hotelName: response.data.data.hotelName,
            hotelAddress: response.data.data.address,
            hotelCity: response.data.data.city,
            hotelState: response.data.data.state,
            hotelCountry: response.data.data.country,
            dateOfBooking: new Date().toISOString().split('T')[0],
            hotelPhoneNumber: response.data.data.phoneNumber,
            hotelPincode: response.data.data.pinCode,
            customerID: currentUser._id,    
          }));
        } else if (response.data.success === false && response.data.statusCode === 404 ) {
          setError(true);
        }
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    getHotelsData();
  }, [hotelID]);

  const handleCountryChange = (code) => {
    setSelectedCountryCode(code);
    setIsDropdownOpen(false);
  };

  const setTheDropdownMenu = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const sentOTPToEmail = async () => {
    const formData = new FormData();
    if (bookingFormData.customerName) {
      formData.append("customerName", bookingFormData.customerName);
    }
    if (bookingFormData.customerEmail) {
      formData.append("customerEmail", bookingFormData.customerEmail);
    }
    if (bookingFormData.customerPhoneNumber && selectedCountryCode) {
      const fullPhoneNumber = `${selectedCountryCode}${bookingFormData.customerPhoneNumber}`;
      formData.append("customerPhoneNumber", fullPhoneNumber);
    }
    const newURL = `${URL}/sharma/resident/stays/hotel/booking/send/email/mobile`;
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(newURL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", 
        },
      });
      if (response.data.success) {
        setEmailSent(true);
        setDisableSend(true);
      }
    } catch (error) {
      console.log(error)
      setEmailSent(false);
      setDisableSend(false);
    } finally {
      setLoading(false); 
    }
  };
  
  const getRoomType = (roomType) => {
    setBookingFormData((prev)=>({...prev, roomType: roomType }));
    setSelectRoomType(false);
  };

  const inputChangeHandler = (event) => {
    const { name, value } = event.target;
    if (name === "customerEmail" || name === "customerPhoneNumber" || name === "customerName") {
      setBookingFormData((prev) => ({...prev, [name]: value }));
    }
  };

  const hanldeOTPChange = (event) => {
    const inputOTP = event.target.value;
    if(inputOTP.length <= 6) {
      setOTP(inputOTP); 
    } 
  }; 
  
  const verifyOTP = async () => {
    const formData = new FormData();
    if(OTP.length === 6) {
      formData.append("otp", OTP);
    }
    if (bookingFormData.customerEmail) {
      formData.append("customerEmail", bookingFormData.customerEmail);
    }
    if (bookingFormData.customerPhoneNumber && selectedCountryCode) {
      const fullPhoneNumber = `${selectedCountryCode}${bookingFormData.customerPhoneNumber}`;
      formData.append("customerPhoneNumber", fullPhoneNumber);
    }
    const newURL = `${URL}/sharma/resident/stays/hotel/booking/verify/email/mobile`;
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(newURL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", 
        },
      });
      if(response.data.success) {
        setEmailSent(false);
        setOTPVerified(true);
      }
    } catch (error) {
      setEmailSent(false);
      setDisableSend(false);
    } finally {
      setLoading(false);
    }
  };

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); 

  const handleDateChange = (newDate) =>{
    setDate(newDate);
    setShowCalendar(false);
    const settingDateOfCommencement = newDate.toISOString().split("T")[0];
    setBookingFormData((prev)=>({
      ...prev,
      dateOfCommencement: settingDateOfCommencement,
    }));
  };

  useEffect(() => {
    const generateTotalPrice = () => {
      if(bookingFormData.roomType === "Flat") {
        const roomEntries = roomPriceOfTheHotels.find((item) => (item.roomStandard === bookingFormData.roomStandard && item.roomType === bookingFormData.roomType));
        let pricePerNight;
        if(roomEntries) { 
          pricePerNight = roomEntries.pricePerNight;
        }
        setBookingFormData((prev)=>({...prev, totalAmount: (pricePerNight)*(bookingFormData.numberOfGuests)*(bookingFormData.numberOfNights)}))
      } else if (bookingFormData.roomType === "Room") {
        const roomEntries = roomPriceOfTheHotels.find((item) => (item.roomStandard === bookingFormData.roomStandard && item.roomType === bookingFormData.roomType));
        let pricePerNight;
        if(roomEntries) { 
          pricePerNight = roomEntries.pricePerNight;
        }
        setBookingFormData((prev)=>({...prev, totalAmount: (pricePerNight)*(bookingFormData.numberOfGuests)*(bookingFormData.numberOfRooms)*(bookingFormData.numberOfNights)}))
      }
    };
    generateTotalPrice();
  }, [bookingFormData.roomType, bookingFormData.roomStandard, bookingFormData.numberOfRooms, bookingFormData.numberOfGuests, bookingFormData.numberOfNights, roomPriceOfTheHotels]);

  const inputNumberOfGuestsHandler = (event) => {
    const { name, value } = event.target;
    setBookingFormData((prev)=>({...prev, [name]: value}));
  };

  const inputChangeStandard = (event) =>{
    setBookingFormData((prev)=>({...prev, roomStandard: event.target.value}))
  };

  return (
    <div className="my-10 flex flex-col sm:flex-row gap-5 mx-5 sm:mx-32">
      <div className="flex flex-col border border-gray-300 sm:w-2/3 w-full rounded-lg">
      {
        payablePage ? 
        (
          <Payment bookingFormData={bookingFormData} />
        )
        :
        (
          <>
            <div className="flex gap-5 bg-gray-200 text-white p-4 rounded-t-lg">
              <p className="text-lg font-bold text-white bg-black p-1 px-2 rounded">1</p>
              <h1 className="text-2xl p-1 px-2 font-bold text-black">Enter your details</h1>
            </div>
            <p className="p-5 font-semibold">We would like to get your details for booking</p>
            <div className="p-5 flex justify-between gap-5">
              <div className="flex flex-col gap-2 w-1/2">
                <label className="text-lg font-bold">Full Name</label>
                <input type="text" placeholder="Enter your name" name="customerName" id="customerName" onChange={inputChangeHandler} value={bookingFormData.customerName} className="p-2 rounded border border-gray-300 w-full" />
              </div>
              <div className="flex flex-col gap-2 w-1/2">
                <label className="text-lg font-bold">Email</label>
                <input type="email" placeholder="Enter your email" name="customerEmail" id="customerEmail" onChange={inputChangeHandler} value={bookingFormData.customerEmail} className="p-2 rounded border border-gray-300 w-full" />
              </div>
            </div>
            <div className="p-5 flex flex-col sm:flex-row justify-between gap-5">
              <div className="flex flex-col gap-2 w-1/2">
                <label className="text-lg font-bold">Mobile Number</label>
                <div className="flex">
                  <div className="relative">
                    <select value={selectedCountryCode} onChange={(e) => handleCountryChange(e.target.value)} className="p-2 outline-none w-24 bg-white text-black rounded-sm border border-gray-300" onClick={setTheDropdownMenu}>
                      <option value={selectedCountryCode} className="bg-none">
                        {selectedCountryCode}
                      </option>
                    </select>
                    <div className="absolute top-full left-1 w-72 bg-white border border-gray-300 z-10">
                    {
                      isDropdownOpen && 
                      (
                        <div className="h-60 overflow-y-auto">
                          {
                            countryCodes.map((item, index) => (
                              <div key={index} onClick={() => handleCountryChange(item.code)} className="flex justify-between p-2 bg-white cursor-pointer hover:bg-blue-700 hover:text-white" >
                                <p>{item.code}</p>
                                <p>{item.name}</p>
                              </div>
                            ))
                          }
                        </div>
                      )
                    }
                    </div>
                  </div>
                  <input type="tel" placeholder="e.g., 1234657890" name="customerPhoneNumber" value={bookingFormData.customerPhoneNumber} onChange={inputChangeHandler} className="p-2 rounded border border-gray-300 flex-1 ml-2 sm:w-auto w-40"/>
                </div>
              </div>
              <div className="flex flex-col gap-1 sm:w-1/2 w-full">
                {
                  emailSent ? 
                  (
                    <>
                      <label className="text-lg font-bold mt-1">OTP</label>
                      <input type="tel" placeholder="Enter OTP" value={OTP} onChange={hanldeOTPChange} className="p-2 rounded border border-gray-300 w-full" /> 
                    </>
                  )
                  :
                  (
                    loading ? 
                    (
                      <div role="status" className="flex justify-center items-center h-full mt-9">
                        <svg aria-hidden="true" className="w-8 h-8 text-gray-200 bg-green-700 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                      </div>
                    )
                    :
                    ( <button disabled={OTPVerified} className={`${OTPVerified || !lengthOfPhoneNumber ? "bg-gray-400 cursor-not-allowed" : "bg-green-700 cursor-pointer"} justify-center h-full mt-9 rounded-sm text-white text-xl sm:p- py-2`} onClick={sentOTPToEmail} type="button">Send</button> )
                  )
                }
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between p-5">
              <div className="flex mt-3">
                {
                  OTPLoading ? 
                  (
                    <div role="status" className="flex items-center w-full mx-28">
                        <svg aria-hidden="true" className="w-8 h-8 text-gray-200 bg-green-700 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                    </div>
                  )
                  :
                  (
                    OTPVerified ?
                    ( <button type="button" disabled={OTPVerified} className="bg-green-700 cursor-not-allowed px-5 p-2 text-white rounded-md">Verified</button> )
                    :
                    ( <button type="button" disabled={OTPVerified} onClick={verifyOTP} className={`${emailSent && OTP.length === 6 ? "bg-green-700 cursor-pointer" : "bg-gray-400 cursor-not-allowed"} px-5 p-2 text-white rounded-md`}>{OTPVerified ? "Verified" : " Verify and Proceed"}</button> )
                  )
                  
                }
              </div>
              <div className="flex gap-1">
              {
                emailSent ?
                (
                  <div className="flex flex-col">
                    <p className="text-red-700">Resend OTP in {timeLeft}</p>
                    <p className="text-green-700">OTP sent successfully!</p>
                  </div>
                )
                :
                null
              }
              </div>
            </div>
            <div className="flex justify-center p-5">
              {
                OTPVerified ?
                ( <p onClick={()=>setPayablePage(true)} className="text-xl bg-green-700 p-2 rounded-xl text-white px-5 font-semibold hover:bg-green-900 cursor-pointer transition duration-300">Procee for payment</p> )
                :
                null
              }
            </div>
          </>
        )
      }
      </div>
      <div className="flex flex-col gap-1 border-[2px] border-gray-300 bg-gray-100 rounded-md p-2 relative" style={{ boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.1), 0px -3px 5px rgba(0, 0, 0, 0.1), 3px 0px 5px rgba(0, 0, 0, 0.1), -3px 0px 5px rgba(0, 0, 0, 0.1)"}}>
        <div className="flex justify-between">
          <div className="flex flex-col p-2 gap-2">
            <h1 className="text-3xl font-semibold">{hotelData.hotelName}</h1>
            <p className="font-semibold text-gray-500">
              {hotelData.address}{", "}{hotelData.city}{", "}{hotelData.state}{", "}{hotelData.country}
            </p>
          </div>
          <div className="flex p-3">
          {
            hotelData && hotelData.imageURLs && 
            (
              <img src={hotelData.imageURLs[4]} alt="" className="w-28 h-24 rounded-md" />   
            )
          }
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex gap-3 p-2 items-center cursor-pointer" onClick={() => setShowCalendar((prev) => !prev)}>
            <FaCalendarAlt className="text-2xl" />
            <p className="text-lg font-semibold">
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
          <div className="flex flex-col gap-3 p-2 items-center relative">
            <p className="border-2 border-gray-400 bg-gray-200 p-1 rounded-md text-center cursor-pointer w-32" onClick={()=>setSelectRoomType(true)}>{bookingFormData.roomType === "" ? "Select Type" : bookingFormData.roomType} ⬇</p>
            {
              selectRoomType ? 
              (
                <div className="border-2 border-gray-200 absolute top-12 w-24 bg-white flex flex-col gap-1 z-10">
                  <span className="p-1 text-black bg-white hover:text-white hover:bg-blue-700 cursor-pointer" onClick={()=>getRoomType("Flat")}>Flat</span>
                  <hr className="w-full h-[2px] bg-black" />
                  <span className="p-1 text-black bg-white hover:text-white hover:bg-blue-700 cursor-pointer" onClick={()=>getRoomType("Room")}>Room</span>
                </div>
              )
              :
              null
            }
          </div>
        </div>
        {
          showCalendar ?
          (
            <div className="absolute top-48 left-4 w-72">
              <Calendar onChange={(newDate) => handleDateChange(newDate)} value={date} minDate={new Date(currentDate.setDate(currentDate.getDate() + 1))}/>
            </div>
          )
          :
          null
        }
        <div className="flex justify-between p-1">
          <p className="text-xl p-1">{bookingFormData.roomType} Standard</p>
          {
            roomData && bookingFormData.roomType &&
            (
              <div className="grid grid-cols-2 gap-5">
                {
                  roomData.filter(item => item.roomType === bookingFormData.roomType).map((item) => (
                    <div className="flex gap-1 items-center" key={item._id}>
                      <input type="radio" name="roomStandard" className="w-4 h-4 cursor-pointer" onChange={inputChangeStandard} value={item.roomStandard} checked={bookingFormData.roomStandard === item.roomStandard} />
                      <p className="text-lg font-normal cursor-pointer">{item.roomStandard}</p>
                    </div>
                  ))
                }
              </div>
            )
          }
        </div>
        <div className="flex flex-col sm:flex-row justify-between p-3 gap-3 sm:gap-0">
          <div className="flex gap-1 border-[2px] border-gray-400 rounded-md items-center sm:w-auto w-52 sm:mx-0 mx-auto sm:pl-0 pl-3">
            <FaMinus className="p-1 text-xl text-red-700 cursor-pointer" onClick={() => {if (bookingFormData.numberOfGuests > 1) {setBookingFormData((prev) => ({...prev, numberOfGuests: prev.numberOfGuests - 1}));}}} />
            <div className="border-l-2 border-gray-400 h-full"></div>
            <p className="p-1 px-2 text-center text-black text-xl w-28">{bookingFormData.numberOfGuests === 1 ? "Guest" : "Guests"} {bookingFormData.numberOfGuests}</p>
            <div className="border-l-2 border-gray-400 h-full"></div>
            <FaPlus className="p-1 text-xl text-green-700 cursor-pointer" onClick={() => setBookingFormData((prev) => ({...prev, numberOfGuests: prev.numberOfGuests + 1}))} />
          </div>
          {
            bookingFormData.roomType === "Room" ?
            (
              <div className="flex gap-1 border-[2px] border-gray-400 rounded-md items-center sm:w-auto w-52 sm:mx-0 mx-auto sm:pl-0 pl-3">
                <FaMinus className="p-1 text-xl text-red-700 cursor-pointer" onClick={() => {if (bookingFormData.numberOfRooms > 1) {setBookingFormData((prev) => ({...prev, numberOfRooms: prev.numberOfRooms - 1}));}}} />
                <div className="border-l-2 border-gray-400 h-full"></div>
                <p className="p-1 px-2 text-center text-black text-xl w-28">{bookingFormData.numberOfRooms === 1 ? "Room" : "Rooms"} {bookingFormData.numberOfRooms}</p>
                <div className="border-l-2 border-gray-400 h-full"></div>
                <FaPlus className="p-1 text-xl text-green-700 cursor-pointer" onClick={() => setBookingFormData((prev) => ({...prev, numberOfRooms: prev.numberOfRooms + 1}))} />
              </div>
            )
            :
            null
          }
        </div>
        <div className="flex justify-between p-3">
          <p className="text-lg">Number of Nights</p>
          <input type="number" name="numberOfNights" onChange={inputNumberOfGuestsHandler} value={bookingFormData.numberOfNights} className="p-1 px-3 outline-none border-none rounded-md sm:w-auto w-24" min="1" />
        </div>
        <div className="flex justify-between p-3">
          {
            bookingFormData.roomType && bookingFormData.roomStandard && 
            (
              <>
                <p className="text-lg font-semibold">
                  Price for {bookingFormData.numberOfNights} {bookingFormData.numberOfNights === 1 ? "Night" : "Nights"} X {" "}
                  {bookingFormData.numberOfGuests} {bookingFormData.numberOfGuests === 1 ? "Guest" : "Guests"} {" "}
                  {bookingFormData.roomType === "Room" && (
                    <> 
                      X {bookingFormData.numberOfRooms} {bookingFormData.numberOfRooms === 1 ? "Room" : "Rooms"}
                    </>
                  )}
                </p>
                <p className="text-lg font-semibold">₹ {bookingFormData.totalAmount}</p>
              </>
            )
          }
        </div>
        <div className="flex justify-between p-3">
          {
            bookingFormData.roomType && bookingFormData.roomStandard && 
            (
              <>
                <p className="text-lg font-semibold text-red-700">Instant Discount offer</p>
                <p className="text-lg font-semibold text-red-700">- ₹ {bookingFormData.totalAmount*(20/100)}</p>
              </>
            )
          }
        </div>
        {bookingFormData.roomType && bookingFormData.roomStandard &&  ( <hr className="bg-black w-full h-[2px]" /> )}
        <div className="flex justify-between p-3">
          {
            bookingFormData.roomType && bookingFormData.roomStandard && 
            (
              <>
                <p className="text-2xl font-semibold text-green-700">Payable Amount</p>
                <p className="text-2xl font-semibold text-green-700">₹ {bookingFormData.totalAmount - (bookingFormData.totalAmount*(20/100))}</p>
              </>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default BookHotel;
