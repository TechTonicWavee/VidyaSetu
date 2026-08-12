import 'dotenv/config'
import { parseResume } from '../lib/resume/parser'

async function main() {
  // Priyanshu's local resume path from DB
  const resumeUrl = '/uploads/temp/resume/1785837370732-new_resume (4).pdf'
  
  console.log('\n=== Running Resume Parse Pipeline ===')
  console.log('URL:', resumeUrl)

  try {
    const parsed = await parseResume(resumeUrl)
    
    console.log('\n=== PARSED RESULT ===')
    console.log('Summary:', parsed.summary ? '✅ ' + parsed.summary.slice(0, 100) + '...' : '❌ empty')
    console.log('Education:', parsed.education.length > 0 ? `✅ ${parsed.education.length} items` : '❌ empty')
    console.log('Skills:', parsed.skills.length > 0 ? `✅ ${parsed.skills.length} items` : '❌ empty')
    console.log('Projects:', parsed.projects.length > 0 ? `✅ ${parsed.projects.length} items` : '❌ empty')
    console.log('Certifications:', parsed.certifications.length > 0 ? `✅ ${parsed.certifications.length} items` : '❌ empty')
    console.log('Leadership:', parsed.leadership.length > 0 ? `✅ ${parsed.leadership.length} items` : '❌ empty')
    
    console.log('\n--- Skills ---')
    parsed.skills.forEach(s => console.log(' •', s))
    
    console.log('\n--- Education ---')
    parsed.education.forEach(e => console.log(' •', e))
    
    console.log('\n--- Projects ---')
    parsed.projects.forEach(p => console.log(' •', p.slice(0, 120)))
    
    console.log('\n--- Certifications ---')
    parsed.certifications.forEach(c => console.log(' •', c))
    
    console.log('\n--- Leadership ---')
    parsed.leadership.forEach(l => console.log(' •', l))
    
    console.log('\n--- Personal _raw (first 200 chars) ---')
    console.log((parsed.personal as any)?._raw?.slice(0, 200) ?? '(none)')

  } catch (err) {
    console.error('Pipeline error:', err)
  }
}

main()
