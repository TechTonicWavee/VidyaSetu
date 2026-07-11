import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import os from 'os'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const universityId = formData.get('universityId') || 'temp'
    const folder = formData.get('folder') || 'misc'
    const fileName = formData.get('fileName') || file.name || 'file'

    if (!file) {
      return Response.json({ success: false, error: 'No file provided' })
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      return Response.json({ 
        success: false, 
        error: 'Only PDF, JPG, PNG files allowed' 
      })
    }

    if (file.size > 5 * 1024 * 1024) {
      return Response.json({ 
        success: false, 
        error: 'File size must be under 5MB' 
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
    return Response.json({ success: false, error: error.message })
  }
}
