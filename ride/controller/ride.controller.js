import rideModel from "../model/ride.model.js";
import { publishToQueue } from "../service/rabbit.js";

export const createRide = async (req, res, next) => {
  try {
    const { pickup, destination } = req.body;
    // console.log("User in createRide:", req.user);
    const newRide = new rideModel({
      user: req.user._id,
      pickup,
      destination,
    });
    // console.log("New Ride:", newRide);
    await newRide.save();
    publishToQueue("new-ride", JSON.stringify(newRide));
    res.send(newRide);
  } catch (error) {
    console.log("Error in createRide:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const acceptRide = async (req, res, next) => {
  const { rideId } = req.query;
  const ride = await rideModel.findById(rideId);
  if (!ride) {
    return res.status(404).json({ message: "Ride not found" });
  }
  ride.status = "accepted";
  await ride.save();
  publishToQueue("ride-accepted", JSON.stringify(ride));
  res.send(ride);
};
