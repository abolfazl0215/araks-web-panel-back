const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://araks-web-panel.onrender.com" // اگر فرانت دیپلوی شده
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// مهم برای preflight
app.options("*", cors());
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
    pricePerKm: Number,
  },
  { timestamps: true },
);

// Models
const Tour = mongoose.model("ToursWebsite", tourSchema);
const Stay = mongoose.model("StaysWebsite", staySchema);
const Transfer = mongoose.model("TransfersWebsite", transferSchema);

// ============== SEED DATABASE ROUTE ==============

// Seed database with demo data
app.post("/api/seed", async (req, res) => {
  try {
    // Clear existing data
    await Tour.deleteMany({});
    await Stay.deleteMany({});
    await Transfer.deleteMany({});

    // Demo Tours
    const demoTours = [
      {
        name: "Lake Sevan Tour",
        images: [
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
        ],
        description:
          "An amazing full-day experience at the beautiful Lake Sevan with local food",
        startTime: "09:00",
        endTime: "18:00",
        duration: "9 hours",
        price: [
          { currency: "AMD", price: "25000" },
          { currency: "$", price: "65" },
        ],
        priceIncluded: ["Transportation", "Tour Guide", "Lunch"],
        category: "Cultural Tour",
        location: "Lake Sevan",
        groupSize: "2-6",
      },
      {
        name: "Yerevan Historical Tour",
        images: [
          "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400",
        ],
        description:
          "Exploring historical landmarks and museums of Yerevan",
        startTime: "10:00",
        endTime: "16:00",
        duration: "6 hours",
        price: [
          { currency: "AMD", price: "18000" },
          { currency: "$", price: "45" },
        ],
        priceIncluded: ["Entrance Tickets", "Professional Guide"],
        category: "Historical Tour",
        location: "Yerevan",
        groupSize: "3-8",
      },
      {
        name: "Dilijan Nature Trail",
        images: [
          "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
        ],
        description:
          "Hiking through the beautiful forests of Dilijan National Park",
        startTime: "08:00",
        endTime: "17:00",
        duration: "9 hours",
        price: [
          { currency: "AMD", price: "22000" },
          { currency: "$", price: "55" },
        ],
        priceIncluded: [
          "Transportation",
          "Tour Guide",
          "Picnic Lunch",
          "Water",
        ],
        category: "Adventure Tour",
        location: "Dilijan",
        groupSize: "2-10",
      },
      {
        name: "Geghard Monastery & Garni Temple",
        images: [
          "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
        ],
        description:
          "Visit UNESCO World Heritage site Geghard and ancient Garni Temple",
        startTime: "09:30",
        endTime: "15:30",
        duration: "6 hours",
        price: [
          { currency: "AMD", price: "20000" },
          { currency: "$", price: "50" },
        ],
        priceIncluded: [
          "Transportation",
          "Entrance Fees",
          "Guide",
          "Traditional Lunch",
        ],
        category: "Cultural Tour",
        location: "Kotayk Province",
        groupSize: "2-8",
      },
      {
        name: "Wine Tasting in Areni",
        images: [
          "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400",
        ],
        description:
          "Explore ancient wine cellars and taste authentic Armenian wines",
        startTime: "11:00",
        endTime: "18:00",
        duration: "7 hours",
        price: [
          { currency: "AMD", price: "30000" },
          { currency: "$", price: "75" },
        ],
        priceIncluded: [
          "Transportation",
          "Wine Tasting",
          "Local Snacks",
          "Guide",
        ],
        category: "Food & Wine Tour",
        location: "Areni Village",
        groupSize: "2-6",
      },
    ];

    // Demo Stays
    const demoStays = [
      {
        name: "Ararat Hotel",
        type: "hotel",
        images: [
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
        ],
        description:
          "5-star hotel in the center of Yerevan with full amenities",
        starsCount: 5,
        address: "123 Republic St, Yerevan, Armenia",
        distanceToCenter: 0.5,
        square: 35,
        included: ["Breakfast", "WiFi", "Swimming Pool", "Gym"],
        notes: ["No pets allowed", "Check-in after 14:00"],
        price: [
          { from: 80, to: 150, currency: "USD" },
          { from: 45000, to: 90000, currency: "AMD" },
        ],
      },
      {
        name: "Mountain Guesthouse",
        type: "guesthouse",
        images: [
          "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400",
        ],
        description:
          "A cozy stay in nature with a beautiful mountain view",
        starsCount: 3,
        address: "45 Mountain Rd, Kotayk, Armenia",
        distanceToCenter: 15,
        square: 50,
        included: ["Breakfast", "Parking", "Hiking Guide"],
        notes: ["Limited WiFi", "Shared bathrooms"],
        price: [
          { from: 40, to: 70, currency: "USD" },
          { from: 22000, to: 40000, currency: "AMD" },
        ],
      },
      {
        name: "Cascade Luxury Apartments",
        type: "apartment",
        images: [
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
        ],
        description:
          "Modern apartments near Cascade Complex with city views",
        starsCount: 4,
        address: "10 Tamanyan St, Yerevan, Armenia",
        distanceToCenter: 1.2,
        square: 45,
        included: ["WiFi", "Kitchen", "Balcony", "Parking"],
        notes: ["Minimum 2 nights stay", "Self check-in available"],
        price: [
          { from: 60, to: 100, currency: "USD" },
          { from: 35000, to: 60000, currency: "AMD" },
        ],
      },
      {
        name: "Sevan Lake Resort",
        type: "hotel",
        images: [
          "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400",
        ],
        description:
          "Beachfront hotel with stunning lake views and water activities",
        starsCount: 4,
        address: "Sevan Peninsula, Gegharkunik, Armenia",
        distanceToCenter: 60,
        square: 40,
        included: [
          "Breakfast",
          "Beach Access",
          "Water Sports",
          "Restaurant",
        ],
        notes: ["Seasonal operation (May-October)", "Pet-friendly"],
        price: [
          { from: 70, to: 120, currency: "USD" },
          { from: 40000, to: 70000, currency: "AMD" },
        ],
      },
      {
        name: "Old City Hostel",
        type: "hostel",
        images: [
          "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400",
        ],
        description:
          "Budget-friendly hostel in the heart of old Yerevan",
        starsCount: 2,
        address: "78 Abovyan St, Yerevan, Armenia",
        distanceToCenter: 0.8,
        square: 20,
        included: ["WiFi", "Shared Kitchen", "Common Room"],
        notes: ["Dorm and private rooms available", "24/7 reception"],
        price: [
          { from: 15, to: 35, currency: "USD" },
          { from: 8000, to: 20000, currency: "AMD" },
        ],
      },
    ];

    // Demo Transfers
    const demoTransfers = [
      {
        name: "Mercedes-Benz E-Class",
        image:
          "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400",
        passengers: 4,
        releaseYear: 2020,
        insurance: true,
        features: ["Air Conditioning", "WiFi", "USB Charger"],
        pricePerKm: 0.5,
      },
      {
        name: "Toyota Hiace Van",
        image:
          "https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=400",
        passengers: 8,
        releaseYear: 2019,
        insurance: true,
        features: [
          "Air Conditioning",
          "Spacious",
          "Comfortable Seats",
        ],
        pricePerKm: 0.4,
      },
      {
        name: "BMW 5 Series",
        image:
          "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400",
        passengers: 4,
        releaseYear: 2021,
        insurance: true,
        features: [
          "Leather Seats",
          "Premium Sound System",
          "Climate Control",
          "WiFi",
        ],
        pricePerKm: 0.6,
      },
      {
        name: "Ford Transit Minibus",
        image:
          "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400",
        passengers: 15,
        releaseYear: 2018,
        insurance: true,
        features: [
          "Air Conditioning",
          "Luggage Space",
          "Reclining Seats",
        ],
        pricePerKm: 0.35,
      },
      {
        name: "Lexus RX350",
        image:
          "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400",
        passengers: 5,
        releaseYear: 2022,
        insurance: true,
        features: [
          "Premium Interior",
          "Panoramic Roof",
          "Advanced Safety",
          "USB Ports",
        ],
        pricePerKm: 0.7,
      },
    ];

    // Insert demo data
    await Tour.insertMany(demoTours);
    await Stay.insertMany(demoStays);
    await Transfer.insertMany(demoTransfers);

    res.json({
      message: "Database seeded successfully!",
      data: {
        tours: demoTours.length,
        stays: demoStays.length,
        transfers: demoTransfers.length,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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
