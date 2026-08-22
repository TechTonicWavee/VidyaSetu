const xlsx = require('xlsx');

// Create a new workbook
const wb = xlsx.utils.book_new();

// The data needs to match the parser expectations
// Row 1-3: headers or empty
// Row 4-5: Contains 'Bachelor of Technology' and 'Computer Science and Engineering'
// Row 6: Main header (Registration No., Student Name, Total)
// Row 7: Sub header (A, T, P under Total)
// Row 8+: Data

const data = [
  ["KIET Group of Institutions", "", "", "", "", "", "", ""],
  ["Attendance Report", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["Bachelor of Technology", "", "", "", "", "", "", ""],
  ["Computer Science and Engineering, Semester V", "", "", "", "", "", "", ""],
  ["Registration No.", "Student Name", "Subject 1", "Subject 2", "Total", "", "", ""],
  ["", "", "", "", "A", "T", "P", ""],
  ["202401100200178", "Krrish Singhal", "10", "12", "45", "50", "90%", ""],
  ["202401100200179", "John Doe", "8", "10", "30", "50", "60%", ""],
  ["202401100200180", "Jane Smith", "0", "0", "NR", "NR", "NR", ""]
];

const ws = xlsx.utils.aoa_to_sheet(data);
xlsx.utils.book_append_sheet(wb, ws, "Attendance");

xlsx.writeFile(wb, "/home/krrish/Desktop/sample_attendance.xlsx");
console.log("Sample excel generated at /home/krrish/Desktop/sample_attendance.xlsx");
