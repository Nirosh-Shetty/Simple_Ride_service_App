import axios from "axios";
import redis from "../service/redis.js";
// import { EventEmitter } from "events";
import { subscribeToQueue } from "../service/rabbit.js";
import EventEmitter from "events";
const rideEventEmitter = new EventEmitter();
// import express from "express";
// import mongoose from "mongoose";
import userModel from "../model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import blackListedToken from "../model/blackListedToken.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.send("Incomplete data");
    const user = await userModel.findOne({ email });
    if (user) return res.send("User already exists");
    const hashedPass = await bcrypt.hash(password, 10);

    const newUser = await new userModel({
      name,
      email,
      password: hashedPass,
    }).save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token);

    delete newUser._doc.password;
    return res.json({ message: "User created successfully", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.send("Incomplete data");
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) return res.send("User does not exist");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.send("Invalid credentials");
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token);
    delete user._doc.password;
    return res.json({ message: "User signed in successfully", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const token =
      req.cookies?.token || req.headers?.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await blackListedToken.create({ token });
    res.clearCookie("token");
    return res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    // console.log("User data:", req.user);
    res.send(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRideHistory = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    console.log(userId, "this is user ID");
    const cacheKey = `ride-history:${userId}`;

    const cached = await redis.get(`ride-history:${userId}`);
    if (cached) return res.json({ rides: JSON.parse(cached), cached: true });

    console.log(process.env.BASE_URL, "this is base url");
    //TODO: pass header bellow
    const response = await axios.get(`${process.env.BASE_URL}/ride/rides`, {
      params: { userId },
    });
    const rides = response.data.rides || [];
    // Cache the result
    await redis.set(`ride-history:${userId}`, JSON.stringify(rides), "EX", 300);
    return res.json({ rides, cached: false });
  } catch (error) {
    console.log(error && error.message ? error.message : error);
    res.status(500).json({ message: error.message });
  }
};

// export const isRideAccepted = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     // Check if the user has an accepted ride
//     const ride = await rideModel.findOne({ user: userId, status: "accepted" });
//     if (ride) {
//       return res.json({ message: "Ride is accepted", ride });
//     }
//     res.json({ message: "No accepted ride found" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const isRideAccepted = async (req, res) => {
  // Long polling: wait for 'ride-accepted' event
  rideEventEmitter.once("ride-accepted", (data) => {
    res.send(data);
  });

  // Set timeout for long polling (e.g., 30 seconds)
  setTimeout(() => {
    res.status(204).send();
  }, 30000);
};

subscribeToQueue("ride-accepted", async (msg) => {
  const data = JSON.parse(msg);
  rideEventEmitter.emit("ride-accepted", data);
});
