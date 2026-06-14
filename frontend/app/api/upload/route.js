import { supabase } from '@/lib/supabase'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const universityId = formData.get('universityId')
    const folder = formData.get('folder') // 'resume', 'certifications', 'internships'
    const fileName = formData.get('fileName') // unique name like cert-1.pdf

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

    const path = `${universityId}/${folder}/${fileName}`

    const { data, error } = await supabase.storage
      .from('student-documents')
      .upload(path, buffer, { 
        contentType: file.type, 
        upsert: true 
      })

    if (error) {
      return Response.json({ success: false, error: error.message })
    }

    const { data: urlData } = supabase.storage
      .from('student-documents')
      .getPublicUrl(path)

    return Response.json({ 
      success: true, 
      url: urlData.publicUrl 
    })

  } catch (error) {
    return Response.json({ success: false, error: error.message })
  }
}
