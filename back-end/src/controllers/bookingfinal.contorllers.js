import Booking from "../models/booking.models.js";
import puppeteer from "puppeteer";
import invoice_template_pdf from "../utils/InvoiceTemplatePDF.js";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinaryPDF = async (fileName) => {
  try {
    if (!fileName) {
      throw new Error("File name is required");
    }
    const localFilePath = path.join(process.cwd(), "public", fileName);

    if (!fs.existsSync(localFilePath)) {
      throw new Error("File not found");
    }
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "raw",
      secure: true,
      access_mode: "public",
    });

    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    const localFilePath = path.join(process.cwd(), "public", fileName);
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    throw error;
  }
};

const roomTypeData = ["Flat", "Room"];

const bookHotel = async (req, res) => {
  const {
    hotelID,
    hotelName,
    customerPhoneNumber,
    customerEmail,
    hotelAddress,
    hotelCity,
    hotelState,
    hotelCountry,
    customerName,
    customerID,
    roomStandard,
    numberOfRooms,
    numberOfGuests,
    numberOfNights,
    roomType,
    dateOfBooking,
    hotelPincode,
    hotelPhoneNumber,
    totalAmount,
    dateOfCommencement,
  } = req.body;

  if (!hotelID) {
    return res.status(409).json({
      success: false,
      message: "Hotel ID is required",
    });
  }
  if (!hotelName.trim()) {
    return res.status(409).json({
      success: false,
      message: "Hotel Name is required",
    });
  }
  if (!customerPhoneNumber.trim()) {
    return res.status(409).json({
      success: false,
      message: "Customer Phone Number is required",
    });
  }
  if (!customerEmail.trim()) {
    return res.status(409).json({
      success: false,
      message: "Customer Email is required",
    });
  }
  if (!hotelAddress.trim()) {
    return res.status(409).json({
      success: false,
      message: "Hotel address is required",
    });
  }
  if (!customerName.trim()) {
    return res.status(409).json({
      success: false,
      message: "Customer Name is required",
    });
  }
  if (!customerID.trim()) {
    return res.status(409).json({
      success: false,
      message: "Customer ID is required",
    });
  }
  if (!roomStandard.trim()) {
    return res.status(409).json({
      success: false,
      message: "Room standard is required",
    });
  }
  if (!hotelCity.trim()) {
    return res.status(409).json({
      success: false,
      message: "Hotel city is required",
    });
  }
  if (!hotelState.trim()) {
    return res.status(409).json({
      success: false,
      message: "Hotel state is required",
    });
  }
  if (!hotelCountry.trim()) {
    return res.status(409).json({
      success: false,
      message: "Hotel country is required",
    });
  }

  if (!parseInt(numberOfRooms) || parseInt(numberOfRooms) <= 0) {
    return res.status(409).json({
      success: false,
      message: "Number Of Rooms is required and must be greater than 0",
    });
  }
  if (!parseInt(numberOfGuests) || parseInt(numberOfGuests) <= 0) {
    return res.status(409).json({
      success: false,
      message: "Number Of Guests is required and must be greater than 0",
    });
  }
  if (!parseInt(numberOfNights) || parseInt(numberOfNights) <= 0) {
    return res.status(409).json({
      success: false,
      message: "Number Of Nights is required and must be greater than 0",
    });
  }

  if (!roomType.trim() || !roomTypeData.includes(roomType)) {
    return res.status(400).json({
      success: false,
      message: "Room type must be Flat or Room",
    });
  }

  if (!dateOfBooking.trim()) {
    return res.status(409).json({
      success: false,
      message: "Date of booking is required",
    });
  }
  if (!dateOfCommencement.trim()) {
    return res.status(409).json({
      success: false,
      message: "Date of Commencement is required",
    });
  }
  if (!hotelPincode || hotelPincode.length < 6) {
    return res.status(409).json({
      success: false,
      message: "Hotel pin code is required and must be a valid 6-digit number",
    });
  }

  if (!hotelPhoneNumber || hotelPhoneNumber.length <= 10) {
    return res.status(409).json({
      success: false,
      message:
        "Hotel phone number is required and must be a valid 10-digit number",
    });
  }

  if (!totalAmount) {
    return res.status(409).json({
      success: false,
      message: "Total amount is required and must be greater than 0",
    });
  }

  try {
    const discountAmountFromTotalAmount = parseInt(totalAmount) * (20 / 100);

    const newBooking = await Booking.create({
      hotelID,
      hotelName,
      customerPhoneNumber: parseInt(customerPhoneNumber),
      customerEmail,
      hotelAddress,
      hotelCity,
      hotelState,
      hotelCountry,
      customerName,
      customerID,
      roomStandard,
      numberOfRooms,
      numberOfGuests,
      numberOfNights,
      roomType,
      dateOfBooking,
      dateOfCommencement,
      hotelPincode: parseInt(hotelPincode),
      hotelPhoneNumber: parseInt(hotelPhoneNumber),
      totalAmount: parseInt(totalAmount),
      discountAmount: discountAmountFromTotalAmount,
    });

    if (!newBooking) {
      return res.status(401).json({
        success: false,
        message: "Error while creating new booking",
      });
    }

    const newBookingID =
      `SRS${newBooking._id.toString().substring(0, 9)}`.toUpperCase();
    newBooking.bookingID = newBookingID;

    const invoiceHTML = invoice_template_pdf(
      customerName,
      numberOfGuests,
      numberOfNights,
      numberOfRooms,
      dateOfBooking,
      dateOfCommencement,
      hotelName,
      hotelAddress,
      hotelCity,
      hotelState,
      hotelCountry,
      hotelPincode,
      hotelPhoneNumber,
      roomType,
      roomStandard,
      discountAmountFromTotalAmount,
      newBookingID,
      totalAmount
    );

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    await page.setContent(invoiceHTML, {
      waitUntil: "networkidle0",
    });

    const pdfPath = path.join(process.cwd(), "public", `${newBookingID}.pdf`);

    await page.pdf({
      path: pdfPath,
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    const uploadPDF = await uploadOnCloudinaryPDF(`${newBookingID}.pdf`);

    newBooking.invoicePDF = uploadPDF.secure_url || uploadPDF.url;
    await newBooking.save();

    return res.status(200).json({
      success: true,
      message: "Booking created successfully",
      data: newBooking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating the Booking",
      error: error.message,
    });
  }
};

export { bookHotel };
