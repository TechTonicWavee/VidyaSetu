import assert from 'node:assert';
import * as xlsx from 'xlsx';
import { AttendanceParserService } from './attendance.service';

function createMockExcelBuffer(data: any[][]): Buffer {
  const ws = xlsx.utils.aoa_to_sheet(data);
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, 'All Subject Type Attendance ');
  return xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
}

async function runTests() {
  console.log('Running AttendanceParserService tests...');

  // Test 1: Valid format with shifting columns
  const validData = [
    ['', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', 'session: Bachelor of Technology', '', '', '', '', '', '', ''],
    ['', '', '', '', 'Computer Science and Engineering', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', ''],
    ['S.No.', 'Degree.', 'Branch.', 'Semester.', 'Section.', 'Registration No.', 'Roll No.', 'Student Name', 'Sub 1', 'Total', 'Trash'],
    ['', '', '', '', '', '', '', '', 'A', 'A', 'T', 'P', 'X'],
    ['1', 'B.Tech', 'CSE', 'V', 'B', '202401100200001', '2CS01', 'Alice', '10', '40', '50', '80%', ''],
    ['2', 'B.Tech', 'CSE', 'V', 'B', '202401100200002', '2CS02', 'Bob', '10', 'NR', 'NR', 'NR', ''],
    ['3', 'B.Tech', 'CSE', 'V', 'B', '202401100200003', '2CS03', 'Charlie', '10', '0', '0', '0%', ''],
  ];

  const buffer = createMockExcelBuffer(validData);
  const result = AttendanceParserService.parseExcelFile(buffer);
  
  assert.strictEqual(result.session.trim(), 'session: Bachelor of Technology');
  assert.strictEqual(result.semester.trim(), 'Computer Science and Engineering');
  assert.strictEqual(result.rows.length, 3);
  
  const alice = result.rows[0]!;
  assert.strictEqual(alice.registrationNo, '202401100200001');
  assert.strictEqual(alice.attended, 40);
  assert.strictEqual(alice.total, 50);
  assert.strictEqual(alice.percentage, 80);
  assert.strictEqual(alice.status, 'valid');

  const bob = result.rows[1]!;
  assert.strictEqual(bob.status, 'skipped');
  assert.strictEqual(bob.reason, 'NR (Not Registered)');

  const charlie = result.rows[2]!;
  assert.strictEqual(charlie.status, 'skipped');
  assert.strictEqual(charlie.reason, 'T is zero');

  // Test 2: Missing Registration No. column
  const invalidHeaderData = [
    ...validData.slice(0, 7),
    ['', '', '', '', ''],
    ['S.No.', 'Degree.', 'Total', 'P'],
    ['', '', 'A', 'T', 'P']
  ];
  try {
    AttendanceParserService.parseExcelFile(createMockExcelBuffer(invalidHeaderData));
    assert.fail('Should have thrown error for missing Registration No.');
  } catch (e: any) {
    assert.ok(e.message.includes('Could not find "Registration No."'), `Unexpected error: ${e.message}`);
  }

  console.log('All tests passed! 🎉');
}

runTests().catch(console.error);
