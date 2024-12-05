import nodemailer from "nodemailer";
import twilio from "twilio";
import OTP from "../models/otp.models.js";
import verification_Booking_OTP_Template from "../utils/SendOTPTemplate.js";

const sendVerificationToEmailAndPhone = async (req, res) => {
  const { customerEmail, customerName, customerPhoneNumber } = req.body;

  if (!customerEmail || !customerName.trim() || !customerPhoneNumber.trim()) {
    return res.status(400).json({
      success: false,
      message: "customerEmail, customerName, and phone number are required.",
    });
  }

  const verificationCode = Math.floor(100000 + Math.random() * 900000);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    port: 465,
    auth: {
      user: process.env.NODE_MAILER_USER,
      pass: process.env.NODE_MAILER_PASSWORD,
    },
  });

  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  try {
    const otpEntry = new OTP({
      otp: verificationCode,
      customerEmail,
      customerPhoneNumber,
    });
    await otpEntry.save();

    const mailOptions = {
      from: `"Sharma Resident & Stay's" <${process.env.NODE_MAILER_USER}>`,
      to: customerEmail,
      subject: "Booking Verification",
      text: `Hello ${customerName},\n\nYour booking has been initiated. This is the OTP for verification, valid for 30 seconds only:\n\n${verificationCode}\n\nPlease verify to proceed further.`,
      html: verification_Booking_OTP_Template(customerName, verificationCode),
    };

    await transporter.sendMail(mailOptions);

    await client.messages.create({
      body: `Hello ${customerName},\n\nYour booking has been initiated. This is the OTP for verification, valid for 30 seconds only:\n\n${verificationCode}\n\nPlease verify to proceed further.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: customerPhoneNumber,
    });

    return res.status(200).json({
      success: true,
      message: "Message sent successfully and OTP stored.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
};

const verifyOTPSentToPhoneOrEmail = async (req, res) => {
  const { otp, customerEmail, customerPhoneNumber } = req.body;

  if (!otp || !customerEmail || !customerPhoneNumber) {
    return res.status(400).json({
      success: false,
      message: "OTP, customerEmail, and phone number are required.",
    });
  }

  try {
    const existingOTP = await OTP.findOne({
      customerEmail,
      customerPhoneNumber,
    });
    if (!existingOTP) {
      return res.status(404).json({
        success: false,
        message: "OTP not found. Please request a new one.",
      });
    }

    const currentTime = new Date();
    if (existingOTP.expiresAt && existingOTP.expiresAt < currentTime) {
      await OTP.deleteOne({ _id: existingOTP._id });
      return res.status(410).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }
    if (existingOTP.otp === parseInt(otp)) {
      await OTP.deleteOne({ _id: existingOTP._id });
      return res.status(200).json({
        success: true,
        message: "OTP verification successful.",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP. Please try again.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export {
  sendVerificationToEmailAndPhone,
  verifyOTPSentToPhoneOrEmail,
};
