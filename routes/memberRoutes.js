import express from 'express';
import { 
  createMemberStep1,  // Step 1: Creating member
  getMembers,         // Fetching all members
  getMemberById,      // Fetching a single member by ID
  getMemberForStep2,  // Fetch member data for Step 2
  updateMemberStep2,  // Updating member in Step 2
  getTotalSurveysAndData,  // Calculating total surveys and data
  getMemberDataForEmployee, // Fetching member data for the logged-in employee
  updateMember, // Updating member data
  getEmployeeSurveysAndData,
  deleteMember
} from '../controllers/memberController.js';

const router = express.Router();

// Route to create a new member (Step 1) and get all members
router.route('/')
  .get(getMembers)        // GET request to fetch all members
  .post(createMemberStep1);  // POST request to create a member (Step 1)
  

  // Route to calculate total family members added by all employees
router.get('/total-surveys-and-data', getTotalSurveysAndData);  // New route to calculate total family members

// Route to calculate total family members added by an employee
 router.get('/employee-surveys/:employeeId', getEmployeeSurveysAndData);  // New route to calculate total family members

// Route to get a single member by ID and fetch member for Step 2 or update member (Step 2)
router.route('/:id')
  .get(getMemberById)      // GET request to fetch member by ID
  .patch(updateMemberStep2);  // PATCH request to update member (Step 2)

// Route to get member data for Step 2 (specific fetch based on ID)
router.get('/step2/:id', getMemberForStep2);  // Fetch member data for Step 2

router.get('/employee/:employeeId',  getMemberDataForEmployee); // Fetch member data for the logged-in employee

// Route to update member data
router.put('/api/members/:id', updateMember);

// Route to delete a member
router.delete('/:id', deleteMember);



export default router;
