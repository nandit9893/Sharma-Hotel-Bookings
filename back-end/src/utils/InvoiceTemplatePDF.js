const invoice_template_pdf = (
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
  totalAmount,
) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        .container {
            width: 800px;
            margin: auto;
            padding: 20px;
            background: #161697;
            height: auto;
        }
        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
        }
        .header .left {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .header .left p {
            font-size: 40px;
            font-weight: 600;
            font-family: Arial, Helvetica, sans-serif;
            color: white;
        }
        .header .left span {
            font-size: 30px;
            font-weight: 600;
            color: white;
            font-family: Arial, Helvetica, sans-serif;
        }
        .header .right img {
            border-radius: 10px;
            width: 230px;
            height: 100px;
        }
        .container .address {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 30px 0px;
        }
        .container .address-left {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        .container .address-right {
            border: 2px dotted white;
            padding: 20px;
            border-radius: 10px;
        }
        .container .address p {
            font-size: 20px;
            font-weight: 500;
            color: white;
            font-family: Arial, Helvetica, sans-serif;
        }
        .customer-details {
            margin: 30px 0px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .customer-details .customer-data, .hotel-data {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        .customer-details .customer-data p {
            font-size: 18px;
            font-family: Arial, Helvetica, sans-serif;
            font-weight: 400;
            color: white;
            text-align: left;
        }
        .customer-details .hotel-data p {
            font-size: 18px;
            font-family: Arial, Helvetica, sans-serif;
            font-weight: 400;
            color: white;
            text-align: right;
        }
        .customer-details .customer-data span {
            font-size: 30px;
            text-align: left;
            font-family: Arial, Helvetica, sans-serif;
            color: white;
        }
        .customer-details .hotel-data span {
            font-size: 30px;
            text-align: right;
            font-family: Arial, Helvetica, sans-serif;
            color: white;
        }
        hr {
            width: 100%;
            height: 2px;
            background: white;
        }
        .hotel-payment-details {
            display: flex;
            margin: 20px 0px;
            align-items: center;
            flex-direction: column;
        }
        .hotel-payment-details-top {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            width: 100%;
        }
        .hotel-payment-details-top p {
            font-size: 18px;
            font-family: Arial, Helvetica, sans-serif;
            color: white;
            padding: 10px 3px;
            text-align: center;
            border: 1px solid white;
        }
        .hotel-payment-details-top span {
            font-size: 15px;
            font-family: Arial, Helvetica, sans-serif;
            color: white;
            padding: 10px 3px;
            text-align: center;
            border: 1px solid white;
        }
        .container .grand-total {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 20px 0px;
        }
        .grand-total .booking-number {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
        }
        .grand-total .booking-number p {
            font-size: 20px;
            font-family: Arial, Helvetica, sans-serif;
            font-weight: 500;
            color: white;
        }
        .grand-total .booking-number span {
            font-size: 15px;
            border: 1px solid white;
            padding: 8px 10px;
            font-family: Arial, Helvetica, sans-serif;
            font-weight: 500;
            color: white;
        }
        .grand-total .booking-total {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
        }
        .grand-total .booking-total p {
            font-size: 20px;
            font-family: Arial, Helvetica, sans-serif;
            font-weight: 500;
            color: white;
        }
        .grand-total .booking-total span {
            font-size: 18px;
            font-family: Arial, Helvetica, sans-serif;
            font-weight: 500;
            color: white;
        }
        .booking-total .total-amount {
            display: flex;
            justify-content: space-between;
            gap: 5px;
            border: 1px solid white;
            background: white;
            border-radius: 10px;
        }
        .booking-total .total-amount p {
            font-size: 25px;
            padding: 10px;
            color: #161697;
            font-family: Arial, Helvetica, sans-serif;
            font-weight: 600;
        }
        .container .payment-status {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 40%;
        }
        .container .payment-status p {
            font-size: 18px;
            font-family: Arial, Helvetica, sans-serif;
            font-weight: 500;
            color: white;
        }
        .container .footer {
            margin-top: 50px;
        }
        .container .footer p {
            font-size: 30px;
            color: white;
            font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="left">
                <p>Sharma</p>
                <span>Residents Stay's</span>
            </div>
            <div class="right">
                <img src="https://res.cloudinary.com/dqzskp5s3/image/upload/v1732858236/iffrrmrlvkixgvtcjeeh.png" alt="Logo">
            </div>
        </div>
        <div class="address">
            <div class="address-left">
                <p>Office Address :</p>
                <p>Sector - 22</p>
                <p>Noida, 201301</p>
                <p>Uttar Pradesh, India</p>
                <p>Enquiry : +91 - 965895858686</p>
            </div>
            <div class="address-right">
                <p>Book Smart,</p>
                <p> Stay in Style</p>
            </div>
        </div>
        <hr>
        <div class="customer-details">
            <div class="customer-data">
                <span>Customer Details</span>
                <p>${customerName}</p>
                <p>Date of Booking : ${dateOfBooking}</p>
                <p>Date of Commencement : ${dateOfCommencement}</p>
            </div>
            <div class="hotel-data">
                <span>Hotel Details</span>
                <p>${hotelName}</p>
                <p>${hotelAddress}</p>
                <p>${hotelCity}, ${hotelPincode}</p>
                <p>${hotelState}, ${hotelCountry}</p>
                <p>+91 - ${hotelPhoneNumber}</p>
            </div>
        </div>
        <hr>
        <div class="hotel-payment-details">
            <div class="hotel-payment-details-top">
                <p>No. of Nights</p>
                <p>No. of Guests</p>
                <p>No. of Rooms</p>
                <p>Type</p>
                <p>Standard</p>
                <p>Ammenities</p>
                <p>Amount</p>
            </div>
            <div class="hotel-payment-details-top">
                <span>${numberOfNights}</span>
                <span>${numberOfGuests}</span>
                <span>${numberOfRooms}</span>
                <span>${roomType}</span>
                <span>${roomStandard}</span>
                <span>AC, TV, Massage</span>
                <span>₹ ${totalAmount}</span>
            </div>
        </div>
        <div class="grand-total">
            <div class="booking-number">
                <p>Receipt ID</p>
                <hr>
                <span>${newBookingID}</span>
            </div>
            <div class="booking-total">
                <p>Total Amount : <span>₹ ${totalAmount}</span> </p>
                <hr>
                <p>Discount : <span>₹ ${discountAmountFromTotalAmount}</span> </p>
                <hr>
                <div class="total-amount">
                    <p>Total:</p>
                    <p>₹ ${totalAmount - discountAmountFromTotalAmount}</p>
                </div>
            </div>
        </div>
        <div class="payment-status">
            <p>Payment Status</p>
            <p>To be paid at Hotel</p>
        </div>
        <div class="footer">
            <p>Wishing you a happy jorney, happy stay!!</p>
        </div>
    </div>
</body>
</html>`;
};

export default invoice_template_pdf;
