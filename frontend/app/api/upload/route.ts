import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import type { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const universityId = String(formData.get('universityId') || 'temp')
    const folder = String(formData.get('folder') || 'misc')

    if (!file || typeof file === 'string') {
      return Response.json({ success: false, error: 'No file provided' })
    }

    const fileName = String(formData.get('fileName') || file.name || 'file')

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      return Response.json({ 
        success: false, 
        error: 'Only PDF, JPG, PNG files allowed' 
      })
    }

    if (file.size > 10 * 1024 * 1024) {
      return Response.json({ 
        success: false, 
        error: 'File size must be under 10MB' 
      })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', universityId, folder)
    await mkdir(uploadDir, { recursive: true })
    
    const uniqueFileName = `${Date.now()}-${fileName}`
    const filePath = path.join(uploadDir, uniqueFileName)
    
    await writeFile(filePath, buffer)
    
    const publicUrl = `/uploads/${universityId}/${folder}/${uniqueFileName}`

    return Response.json({ 
      success: true, 
      url: publicUrl 
    })

  } catch (error) {
    console.error('Upload Error:', error)
    return Response.json({ success: false, error: error instanceof Error ? error.message : String(error) })
  }
}
