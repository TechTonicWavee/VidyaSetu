import XLSX from "xlsx";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "../frontend/node_modules/@prisma/client/index.js";

const prisma = new PrismaClient();

console.log("Starting student import...");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const excelPath = path.join(__dirname, "../database/Student.xlsx");

const workbook = XLSX.readFile(excelPath);

const sheetsToProcess = ["CSE II", "CSE III", "CSE IV"];

let imported = 0;
let skipped = 0;
let failed = 0;

for (const sheetName of sheetsToProcess) {
    const worksheet = workbook.Sheets[sheetName];

    const data = XLSX.utils.sheet_to_json(worksheet);

    console.log(`\nProcessing ${sheetName}: ${data.length} students`);

    for (const row of data) {
        try {
            let student;

            if (sheetName === "CSE II" || sheetName === "CSE III") {
                student = {
                    universityId: String(row["University Roll No"]).trim(),
                    fullName: String(row["NAME"]).trim(),
                    email: row["E-Mail ID"]
                        ? String(row["E-Mail ID"]).trim().toLowerCase()
                        : null,
                    branch: String(row["BRANCH"]).trim(),
                    section: String(row["SEC"]).trim(),
                    year: Number(row["Year"]),
                };
            } else {
                student = {
                    universityId: String(row["University Roll No"]).trim(),
                    fullName: String(row["Student Name"]).trim(),
                    email: row["Email Id"]
                        ? String(row["Email Id"]).trim().toLowerCase()
                        : null,
                    branch: "CSE",
                    section: String(row["SEC."]).trim(),
                    year: Number(row["Year"]),
                };
            }

            const existing = await prisma.student.findUnique({
                where: {
                    universityId: student.universityId,
                },
            });

            if (existing) {
                skipped++;
                continue;
            }

            await prisma.student.create({
                data: student,
            });

            imported++;
        } catch (error) {
            failed++;

            console.log(
                `Failed for ${row["University Roll No"] || row["Student Name"]
                }:`,
                error.message
            );
        }
    }
}

console.log("\n==============================");
console.log("Import Completed");
console.log("==============================");
console.log("Imported :", imported);
console.log("Skipped  :", skipped);
console.log("Failed   :", failed);

await prisma.$disconnect();