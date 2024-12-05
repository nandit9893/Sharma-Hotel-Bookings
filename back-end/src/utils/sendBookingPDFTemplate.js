const sendBookingPDFTemplateToUser = (customerName, hotelName, newBookingID) => {
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
            width: auto;
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
            padding: 8px;
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
        .content img {
            width: 100px;
            height: 100px;
            border-radius: 10px;
        }
        .content a {
            cursor: pointer;
        }
    </style>
    </head>
    <body>
        <div class="email-body">
            <div class="logo">
                <img src="https://res.cloudinary.com/dqzskp5s3/image/upload/v1732858236/iffrrmrlvkixgvtcjeeh.png" alt="Company Logo">
            </div>
            <h2>Thankyou for booking hotel with us Sharma Resident Stay's</h2>
            <div class="content">
                <h1>Hello, ${customerName}</h1>
                <p>Your booking has completed in <strong>${hotelName}</strong>. This is this your booking invoice with <strong>Booking ID : ${newBookingID}</strong>, remember this ID.</p>
            </div>
        </div>
    </body>
    </html>`;
};

export default sendBookingPDFTemplateToUser;