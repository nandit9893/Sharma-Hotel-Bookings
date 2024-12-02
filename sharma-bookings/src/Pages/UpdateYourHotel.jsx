import React, { useEffect, useState } from "react";
import URL from "../assets/URL.js";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const UpdateYourHotel = () => {
  const {hotelID} = useParams();
  const [nearByPlacesOfHotel, setNearByPlacesOfHotel] = useState([]);
  const [newUpdatedNearByPlacesOfHotel, setNewUpdatedNearByPlacesOfHotel] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
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
  const [uploading, setUploading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageData, setImageData] = useState([]);
  const [result, setResult] = useState("");

  useEffect(() =>{
    const initializeHotelData = async() =>{
      const newURL = `${URL}/sharma/resident/stays/hotel/data/get/specific/${hotelID}`;
      try {
        setLoading(true);
        const response = await axios.get(newURL);
        if(response.data.success) {
          console.log(response.data.data);
          setData({
            hotelName: response.data.data.hotelName || "",
            address: response.data.data.address || "",
            country: response.data.data.country || "",
            state: response.data.data.state || "",
            city: response.data.data.city || "",
            pinCode: response.data.data.pinCode || "",
            description: response.data.data.description || "",
            imageURLs: response.data.data.imageURLs || "",
            phoneNumber: response.data.data.phoneNumber || "",
            amenities: response.data.data.amenities || "",
            checkInTime: response.data.data.checkInTime || "",
            checkOutTime: response.data.data.checkOutTime || "",
            startingPrice: response.data.data.startingPrice || "",
            restaurants: response.data.data.restaurants || "",
            cinemaHalls: response.data.data.cinemaHalls || "",
            famousTouristPlaces: response.data.data.famousTouristPlaces || "",
            transportationFacilities: response.data.data.transportationFacilities || "",
          });
          setError(false);
        } else if (response.data.success === false && response.data.statusCode === 404) {
          setError(true);
        }
      } catch (error) {
        setError(true);
      }
      finally {
        setLoading(false);
      }
    };
    initializeHotelData();
  }, [hotelID]);

  const handleMore = () => {
    setCounter((prevCounter) => {
      const newCounter = prevCounter + 1;
      setNearByPlacesOfHotel((prevPlaces) => [
        ...prevPlaces, { id: newCounter, nearByPlaces: "restaurants", name: "", distance: "", },
      ]);
      return newCounter;
    });
  };

  const inputChangeHandler = (event) =>{
    const { name, value } = event.target;
    setData((prev) => ({...prev, [name]: value}));
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

  const sumbitHandler = (event) => {

  };

  const handleRemove = (id) => {
    setNearByPlacesOfHotel((prevPlaces) => prevPlaces.filter((place) => place.id !== id));
  };

  const handleRemoveAllPlace = (id) => {

  };

  const editAllPlaces = (event, id) => {
    const { name, value } = event.target;
  }; 

  return (
    <div className="p-3 px-16 w-full">
      <h1 className="text-5xl text-center font-semibold my-7" style={{ fontFamily: '"Edu AU VIC WA NT Pre", cursive'}}>{data.hotelName}</h1>
      <form onSubmit={sumbitHandler} className="flex flex-col gap-4 mx-auto">
        <div className="flex gap-4">
          <div className="flex flex-col flex-1 gap-2">
            <div className="flex flex-col gap-1">
              <p className="ml-2 font-semibold text-xl">Description</p>
              <textarea name="description" id="description" value={data.description} placeholder="description" maxLength="300" minLength="50"  className="border p-2 rounded-lg w-full" rows="4" onChange={inputChangeHandler} ></textarea>
            </div>
            <div className="flex flex-col gap-1">
              <p className="ml-2 font-semibold text-xl">ADDRESS</p>
              <input name="address" id="address" value={data.address} placeholder="address" minLength="20" maxLength="50" type="text" className="border p-2 rounded-lg w-full" onChange={inputChangeHandler}  />
            </div>
            <div className="flex flex-col gap-1">
              <p className="ml-2 font-semibold text-xl">COUNTRY</p>
              <input name="country" id="country" value={data.country} placeholder="country"  type="text" className="border p-2 rounded-lg w-full" onChange={inputChangeHandler} /> 
            </div>
            <div className="flex flex-col gap-1">
              <p className="ml-2 font-semibold text-xl">STATE</p>
              <input name="state" id="state" value={data.state} placeholder="state" type="text" className="border p-2 rounded-lg w-full" onChange={inputChangeHandler} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="ml-2 font-semibold text-xl">CITY</p>
              <input name="city" id="city" value={data.city} placeholder="city"  type="text" className="border p-2 rounded-lg w-full" onChange={inputChangeHandler} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="ml-2 font-semibold text-xl">PINCODE</p>
              <input name="pinCode" id="pinCode" value={data.pinCode} placeholder="pincode"  type="number" className="border p-2 rounded-lg w-full" onChange={inputChangeHandler} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="ml-2 font-semibold text-xl">PHONE NUMBER</p>
              <input name="phoneNumber" id="phoneNumber" value={data.phoneNumber}  minLength="10" maxLength="10" type="number" className="border p-2 rounded-lg w-full" onChange={inputChangeHandler} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="ml-2 font-semibold text-xl">AMENITIES</p>
              <input name="amenities" id="amenities" value={data.amenities}  placeholder="enter facilities" type="text" className="border p-2 rounded-lg w-full" onChange={inputChangeHandler} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="ml-2 font-semibold text-xl">STARTING PRICE{" "}<span className="font-semibold text-gray-400 text-[15px]">( ₹ / night)</span></p>
              <input name="startingPrice" id="startingPrice" value={data.startingPrice}  placeholder="starting price" type="number" className="border p-2 rounded-lg w-full" onChange={inputChangeHandler} />
            </div>
          </div>
          <div className="flex flex-col flex-1 gap-4">
            <div className="flex justify-around gap-2">
              <div className="flex flex-col gap-1 w-full">
                <p className="text-center font-semibold text-xl">CHECK IN TIME</p>
                <input name="checkInTime" id="checkInTime" value={data.checkInTime}  type="time" className="border p-3 rounded-lg" onChange={inputChangeHandler} />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <p className="text-center font-semibold text-xl">CHECK OUT TIME</p>
                <input name="checkOutTime" id="checkOutTime" value={data.checkOutTime}  type="time" className="border p-3 rounded-lg" onChange={inputChangeHandler} />
              </div>
            </div>
            <div className="flex flex-col mt-2">
              <h2 className="text-2xl font-semibold text-center">NEARBY PLACES{" "}<span className="font-semibold text-gray-400 text-[15px]">(OPTIONAL){" "}</span><span className="text-sm">in km</span></h2>
              {
                data.restaurants && data.restaurants.length > 0 ?
                (
                  data.restaurants.map((restaurant) => (
                    <div key={restaurant._id} className="flex gap-3 mt-4 items-center justify-center">
                      <select name="nearByPlaces" id="nearByPlaces" className="border p-2 rounded-lg w-full text-xl">
                        <option value="restaurants">Restaurants</option>
                      </select>
                      <input name="name" id="name" type="text" value={restaurant.name} onChange={(event)=>editAllPlaces(event, restaurant._id)} className="text-xl border p-2 rounded-lg w-full" placeholder="Name of place" />
                      <input name="distance" id="distance" type="number" value={restaurant.distance} max="30" onChange={(event)=>editAllPlaces(event, restaurant._id)} className="text-xl border p-2 rounded-lg w-full" placeholder="Distance (in km)" />
                      <button type="button" onClick={()=>handleRemoveAllPlace(restaurant._id)} className="bg-red-500 text-white p-1 rounded-full mx-auto mt-2 w-fit text-xs"><FaMinus /></button>
                    </div>
                  ))
                )
                :
                null
              }
              {
                data.cinemaHalls && data.cinemaHalls.length > 0 ?
                (
                  data.cinemaHalls.map((cinemaHall) => (
                    <div key={cinemaHall._id} className="flex gap-3 mt-4 items-center justify-center">
                      <select name="nearByPlaces" id="nearByPlaces" className="border p-2 rounded-lg w-full text-xl">
                        <option value="cinemaHalls">Cinema Hall</option>
                      </select>
                      <input name="name" id="name" type="text" value={cinemaHall.name} onChange={(event)=>editAllPlaces(event, cinemaHall._id)} className="text-xl border p-2 rounded-lg w-full" placeholder="Name of place" />
                      <input name="distance" id="distance" type="number" value={cinemaHall.distance} max="30" onChange={(event)=>editAllPlaces(event, cinemaHall._id)} className="text-xl border p-2 rounded-lg w-full" placeholder="Distance (in km)" />
                      <button type="button" onClick={()=>handleRemoveAllPlace(cinemaHall._id)} className="bg-red-500 text-white p-1 rounded-full mx-auto mt-2 w-fit text-xs"><FaMinus /></button>
                    </div>
                  ))
                )
                :
                null
              }
              {
                data.transportationFacilities && data.transportationFacilities.length > 0 ?
                (
                  data.transportationFacilities.map((transportationFacility) => (
                    <div key={transportationFacility._id} className="flex gap-3 mt-4 items-center justify-center">
                      <select name="nearByPlaces" id="nearByPlaces" className="border p-2 rounded-lg w-full text-xl">
                        <option value="transportationFacility">Transport Facility</option>
                      </select>
                      <input name="name" id="name" type="text" value={transportationFacility.name} onChange={(event)=>editAllPlaces(event, transportationFacility._id)} className="text-xl border p-2 rounded-lg w-full" placeholder="Name of place" />
                      <input name="distance" id="distance" type="number" value={transportationFacility.distance} max="30" onChange={(event)=>editAllPlaces(event, transportationFacility._id)} className="text-xl border p-2 rounded-lg w-full" placeholder="Distance (in km)" />
                      <button type="button" onClick={()=>handleRemoveAllPlace(transportationFacility._id)} className="bg-red-500 text-white p-1 rounded-full mx-auto mt-2 w-fit text-xs"><FaMinus /></button>
                    </div>
                  ))
                )
                :
                null
              }
              {
                data.famousTouristPlaces && data.famousTouristPlaces.length > 0 ?
                (
                  data.famousTouristPlaces.map((famousTouristPlace) => (
                    <div key={famousTouristPlace._id} className="flex gap-3 mt-4 items-center justify-center">
                      <select name="nearByPlaces" id="nearByPlaces" className="border p-2 rounded-lg w-full text-xl">
                        <option value="famousTouristPlace">Tourist Place</option>
                      </select>
                      <input name="name" id="name" type="text" value={famousTouristPlace.name} onChange={(event)=>editAllPlaces(event, famousTouristPlace._id)} className="text-xl border p-2 rounded-lg w-full" placeholder="Name of place" />
                      <input name="distance" id="distance" type="number" value={famousTouristPlace.distance} max="30" onChange={(event)=>editAllPlaces(event, famousTouristPlace._id)} className="text-xl border p-2 rounded-lg w-full" placeholder="Distance (in km)" />
                      <button type="button" onClick={()=>handleRemoveAllPlace(famousTouristPlace._id)} className="bg-red-500 text-white p-1 rounded-full mx-auto mt-2 w-fit text-xs"><FaMinus /></button>
                    </div>
                  ))
                )
                :
                null
              }
              {
                nearByPlacesOfHotel.map((place) => (
                  <div key={place.id} className="flex gap-3 mt-4 items-center justify-center">
                    <select name="nearByPlaces" id="nearByPlaces" className="border p-2 rounded-lg w-full text-xl" onChange={(event)=>inputPlacesAndDistances(event, place.id)}>
                      <option value="restaurants">Restaurants</option>
                      <option value="cinemaHalls">Cinema Hall</option>
                      <option value="famousTouristPlaces">Tourist Place</option>
                      <option value="transportationFacilities">Transport Facilities</option>
                    </select>
                    <input name="name" id="name" type="text" value={place.name} onChange={(event)=>inputPlacesAndDistances(event, place.id)} className="text-xl border p-2 rounded-lg w-full" placeholder="Name of place" />
                    <input name="distance" id="distance" type="number" value={place.distance} max="30" onChange={(event)=>inputPlacesAndDistances(event, place.id)} className="text-xl border p-2 rounded-lg w-full" placeholder="Distance (in km)" />
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
          <div className="flex gap-4 mt-2">
            <input className="p-2 w-full border border-green-700 rounded" type="file" id="imageURLs" name="imageURLs" accept="image/*" multiple onChange={inputImageHandler}  />
            <button disabled={uploading} type="button" className="p-2 w-full text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80" onClick={handleImageSubmit}>{uploading ? "Uploading..." : "UPLOAD IMAGES"}</button>
          </div>
          <button disabled={loading || uploading} type="submit" className="p-3 bg-green-700 text-white text-xl rounded-lg uppercase hover:opacity-95 disabled:opacity-80">{loading ? "UPDATING" : "UPDATE HOTEL"}</button>
          {
            data && data.imageURLs.length > 0 ? 
            (
              <div className="grid grid-cols-5 gap-6 mx-auto">
                {
                  data.imageURLs.map((url, index) => (
                    <div className="relative flex gap-1" key={index}>
                      <img className="cursor-pointer w-60 rounded-lg object-cover h-52 transition-transform duration-300 ease-in-out hover:scale-105" src={url} alt={`Image ${index + 2}`} />
                      <FaTrash onClick={()=>removeImageHandler(index+1)} className="absolute top-2 right-2 text-white cursor-pointer hover:text-red-500"/>
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


export default UpdateYourHotel;
