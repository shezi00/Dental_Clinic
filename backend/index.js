import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import inquiryRoutes from "./routes/inquiryRoutes.js";
import appointmentRoutes from './routes/appointmentRoutes.js';
import authRoutes from './routes/authRoutes.js'; // 1. Added import
import dashboardRoutes from './routes/dashboardRoutes.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes); // 2. Mount auth routes
app.use('/api/appointments', appointmentRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.get("/", (req, res) => {
  res.send("Harbord Dentistry API running smoothly.");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});