// import express from "express";
// import mongoose from "mongoose";
import captainModel from "../model/captain.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import blackListedToken from "../model/blackListedToken.js";
import { subscribeToQueue } from "../service/rabbit.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.send("Incomplete data");
    const captain = await captainModel.findOne({ email });
    if (captain) return res.send("captain already exists");
    const hashedPass = await bcrypt.hash(password, 10);

    const newCaptain = await new captainModel({
      name,
      email,
      password: hashedPass,
    }).save();
    const token = jwt.sign({ id: newCaptain._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token);

    delete newCaptain._doc.password;
    return res.json({ message: "captain created successfully", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.send("Incomplete data");
    const captain = await captainModel.findOne({ email }).select("+password");
    if (!captain) return res.send("captain does not exist");
    const isMatch = await bcrypt.compare(password, captain.password);
    if (!isMatch) return res.send("Invalid credentials");
    const token = jwt.sign({ id: captain._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token);
    delete captain._doc.password;
    return res.json({ message: "captain signed in successfully", token });
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
    return res.json({ message: "Captain logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCaptain = async (req, res) => {
  try {
    // console.log("Captain data:", req.captain);
    res.send(req.captain);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleAvailability = async (req, res) => {
  try {
    const captain = await captainModel.findById(req.captain._id);
    if (!captain) return res.send("captain does not exist");
    captain.isAvailable = !captain.isAvailable;
    await captain.save();
    return res.json({
      message: "Captain availability toggled",
      isAvailable: captain.isAvailable,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const pendingRequests = [];

//TODO: understand this part
export const waitForNewRide = async (req, res) => {
  // Set timeout for long polling (e.g., 30 seconds)
  req.setTimeout(30000, () => {
    res.status(204).end(); // No Content
  });

  // Add the response object to the pendingRequests array
  pendingRequests.push(res);
};

subscribeToQueue("new-ride", (data) => {
  const rideData = JSON.parse(data);
  // console.log("ride data got iin captain service", rideData);
  // Send the new ride data to all pending requests
  pendingRequests.forEach((res) => {
    res.json(rideData);
  });

  // Clear the pending requests
  pendingRequests.length = 0;
});
