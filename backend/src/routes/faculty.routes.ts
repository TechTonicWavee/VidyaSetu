import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  getMentees,
  addMenteeNote,
  addMenteeAlert,
  getClasses,
  getAnalytics
} from '../controllers/faculty.controller';

const router = Router();

// Profile Routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Mentees Routes
router.get('/mentees', getMentees);
// In a real app we'd have a getMentee route as well, but we can reuse the mentees logic or create one.
// Let's add a note and alert endpoint
router.post('/mentees/:id/notes', addMenteeNote);
router.post('/mentees/:id/alerts', addMenteeAlert);

// Classes & Analytics
router.get('/classes', getClasses);
router.get('/reports/analytics', getAnalytics);

export default router;
