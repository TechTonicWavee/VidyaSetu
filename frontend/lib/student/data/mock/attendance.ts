import type { AttendanceData } from '../types';

function cal(): AttendanceData['calendar'] {
  const out: AttendanceData['calendar'] = [];
  for (let d = 1; d <= 30; d++) {
    const dow = (d + 1) % 7; // arbitrary but stable
    let status: AttendanceData['calendar'][number]['status'] = 'present';
    if (dow === 0) status = 'holiday';
    else if ([4, 11, 19, 25].includes(d)) status = 'absent';
    out.push({ date: d, status });
  }
  return out;
}

export const attendanceMock: AttendanceData = {
  overall: 79,
  required: 75,
  subjects: [
    { code: 'CS501', name: 'Database Management', attended: 43, total: 50, percent: 86 },
    { code: 'CS502', name: 'Operating Systems', attended: 40, total: 50, percent: 80 },
    { code: 'CS503', name: 'Theory of Computation', attended: 37, total: 50, percent: 74 },
    { code: 'CS504', name: 'Data Structures & Algorithms', attended: 45, total: 50, percent: 90 },
    { code: 'CS505', name: 'Computer Networks', attended: 39, total: 50, percent: 78 },
  ],
  monthly: [
    { month: 'Sep', percent: 88 },
    { month: 'Oct', percent: 84 },
    { month: 'Nov', percent: 81 },
    { month: 'Dec', percent: 76 },
    { month: 'Jan', percent: 82 },
    { month: 'Feb', percent: 79 },
    { month: 'Mar', percent: 77 },
    { month: 'Apr', percent: 79 },
  ],
  calendar: cal(),
  alerts: [
    { id: 'al1', subject: 'Theory of Computation', message: 'At 74% — below the 75% requirement. Attend the next 3 classes to recover.', tone: 'red' },
    { id: 'al2', subject: 'Computer Networks', message: 'At 78% — buffer is thin. Avoid skipping upcoming labs.', tone: 'amber' },
  ],
};
