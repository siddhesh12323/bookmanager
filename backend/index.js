import express from "express";
import mongoose from "mongoose";
import router from "./routes/bookRoutes.js";
import userRouter from "./routes/authRoutes.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/books", router);
app.use("/users", userRouter);

// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type"],
//   })
// );

app.get("/", () => {
  console.log(`Yahallo!`);
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODBURL).then(() => { 
    console.log(`MongoDB connected!`); 
    app.listen(PORT, () => {
      console.log(`App is live on ${PORT}`);
    });
}).catch((err) => { console.log(err); })
