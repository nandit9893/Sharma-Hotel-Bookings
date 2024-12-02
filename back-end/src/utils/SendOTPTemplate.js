const verification_Booking_OTP_Template = (customerName, OTP) => {
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
        body, h1, h2, p, span {
            margin: 0;
            padding: 0;
            font-family: Arial, Helvetica, sans-serif;
        }
        body {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #f4f4f4;
            padding: 20px;
        }
        .email-body {
            border: 1px solid #ddd;
            background: #fff;
            padding: 10px;
            border-radius: 8px;
            width: 100%;
            max-width: 450px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .logo {
            display: flex;
            justify-content: center;
            margin-bottom: 20px;
        }
        .logo img {
            width: 200px;
            border-radius: 5px;
            height: auto;
        }
        h2 {
            font-size: 20px;
            color: #fff;
            background-color: #50b650;
            padding: 10px;
            text-align: center;
            border-radius: 5px;
            font-weight: 600;
        }
        .content {
            margin-top: 20px;
            text-align: center;
        }
        .content h1 {
            font-size: 22px;
            color: #333;
            margin-bottom: 10px;
        }
        .content p {
            font-size: 16px;
            color: #555;
            margin-bottom: 20px;
            line-height: 1.5;
        }
        .content span {
            display: inline-block;
            font-size: 24px;
            font-weight: 600;
            color: rgb(63, 166, 63);
            background-color: #bdefbd;
            width: 90%;
            padding: 8px 3px;
            border-radius: 5px;
            letter-spacing: 2px;
            border: 2px dashed rgb(154, 219, 154);
        }
    </style>
    </head>
    <body>
        <div class="email-body">
            <div class="logo">
                <img src="https://res.cloudinary.com/dqzskp5s3/image/upload/v1732858236/iffrrmrlvkixgvtcjeeh.png" alt="Company Logo">
            </div>
            <h2>Verify Your Booking</h2>
            <div class="content">
                <h1>Hello ${customerName},</h1>
                <p>Your booking has been initiated. This is the OTP for verification, valid for <strong>30 seconds</strong> only. Please verify to proceed further.</p>
                <span>${OTP}</span>
            </div>
        </div>
    </body>
    </html>`;
};

export default verification_Booking_OTP_Template;
