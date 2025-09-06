import express from "express";
import mongoose from "mongoose";
import router from "./routes/bookRoutes.js";
import userRouter from "./routes/authRoutes.js";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
dotenv.config();
import cookieParser from "cookie-parser";

const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "https://bookmanager-app.onrender.com/"
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // allow cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ This makes Express reply to preflight OPTIONS
app.options("*", cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/books", router);
app.use("/users", userRouter);
app.use("/uploads", express.static("uploads"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
  headers: true,
});

app.use(limiter);

// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type"],
//   })
// );

// This is correct
app.get("/", (req, res) => {
  console.log(`Yahallo!`);
  res.status(200).send("Server is up and running!");
});

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

mongoose
  .connect(process.env.MONGODBURL)
  .then(() => {
    console.log("✅ MongoDB connected!");
    app.listen(PORT, HOST, () => {
      console.log(`🚀 App is live on ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1); // Crash explicitly if DB fails
  });

// Extra crash/error logging
process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("💥 Unhandled Rejection at:", promise, "reason:", reason);
});

