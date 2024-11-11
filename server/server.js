// server/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import routes from "./routes/index.js";
import morgan from "morgan";
import helmet from "helmet";

dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Corrected CORS initialization
app.use(morgan("dev"));
app.use(helmet());

// Basic rate limiting
import rateLimit from "express-rate-limit";
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api", routes); // Use the routes starting with /api

// Global Error Handler (Optional)
app.use((err, req, res, next) => {
  console.error("Global error handler:", err.stack);
  res
    .status(500)
    .json({ success: false, message: "An unexpected error occurred." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
