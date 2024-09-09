import { VehicleMoveData } from "../models/Employee.js";

export const createVehicleMoveData = async (req, res) => {
  try {
    console.log('Received request to create vehicle move data:', req.body);
    const { villageNameStart, goingVillage, startReading, endReading, totalKM, purpose } = req.body;

    const newVehicleMoveData = new VehicleMoveData({
      villageNameStart,
      goingVillage,
      startReading,
      endReading,
      totalKM,
      purpose,
    });

    await newVehicleMoveData.save();

    return res.status(201).json({ message: "Vehicle move data added successfully", data: newVehicleMoveData });
  } catch (error) {
    console.error('Error creating vehicle move data:', error);
    return res.status(500).json({ message: "Error creating vehicle move data", error: error.message });
  }
};


// Controller to fetch all vehicle move data
export const getAllVehicleMoveData = async (req, res) => {
  try {
    const vehicleMoveData = await VehicleMoveData.find();
    return res.status(200).json({ message: "Vehicle move data fetched successfully", data: vehicleMoveData });
  } catch (error) {
    console.error('Error fetching vehicle move data:', error);
    return res.status(500).json({ message: "Error fetching vehicle move data", error: error.message });
  }
};
