import mongoose from "mongoose";

const captainSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  isAvailable: {
    type: Boolean,
    default: false,
  },
});

captainSchema.index({ isAvailable: 1 });

export default mongoose.model("Captain", captainSchema);
