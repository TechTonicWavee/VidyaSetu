import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  getMentees,
  addMenteeNote,
  addMenteeAlert,
  getClasses,
  getAnalytics,
  addClass,
  uploadAttendance,
  uploadMarks
} from '../controllers/faculty.controller';
import multer from 'multer';

const upload = multer();
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
router.post('/classes', addClass);
router.get('/reports/analytics', getAnalytics);

// Uploads
router.post('/upload/attendance', upload.single('file'), uploadAttendance);
router.post('/upload/marks', upload.single('file'), uploadMarks);

export default router;
