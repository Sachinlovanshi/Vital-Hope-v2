import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    },

    totalBeds: { type: Number, required: true },
    availableBeds: { type: Number, required: true },
    icuBeds: { type: Number, required: true },

    brochurePath: { type: String }
  },
  { timestamps: true }
);

// Geospatial index
hospitalSchema.index({ location: "2dsphere" });

const Hospital = mongoose.model("Hospital", hospitalSchema);

export default Hospital;
