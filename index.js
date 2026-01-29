const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://araks-web-panel.onrender.com",
      "https://arax-web-panel.vercel.app",
      "https://arax-website-front-dpbi.vercel.app",
      "https://arax-website-front.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.options(/.*/, cors()); // ← این مهمه

app.use(express.json());

// MongoDB Connection
mongoose
  .connect(
    "mongodb+srv://xchat:Abolfazl021_@db1.6qsnqns.mongodb.net/?appName=db1",
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

// Schemas
const tourSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    images: [String],
    description: String,
    startTime: String,
    endTime: String,
    duration: String,
    price: [
      {
        currency: String,
        price: String,
      },
    ],
    priceIncluded: [String],
    category: String,
    location: String,
    groupSize: String,
  },
  { timestamps: true },
);

const staySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["hotel", "guesthouse", "hostel", "apartment"],
    },
    images: [String],
    description: String,
    starsCount: { type: Number, min: 0, max: 5, default: 0 },
    address: String,
    distanceToCenter: Number,
    square: Number,
    included: [String],
    notes: [String],
    price: [
      {
        from: Number,
        to: Number,
        currency: String,
      },
    ],
  },
  { timestamps: true },
);

const transferSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: String,
    passengers: Number,
    releaseYear: Number,
    insurance: Boolean,
    features: [String],
    pricePerKm: [
      {
        currency: String,
        price: String,
      },
    ],
  },
  { timestamps: true },
);

// Models
const Tour = mongoose.model("ToursWebsite", tourSchema);
const Stay = mongoose.model("StaysWebsite", staySchema);
const Transfer = mongoose.model("TransfersWebsite", transferSchema);

// ============== SEED DATABASE ROUTE ==============

// ============== GET ALL DATA ROUTE ==============

// Get all data (tours, stays, transfers)
app.get("/api/all", async (req, res) => {
  try {
    const tours = await Tour.find();
    const stays = await Stay.find();
    const transfers = await Transfer.find();

    res.json({
      tours,
      stays,
      transfers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============== TOUR ROUTES ==============

// Get all tours
app.get("/api/tours", async (req, res) => {
  try {
    const tours = await Tour.find();
    res.json(tours);
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: error.message });
  }
});

// Get single tour
app.get("/api/tours/:id", async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour)
      return res.status(404).json({ message: "Tour not found" });
    res.json(tour);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create tour
app.post("/api/tours", async (req, res) => {
  const tour = new Tour(req.body);
  try {
    const newTour = await tour.save();
    res.status(201).json(newTour);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update tour
app.put("/api/tours/:id", async (req, res) => {
  try {
    console.log(req.body);
    const tour = await Tour.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!tour)
      return res.status(404).json({ message: "Tour not found" });
    res.json(tour);
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log({ error });
  }
});

// Delete tour
app.delete("/api/tours/:id", async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour)
      return res.status(404).json({ message: "Tour not found" });
    res.json({ message: "Tour deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============== STAY ROUTES ==============

// Get all stays
app.get("/api/stays", async (req, res) => {
  try {
    const stays = await Stay.find();
    res.json(stays);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single stay
app.get("/api/stays/:id", async (req, res) => {
  try {
    const stay = await Stay.findById(req.params.id);
    if (!stay)
      return res.status(404).json({ message: "Stay not found" });
    res.json(stay);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create stay
app.post("/api/stays", async (req, res) => {
  const stay = new Stay(req.body);
  try {
    const newStay = await stay.save();
    res.status(201).json(newStay);
  } catch (error) {
    console.log({ error });
    res.status(400).json({ message: error.message });
  }
});

// Update stay
app.put("/api/stays/:id", async (req, res) => {
  try {
    const stay = await Stay.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!stay)
      return res.status(404).json({ message: "Stay not found" });
    res.json(stay);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete stay
app.delete("/api/stays/:id", async (req, res) => {
  try {
    const stay = await Stay.findByIdAndDelete(req.params.id);
    if (!stay)
      return res.status(404).json({ message: "Stay not found" });
    res.json({ message: "Stay deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============== TRANSFER ROUTES ==============

// Get all transfers
app.get("/api/transfers", async (req, res) => {
  try {
    const transfers = await Transfer.find();
    res.json(transfers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single transfer
app.get("/api/transfers/:id", async (req, res) => {
  try {
    const transfer = await Transfer.findById(req.params.id);
    if (!transfer)
      return res.status(404).json({ message: "Transfer not found" });
    res.json(transfer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create transfer
app.post("/api/transfers", async (req, res) => {
  const transfer = new Transfer(req.body);
  try {
    const newTransfer = await transfer.save();
    res.status(201).json(newTransfer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update transfer
app.put("/api/transfers/:id", async (req, res) => {
  try {
    const transfer = await Transfer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!transfer)
      return res.status(404).json({ message: "Transfer not found" });
    res.json(transfer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete transfer
app.delete("/api/transfers/:id", async (req, res) => {
  try {
    const transfer = await Transfer.findByIdAndDelete(req.params.id);
    if (!transfer)
      return res.status(404).json({ message: "Transfer not found" });
    res.json({ message: "Transfer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
