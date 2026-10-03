const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Booking = require("../models/Booking");
const Vehicle = require("../models/Vehicle");

// Create Stripe payment session
exports.createStripeSession = async (req, res) => {
  try {
    const { bookingId } = req.body;

    console.log("Creating Stripe session for booking:", bookingId);

    // Get the booking
    const booking = await Booking.findByPk(bookingId, {
      include: [{ model: Vehicle, as: "vehicle" }],
    });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    console.log("Booking found:", {
      id: booking._id,
      totalPrice: booking.totalPrice,
      vehicle: booking.vehicle?.make,
      pickupDate: booking.pickupDate,
      returnDate: booking.returnDate,
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Car Rental - ${booking.vehicle?.make || "Vehicle"} ${booking.vehicle?.model || ""}`,
              description: `Rental from ${new Date(booking.pickupDate).toLocaleDateString()} to ${new Date(booking.returnDate).toLocaleDateString()}`,
            },
            unit_amount: Math.round(booking.totalPrice * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/bookings/${booking._id}/pay`,
      metadata: {
        bookingId: booking._id.toString(),
      },
    });

    // Update booking with Stripe session ID
    booking.paymentSessionId = session.id;
    await booking.save();

    console.log("Stripe session created:", session.id);

    res.json({ url: session.url });
  } catch (error) {
    console.error("Payment error:", error);
    res
      .status(500)
      .json({ message: "Payment processing failed", error: error.message });
  }
};

// Handle Stripe webhook
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      // Update the booking status to 'paid'
      await Booking.update(
        {
          status: "Confirmed",
          paymentStatus: "Paid",
          paymentMethod: "Stripe",
          paymentDate: new Date(),
        },
        { where: { id: session.metadata.bookingId } }
      );

      // Here you might want to send a confirmation email
    } catch (error) {
      console.error("Error updating booking after payment:", error);
      // Consider implementing a retry mechanism here
    }
  }

  res.json({ received: true });
};

// Ethiopian Payment Methods (Telebirr, CBE Birr, E-Birr)
exports.createEthiopianPayment = async (req, res) => {
  try {
    const { bookingId, paymentMethod } = req.body;

    console.log("Creating Ethiopian payment:", { bookingId, paymentMethod });

    // Get the booking
    const booking = await Booking.findByPk(bookingId, {
      include: [{ model: Vehicle, as: "vehicle" }],
    });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if booking is approved
    if (booking.verificationStatus !== "Approved") {
      return res
        .status(400)
        .json({ message: "Booking must be approved before payment" });
    }

    // Check if already paid
    if (booking.paymentStatus === "Paid") {
      return res.status(400).json({ message: "Booking already paid" });
    }

    // Validate payment method
    const validMethods = ["Telebirr", "CBE Birr", "E-Birr"];
    if (!validMethods.includes(paymentMethod)) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    // Generate payment reference
    const paymentReference = `${paymentMethod.replace(" ", "").toUpperCase()}-${Date.now()}-${booking._id.toString().slice(-6)}`;

    // Update booking with payment info
    booking.paymentMethod = paymentMethod;
    booking.paymentReference = paymentReference;
    booking.paymentStatus = "Pending"; // Will be updated to 'Paid' when confirmed

    await booking.save();

    console.log("Ethiopian payment initiated:", paymentReference);

    // In a real implementation, you would:
    // 1. Integrate with Telebirr/CBE Birr/E-Birr API
    // 2. Get payment URL or instructions
    // 3. Return payment details

    res.json({
      message: "Payment initiated successfully",
      paymentReference,
      paymentMethod,
      amount: booking.totalPrice,
      instructions: `Please complete payment via ${paymentMethod} using reference: ${paymentReference}`,
    });
  } catch (error) {
    console.error("Ethiopian payment error:", error);
    res
      .status(500)
      .json({ message: "Payment processing failed", error: error.message });
  }
};

// Confirm Ethiopian Payment (for manual confirmation by admin or webhook)
exports.confirmEthiopianPayment = async (req, res) => {
  try {
    const { paymentReference } = req.body;

    // Find booking by payment reference
    const booking = await Booking.findOne({ where: { paymentReference } });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Update payment status
    booking.paymentStatus = "Paid";
    booking.paymentDate = new Date();
    booking.status = "Confirmed";

    await booking.save();

    res.json({ message: "Payment confirmed successfully", booking });
  } catch (error) {
    console.error("Payment confirmation error:", error);
    res
      .status(500)
      .json({ message: "Failed to confirm payment", error: error.message });
  }
};
