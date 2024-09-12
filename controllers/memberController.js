import Member from '../models/Member.js';
import { Employee } from '../models/Employee.js';

// Controller to create a new member (Step 1)
export const createMemberStep1 = async (req, res) => {
  const { employeeId, headName, mobileNumber, address, donationAmount, rasidNo  } = req.body;
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
      headName,
      mobileNumber,
      address,
      donationAmount,
      rasidNo,
    });

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
    familyMembers, occupation, gauwansh, tractor, twoWheeler, fourWheeler,
    educationRequired, searchingJob, mahilaSamuh, loanRunning, needLoan,
    otherDetails, donationDetails, donationInWords, remarks,
    // Numeric fields that need parsing
    tractorCount, twoWheelerCount, fourWheelerCount, mahilaSamuhCount, loanRunningAmount, loanRequiredAmount
  } = req.body;

  try {
    const updatedMember = await Member.findByIdAndUpdate(
      id,
      {
        familyMembers,
        occupation,
        gauwansh,
        tractor,
        twoWheeler,
        fourWheeler,
        educationRequired,
        searchingJob,
        mahilaSamuh,
        loanRunning,
        needLoan,
        otherDetails,
        donationDetails,
        donationInWords,
        remarks,
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
    const members = await Member.find();
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

    if (!member) {
      return res.status(404).json({ message: 'Member not found.' });
    }

    res.status(200).json(member);
  } catch (error) {
    console.error('Error fetching member by ID:', error);
    res.status(500).json({ message: 'Server error, could not fetch member.', error: error.message });
  }
};


export const getTotalSurveysAndData = async (req, res) => {
  try {
    const result = await Member.aggregate([
      {
        $group: {
          _id: null,
          totalFamilyMembers: { $sum: { $toInt: "$familyMembers" } }, // Convert familyMembers to integer
          totalMahilaSamuh: { $sum: "$mahilaSamuhCount" }, // Sum of mahilaSamuhCount
          totalSurveys: { $sum: 1 } // Total count of documents (surveys)
        }
      }
    ]);

    if (result.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    const { totalFamilyMembers, totalMahilaSamuh, totalSurveys } = result[0];

    res.status(200).json({
      totalFamilyMembers,
      totalMahilaSamuh,
      totalSurveys
    });
  } catch (error) {
    console.error("Error calculating totals:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMemberDataForEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    console.log('Received request to fetch member data for employee:', employeeId);
    if (!employeeId) return res.status(400).json({ message: "Employee ID is required" });

    const members = await Member.find({ employeeId });
    if (!members.length) return res.status(404).json({ message: "No members found for this employee" });

    return res.status(200).json({ message: "Survey data", data: members });
  } catch (error) {
    console.error('Error fetching member data for employee:', error);
    res.status(500).json({ message: 'Server error, could not fetch member data.', error: error.message });
  }
}