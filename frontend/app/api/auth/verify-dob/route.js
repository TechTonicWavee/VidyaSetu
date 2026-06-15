import { prisma } from '@/lib/prisma'

export async function POST(request) {
  try {
    const { universityId, email } = await request.json()

    const student = await prisma.student.findUnique({
      where: { universityId }
    })

    if (!student) {
      return Response.json({ 
        success: false,
        error: 'University ID not found. Contact your coordinator.' 
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

    if (student.email) {
      // Case 1: Email exists in DB — compare as usual
      if (student.email.trim().toLowerCase() !== email.trim().toLowerCase()) {
        return Response.json({ 
          success: false,
          error: 'Verification failed.' 
        })
      }
    } else {
      // Case 2: Email is NULL — validate and persist a KIET email
      const normalised = email.trim().toLowerCase()
      if (!normalised.endsWith('@kiet.edu')) {
        return Response.json({ 
          success: false,
          error: 'Please enter a valid KIET email.' 
        })
      }
      await prisma.student.update({
        where: { universityId },
        data: { email: normalised }
      })
    }

    return Response.json({ 
      success: true,
      isFirstLogin: student.isFirstLogin,
      status: student.formStatus,
      name: student.fullName,
      universityId: student.universityId
    })

  } catch (error) {
    return Response.json({ 
      success: false, 
      error: error.message 
    })
  }
}