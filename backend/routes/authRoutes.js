import express from "express";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

const userRouter = express.Router();

//! Find by username instead of create
userRouter.post("/login", async (request, response) => {
  try {
    const { username, password } = request.body;
    if (!username || !password) {
      return response.status(400).send({
        message: "Both username and password are required!",
      });
    }
    // Find the user
    const user = await User.findOne({ username });
    if (!user) {
      return res
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
          message: `Incorrect password for ${username}! Please re-check your password!`,
        });
    }
    // Create JWT
    const token = jwt.sign(
      { id: user._id, username: user.username }, // payload
      process.env.JWT_SECRET || "supersecretkey", // secret key
      { expiresIn: 30 * 24 * 60 * 60 } // token expiry
    );
    return response.status(200).send({
      message: "Success",
      token: token,
      user: { id: user._id, username: user.username },
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
    if (!request.body.username || !request.body.password) {
      return response.status(400).send({
        message: "Both username and password are required!",
      });
    }
    const temp = await User.findOne({
      username: request.body.username,
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
      username: request.body.username.trim(),
      password: hashedPassword,
    });
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET || "supersecretkey",
      { expiresIn: 30 * 24 * 60 * 60 }
    );
    return response.status(201).send({
      message: "Success",
      token: token,
      user: { id: user._id, username: user.username },
    });
  } catch (error) {
    console.log(`Error at authRoutes get:- ${error}`);
    return response.status(500).send({
      message: error.message,
    });
  }
});

export default userRouter;
