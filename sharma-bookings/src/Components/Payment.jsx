import React, { useState } from "react";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { FaCreditCard } from "react-icons/fa";
import upi_icon from "../assets/upi.png";
import rupay_card from "../assets/rupay_card.jpeg";
import visa_card from "../assets/visa_card.jpeg";
import master_card from "../assets/master_card.jpeg";
import banks_data from "../assets/banks.js";
import bhim_logo from "../assets/bhim_logo.jpeg";
import airtel_pay_logo from "../assets/airtel_pay_logo.png";
import bharat_pay_logo from "../assets/bharat_pay_logo.png";
import paytm_pay_logo from "../assets/paytm_pay_logo.png";
import phonepe_pay_logo from "../assets/phonepe_pay_logo.png";
import google_pay_logo from "../assets/google_pay_logo.png";
import URL from "../assets/URL.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Payment = ({ bookingFormData }) => {
    const navigate = useNavigate();
    const [paymentPlace, setPaymentPlace] = useState("hotel");
    const [payNowMethod, setPayNowMethod] = useState("card");
    const [bookingError, setBookingError] = useState("");
    const [error, setError] = useState(false);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [showCard, setShowCard] = useState(false);
    const [upiMethod, setUpiMethod] = useState(null);
    const [upiDisplay, setUpiDisplay] = useState(false);
    const [bookNow, setBookNow] = useState(false);
    const paymentOptions = [
        { id: "card", icon: <FaCreditCard className="text-lg" />, label: "Credit/Debit/ATM Cards" },
        { id: "banking", icon: <MdOutlineAccountBalanceWallet className="text-lg" />, label: "Net Banking" },
        { id: "upi", icon: <img src={upi_icon} alt="UPI" className="w-6 h-6" />, label: "Pay by any UPI app" },
    ];

    const getBoxShadow = (isSelected) => isSelected ? 
            {
                boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.1), 0px -3px 5px rgba(0, 0, 0, 0.1), 3px 0px 5px rgba(0, 0, 0, 0.1), -3px 0px 5px rgba(0, 0, 0, 0.1)",
            }
            : 
            {};

    const handleManyItem = () =>{
        setShowCard((prev)=>!prev);
    };

    const handleBookingData = async (event) => {
        event.preventDefault();        
        const newURL = `${URL}/sharma/resident/stays/hotel/booking/book/hotel`;
        console.log(bookingFormData)
        try {
            setBookingLoading(true);
            setBookNow(false);
            const token = localStorage.getItem("accessToken");
            const response = await axios.post(newURL, bookingFormData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.success) {
                navigate("/profile");
            } else {
                setError(true);
                setBookingError(response.data.data.message);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "An error occurred while booking the hotel.";
            setError(true);
            setBookingError(errorMessage);
        } finally {
            setBookingLoading(false);
        }
    };

    const changinngPaymentPlaceForNowAndHotel = () => {
        setPaymentPlace("now");
        setBookNow(false);
    };

    return (
        <div className="flex flex-col bg-white h-auto sm:h-[620px]">
            <div className="flex gap-5 bg-gray-200 text-white rounded-t-lg p-3">
                <p className="text-lg font-bold text-white bg-black p-1 px-2 rounded">1</p>
                <h1 className="text-2xl p-1 px-2 font-bold text-black">Your details</h1>
            </div>
            <div className="flex flex-col sm:flex-row justify-between my-3 p-2">
                <p className="px-3 p-1 text-xl font-medium">{bookingFormData.customerName}</p>
                <p className="px-3 p-1 text-xl font-medium">{bookingFormData.customerEmail}</p>
                <p className="px-3 p-1 text-xl font-medium">{bookingFormData.customerPhoneNumber}</p>
            </div>
            <hr className="w-full h-[2px] bg-gray-300" />
            <h1 className="text-2xl font-semibold p-3">Choose payment method</h1>
            <div className="flex flex-col sm:flex-row justify-between">
                <div className="flex flex-col">
                    <div className="flex flex-col gap-6 p-5">
                        <span onClick={() => setPaymentPlace("hotel")} className={`p-4 w-72 px-5 ${paymentPlace === "hotel" ? "text-black bg-white font-semibold" : "text-gray-500 border-2 border-gray-100 rounded-sm"} cursor-pointer text-center text-xl`} style={getBoxShadow(paymentPlace === "hotel")}>Pay at hotel</span>
                        <span onClick={changinngPaymentPlaceForNowAndHotel} className={`p-4 w-72 px-5 ${paymentPlace === "now" ? "text-black bg-white font-semibold" : "text-gray-500 border-2 border-gray-100 rounded-sm"} cursor-pointer text-center text-xl`} style={getBoxShadow(paymentPlace === "now")}>Pay now</span>
                    </div>            
                    {
                        paymentPlace === "now" &&
                        (
                            <div className="flex flex-col gap-3 mx-5">
                                {
                                    paymentOptions.map(({ id, icon, label }) => (
                                        <div key={id} className={`flex items-center ${payNowMethod === id ? "border-2 border-gray-300 rounded-md text-lg text-black" : "text-gray-400 text-xs"} gap-2 w-72 cursor-pointer`} onClick={() => setPayNowMethod(id)}>
                                            {payNowMethod === id && <hr className="w-[5px] h-full bg-red-600 rounded-t-lg rounded-b-lg" />}
                                            {icon}
                                            <p className="px-1 text-lg font-semibold p-3">{label}</p>
                                        </div>
                                    ))
                                }
                            </div>
                        )
                    }
                </div>
                <div className="flex flex-col my-2 p-2">
                    {
                        paymentPlace === "hotel"?
                        (
                            <div className="flex flex-col items-center px-2">
                                <p className="text-2xl font-semibold text-black">No need to pay today</p>
                                <div className="my-2">
                                    <p className="text-center text-gray-600">We will confirm your stay without any charge. Pay </p>
                                    <p className="text-center text-gray-600">directly at the hotel during your stay.</p>
                                </div>
                                <button disabled={bookNow} type="button" onClick={()=>setBookNow(true)} className={`p-3 px-8 ${bookNow ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"} rounded-md text-white w-full font-semibold transition duration-300`}>BOOK NOW</button>
                            </div>
                        )
                        :
                        (
                            <div className="flex flex-col border-[2px] border-gray-200 rounded-sm w-full sm:w-96">
                                {
                                    payNowMethod === "card" ?
                                    (
                                        <div className="flex justify-between items-center p-3">
                                            <FaCreditCard />
                                            <p className="text-lg">Add new card</p>
                                            <span onClick={handleManyItem} className="text-lg font-bold cursor-pointer" style={{display: "inline-block", transform: showCard ? "rotate(90deg)" : "rotate(270deg)", transition: "transform 0.3s ease" }}>{'>'}</span>
                                        </div>
                                    )
                                    :
                                    null
                                }
                                {
                                    payNowMethod === "card" && showCard ? 
                                    (
                                        <div className="p-2">
                                            <p className="text-xl font-semibold">Your card details</p>
                                            <div className="flex flex-col my-4 gap-2">
                                                <div className="border-2 border-gray-300 p-2 w-full">
                                                    <input className="px-3 text-gray-600 outline-none border-none" placeholder="Card number" />
                                                </div>
                                                <div className="border-2 border-gray-300 p-2 w-full">
                                                <input className="px-3 text-gray-600 outline-none border-none" placeholder="Card holder name" />
                                                </div>
                                                <div className="flex justify-between">
                                                    <div className="flex border-2 border-gray-300 p-1 px-2 gap-3 items-center">
                                                        <p className="text-lg font-normal text-gray-400">Valid throu</p>
                                                        <input type="number" placeholder="YYYY" className="w-16 p-1 px-4" min="1900" max="2100" />
                                                        <input type="number" placeholder="MM" className="w-16 p-1 px-2" min="1" max="12" />
                                                    </div>
                                                    <div className="flex border-2 border-gray-300 p-1">
                                                        <input type="text" placeholder="CVV"  className="w-14 outline-none border-none"/>
                                                    </div>
                                                </div>
                                                <button type="button" className="w-full bg-green-700 p-2 rounded-md text-white font-semibold text-xl my-1">Pay {bookingFormData.totalAmount && bookingFormData.totalAmount > 0 && (<span>₹ {bookingFormData.totalAmount - (bookingFormData.totalAmount*(20/100))}</span>)}</button>
                                            </div>
                                        </div>
                                    )
                                    :
                                    null
                                }
                                {
                                 payNowMethod === "card" ?
                                    (
                                        <div className="flex gap-5 items-center p-2">
                                            <p className="text-sm font-semibold">We accept</p>
                                            <img src={rupay_card} className="w-6 h-5" alt="" />
                                            <img src={visa_card} className="w-6 h-5" alt="" />
                                            <img src={master_card} className="w-6 h-5" alt="" />
                                        </div>
                                    )
                                    :
                                    null
                                }
                                {
                                    payNowMethod === "banking" ?
                                    (
                                        <div className="flex flex-col p-2 gap-2">
                                            {
                                                banks_data.map((bank) => (
                                                    <div key={bank.id} className="cursor-pointer flex flex-col gap-2">
                                                        <div className="flex gap-5 p-1">
                                                            <img src={bank.bank_logo} alt="" className="w-8 h-6" />
                                                            <p className="text-black font-semibold">{bank.bank_name}</p>
                                                        </div>
                                                        <hr className="w-full h-[2px]" />
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    )
                                    :
                                    null
                                }
                                {
                                    payNowMethod === "upi" ?
                                    (
                                        <div className="flex flex-col">
                                            <div className="flex justify-between items-center px-2">
                                                <p className="text-lg">Pay by any UPI app</p>
                                                <img src={bhim_logo} className="w-36 h-12" alt="" />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex justify-between items-center px-3">
                                                    <img src={google_pay_logo} className="w-14 h-10" alt="" />
                                                    <p className="text-black font-semibold">Google Pay</p>
                                                    <span onClick={()=>{setUpiMethod("googlepay"); setUpiDisplay((prev)=>!prev)}} className="text-lg font-bold cursor-pointer" style={{display: "inline-block", transform: upiMethod === "googlepay" && upiDisplay ? "rotate(90deg)" : "rotate(270deg)", transition: "transform 0.3s ease" }}>{'>'}</span>
                                                </div>
                                                {
                                                    upiDisplay && upiMethod === "googlepay" && 
                                                    (
                                                        <div className="flex flex-col justify-center px-20 gap-3">
                                                            <input type="text" placeholder="enter google pay number" className="border-[2px] border-gray-400 px-2 py-1 rounded-md transition duration-300 outline-none" />
                                                            <span className="p-2 bg-green-700 text-white text-center rounded-lg">Pay ₹ {bookingFormData.totalAmount && bookingFormData.totalAmount > 0 && (bookingFormData.totalAmount - ((bookingFormData.totalAmount*20)/100))}</span>
                                                        </div>
                                                    )
                                                }
                                                <hr className="w-full h-[2px]" />
                                                <div className="flex justify-between items-center px-3">
                                                    <img src={phonepe_pay_logo} className="w-14 h-10" alt="" />
                                                    <p className="text-black font-semibold">Phone Pe</p>
                                                    <span onClick={()=>{setUpiMethod("phonepe"); setUpiDisplay((prev)=>!prev)}} className="text-lg font-bold cursor-pointer" style={{display: "inline-block", transform: upiMethod === "phonepe" && upiDisplay ? "rotate(90deg)" : "rotate(270deg)", transition: "transform 0.3s ease" }}>{'>'}</span>
                                                </div>
                                                <hr className="w-full h-[2px]" />
                                                {
                                                    upiDisplay && upiMethod === "phonepe" && 
                                                    (
                                                        <div className="flex flex-col justify-center px-20 gap-3">
                                                            <input type="text" placeholder="enter phone pe number" className="border-[2px] border-gray-400 px-2 py-1 rounded-md transition duration-300 outline-none" />
                                                            <span className="p-2 bg-green-700 text-white text-center rounded-lg">Pay ₹ {bookingFormData.totalAmount && bookingFormData.totalAmount > 0 && (bookingFormData.totalAmount - ((bookingFormData.totalAmount*20)/100))}</span>
                                                        </div>
                                                    )
                                                }
                                                <div className="flex justify-between items-center px-3">
                                                    <img src={paytm_pay_logo} className="w-14 h-10" alt="" />
                                                    <p className="text-black font-semibold">Paytm</p>
                                                    <span onClick={()=>{setUpiMethod("paytm"); setUpiDisplay((prev)=>!prev)}} className="text-lg font-bold cursor-pointer" style={{display: "inline-block", transform: upiMethod === "paytm" && upiDisplay ? "rotate(90deg)" : "rotate(270deg)", transition: "transform 0.3s ease" }}>{'>'}</span>
                                                </div>
                                                <hr className="w-full h-[2px]" />
                                                {
                                                    upiDisplay && upiMethod === "paytm" && 
                                                    (
                                                        <div className="flex flex-col justify-center px-20 gap-3">
                                                            <input type="text" placeholder="enter paytm number" className="border-[2px] border-gray-400 px-2 py-1 rounded-md transition duration-300 outline-none" />
                                                            <span className="p-2 bg-green-700 text-white text-center rounded-lg">Pay ₹ {bookingFormData.totalAmount && bookingFormData.totalAmount > 0 && (bookingFormData.totalAmount - ((bookingFormData.totalAmount*20)/100))}</span>
                                                        </div>
                                                    )
                                                }
                                                <div className="flex justify-between items-center px-3">
                                                    <img src={bharat_pay_logo} className="w-14 h-10" alt="" />
                                                    <p className="text-black font-semibold">Bharat Pe</p>
                                                    <span onClick={()=>{setUpiMethod("bharatpe"); setUpiDisplay((prev)=>!prev)}} className="text-lg font-bold cursor-pointer" style={{display: "inline-block", transform: upiMethod === "bharatpe" && upiDisplay ? "rotate(90deg)" : "rotate(270deg)", transition: "transform 0.3s ease" }}>{'>'}</span>
                                                </div>
                                                <hr className="w-full h-[2px]" />
                                                {
                                                    upiDisplay && upiMethod === "bharatpe" && 
                                                    (
                                                        <div className="flex flex-col justify-center px-20 gap-3">
                                                            <input type="text" placeholder="enter bharatpe number" className="border-[2px] border-gray-400 px-2 py-1 rounded-md transition duration-300 outline-none" />
                                                            <span className="p-2 bg-green-700 text-white text-center rounded-lg">Pay ₹ {bookingFormData.totalAmount && bookingFormData.totalAmount > 0 && (bookingFormData.totalAmount - ((bookingFormData.totalAmount*20)/100))}</span>
                                                        </div>
                                                    )
                                                }
                                                <div className="flex justify-between items-center px-3">
                                                    <img src={airtel_pay_logo} className="w-14 h-10" alt="" />
                                                    <p className="text-black font-semibold">Airtel Payent's Bank</p>
                                                    <span onClick={()=>{setUpiMethod("airtelbank"); setUpiDisplay((prev)=>!prev)}} className="text-lg font-bold cursor-pointer" style={{display: "inline-block", transform: upiMethod === "airtelbank" && upiDisplay ? "rotate(90deg)" : "rotate(270deg)", transition: "transform 0.3s ease" }}>{'>'}</span>
                                                </div>
                                                {
                                                    upiDisplay && upiMethod === "airtelbank" && 
                                                    (
                                                        <div className="flex flex-col justify-center px-20 gap-3">
                                                            <input type="text" placeholder="enter airtel bank number" className="border-[2px] border-gray-400 px-2 py-1 rounded-md transition duration-300 outline-none" />
                                                            <span className="p-2 bg-green-700 text-white text-center rounded-lg">Pay ₹ {bookingFormData.totalAmount && bookingFormData.totalAmount > 0 && (bookingFormData.totalAmount - ((bookingFormData.totalAmount*20)/100))}</span>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    )
                                    :
                                    null
                                }
                            </div>
                        )
                    }
                </div>
            </div>
            {
                bookNow ?
                (
                    <div className="p-5 flex flex-col m-5 border-2 border-gray-500 gap-5 rounded-lg">
                        <div className="flex m-auto items-center">
                            <p className="text-2xl text-center font-semibold text-green-700">Please cross - check the hotel details before proceeding.</p>
                        </div>
                        <div className="flex justify-around">
                            <p onClick={()=>setBookNow(false)} className="cursor-pointer text-xl font-semibold px-3 py-2 rounded-lg hover:bg-red-500 text-white bg-red-700">Back</p>
                            <p onClick={handleBookingData} className="cursor-pointer text-xl font-semibold px-3 py-2 rounded-lg hover:bg-green-500 text-white bg-green-700">Book</p>
                        </div>
                    </div>
                )
                :
                null
            }
            {
                bookingLoading ?
                (
                    <div role="status" className="flex justify-center items-center p-5">
                        <svg aria-hidden="true" class="w-44 h-52 text-gray-200 animate-spin dark:text-gray-600 fill-green-600" viewBox="0 0 100 101" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                    </div>
                )
                :
                null
            }
            {
                error ? 
                (
                    <div className="p-5 flex justify-center items-center">
                        <p className="text-red-600 font-semibold text-3xl">{bookingError}</p>
                    </div>
                )
                :
                null
            }
        </div>
    );
};

export default Payment;
