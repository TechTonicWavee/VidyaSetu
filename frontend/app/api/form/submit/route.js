import { prisma } from '@/lib/prisma'

export async function POST(request) {
  try {
    const data = await request.json()
    console.log('Form submission:', JSON.stringify(data, null, 2))

    await prisma.student.update({
      where: { universityId: data.universityId },
      data: {
        formStatus: 'submitted',
        formSubmittedAt: new Date(),
      },
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error('Form submission error:', error)
    return Response.json({ success: false, error: error.message })
  }
}
