import React, { useState } from "react";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";

const AddRoomData = () => {
  const [data, setData] = useState({
    roomType: "",
    roomStandard: "",
    size: 0,
    bedType: "",
    ammenities: "",
    pricePerNight: 0,
    numberOfRooms: 1,
    hasKitchen: false,
    furnished: false,
    hotelID: "",
    imageURLs: [],
  });

  const inputChangeHandler = (event) => {
    const { name, value, checked  } = event.target;
    if (name === "roomStandard" || name === "ammenities" || name === "size" || name === "pricePerNight") {
      setData((prev) => ({ ...prev, [name]: value }));
    } else if (name === "bedType" || name === "roomType") {
      setData((prev) => ({ ...prev, [name]: value }));
    } else if (name === "furnished" || name === "hasKitchen") {
      setData((prev) => ({ ...prev, [name]: checked }));
    }
  };

  const [imageUploadError, setImageUploadError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageData, setImageData] = useState([]);

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
    } else if(selectedImages.length > 2) {
      setImageUploadError("Upload less than or equal to two images");
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

  return (
    <div className="p-3 sm:px-16 px-3 w-full">
      <h1 className="text-4xl text-center font-semibold my-7" style={{ fontFamily: '"Edu AU VIC WA NT Pre", cursive' }}>ADD ROOM</h1>
      <form className="flex justify-around mx-auto">
        <div className="flex flex-col gap-4 p-2 max-w-2xl">
          <div className="flex gap-5 items-center">
            <p className="font-semibold text-xl whitespace-nowrap w-44">Room Standard</p>
            <input type="text" name="roomStandard" id="roomStandard" onChange={inputChangeHandler} value={data.roomStandard} placeholder="standard, luxury, economic, etc." className="p-2 rounded-md outline-none border w-80" /> 
          </div>
          <div className="flex gap-5 items-center">
            <p className="font-semibold text-xl whitespace-nowrap w-44">Ammenities</p>
            <input type="text" name="ammenities" id="ammenities" onChange={inputChangeHandler} value={data.ammenities} placeholder="TV, AC, oven, etc." className="p-2 rounded-md outline-none border w-80" />
          </div>
          <div className="flex gap-5 items-center">
            <p className="font-semibold text-xl whitespace-nowrap w-44">Room Size</p>
            <input type="number" min="0" name="size" id="size" onChange={inputChangeHandler} placeholder="e.g., 24 sqm" value={data.size} className="p-2 rounded-md outline-none border w-80" />
          </div>
          <div className="flex gap-5 items-center">
            <p className="font-semibold text-xl whitespace-nowrap w-44">Room Type</p>
            <div className="flex justify-between w-80">
              <div className="flex gap-1 items-center">
                <input type="radio" className="w-6 h-4 border cursor-pointer" name="roomType" id="roomType" value="Room" onChange={inputChangeHandler} checked={data.roomType === "Room"} />
                <span className="text-xl font-semibold">Room</span>
              </div>
              <div className="flex gap-1 items-center">
                <input type="radio" className="w-6 h-4 border cursor-pointer" name="roomType" id="roomType" value="Flat" onChange={inputChangeHandler} checked={data.roomType === "Flat"} />
                <span className="text-xl font-semibold">Apartment</span>
              </div>
            </div>
          </div>
          <div className="flex">
            <div className="flex gap-5 items-center">
              <p className="font-semibold text-xl whitespace-nowrap w-44">Price per Night</p>
              <input type="number" min="0" name="pricePerNight" id="pricePerNight" onChange={inputChangeHandler} placeholder="e.g., 24 sqm" value={data.pricePerNight} className="p-2 rounded-md outline-none border w-80" />
            </div>
          </div>
          <div className="flex gap-5 items-center">
            <p className="font-semibold text-xl whitespace-nowrap w-44">Bed Type</p>
            <div className="grid grid-cols-2 gap-4 w-80">
              <div className="flex gap-1 items-center">
                <input type="radio" className="cursor-pointer w-6 h-4 border" value="Single" name="bedType" id="bedType" onChange={inputChangeHandler} checked={data.bedType === "Single"} />
                <span className="text-xl font-semibold">Single</span>
              </div>
              <div className="flex gap-1 items-center">
                <input type="radio" className="cursor-pointer w-6 h-4 border" value="Double" name="bedType" id="bedType" onChange={inputChangeHandler} checked={data.bedType === "Double"} />
                <span className="text-xl font-semibold">Double</span>
              </div>
              <div className="flex gap-1 items-center">
                <input type="radio" className="cursor-pointer w-6 h-4 border" value="Queen" name="bedType" id="bedType" onChange={inputChangeHandler} checked={data.bedType === "Queen"} />
                <span className="text-xl font-semibold">Queen</span>
              </div>
              <div className="flex gap-1 items-center">
                <input type="radio" className="cursor-pointer w-6 h-4 border" value="King" name="bedType" id="bedType" onChange={inputChangeHandler} checked={data.bedType === "King"} />
                <span className="text-xl font-semibold">King</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-5 justify-evenly">
            {
              data.roomType === "Flat" ?
              (
                <div className="flex gap-2 bg-white items-center border-2 border-black rounded-lg w-48 justify-center">
                  <FaMinus className="text-xl text-red-600 px-1 cursor-pointer" onClick={() => {if (data.numberOfRooms > 1) {setData((prev)=>({...prev, numberOfRooms: prev.numberOfRooms - 1}))}}}/>
                  <hr className="w-[3px] h-[35px] bg-black"/>
                  <p className="text-xl font-semibold p-1 w-24 text-center">{data.numberOfRooms === 1 ? "Room" : "Rooms"}{" "}{data.numberOfRooms}</p>
                  <hr className="w-[3px] h-[35px] bg-black"/>
                  <FaPlus className="text-xl text-green-600 px-1 cursor-pointer" onClick={()=>setData((prev)=>({...prev, numberOfRooms: prev.numberOfRooms + 1}))}/>
                </div>
              )
              :
              null
            }
            <div className="flex gap-2 items-center">
              <input type="checkbox" className="w-6 h-4 border cursor-pointer" name="furnished" id="furnished" value="true" checked={data.furnished} onChange={inputChangeHandler}/>
              <span className="text-xl font-semibold">Furnished</span>
            </div>
            {
              data.roomType === "Flat" ?
              (
                <div className="flex gap-2 items-center">
                  <input type="checkbox" className="w-6 h-4 border cursor-pointer" name="hasKitchen" id="hasKitchen" value="true" checked={data.hasKitchen} onChange={inputChangeHandler}/>
                  <span className="text-xl font-semibold">Kitchen</span>
                </div>
              )
              :
              null
            }
          </div>
        </div>
        <div className="flex flex-col gap-2 p-2 max-w-2xl">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <input className="p-2 w-full border border-green-700 rounded cursor-pointer" type="file" id="imageURLs" name="imageURLs" accept="image/*" multiple required onChange={inputImageHandler} />
            <button disabled={uploading} onClick={handleImageSubmit} type="button" className="p-2 w-full text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80 text-xl">{uploading ? "Uploading" : "Upload"}</button>
          </div>
          <button disabled={loading || uploading} type="submit" className="p-3 bg-green-700 text-white text-xl rounded-lg uppercase hover:opacity-95 disabled:opacity-80">{loading ? "ADDING" : "ADD ROOM"}</button>
          {
            imageData.length > 0 ?
            (
              <div className="grid grid-cols-2 gap-2 p-5">
                {
                  imageData.map((url, index) => (
                    <div className="relative flex gap-1" key={index}>
                      <img src={url} alt="" className="w-44 h-36 rounded-lg cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105" />
                      <FaTrash className="absolute top-2 right-4 text-red-600 cursor-pointer hover:text-red-700"/>
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
        </div>
      </form>
    </div>
  );
};

export default AddRoomData;
