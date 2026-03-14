import Hospital from "../models/Hospital.js";
import { io } from "../server.js";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";

export const registerHospital = async (req, res) => {
  try {

    const {
      name,
      address,
      latitude,
      longitude,
      totalBeds,
      icuBeds
    } = req.body;

    const hospital = await Hospital.create({
      name,
      address,
      admin: req.user._id,
      location: {
        type: "Point",
        coordinates: [
          parseFloat(longitude),
          parseFloat(latitude)
        ]
      },
      totalBeds,
      availableBeds: totalBeds,
      icuBeds
    });

    res.json(hospital);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getNearbyHospitals = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    const hospitals = await Hospital.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [
              parseFloat(longitude),
              parseFloat(latitude)
            ]
          },
          $maxDistance: 5000
        }
      }
    });

    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBeds = async (req, res) => {
  try {
    const { hospitalId, availableBeds } = req.body;

    const hospital = await Hospital.findByIdAndUpdate(
      hospitalId,
      { availableBeds },
      { new: true }
    );

    // Emit real-time update
    io.emit("bedUpdated", hospital);


    res.json(hospital);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const uploadBrochure = async (req, res) => {
  try {

    const filePath = req.file.path;

    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));

    await axios.post(
      "http://localhost:8000/upload-brochure",
      formData,
      {
        headers: formData.getHeaders()
      }
    );

    res.json({ message: "Brochure uploaded and processed" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Upload failed" });
  }
};