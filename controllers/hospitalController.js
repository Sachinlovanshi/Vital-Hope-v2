import Hospital from "../models/Hospital.js";

export const registerHospital = async (req, res) => {
  try {
    const { name, address, latitude, longitude, totalBeds, icuBeds } =
      req.body;

    const hospital = await Hospital.create({
      name,
      address,
      location: {
        type: "Point",
        coordinates: [longitude, latitude]
      },
      totalBeds,
      availableBeds: totalBeds,
      icuBeds
    });

    res.status(201).json(hospital);
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

    res.json(hospital);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
