import express from 'express';
import { 
  createMemberStep1,  // Step 1: Creating member
  getMembers,         // Fetching all members
  getMemberById,      // Fetching a single member by ID
  getMemberForStep2,  // Fetch member data for Step 2
  updateMemberStep2   // Updating member in Step 2
} from '../controllers/memberController.js';

const router = express.Router();

// Route to create a new member (Step 1) and get all members
router.route('/')
  .get(getMembers)        // GET request to fetch all members
  .post(createMemberStep1);  // POST request to create a member (Step 1)

// Route to get a single member by ID and fetch member for Step 2 or update member (Step 2)
router.route('/:id')
  .get(getMemberById)      // GET request to fetch member by ID
  .patch(updateMemberStep2);  // PATCH request to update member (Step 2)

// Route to get member data for Step 2 (specific fetch based on ID)
router.get('/step2/:id', getMemberForStep2);  // Fetch member data for Step 2

export default router;
