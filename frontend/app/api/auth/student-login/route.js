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

    if (student.formStatus !== 'submitted') {
      return Response.json({
        success: false,
        status: 'form_incomplete',
        error: 'Please complete your profile form first.'
      })
    }

    if (!student.password) {
      return Response.json({
        success: false,
        error: 'No password set. Please visit /form/login first.'
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
        section: student.section
      }
    })

  } catch (error) {
    return Response.json({
      success: false,
      error: error.message
    })
  }
}
