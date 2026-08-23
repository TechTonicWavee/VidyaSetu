// One-off: seeds/reconciles the real student roster (studentsSeed.json) into the
// students table, keyed by student_roll_number -> universityId.
//
// - New roll numbers: created fresh (isFirstLogin: true, formStatus: 'not_registered',
//   password: null — same as any student who hasn't started onboarding).
// - Roll numbers that already exist: only fills fields that are currently null/empty
//   in the DB. Never overwrites data a student has already set (password, formStatus,
//   spiScore, resumeUrl, cgpa, domain, etc.) or a roster field that already has a value.
//
// Safe to re-run: already-filled fields are left untouched, so running this twice
// is a no-op for rows that were already reconciled.

const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const SEED_PATH = path.join(__dirname, '..', '..', 'studentsSeed.json');

const ROSTER_FIELD_MAP = {
  student_name: 'fullName',
  student_email_id: 'email',
  student_phone_number: 'phone',
  father_phone_number: 'fatherPhone',
  section: 'section',
  semester: 'semester',
  branch: 'branch',
  gender: 'gender',
};

function normalizeName(value) {
  return value.trim().replace(/\s+/g, ' ').toUpperCase();
}

function clean(value) {
  if (value === undefined || value === null) return null;
  if (typeof value === 'string' && value.trim() === '') return null;
  return value;
}

function validateRoster(roster) {
  const errors = [];
  const seenRoll = new Map();
  const seenEmail = new Map();

  roster.forEach((row, idx) => {
    const roll = clean(row.student_roll_number);
    const email = clean(row.student_email_id);
    const name = clean(row.student_name);

    if (!roll) errors.push(`Row ${idx}: missing student_roll_number`);
    if (!email) errors.push(`Row ${idx}: missing student_email_id (roll ${roll})`);
    if (!name) errors.push(`Row ${idx}: missing student_name (roll ${roll})`);

    if (roll) {
      if (seenRoll.has(roll)) {
        errors.push(`Duplicate roll number in source file: ${roll} (rows ${seenRoll.get(roll)} and ${idx})`);
      } else {
        seenRoll.set(roll, idx);
      }
    }
    if (email) {
      if (seenEmail.has(email)) {
        errors.push(`Duplicate email in source file: ${email} (rows ${seenEmail.get(email)} and ${idx})`);
      } else {
        seenEmail.set(email, idx);
      }
    }
  });

  return errors;
}

async function main() {
  const raw = fs.readFileSync(SEED_PATH, 'utf8');
  const roster = JSON.parse(raw);

  console.log(`Loaded ${roster.length} rows from ${SEED_PATH}`);

  const validationErrors = validateRoster(roster);
  if (validationErrors.length > 0) {
    console.error(`Aborting: ${validationErrors.length} validation error(s) found:`);
    for (const err of validationErrors.slice(0, 50)) console.error(`  - ${err}`);
    if (validationErrors.length > 50) console.error(`  ...and ${validationErrors.length - 50} more`);
    process.exitCode = 1;
    return;
  }
  console.log('Validation passed: all roll numbers and emails are present and unique.');

  let created = 0;
  let updated = 0;
  let unchanged = 0;
  const mismatches = [];

  for (const row of roster) {
    const universityId = String(row.student_roll_number).trim();

    const mapped = {
      fullName: clean(row.student_name),
      email: clean(row.student_email_id),
      phone: clean(row.student_phone_number),
      fatherPhone: clean(row.father_phone_number),
      section: clean(row.section),
      semester: row.semester != null ? Number(row.semester) : null,
      branch: clean(row.branch),
      gender: clean(row.gender),
    };

    const existing = await prisma.student.findUnique({ where: { universityId } });

    if (!existing) {
      await prisma.student.create({
        data: {
          universityId,
          fullName: mapped.fullName,
          email: mapped.email,
          phone: mapped.phone,
          fatherPhone: mapped.fatherPhone,
          section: mapped.section,
          semester: mapped.semester,
          branch: mapped.branch,
          gender: mapped.gender,
          isFirstLogin: true,
          formStatus: 'not_registered',
        },
      });
      created++;
      continue;
    }

    // Roll number already present in DB (or another row's) — verify the identity
    // fields actually correspond to the same person before touching anything.
    if (existing.fullName && mapped.fullName && normalizeName(existing.fullName) !== normalizeName(mapped.fullName)) {
      mismatches.push(
        `Roll ${universityId}: DB name "${existing.fullName}" != sheet name "${mapped.fullName}" — skipped, needs manual review.`,
      );
      continue;
    }

    const diff = {};
    for (const [, dbField] of Object.entries(ROSTER_FIELD_MAP)) {
      const newValue = mapped[dbField];
      const currentValue = existing[dbField];
      const isCurrentEmpty = currentValue === null || currentValue === undefined || currentValue === '';
      if (isCurrentEmpty && newValue !== null && newValue !== undefined) {
        diff[dbField] = newValue;
      }
    }
    // Same person, but DB's stored name has stray whitespace vs. the roster's
    // clean version — normalize it even though the field isn't "empty".
    if (existing.fullName && mapped.fullName && existing.fullName !== mapped.fullName) {
      diff.fullName = mapped.fullName;
    }

    if (Object.keys(diff).length === 0) {
      unchanged++;
      continue;
    }

    await prisma.student.update({ where: { universityId }, data: diff });
    updated++;
  }

  console.log('\n--- Summary ---');
  console.log(`Created:   ${created}`);
  console.log(`Updated:   ${updated} (filled missing fields only)`);
  console.log(`Unchanged: ${unchanged} (already fully populated)`);
  console.log(`Total processed: ${created + updated + unchanged + mismatches.length} / ${roster.length}`);

  if (mismatches.length > 0) {
    console.log(`\n${mismatches.length} name mismatch(es) — left untouched, review manually:`);
    for (const m of mismatches) console.log(`  - ${m}`);
  }

  // Integrity check: every roll number in the sheet must now exist in the DB.
  const rolls = roster.map((r) => String(r.student_roll_number).trim());
  const dbStudents = await prisma.student.findMany({
    where: { universityId: { in: rolls } },
    select: { universityId: true },
  });
  const dbRollSet = new Set(dbStudents.map((s) => s.universityId));
  const missing = rolls.filter((r) => !dbRollSet.has(r));

  if (missing.length > 0) {
    console.error(`\nINTEGRITY CHECK FAILED: ${missing.length} roll number(s) from the sheet are missing in the DB:`);
    for (const m of missing.slice(0, 50)) console.error(`  - ${m}`);
    process.exitCode = 1;
  } else {
    console.log(`\nIntegrity check passed: all ${rolls.length} roll numbers from the sheet exist in the DB.`);
  }
}

main()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
