import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request) {
  try {
    const { universityId, password } = await request.json()

    const student = await prisma.student.findUnique({
      where: { universityId }
    })

    if (!student) {
      return Response.json({ 
        success: false,
        error: 'University ID not found.' 
      })
    }

    if (student.formStatus === 'submitted') {
      return Response.json({ 
        success: false,
        status: 'submitted',
        name: student.fullName,
        error: 'You have already submitted your form.'
      })
    }

    if (student.isFirstLogin || !student.password) {
      return Response.json({ 
        success: false,
        status: 'not_registered',
        error: 'Please verify your identity first.' 
      })
    }

    const passwordMatch = await bcrypt.compare(password, student.password)

    if (!passwordMatch) {
      return Response.json({ 
        success: false,
        error: 'Incorrect password.' 
      })
    }

    return Response.json({ 
      success: true,
      student: {
        universityId: student.universityId,
        name: student.fullName,
        branch: student.branch,
        year: student.year,
        section: student.section,
        formProgress: student.formProgress
      }
    })

  } catch (error) {
    return Response.json({ 
      success: false, 
      error: error.message 
    })
  }
}