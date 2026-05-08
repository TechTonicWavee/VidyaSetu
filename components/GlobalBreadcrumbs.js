'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export function GlobalBreadcrumbs() {
  const pathname = usePathname() || ''
  
  // Do not show on these pages
  if (pathname === '/login' || pathname === '/demo' || pathname === '/demo-script' || pathname === '/') {
    return null
  }

  // Parse path into segments
  const segments = pathname.split('/').filter(Boolean)
  
  // Map segments to readable names
  const generateBreadcrumbs = () => {
    const breadcrumbs = []
    
    // Add Home basis depending on role
    let basePath = ''
    let roleName = ''
    if (segments.includes('student')) { basePath = '/dashboard/student'; roleName = 'Student Dashboard' }
    else if (segments.includes('faculty')) { basePath = '/dashboard/faculty'; roleName = 'Faculty Dashboard' }
    else if (segments.includes('dean')) { basePath = '/dashboard/dean'; roleName = 'Dean Dashboard' }
    else if (segments.includes('admin')) { basePath = '/dashboard/admin'; roleName = 'Admin Dashboard' }
    else if (segments.includes('parent')) { basePath = '/dashboard/parent'; roleName = 'Parent Dashboard' }
    else { basePath = '/dashboard'; roleName = 'Dashboard' }

    breadcrumbs.push({ label: roleName, path: basePath })

    // Build the rest
    let currentPath = ''
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`
      // Skip the base dashboard segments as we've already grouped them
      if (['dashboard', 'student', 'faculty', 'dean', 'admin', 'parent'].includes(segment)) return

      // Format name
      const name = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      // If it's the last segment, it doesn't need a path
      const isLast = index === segments.length - 1
      breadcrumbs.push({
        label: name,
        path: isLast ? null : currentPath
      })
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <div className="bg-transparent px-6 pt-4 pb-2 print:hidden page-fade-in">
      <nav className="flex items-center gap-2 text-[13px]">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1
          
          return (
            <div key={index} className="flex items-center gap-2">
              {index > 0 && <span className="text-gray-400 font-medium">›</span>}
              {isLast || !crumb.path ? (
                <span className="font-semibold text-navy">{crumb.label}</span>
              ) : (
                <Link href={crumb.path} className="text-gray-500 hover:text-blue-600 transition">
                  {crumb.label}
                </Link>
              )}
            </div>
          )
        })}
      </nav>
    </div>
  )
}
