// controllers/bookingController.js
const Booking = require("../models/booking");
const Hosting = require("../models/hosting");
// In your backend controller
module.exports.createBooking = async (req, res) => {
  try {
    const { hostingId, propertyId, checkIn, checkOut, guests, fullname, contactno, adharno, age } = req.body;

    // Use either hostingId or propertyId
    const actualHostingId = hostingId || propertyId;
    
    console.log("Received booking request:", req.body);
    console.log("Using hosting ID:", actualHostingId);
    console.log("User ID:", req.user._id);

    // Validate required fields
    if (!actualHostingId || !checkIn || !checkOut || !guests || !fullname || !contactno || !adharno || !age) {
      console.log("Missing fields:", {
        hostingId: !actualHostingId,
        checkIn: !checkIn,
        checkOut: !checkOut,
        guests: !guests,
        fullname: !fullname,
        contactno: !contactno,
        adharno: !adharno,
        age: !age
      });
      return res.status(400).json({ error: "All fields are required" });
    }

    // Get hosting details using the actual ID
    const hosting = await Hosting.findById(actualHostingId);
    if (!hosting) {
      return res.status(404).json({ error: "Hosting not found" });
    }

    // Rest of your code remains the same...
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (checkOutDate <= checkInDate) {
      return res.status(400).json({ error: "Check-out date must be after check-in date" });
    }

    const days = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalPrice = hosting.price * days;

    // Create booking
    const booking = new Booking({
      user: req.user._id,
      fullname,
      contactno,
      adharno,
      age,
      hosting: actualHostingId, // Use the actual ID here
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      totalPrice,
    });

    await booking.save();

    res.status(201).json({
      message: "Booking created successfully",
      booking: {
        ...booking.toObject(),
        checkIn: booking.checkIn.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        checkOut: booking.checkOut.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        createdAt: booking.createdAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        updatedAt: booking.updatedAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      },
    });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ error: "Server error, please try again later" });
  }
};