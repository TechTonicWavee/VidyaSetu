import * as xlsx from 'xlsx';

export interface ParsedAttendance {
  registrationNo: string;
  name: string;
  attended: number;
  total: number;
  percentage: number;
  status: 'valid' | 'skipped';
  reason?: string;
}

export interface ParseResult {
  semester: string;
  session: string;
  rows: ParsedAttendance[];
  totalColLetter?: string;
}

export class AttendanceParserService {
  static parseExcelFile(buffer: Buffer): ParseResult {
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0]; // first sheet
    if (!sheetName) {
      throw new Error('Workbook contains no sheets.');
    }
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) {
      throw new Error('Workbook contains no sheets.');
    }
    const data = xlsx.utils.sheet_to_json<string[]>(sheet, { header: 1, defval: '' });

    if (data.length < 10) {
      throw new Error('File does not contain enough rows to be a valid attendance report.');
    }

    // Try to extract session info from row 4 or 5
    let session = '';
    let semesterStr = '';
    for (let i = 0; i < 7; i++) {
      const infoRow = data[i];
      if (!infoRow) continue;
      const rowStr = infoRow.join(' ');
      if (rowStr.includes('Bachelor of Technology')) {
        session = rowStr;
      } else if (rowStr.includes('Computer Science and Engineering') || rowStr.match(/,[IVX]+,/)) {
        semesterStr = rowStr;
      }
    }

    // 1. Scan for the group header row (contains "Registration No.")
    let headerRowIdx = -1;
    let regNoColIdx = -1;
    let nameColIdx = -1;

    for (let i = 0; i < Math.min(20, data.length); i++) {
      const row = data[i];
      if (!row) continue;
      
      const regIdx = row.findIndex((cell) => cell?.trim() === 'Registration No.');
      if (regIdx !== -1) {
        headerRowIdx = i;
        regNoColIdx = regIdx;
        nameColIdx = row.findIndex((cell) => cell?.trim() === 'Student Name');
        break;
      }
    }

    if (headerRowIdx === -1) {
      throw new Error('Could not find "Registration No." column header in the first 20 rows.');
    }

    const headerRow = data[headerRowIdx];
    const subHeaderRow = data[headerRowIdx + 1];

    if (!headerRow) {
      throw new Error('Could not read the header row.');
    }
    if (!subHeaderRow) {
      throw new Error('Missing sub-header row below the main header.');
    }

    // 2. Find "Total" in the group header row. We need the LAST match.
    let totalColIdx = -1;
    for (let i = headerRow.length - 1; i >= 0; i--) {
      if (headerRow[i]?.trim() === 'Total') {
        totalColIdx = i;
        break;
      }
    }

    if (totalColIdx === -1) {
      throw new Error('Could not find "Total" column header.');
    }

    // 3. Confirm sub-headers are A, T, P
    const tA = subHeaderRow[totalColIdx]?.trim();
    const tT = subHeaderRow[totalColIdx + 1]?.trim();
    const tP = subHeaderRow[totalColIdx + 2]?.trim();

    if (tA !== 'A' || tT !== 'T' || tP !== 'P') {
      throw new Error(`Sub-headers under Total are not A, T, P (found ${tA}, ${tT}, ${tP}).`);
    }

    const totalColLetter = xlsx.utils.encode_col(totalColIdx + 2); // column of P

    const parsedRows: ParsedAttendance[] = [];

    // 4. Data begins on the row after sub-header
    for (let i = headerRowIdx + 2; i < data.length; i++) {
      const row = data[i];
      if (!row || row.length === 0) continue;

      // xlsx returns real numbers for numeric cells at runtime despite the string[] typing
      const regNoRaw = row[regNoColIdx] as string | number | undefined;
      const regNo = typeof regNoRaw === 'number'
        ? regNoRaw.toString().trim()
        : (regNoRaw || '').toString().trim();
      const name = (row[nameColIdx] || '').toString().trim();

      if (!regNo || regNo.length < 13) {
        // Skip trailing rows / summary rows
        continue;
      }

      const aRaw = row[totalColIdx]?.toString().trim();
      const tRaw = row[totalColIdx + 1]?.toString().trim();
      const pRaw = row[totalColIdx + 2]?.toString().trim();

      const aNum = parseFloat(aRaw ?? '');
      const tNum = parseFloat(tRaw ?? '');

      if (aRaw === 'NR' || tRaw === 'NR' || pRaw === 'NR') {
        parsedRows.push({
          registrationNo: regNo,
          name,
          attended: 0,
          total: 0,
          percentage: 0,
          status: 'skipped',
          reason: 'NR (Not Registered)',
        });
        continue;
      }

      if (isNaN(tNum) || tNum === 0) {
        parsedRows.push({
          registrationNo: regNo,
          name,
          attended: aNum || 0,
          total: tNum || 0,
          percentage: 0,
          status: 'skipped',
          reason: isNaN(tNum) ? 'Invalid T value' : 'T is zero',
        });
        continue;
      }

      let pNum = 0;
      if (pRaw && pRaw.includes('%')) {
        pNum = parseFloat(pRaw.replace('%', ''));
      } else {
        pNum = parseFloat(pRaw ?? '');
      }

      if (isNaN(aNum) || isNaN(pNum)) {
        parsedRows.push({
          registrationNo: regNo,
          name,
          attended: 0,
          total: 0,
          percentage: 0,
          status: 'skipped',
          reason: 'Invalid number format in A or P',
        });
        continue;
      }

      parsedRows.push({
        registrationNo: regNo,
        name,
        attended: aNum,
        total: tNum,
        percentage: pNum,
        status: 'valid',
      });
    }

    return {
      semester: semesterStr,
      session: session,
      totalColLetter,
      rows: parsedRows,
    };
  }
}
