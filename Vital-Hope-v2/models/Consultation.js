import mongoose from "mongoose";

const consultationSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    expert: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    roomId: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "active", "completed"],
      default: "pending"
    }
  },
  { timestamps: true }
);

const Consultation = mongoose.model(
  "Consultation",
  consultationSchema
);

export default Consultation;
