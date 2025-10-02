import express from "express";
import mongoose from "mongoose";
import userModel from "../model/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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
    return res.send("User created successfully");
  } catch (error) {
    console.error(error.message);
  }
};
