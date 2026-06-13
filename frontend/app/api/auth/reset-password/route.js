import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request) {
  try {
    const { universityId, password } = await request.json()

    if (password.length < 8) {
      return Response.json({
        success: false,
        error: 'Password must be at least 8 characters.'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.student.update({
      where: { universityId },
      data: { password: hashedPassword }
    })

    return Response.json({
      success: true,
      message: 'Password reset successfully.'
    })

  } catch (error) {
    return Response.json({
      success: false,
      error: error.message
    })
  }
}
