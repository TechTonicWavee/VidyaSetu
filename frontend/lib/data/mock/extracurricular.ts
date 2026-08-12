import type { ExtracurricularData } from '../types';

export const extracurricularMock: ExtracurricularData = {
  stats: [
    { label: 'Activities', value: 7 },
    { label: 'Leadership roles', value: 2 },
    { label: 'Awards', value: 3 },
    { label: 'Hours (this year)', value: 120 },
  ],
  items: [
    { id: 'ec1', title: 'Coding Club', category: 'Technical', role: 'Core Member', date: '2025 – present', description: 'Organised 4 workshops on web development and DSA for juniors.', impact: 'Reached 200+ students' },
    { id: 'ec2', title: 'Inter-College Cricket', category: 'Sports', role: 'Team Player', date: 'Mar 2026', description: 'Represented the college; District runner-up.', impact: 'District Runner-Up' },
    { id: 'ec3', title: 'Annual Tech Fest', category: 'Leadership', role: 'Event Lead', date: 'Feb 2026', description: 'Led the hackathon track with 30 teams.', impact: '30 teams, 3 sponsors' },
    { id: 'ec4', title: 'NSS Volunteer', category: 'Social', role: 'Volunteer', date: '2025 – present', description: 'Community teaching and cleanliness drives.', impact: '60+ hours' },
    { id: 'ec5', title: 'Cultural Night', category: 'Cultural', role: 'Performer', date: 'Dec 2025', description: 'Part of the winning group dance performance.' },
  ],
};
