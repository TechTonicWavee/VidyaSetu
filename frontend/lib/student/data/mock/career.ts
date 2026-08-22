import type { CareerData } from '../types';

export const careerMock: CareerData = {
  recommended: [
    {
      id: 'fullstack',
      title: 'Full-Stack Engineer',
      confidence: 88,
      demand: 'Very High',
      medianSalary: '₹12–22 LPA',
      match: ['Strong project portfolio', 'React & Node experience', 'GitHub activity'],
      gaps: ['System design depth', 'Testing discipline'],
      tone: 'brand',
    },
    {
      id: 'ml',
      title: 'Machine Learning Engineer',
      confidence: 71,
      demand: 'High',
      medianSalary: '₹14–26 LPA',
      match: ['Python proficiency', 'Math fundamentals'],
      gaps: ['Deep learning projects', 'Kaggle track record', 'MLOps'],
      tone: 'blue',
    },
    {
      id: 'pm',
      title: 'Associate Product Manager',
      confidence: 64,
      demand: 'Moderate',
      medianSalary: '₹15–24 LPA',
      match: ['Team leadership', 'Cross-domain projects'],
      gaps: ['Communication score', 'Case-study practice', 'Analytics'],
      tone: 'teal',
    },
  ],
  trajectories: [
    { id: 'aggressive', label: 'Fast Track', probability: 35, outcome: 'Product-based company (Tier-1) within 18 months of focused prep.', tone: 'green' },
    { id: 'steady', label: 'Steady Climb', probability: 48, outcome: 'Service/product company now, switch to Tier-1 in 2–3 years.', tone: 'blue' },
    { id: 'explore', label: 'Explorer', probability: 17, outcome: 'Higher studies (MS/M.Tech) followed by research or specialised roles.', tone: 'amber' },
  ],
  alumni: [
    { name: 'Ananya Rao', batch: '2022', role: 'SDE-1', company: 'Amazon', path: 'Web projects → 2 internships → placement', initials: 'AR' },
    { name: 'Kabir Mehta', batch: '2021', role: 'ML Engineer', company: 'Fractal', path: 'Kaggle → research paper → placement', initials: 'KM' },
    { name: 'Ishita Sen', batch: '2023', role: 'Frontend Dev', company: 'Zoho', path: 'Open source → hackathons → placement', initials: 'IS' },
    { name: 'Rohan Nair', batch: '2022', role: 'APM', company: 'Flipkart', path: 'Club lead → case comps → PM internship', initials: 'RN' },
  ],
  actionPlan: [
    { id: 'a1', task: 'Complete a system design crash course', done: false, category: 'Technical' },
    { id: 'a2', task: 'Ship one full-stack project with tests', done: false, category: 'Projects' },
    { id: 'a3', task: 'Solve 40 medium DSA problems', done: true, category: 'DSA' },
    { id: 'a4', task: 'Give 2 mock interviews', done: false, category: 'Interview' },
    { id: 'a5', task: 'Refine resume with quantified impact', done: true, category: 'Resume' },
  ],
};
