import express from "express";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

//! Find by email instead of create
userRouter.post("/login", async (request, response) => {
  try {
    const { email, password } = request.body;
    if (!email || !password) {
      return response.status(400).send({
        message: "Both email and password are required!",
      });
    }
    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return response
        .status(400)
        .send({
          message:
            "Couldn't find your account! Please Sign Up first if you don't have an account!",
        });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .send({
          message: `Incorrect password for ${email}! Please re-check your password!`,
        });
    }
    // Create JWT
    const token = jwt.sign(
      { id: user._id, email: user.email }, // payload
      process.env.JWT_SECRET || "supersecretkey", // secret key
      { expiresIn: 30 * 24 * 60 * 60 } // token expiry
    );

    response.cookie("token", token, {
      httpOnly: true,
      secure: true, // only HTTPS in prod
      sameSite: "none", // CSRF protection
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return response.status(200).send({
      message: "Success",
      user: { id: user._id, email: user.email },
    });

  } catch (error) {
    console.log(`Error at authRoutes get:- ${error}`);
    return response.status(500).send({
      message: error.message,
    });
  }
});

userRouter.post("/signup", async (request, response) => {
  function containsSpecialChars(str) {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return specialChars.test(str);
  }
  try {
    if (!request.body.email || !request.body.password) {
      return response.status(400).send({
        message: "Both email and password are required!",
      });
    }
    const temp = await User.findOne({
      email: request.body.email,
    });
    if (temp) {
      return response.status(400).send({
        message: "Account already exists! Please login!",
      });
    }
    if (
      request.body.password.length < 9 ||
      !containsSpecialChars(request.body.password)
    ) {
      return response.status(400).send({
        message: "Password must be atleast 8 characters long, and must have 1 special character",
      });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(request.body.password, saltRounds);
    const user = await User.create({
      email: request.body.email.trim(),
      password: hashedPassword,
    });
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "supersecretkey",
      { expiresIn: 30 * 24 * 60 * 60 }
    );
    response.cookie("token", token, {
      httpOnly: true,
      secure: true, // only HTTPS in prod
      sameSite: "none", // CSRF protection
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return response.status(201).send({
      message: "Success",
      user: { id: user._id, email: user.email },
    });

  } catch (error) {
    console.log(`Error at authRoutes get:- ${error}`);
    return response.status(500).send({
      message: error.message,
    });
  }
});

userRouter.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  return res.status(200).send({ message: "Logged out" });
});

userRouter.get("/me", authMiddleware, (req, res) => {
  res.status(200).send({ user: req.user });
});

export default userRouter;
