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
    console.log(req.user);
    const user = await userModel.findById(req.user._id);
    if (!user) return res.send("User does not exist");
    delete user._doc.password;
    return res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
