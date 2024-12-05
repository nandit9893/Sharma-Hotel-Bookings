import React, { useState } from "react";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import URL from "../assets/URL.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddYourHotel = () => {
  const [nearByPlacesOfHotel, setNearByPlacesOfHotel] = useState([]);
  const [counter, setCounter] = useState(-1);
  const [data, setData] = useState({
    hotelName: "",
    address: "",
    country: "",
    state: "",
    city: "",
    pinCode: "",
    description: "",
    imageURLs: [],
    phoneNumber: "",
    amenities: [],
    checkInTime: "",
    checkOutTime: "",
    startingPrice: "",
    restaurants: [],
    cinemaHalls: [],
    famousTouristPlaces: [],
    transportationFacilities: [],
  });

  const navigate = useNavigate();
  const [imageUploadError, setImageUploadError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageData, setImageData] = useState([]);
  const [result, setResult] = useState("");

  const handleMore = () => {
    setCounter((prevCounter) => {
      const newCounter = prevCounter + 1;
      setNearByPlacesOfHotel((prevPlaces) => [
        ...prevPlaces, { id: newCounter, nearByPlaces: "restaurants", name: "", distance: "", },
      ]);
      return newCounter;
    });
  };

  const calculateRange = (distances) => {
    const validDistances = distances.filter(distance => !isNaN(distance) && distance !== null);
    const totalDistance = validDistances.reduce((sum, distance) => sum + parseFloat(distance), 0);
    return validDistances.length > 0 ? totalDistance / validDistances.length : 0;
  };
  

  const inputPlacesAndDistances = (event, id) => {
    const { name, value } = event.target;
    setNearByPlacesOfHotel((prevPlaces) => {
      const updatedPlaces = prevPlaces.map((place) => {
        if (place.id === id) {
          return { ...place, [name]: value };
        }
        return place;
      });  
      return updatedPlaces;
    });
  };

  const handleRemove = (id) => {
    setNearByPlacesOfHotel((prevPlaces) => prevPlaces.filter((place) => place.id !== id));
  };

  const inputChangeHandler = (event) =>{
    const { name, value } = event.target;
    setData((prev) => ({...prev, [name]: value}));
  };

  const inputImageHandler = (event) => {
    const files = Array.from(event.target.files);
    setSelectedImages(files);
  };

  const handleImageSubmit = (event) => {
    event.preventDefault();
    if(selectedImages.length === 0) {
      setImageUploadError("Upload images");
      setSelectedImages([]);
      return;
    } else if(selectedImages.length < 5) {
      setImageUploadError("Upload more than 5 images");
      setSelectedImages([]);
      return;
    } else if(selectedImages.length > 10) {
      setImageUploadError("Upload maximum 10 images");
      setSelectedImages([]);
      return;
    } else {
      setImageUploadError("");
    }
    setUploading(true);
    const imagePreviews = selectedImages.map((file) => window.URL.createObjectURL(file));
    setImageData(imagePreviews);
    setData((prev) => ({...prev, imageURLs: selectedImages}));
    setUploading(false);
  };

  const removeImageHandler = (index) => {
    setImageData((prev) => prev.filter((_, i) => i !== index));
    setSelectedImages((prev) => {
        const updatedImages = prev.filter((_, i) => i !== index);
        setData((prevData) => ({ ...prevData, imageURLs: updatedImages }));
        return updatedImages;
    });
  };

  const sumbitHandler = async (event) => {
    event.preventDefault();
    const distanceRangeOfNearByPlaces = nearByPlacesOfHotel.map((item) => parseFloat(item.distance)); 
    const range = calculateRange(distanceRangeOfNearByPlaces);
    const updatedRestaurants = nearByPlacesOfHotel.filter((item) => item.nearByPlaces === "restaurants").map((item) => ({ name: item.name, distance: item.distance}));
    const updatedCinemaHalls = nearByPlacesOfHotel.filter((item) => item.nearByPlaces === "cinemaHalls").map((item) => ({ name: item.name, distance: item.distance}));
    const updatedFamousTouristPlace = nearByPlacesOfHotel.filter((item) => item.nearByPlaces === "famousTouristPlaces").map((item) => ({ name: item.name, distance: item.distance}));
    const updatedTransportationFacilities = nearByPlacesOfHotel.filter((item) => item.nearByPlaces === "transportationFacilities").map((item) => ({ name: item.name, distance: item.distance}));
    const formData = new FormData();
    if(data.hotelName) {
      formData.append("hotelName", data.hotelName);
    }
    if(data.address) {
      formData.append("address", data.address);
    }
    if(data.country) {
      formData.append("country", data.country);
    }
    if(data.state) {
      formData.append("state", data.state);
    }
    if(data.city) {
      formData.append("city", data.city);
    }
    if(data.pinCode) {
      formData.append("pinCode", data.pinCode);
    }
    if(data.description) {
      formData.append("description", data.description);
    }
    if(data.phoneNumber) {
      formData.append("phoneNumber", data.phoneNumber);
    }
    if(data.amenities) {
      formData.append("amenities", data.amenities);
    }
    if(data.checkInTime) {
      formData.append("checkInTime", data.checkInTime);
    }
    if(data.checkOutTime) {
      formData.append("checkOutTime", data.checkOutTime);
    }
    if(data.startingPrice) {
      formData.append("startingPrice", data.startingPrice);
    }
    for(const [key, value] of Object.entries(data)){
      if(key === "imageURLs") {
        value.forEach((image) => {
          formData.append("imageURLs", image);
        });
      }
    }
    if(range !== 0) {
      formData.append("range", range);
    }
    if (updatedRestaurants.length > 0) {
      formData.append("restaurants", JSON.stringify(updatedRestaurants));
    }
    if (updatedCinemaHalls.length > 0) {
      formData.append("cinemaHalls", JSON.stringify(updatedCinemaHalls));
    }
    if (updatedFamousTouristPlace.length > 0) {
      formData.append("famousTouristPlaces", JSON.stringify(updatedFamousTouristPlace));
    }
    if (updatedTransportationFacilities.length > 0) {
      formData.append("transportationFacilities", JSON.stringify(updatedTransportationFacilities));
    }    
    const newURL = `${URL}/sharma/resident/stays/hotel/data/create/hotel`;
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(newURL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLoading(false);
      if(response.data.success) {
        setResult(response.data.message);
        setData({
          hotelName: "",
          address: "",
          country: "",
          state: "",
          city: "",
          pinCode: "",
          description: "",
          imageURLs: [],
          phoneNumber: "",
          amenities: [],
          checkInTime: "",
          checkOutTime: "",
          startingPrice: "",
          restaurants: [],
          cinemaHalls: [],
          famousTouristPlaces: [],
          transportationFacilities: [],
        });
        navigate(`/view-hotel/${response.data.data._id}`)
      } else if(response.data.success === false) {
        setResult(response.data.message);
      }
    } catch (error) {
      setResult(error.response.data.message);
    }
    setLoading(false);
  };

  return (
    <div className="p-3 sm:px-16 px-3 w-full">
      <h1 className="text-4xl text-center font-semibold my-7" style={{ fontFamily: '"Edu AU VIC WA NT Pre", cursive'}}>ADD HOTEL</h1>
      <form onSubmit={sumbitHandler} className="flex flex-col gap-4 mx-auto">
        <div className="flex gap-4 sm:flex-row flex-col">
          <div className="flex flex-col flex-1 gap-2">
            <div className="flex flex-col gap-1">
              <p className="ml-2 font-semibold text-xl">NAME OF THE HOTEL</p>
              <input name="hotelName" id="name" value={data.hotelName} placeholder="hotel name" type="text" className="border p-2 rounded-lg w-full" maxLength="60" minLength="10" onChange={inputChangeHandler} required />
            </div>
            <div className="flex flex-col gap-1">
              <p className="ml-2 font-semibold text-xl">Description</p>
              <textarea name="description" id="description" value={data.description} placeholder="description" maxLength="300" minLength="50"  className="border p-2 rounded-lg w-full" rows="4" onChange={inputChangeHandler} required></textarea>
            </div>
            <div className="flex flex-col gap-1">
              <p className="ml-2 font-semibold text-xl">ADDRESS</p>
              <input name="address" id="address" value={data.address} placeholder="address" minLength="20" maxLength="50" type="text" className="border p-2 rounded-lg w-full" onChange={inputChangeHandler} required />
            </div>
            <div className="flex flex-col gap-1">
              <p className="ml-2 font-semibold text-xl">COUNTRY</p>
              <input name="country" id="country" value={data.country} placeholder="country" required type="text" className="border p-2 rounded-lg w-full" onChange={inputChangeHandler} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="ml-2 font-semibold text-xl">STATE</p>
              <input name="state" id="state" value={data.state} placeholder="state" type="text" className="border p-2 rounded-lg w-full" onChange={inputChangeHandler} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="ml-2 font-semibold text-xl">CITY</p>
              <input name="city" id="city" value={data.city} placeholder="city" required type="text" className="border p-2 rounded-lg w-full" onChange={inputChangeHandler} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="ml-2 font-semibold text-xl">PINCODE</p>
              <input name="pinCode" id="pinCode" value={data.pinCode} placeholder="pincode" required type="number" className="border p-2 rounded-lg w-full" onChange={inputChangeHandler} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="ml-2 font-semibold text-xl">PHONE NUMBER</p>
              <input name="phoneNumber" id="phoneNumber" value={data.phoneNumber} required minLength="10" maxLength="10" type="number" className="border p-2 rounded-lg w-full" onChange={inputChangeHandler} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="ml-2 font-semibold text-xl">AMENITIES</p>
              <input name="amenities" id="amenities" value={data.amenities} required placeholder="enter facilities" type="text" className="border p-2 rounded-lg w-full" onChange={inputChangeHandler} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="ml-2 font-semibold text-xl">STARTING PRICE{" "}<span className="font-semibold text-gray-400">( ₹ / night)</span></p>
              <input name="startingPrice" id="startingPrice" value={data.startingPrice} required placeholder="starting price" type="number" className="border p-2 rounded-lg w-full" onChange={inputChangeHandler} />
            </div>
          </div>
          <div className="flex flex-col flex-1 gap-4">
            <div className="flex justify-around gap-2">
              <div className="flex flex-col gap-1 w-full">
                <p className="text-center font-semibold text-xl">CHECK IN TIME</p>
                <input name="checkInTime" id="checkInTime" value={data.checkInTime} required type="time" className="border p-3 rounded-lg" onChange={inputChangeHandler} />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <p className="text-center font-semibold text-xl">CHECK OUT TIME</p>
                <input name="checkOutTime" id="checkOutTime" value={data.checkOutTime} required type="time" className="border p-3 rounded-lg" onChange={inputChangeHandler} />
              </div>
            </div>
            <div className="flex flex-col mt-2">
              <h2 className="text-2xl font-semibold text-center">NEARBY PLACES{" "}<span className="font-semibold text-gray-400">(OPTIONAL)</span><span className="text-sm">in km</span></h2>
              {
                nearByPlacesOfHotel.map((place) => (
                  <div key={place.id} className="flex gap-3 mt-4 items-center justify-center">
                    <select name="nearByPlaces" id="nearByPlaces" className="border p-2 rounded-lg sm:w-96 w-36 sm:text-xl text-lg" onChange={(event)=>inputPlacesAndDistances(event, place.id)}>
                      <option value="restaurants">Restaurant</option>
                      <option value="cinemaHalls">Cinema Hall</option>
                      <option value="famousTouristPlaces">Tourist Place</option>
                      <option value="transportationFacilities">Transport Facility</option>
                    </select>
                    <input name="name" id="name" type="text" value={place.name} onChange={(event)=>inputPlacesAndDistances(event, place.id)} className="sm:text-xl text-lg border p-2 rounded-lg w-full" placeholder="Name of place" />
                    <input name="distance" id="distance" type="number" value={place.distance} max="30" onChange={(event)=>inputPlacesAndDistances(event, place.id)} className="sm:text-xl text-lg border p-2 rounded-lg sm:w-20 w-14" placeholder="Distance (in km)" />
                    <button type="button" onClick={()=>handleRemove(place.id)} className="bg-red-500 text-white p-1 rounded-full mx-auto mt-2 w-fit"><FaMinus /></button>
                  </div>
                ))
              }
              <div onClick={handleMore} className="p-2 rounded-lg flex gap-1 w-28 items-center cursor-pointer mt-2 mx-auto justify-center">
                <p className="text-xl text-blue-500 font-bold">Add</p>
                <FaPlus className="bg-blue-600 text-white text-xl rounded-full w-fit p-1 self-center" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2">
            <input className="p-2 w-full border border-green-700 rounded" type="file" id="imageURLs" name="imageURLs" accept="image/*" multiple onChange={inputImageHandler} required />
            <button disabled={uploading} type="button" className="p-2 w-full text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80" onClick={handleImageSubmit}>{uploading ? "Uploading..." : "UPLOAD IMAGES"}</button>
          </div>
          <button disabled={loading || uploading} type="submit" className="p-3 bg-green-700 text-white text-xl rounded-lg uppercase hover:opacity-95 disabled:opacity-80">{loading ? "ADDING" : "ADD HOTEL"}</button>
          {
            imageData.length > 0 ? 
            (
              <div className="grid sm:grid-cols-5 grid-cols-2 gap-6 mx-auto">
                {
                  imageData.map((url, index) => (
                    <div className="relative flex gap-1" key={index}>
                      <img className="cursor-pointer sm:w-60 w-48 rounded-lg object-cover sm:h-52 h-44 transition-transform duration-300 ease-in-out hover:scale-105" src={url} alt={`Image ${index + 2}`} />
                      <FaTrash onClick={()=>removeImageHandler(index+1)} className="absolute top-2 right-2 text-white cursor-pointer hover:text-red-800"/>
                    </div>
                  ))
                }
              </div>
            ) 
            : 
            (
              <div className="flex justify-center items-center">
                  <p className="flex items-center font-semibold text-xl">No images uploaded yet.</p>
              </div>
            )
          }
          {
            result ? 
            ( <p className="text-green-600 text-xl text-center font-semibold">{result}</p> )
            : 
            ( <p className="text-red-600 text-xl text-center font-semibold">{imageUploadError ? imageUploadError : ""}</p>  )
          }
        </div>
      </form>
    </div>
  );
};

export default AddYourHotel;
