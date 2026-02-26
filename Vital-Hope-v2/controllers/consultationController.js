import Consultation from "../models/Consultation.js";
import User from "../models/User.js";
import { io } from "../server.js";
import { v4 as uuidv4 } from "uuid";

/**
 * 🟢 Create Consultation (Patient → Auto assign expert)
 */
export const createConsultation = async (req, res) => {
  try {
    const patientId = req.user._id;

    // 1️⃣ Find first available online expert
    const expert = await User.findOne({
      role: "expert",
      isAvailable: true,
      socketId: { $ne: null }
    });

    if (!expert) {
      return res.status(404).json({
        message: "No experts available right now"
      });
    }

    // 2️⃣ Create room
    const roomId = uuidv4();

    // 3️⃣ Create consultation (pending state)
    const consultation = await Consultation.create({
      patient: patientId,
      expert: expert._id,
      roomId,
      status: "pending"
    });

    // 4️⃣ Mark expert as busy
    expert.isAvailable = false;
    await expert.save();

    // 5️⃣ Notify expert
    io.to(expert.socketId).emit("incomingCall", {
      consultationId: consultation._id,
      roomId,
      patientId
    });

    return res.status(201).json({
      consultationId: consultation._id,
      roomId,
      message: "Expert notified. Waiting for acceptance."
    });

  } catch (error) {
    console.error("Create Consultation Error:", error);
    return res.status(500).json({ error: error.message });
  }
};


/**
 * 🟢 Expert Accept Call
 */
export const acceptConsultation = async (req, res) => {
  try {
    const expertId = req.user._id;
    const { consultationId } = req.body;

    const consultation = await Consultation.findById(consultationId);

    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    // 🔒 Security Check
    if (consultation.expert.toString() !== expertId.toString()) {
      return res.status(403).json({ message: "Not authorized for this consultation" });
    }

    if (consultation.status !== "pending") {
      return res.status(400).json({ message: "Consultation not in pending state" });
    }

    consultation.status = "active";
    await consultation.save();

    const patient = await User.findById(consultation.patient);

    // Notify patient
    if (patient?.socketId) {
      io.to(patient.socketId).emit("callAccepted", {
        roomId: consultation.roomId,
        consultationId: consultation._id
      });
    }

    return res.json({ message: "Call accepted" });

  } catch (error) {
    console.error("Accept Consultation Error:", error);
    return res.status(500).json({ error: error.message });
  }
};


/**
 * 🔴 Expert Reject Call
 */
export const rejectConsultation = async (req, res) => {
  try {
    const expertId = req.user._id;
    const { consultationId } = req.body;

    const consultation = await Consultation.findById(consultationId);

    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    // 🔒 Security Check
    if (consultation.expert.toString() !== expertId.toString()) {
      return res.status(403).json({ message: "Not authorized for this consultation" });
    }

    consultation.status = "completed";
    await consultation.save();

    // Make expert available again
    await User.findByIdAndUpdate(expertId, {
      isAvailable: true
    });

    const patient = await User.findById(consultation.patient);

    if (patient?.socketId) {
      io.to(patient.socketId).emit("callRejected");
    }

    return res.json({ message: "Call rejected" });

  } catch (error) {
    console.error("Reject Consultation Error:", error);
    return res.status(500).json({ error: error.message });
  }
};


/**
 * 🔵 End Consultation (Either side can end)
 */
export const endConsultation = async (req, res) => {
  try {
    const { consultationId } = req.body;

    const consultation = await Consultation.findById(consultationId);

    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    if (consultation.status !== "active") {
      return res.status(400).json({ message: "Consultation not active" });
    }

    consultation.status = "completed";
    await consultation.save();

    // Free expert
    await User.findByIdAndUpdate(consultation.expert, {
      isAvailable: true
    });

    // Notify both sides
    const expert = await User.findById(consultation.expert);
    const patient = await User.findById(consultation.patient);

    if (expert?.socketId) {
      io.to(expert.socketId).emit("callEnded");
    }

    if (patient?.socketId) {
      io.to(patient.socketId).emit("callEnded");
    }

    return res.json({ message: "Consultation ended successfully" });

  } catch (error) {
    console.error("End Consultation Error:", error);
    return res.status(500).json({ error: error.message });
  }
};
