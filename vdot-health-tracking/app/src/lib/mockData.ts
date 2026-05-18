import { addDays, subDays } from 'date-fns';

export const mockEmployees = Array.from({ length: 5000 }, (_, i) => ({
  id: `EMP-${1000 + i}`,
  name: [
    'Alice Johnson', 'Bob Smith', 'Charlie Davis', 'Diana Evans', 'Evan Harris',
    'Fiona Clark', 'George Lewis', 'Hannah Walker', 'Ian Hall', 'Julia Young'
  ][i % 10] + (i > 9 ? ` ${Math.floor(i / 10)}` : ''),
  department: ['Maintenance', 'Construction', 'Engineering', 'Safety', 'HR'][i % 5],
  district: ['Richmond', 'Salem', 'Bristol', 'Lynchburg', 'Hampton Roads'][i % 5],
  status: ['Cleared', 'Pending Review', 'Overdue', 'On Hold'][i % 4],
  riskLevel: ['Low', 'Medium', 'High'][i % 3],
}));

export const mockAlerts = [
  { id: 1, type: 'Warning', message: '14 Audiograms overdue in Bristol district.', date: subDays(new Date(), 1) },
  { id: 2, type: 'Critical', message: 'Exposure incident reported: Route 460 chemical spill.', date: new Date() },
  { id: 3, type: 'Info', message: 'OSHA 300A summary ready for review.', date: subDays(new Date(), 2) },
];

export const mockExposures = [
  { id: 'EXP-9001', type: 'Chemical', severity: 'High', date: subDays(new Date(), 2), location: 'Route 460', employeesInvolved: 3 },
  { id: 'EXP-9002', type: 'Noise', severity: 'Medium', date: subDays(new Date(), 5), location: 'I-81 Bridge', employeesInvolved: 8 },
  { id: 'EXP-9003', type: 'Biological', severity: 'Low', date: subDays(new Date(), 12), location: 'Rest Area 4', employeesInvolved: 1 },
];

export const mockUpcomingExams = Array.from({ length: 5 }, (_, i) => ({
  id: `EXAM-${i}`,
  employeeId: mockEmployees[i].id,
  employeeName: mockEmployees[i].name,
  type: ['Audiogram', 'Respirator Fit Check', 'DOT Physical'][i % 3],
  date: addDays(new Date(), i + 1),
  status: 'Scheduled',
}));

export const mockComplianceData = [
  { name: 'Bristol', compliance: 82 },
  { name: 'Salem', compliance: 95 },
  { name: 'Lynchburg', compliance: 88 },
  { name: 'Richmond', compliance: 91 },
  { name: 'Hampton', compliance: 78 },
];
