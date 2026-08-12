import 'dotenv/config'
import calcInternshipsScore from '../../lib/spi/sources/internships.js'

async function runTest() {
  console.log('====================================================')
  console.log('            INTERNSHIPS ENGINE TEST SUITE          ')
  console.log('====================================================\n')

  const studentName = 'Priyanshu Raj'

  // Test 1: Semester 3 (Year 2 start) — 0 internships expected
  const test1 = await calcInternshipsScore({
    year: 2,
    admissionYear: 2025,
    studentName,
    internships: [],
  })
  console.log('Test 1 [Sem 3 - 0 required, 0 submitted]:')
  console.log('  Score:', test1.score, '/ 10 | Target:', test1.targets)

  // Test 2: Semester 5 — 1 internship required, 1 paid ₹30k/mo with offer letter & cert
  const test2 = await calcInternshipsScore({
    year: 3,
    admissionYear: 2024,
    studentName,
    internships: [
      {
        company: 'Amazon AWS',
        role: 'Cloud Engineering Intern',
        isPaid: true,
        stipendAmount: 30000,
        startDate: '2025-05-01',
        endDate: '2025-08-31',
        techStack: ['AWS', 'Python', 'Docker'],
        offerLetterUrl: '/uploads/offer.pdf',
        completionCertificateUrl: '/uploads/completion.pdf',
        recipientName: 'Priyanshu Raj',
      },
    ],
  })
  console.log('\nTest 2 [Sem 5 - 1 required, 1 High Paid (₹30k/mo) + verified docs]:')
  console.log('  Score:', test2.score, '/ 10')
  console.log('  Breakdown:', JSON.stringify(test2.breakdown[0], null, 2))

  // Test 3: Document PDF Gate — Missing offer letter / certificate URL
  const test3 = await calcInternshipsScore({
    year: 3,
    admissionYear: 2024,
    studentName,
    internships: [
      {
        company: 'Local Startup',
        role: 'Web Intern',
        isPaid: false,
        offerLetterUrl: '', // NO DOCUMENT ATTACHED
      },
    ],
  })
  console.log('\nTest 3 [Document PDF Gate - Missing PDF]:')
  console.log('  Score:', test3.score, '/ 10 | Badge:', test3.breakdown[0]?.authenticityBadge)

  // Test 4: Identity Mismatch — Document for another student
  const test4 = await calcInternshipsScore({
    year: 3,
    admissionYear: 2024,
    studentName,
    internships: [
      {
        company: 'Google',
        role: 'Software Intern',
        isPaid: true,
        stipendAmount: 50000,
        offerLetterUrl: '/uploads/offer.pdf',
        recipientName: 'Shivanshu Shukla', // MISMATCH against Priyanshu Raj
      },
    ],
  })
  console.log('\nTest 4 [Identity Mismatch Penalty]:')
  console.log('  Score:', test4.score, '/ 10 | Badge:', test4.breakdown[0]?.authenticityBadge)
}

runTest().catch(console.error)
