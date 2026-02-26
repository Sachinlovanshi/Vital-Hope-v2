import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["patient", "admin", "expert"],
      required: true
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    socketId: {
      type: String
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;

