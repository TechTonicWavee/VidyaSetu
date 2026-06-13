import { prisma } from '@/lib/prisma'

export async function POST(request) {
  try {
    const { universityId, dob } = await request.json()

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

    const studentDob = student.dob.toISOString().split('T')[0]
    const enteredDob = new Date(dob).toISOString().split('T')[0]

    if (studentDob !== enteredDob) {
      return Response.json({ 
        success: false,
        error: 'Date of birth does not match our records.' 
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