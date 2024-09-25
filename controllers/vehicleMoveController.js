import { VehicleMoveData, Employee } from "../models/Employee.js";

export const createVehicleMoveData = async (req, res) => {
  try {
    console.log('Received request to create vehicle move data:', req.body);
    const { villageNameStart, goingVillage, startReading, endReading, totalKM, purpose, employeeId } = req.body;

    // Check if the employee ID is valid
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(400).json({ message: "Invalid employee ID" });
    }

    const newVehicleMoveData = new VehicleMoveData({
      villageNameStart,
      goingVillage,
      startReading,
      endReading,
      totalKM,
      purpose,
      employeeId, // Add employee ID to the data
      isEditable: true, // Set it as editable when creating a new record
    });

    await newVehicleMoveData.save();

    return res.status(201).json({ message: "Vehicle move data added successfully", data: newVehicleMoveData });
  } catch (error) {
    console.error('Error creating vehicle move data:', error);
    return res.status(500).json({ message: "Error creating vehicle move data", error: error.message });
  }
};

// For Admins: Get all vehicle move data
export const getAllVehicleMoveDataForAdmin = async (req, res) => {
  try {
    // Fetch vehicle move data and populate employee details
    const vehicleMoveData = await VehicleMoveData.find().sort({ createdAt: -1 })
      .populate({
        path: 'employeeId',
        select: 'personalDetails companyDetails', // Specify fields to include
      });

    return res.status(200).json({
      message: 'Vehicle move data fetched successfully',
      data: vehicleMoveData,
    });
  } catch (error) {
    console.error('Error fetching vehicle move data:', error);
    return res.status(500).json({
      message: 'Error fetching vehicle move data',
      error: error.message,
    });
  }
};

// For Employees: Get vehicle move data for the logged-in employee
// export const getVehicleMoveDataForEmployee = async (req, res) => {
//   try {
//     const { employeeId } = req.params; // Get employee ID from request parameters
//     if (!employeeId) return res.status(400).json({ message: "Employee ID is required" });

//     const vehicleMoveData = await VehicleMoveData.find({ employeeId });
//     return res.status(200).json({ message: "Vehicle move data fetched successfully", data: vehicleMoveData });
//   } catch (error) {
//     console.error('Error fetching vehicle move data:', error);
//     return res.status(500).json({ message: "Error fetching vehicle move data", error: error.message });
//   }
// };

export const getVehicleMoveDataForEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params; // Get employee ID from request parameters
    if (!employeeId) {
      return res.status(400).json({ message: "Employee ID is required" });
    }

    // Fetch vehicle move data for the employee
    const vehicleMoveData = await VehicleMoveData.find({ employeeId }).sort({ createdAt: -1 }); // Sort by createdAt in descending order (-1);

    // Add a flag to indicate if the record is editable
    const dataWithEditStatus = vehicleMoveData.map((data) => {
      return {
        ...data.toObject(), // Convert Mongoose document to plain JavaScript object
        isEditable: !(data.goingVillage && data.endReading), // If both fields have values, it's not editable
      };
    });

    return res.status(200).json({
      message: "Vehicle move data fetched successfully",
      data: dataWithEditStatus, // Return the modified data with the edit flag
    });
  } catch (error) {
    console.error("Error fetching vehicle move data:", error);
    return res.status(500).json({ message: "Error fetching vehicle move data", error: error.message });
  }
};


// Update vehicle move data (for both admin and employees)
export const updateVehicleMoveData = async (req, res) => {
  try {
    const { id } = req.params;
    const { goingVillage, endReading } = req.body;

    // Fetch the existing record to get startReading
    const vehicleMoveData = await VehicleMoveData.findById(id);

    if (!vehicleMoveData) {
      return res.status(404).json({ message: "Vehicle move data not found" });
    }

    // Calculate totalKM if startReading and endReading are available
    let totalKM = null;
    if (vehicleMoveData.startReading && endReading) {
      totalKM = endReading - vehicleMoveData.startReading;
    }

     // Check if the record should still be editable
     const isEditable = !(goingVillage && endReading); // Disable edit if both fields are set


    // Update the vehicle move data
    const updatedVehicleMoveData = await VehicleMoveData.findByIdAndUpdate(
      id,
      { goingVillage, endReading, totalKM, isEditable }, // Update the fields
      { new: true } // Return the updated document
    );

    return res.status(200).json({ message: "Vehicle move data updated successfully", data: updatedVehicleMoveData });
  } catch (error) {
    return res.status(500).json({ message: "Error updating vehicle move data", error: error.message });
  }
};


// Delete vehicle move data
export const deleteVehicleMoveData = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedVehicleMoveData = await VehicleMoveData.findByIdAndDelete(id);

    if (!deletedVehicleMoveData) {
      return res.status(404).json({ message: "Vehicle move data not found" });
    }

    return res.status(200).json({ message: "Vehicle move data deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting vehicle move data", error: error.message });
  }
};