import Member from '../models/Member.js';
import { Employee } from '../models/Employee.js';
import mongoose from 'mongoose';

// Controller to create a new member (Step 1)
export const createMemberStep1 = async (req, res) => {
  const { 
    employeeId, 
    FirstName, 
    LastName,
    surveyDate,
    MobileNumber, 
    Address, 
    VillageName,
    State,
    City,
    DonationAmount, 
    RasidNo 
   } = req.body;
  console.log('Received request to create member (Step 1):', req.body);
  console.log('Received id of employee to create member (Step 1):', req.body.employeeId);

  const employee = await Employee.findById(employeeId);
  if (!employee) {
    return res.status(400).json({ message: "Invalid employee ID" });
  }


  try {
    // Create new member instance for Step 1
    const member = new Member({
      employeeId,
      FirstName,
      LastName,
      surveyDate,
      MobileNumber,
      Address,
      VillageName,
      State,
      City,
      DonationAmount,
      RasidNo,
    });

    console.log('Member created:', member);
    const savedMember = await member.save();
    res.status(201).json({ message: 'Member created successfully.', member: savedMember, memberId: savedMember._id });
  } catch (error) {
    console.error('Error creating member (Step 1):', error);
    res.status(500).json({ message: 'Server error, could not create member.', error: error.message });
  }
};

// Controller to fetch member data for Step 2
export const getMemberForStep2 = async (req, res) => {
  const { id } = req.params;

  try {
    const member = await Member.findById(id);

    if (!member) {
      return res.status(404).json({ message: 'Member not found.' });
    }

    res.status(200).json(member);
  } catch (error) {
    console.error('Error fetching member for Step 2:', error);
    res.status(500).json({ message: 'Server error, could not fetch member.', error: error.message });
  }
};

// Controller to update member data for Step 2
export const updateMemberStep2 = async (req, res) => {
  const { id } = req.params;
  const {
    FamilyMembers, Occupation, Gauwansh, Tractor, TwoWheeler, FourWheeler,
    EducationRequired, searchingJob, MahilaSamuh, LoanRunning, NeedLoan,
    OtherDetails, DonationDetails, Remarks,
    // Numeric fields that need parsing
    tractorCount, twoWheelerCount, fourWheelerCount, mahilaSamuhCount, loanRunningAmount, loanRequiredAmount
  } = req.body;

  try {
    const updatedMember = await Member.findByIdAndUpdate(
      id,
      {
        FamilyMembers,
        Occupation,
        Gauwansh,
        Tractor,
        TwoWheeler,
        FourWheeler,
        EducationRequired,
        searchingJob,
        MahilaSamuh,
        LoanRunning,
        NeedLoan,
        OtherDetails,
        DonationDetails,
        // OtherDonation,
        Remarks,
        // Convert string to number if present, otherwise default to null or 0
        tractorCount: tractorCount ? parseInt(tractorCount, 10) : null,
        twoWheelerCount: twoWheelerCount ? parseInt(twoWheelerCount, 10) : null,
        fourWheelerCount: fourWheelerCount ? parseInt(fourWheelerCount, 10) : null,
        mahilaSamuhCount: mahilaSamuhCount ? parseInt(mahilaSamuhCount, 10) : null,
        loanRunningAmount: loanRunningAmount ? parseFloat(loanRunningAmount) : null,
        loanRequiredAmount: loanRequiredAmount ? parseFloat(loanRequiredAmount) : null,
      },
      { new: true, runValidators: true } // Return updated document and run validation
    );

    if (!updatedMember) {
      return res.status(404).json({ message: 'Member not found.' });
    }

    res.status(200).json({ message: 'Member updated successfully.', member: updatedMember });
  } catch (error) {
    console.error('Error updating member (Step 2):', error);
    res.status(500).json({ message: 'Server error, could not update member.', error: error.message });
  }
};


// Get all members
export const getMembers = async (req, res) => {
  try {
    // const members = await Member.find();
    const members = await Member.find()
    // .sort({ createdAt: -1 });;
    .sort({ createdAt: -1, _id: 1 })
    .populate({
      path: 'employeeId',
      select: 'personalDetails.phoneNumber personalDetails.name companyDetails.employeeId',
    });
    ;
    res.status(200).json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ message: 'Server error, could not fetch members.', error: error.message });
  }
};

// Get a single member by ID
export const getMemberById = async (req, res) => {
  const { id } = req.params;

  try {
    const member = await Member.findById(id);
    // const member = await Member.find()
    // .sort({ createdAt: -1, _id: 1 });
    // sort({ _id: -1 });
    // .sort({ createdAt: -1, _id: 1 });

    if (!member) {
      return res.status(404).json({ message: 'Member not found.' });
    }

    res.status(200).json(member);
  } catch (error) {
    console.error('Error fetching member by ID:', error);
    res.status(500).json({ message: 'Server error, could not fetch member.', error: error.message });
  }
};


// export const getTotalSurveysAndData = async (req, res) => {
//   try {
//     const result = await Member.aggregate([
//       {
//         $group: {
//           _id: null,
//           totalFamilyMembers: { $sum: { $toInt: "$FamilyMembers" } }, // Convert familyMembers to integer
//           totalMahilaSamuh: { $sum: "$mahilaSamuhCount" }, // Sum of mahilaSamuhCount
//           totalSurveys: { $sum: 1 } // Total count of documents (surveys)
//         }
//       }
//     ]);

//     if (result.length === 0) {
//       return res.status(404).json({ message: "No data found" });
//     }

//     const { totalFamilyMembers, totalMahilaSamuh, totalSurveys } = result[0];

//     res.status(200).json({
//       totalFamilyMembers,
//       totalMahilaSamuh,
//       totalSurveys
//     });
//   } catch (error) {
//     console.error("Error calculating totals:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const getTotalSurveysAndData = async (req, res) => {
  try {
    const result = await Member.aggregate([
      {
        $group: {
          _id: null,
          totalFamilyMembers: {
            $sum: {
              $cond: {
                if: { $gt: [{ $toInt: { $ifNull: ["$FamilyMembers", "0"] } }, 0] }, // Convert FamilyMembers to integer or default to 0
                then: { $toInt: "$FamilyMembers" },
                else: 0
              }
            }
          },
          totalMahilaSamuh: {
            $sum: { $ifNull: ["$mahilaSamuhCount", 0] } // Sum of mahilaSamuhCount, default to 0 if null
          },
          totalSurveys: { $sum: 1 }, // Total count of documents (surveys)
          uniqueVillageNames: {
            $addToSet: {
              $cond: {
                if: { $and: [{ $ne: ["$VillageName", null] }, { $ne: ["$VillageName", ""] }] }, // Exclude null or empty village names
                then: "$VillageName",
                else: null
              }
            }
          }
        }
      },
      {
        $project: {
          totalFamilyMembers: 1,
          totalMahilaSamuh: 1,
          totalSurveys: 1,
          totalUniqueVillages: {
            $size: {
              $filter: {
                input: "$uniqueVillageNames",
                as: "village",
                cond: { $ne: ["$$village", null] } // Count non-null unique village names
              }
            }
          }
        }
      }
    ]);

    if (result.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    const { totalFamilyMembers, totalMahilaSamuh, totalSurveys, totalUniqueVillages } = result[0];

    res.status(200).json({
      totalFamilyMembers,
      totalMahilaSamuh,
      totalSurveys,
      totalUniqueVillages // Return total unique villages
    });
  } catch (error) {
    console.error("Error calculating totals:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// export const getEmployeeSurveysAndData = async (req, res) => {
//   const { employeeId } = req.params;
//   console.log(`Received employeeId: ${employeeId}`);

//   try {
//     // Convert employeeId string to ObjectId
//     const employeeObjectId = new mongoose.Types.ObjectId(employeeId);

//     // Check if employee exists based on the employeeId
//     const member = await Member.findOne({ employeeId: employeeObjectId });
//     if (!member) {
//       console.log('No employee found with this employeeId');
//       return res.status(404).json({ message: "No employee found with this ID" });
//     }

//     console.log('Employee found:', member);

//     // Perform aggregation to calculate totals
//     const result = await Member.aggregate([
//       { $match: { employeeId: employeeObjectId } },
//       {
//         $group: {
//           _id: null,

//           // Sum FamilyMembers, ignoring non-numeric values
//           totalFamilyMembers: {
//             $sum: {
//               $cond: {
//                 if: {
//                   $regexMatch: { input: "$FamilyMembers", regex: /^[0-9]+$/ } // Only match numeric values
//                 },
//                 then: { $toInt: "$FamilyMembers" }, // Convert to integer if numeric
//                 else: 0 // Ignore non-numeric values
//               }
//             }
//           },

//           totalMahilaSamuh: {
//             $sum: { $ifNull: ["$mahilaSamuhCount", 0] }
//           },

//           totalSurveys: { $sum: 1 },

//           uniqueVillageNames: {
//             $addToSet: {
//               $cond: {
//                 if: {
//                   $and: [
//                     { $ne: ["$VillageName", null] }, 
//                     { $ne: ["$VillageName", ""] }
//                   ]
//                 },
//                 then: "$VillageName",
//                 else: null
//               }
//             }
//           }
//         }
//       },
//       {
//         $project: {
//           totalFamilyMembers: 1,
//           totalMahilaSamuh: 1,
//           totalSurveys: 1,
//           totalUniqueVillages: { 
//             $size: { 
//               $filter: { 
//                 input: "$uniqueVillageNames", 
//                 as: "village", 
//                 cond: { $ne: ["$$village", null] } 
//               } 
//             } 
//           }
//         }
//       }
//     ]);

//     if (result.length === 0) {
//       console.log('No survey data found for this employee');
//       return res.status(404).json({ message: "No data found for this employee" });
//     }

//     const { totalFamilyMembers, totalMahilaSamuh, totalSurveys, totalUniqueVillages } = result[0];

//     console.log('Total Family Members:', totalFamilyMembers);
//     console.log('Total Mahila Samuh:', totalMahilaSamuh);
//     console.log('Total Surveys:', totalSurveys);
//     console.log('Total Unique Villages:', totalUniqueVillages);

//     // Send response with calculated data
//     res.status(200).json({
//       totalFamilyMembers,
//       totalMahilaSamuh,
//       totalSurveys,
//       totalUniqueVillages
//     });
//   } catch (error) {
//     console.error("Error calculating employee totals:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const getEmployeeSurveysAndData = async (req, res) => {
  const { employeeId } = req.params;
  console.log(`Received employeeId: ${employeeId}`);

  try {
    // Convert employeeId string to ObjectId
    const employeeObjectId = new mongoose.Types.ObjectId(employeeId);

    // Check if employee exists based on the employeeId
    const member = await Member.findOne({ employeeId: employeeObjectId });
    if (!member) {
      console.log('No employee found with this employeeId');
      return res.status(404).json({ message: "No employee found with this ID" });
    }

    console.log('Employee found:', member);

    // Perform aggregation to calculate totals, handling both string and number types
    const result = await Member.aggregate([
      { $match: { employeeId: employeeObjectId } },
      {
        $group: {
          _id: null,

          // Sum FamilyMembers, handling both numeric strings and numbers
          totalFamilyMembers: {
            $sum: {
              $cond: {
                if: {
                  $or: [
                    { $regexMatch: { input: { $toString: "$FamilyMembers" }, regex: /^[0-9]+$/ } }, // Check if it's a numeric string
                    { $isNumber: "$FamilyMembers" } // Check if it's already a number
                  ]
                },
                then: { $toInt: { $toString: "$FamilyMembers" } }, // Convert to int (handles both number and numeric string)
                else: 0 // Ignore non-numeric values
              }
            }
          },

          totalMahilaSamuh: {
            $sum: { $ifNull: ["$mahilaSamuhCount", 0] }
          },

          totalSurveys: { $sum: 1 },

          uniqueVillageNames: {
            $addToSet: {
              $cond: {
                if: {
                  $and: [
                    { $ne: ["$VillageName", null] },
                    { $ne: ["$VillageName", ""] }
                  ]
                },
                then: "$VillageName",
                else: null
              }
            }
          }
        }
      },
      {
        $project: {
          totalFamilyMembers: 1,
          totalMahilaSamuh: 1,
          totalSurveys: 1,
          totalUniqueVillages: {
            $size: {
              $filter: {
                input: "$uniqueVillageNames",
                as: "village",
                cond: { $ne: ["$$village", null] }
              }
            }
          }
        }
      }
    ]);

    if (result.length === 0) {
      console.log('No survey data found for this employee');
      return res.status(404).json({ message: "No data found for this employee" });
    }

    const { totalFamilyMembers, totalMahilaSamuh, totalSurveys, totalUniqueVillages } = result[0];

    console.log('Total Family Members:', totalFamilyMembers);
    console.log('Total Mahila Samuh:', totalMahilaSamuh);
    console.log('Total Surveys:', totalSurveys);
    console.log('Total Unique Villages:', totalUniqueVillages);

    // Send response with calculated data
    res.status(200).json({
      totalFamilyMembers,
      totalMahilaSamuh,
      totalSurveys,
      totalUniqueVillages
    });
  } catch (error) {
    console.error("Error calculating employee totals:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// export const getEmployeeSurveysAndData = async (req, res) => {
//   const { employeeId } = req.params;
//   console.log(`Received employeeId: ${employeeId}`);

//   try {
//     // Convert employeeId string to ObjectId
//     const employeeObjectId = mongoose.Types.ObjectId.isValid(employeeId)
//       ? new mongoose.Types.ObjectId(employeeId)
//       : null;

//     if (!employeeObjectId) {
//       return res.status(400).json({ message: "Invalid employee ID format" });
//     }

//     // Check if employee exists based on the employeeId
//     const member = await Member.findById(employeeObjectId); // Use _id instead of employeeId if it's a unique identifier
//     if (!member) {
//       console.log('No employee found with this employeeId');
//       return res.status(404).json({ message: "No employee found with this ID" });
//     }

//     console.log('Employee found:', member);

//     // Perform aggregation to calculate totals, handling both string and number types
//     const result = await Member.aggregate([
//       { $match: { _id: employeeObjectId } }, // Use _id to match the employee
//       {
//         $group: {
//           _id: null,

//           // Sum FamilyMembers, handling both numeric strings and numbers
//           totalFamilyMembers: {
//             $sum: {
//               $cond: {
//                 if: {
//                   $or: [
//                     { $regexMatch: { input: { $toString: "$FamilyMembers" }, regex: /^[0-9]+$/ } }, // Check if it's a numeric string
//                     { $isNumber: "$FamilyMembers" } // Check if it's already a number
//                   ]
//                 },
//                 then: { $toInt: { $toString: "$FamilyMembers" } }, // Convert to int (handles both number and numeric string)
//                 else: 0 // Ignore non-numeric values
//               }
//             }
//           },

//           totalMahilaSamuh: {
//             $sum: { $ifNull: ["$mahilaSamuhCount", 0] }
//           },

//           totalSurveys: { $sum: 1 },

//           uniqueVillageNames: {
//             $addToSet: {
//               $cond: {
//                 if: {
//                   $and: [
//                     { $ne: ["$VillageName", null] },
//                     { $ne: ["$VillageName", ""] }
//                   ]
//                 },
//                 then: "$VillageName",
//                 else: null
//               }
//             }
//           }
//         }
//       },
//       {
//         $project: {
//           totalFamilyMembers: 1,
//           totalMahilaSamuh: 1,
//           totalSurveys: 1,
//           totalUniqueVillages: {
//             $size: {
//               $filter: {
//                 input: "$uniqueVillageNames",
//                 as: "village",
//                 cond: { $ne: ["$$village", null] }
//               }
//             }
//           }
//         }
//       }
//     ]);

//     if (result.length === 0) {
//       console.log('No survey data found for this employee');
//       return res.status(404).json({ message: "No data found for this employee" });
//     }

//     const { totalFamilyMembers, totalMahilaSamuh, totalSurveys, totalUniqueVillages } = result[0];

//     console.log('Total Family Members:', totalFamilyMembers);
//     console.log('Total Mahila Samuh:', totalMahilaSamuh);
//     console.log('Total Surveys:', totalSurveys);
//     console.log('Total Unique Villages:', totalUniqueVillages);

//     // Send response with calculated data
//     res.status(200).json({
//       totalFamilyMembers,
//       totalMahilaSamuh,
//       totalSurveys,
//       totalUniqueVillages
//     });
//   } catch (error) {
//     console.error("Error calculating employee totals:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };



export const getMemberDataForEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    console.log('Received request to fetch member data for employee:', employeeId);
    if (!employeeId) return res.status(400).json({ message: "Employee ID is required" });

    const members = await Member.find({ employeeId }).sort({ createdAt: -1 }); // Sort by createdAt in descending order (-1);
    if (!members.length) return res.status(404).json({ message: "No members found for this employee" });

    return res.status(200).json({ message: "Survey data", data: members });
  } catch (error) {
    console.error('Error fetching member data for employee:', error);
    res.status(500).json({ message: 'Server error, could not fetch member data.', error: error.message });
  }
}


export const updateMember = async (req, res) => {
  const { id } = req.params; // Extract the member ID from the request parameters
  const {
    FamilyMembers,
    Occupation,
    Gauwansh,
    Tractor,
    TwoWheeler,
    FourWheeler,
    EducationRequired,
    searchingJob,
    mahilaSamuhCount,    // Renamed for consistency with frontend
    // MahilaSamuh,
    LoanRunning,
    NeedLoan,
    OtherDetails,
    DonationAmount,      // Renamed for consistency with frontend
    RasidNo,             // Renamed for consistency with frontend
    Remarks
  } = req.body; // Extract the fields to update from the request body
  console.log('Received request to update member:', req.body);
  try {
    console.log('Received request to update member:', req.body);
    // Find the member by ID and update the specified fields
    const updatedMember = await Member.findByIdAndUpdate(
      id,
      {
        FamilyMembers,
        Occupation,
        Gauwansh,
        Tractor,
        tractorCount: Tractor === "yes" ? TractorCount : 0,  // Update count only if "yes"
        TwoWheeler,
        twoWheelerCount: TwoWheeler === "yes" ? TwoWheelerCount : 0,
        FourWheeler,
        fourWheelerCount: FourWheeler === "yes" ? FourWheelerCount : 0,
        EducationRequired,
        searchingJob,
        // MahilaSamuh,
        mahilaSamuhCount,    // Renamed for consistency with frontend
        LoanRunning,
        NeedLoan,
        OtherDetails,
        DonationAmount,      // Renamed for consistency with frontend
        RasidNo,             // Renamed for consistency with frontend
        Remarks
      },
      { new: true, runValidators: true } // Return the updated document and run validation
    );

    // If no member was found, return a 404 error
    if (!updatedMember) {
      return res.status(404).json({ message: 'Member not found.' });
    }

    // Return the updated member
    res.status(200).json({ message: 'Member updated successfully.', member: updatedMember });
  } catch (error) {
    // Log and return a server error if something goes wrong
    console.error('Error updating member:', error);
    res.status(500).json({ message: 'Server error, could not update member.', error: error.message });
  }
};

// Controller to delete a member (survey) by ID
export const deleteMember = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedMember = await Member.findByIdAndDelete(id);

    if (!deletedMember) {
      return res.status(404).json({ message: 'Member (survey) not found.' });
    }

    res.status(200).json({ message: 'Member (survey) deleted successfully.' });
  } catch (error) {
    console.error('Error deleting member:', error);
    res.status(500).json({ message: 'Server error, could not delete member.', error: error.message });
  }
};
