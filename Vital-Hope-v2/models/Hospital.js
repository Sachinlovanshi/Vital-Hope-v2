import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  address: {
    type: String,
    required: true
  },

  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },

    coordinates: {
      type: [Number],
      required: true
    }
  },

  totalBeds: Number,
  availableBeds: Number,
  icuBeds: Number

});

hospitalSchema.index({ location: "2dsphere" });

export default mongoose.model("Hospital", hospitalSchema);