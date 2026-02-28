const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes"); // optional bonus
const bookRoutes = require("./routes/bookRoutes");

const app = express();

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully ✅"))
  .catch((err) => {
    console.error("MongoDB Connection Error ❌", err);
    process.exit(1);
  });

// ================= ROUTES =================

app.use(express.static("public"));
// Book Routes (MAIN ASSIGNMENT ROUTES)
app.use("/books", bookRoutes);

// Optional Bonus Authentication Routes
app.use("/", authRoutes); 
// This gives: POST /signup , POST /login

// // Default Route
// app.get("/", (req, res) => {
//   res.send("📚 Book Library API Running...");
// });

//frontend


// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route Not Found" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});