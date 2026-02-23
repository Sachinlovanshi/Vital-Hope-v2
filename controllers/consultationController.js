import Consultation from "../models/Consultation.js";
import { v4 as uuidv4 } from "uuid";

export const createConsultation = async (req, res) => {
  try {
    const roomId = uuidv4();

    const consultation = await Consultation.create({
      patient: req.user._id,
      roomId
    });

    res.status(201).json(consultation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
