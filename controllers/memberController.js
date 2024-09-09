import Member from '../models/Member.js';

// Controller to create a new member (Step 1)
export const createMemberStep1 = async (req, res) => {
  const { headName, mobileNumber, address, donationAmount, rasidNo } = req.body;

  try {
    // Create new member instance for Step 1
    const member = new Member({
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
    otherDetails, donationDetails, donationInWords, remarks
  } = req.body;

  try {
    const updatedMember = await Member.findByIdAndUpdate(
      id,
      {
        familyMembers, occupation, gauwansh, tractor, twoWheeler, fourWheeler,
        educationRequired, searchingJob, mahilaSamuh, loanRunning, needLoan,
        otherDetails, donationDetails, donationInWords, remarks
      },
      { new: true, runValidators: true }  // Return updated document and run validation
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
