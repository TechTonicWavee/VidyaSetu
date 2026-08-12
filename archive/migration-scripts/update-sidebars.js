const fs = require('fs')
const path = require('path')

const roles = {
  student: {
    navLinksStr: `const navLinks = [
  { id: 'dashboard',  label: 'Dashboard',       icon: Home,       badge: null,  active: true, path: '/dashboard/student' },
  { id: 'profile',    label: 'My Profile',       icon: User,       badge: null,  active: false, path: '/dashboard/student/profile' },
  { id: 'skill',      label: 'Skill Radar',      icon: Activity,   badge: null,  active: false, path: '/dashboard/student/skill-radar' },
  { id: 'spi',        label: 'SPI Score',        icon: TrendingUp, badge: null,  active: false, path: '/dashboard/student/spi' },
  { id: 'career',     label: 'Career Path',      icon: TrendingUp, badge: null,  active: false, path: '/dashboard/student/career' },
  { id: 'team',       label: 'My Team',          icon: Users,      badge: null,  active: false, path: '/dashboard/student/my-team' },
  { id: 'notifs',     label: 'Notifications',    icon: Bell,       badge: '3',   active: false, path: '/dashboard/student/notifications' },
  { id: 'rankings',   label: 'Rankings',         icon: Award,      badge: null,  active: false, path: '/dashboard/student/rankings' },
  { id: 'directory',  label: 'Domain Directory', icon: Grid,       badge: null,  active: false, path: '/dashboard/student/directory' },
  { id: 'resume',     label: 'Resume Builder',   icon: FileText,   badge: null,  active: false, path: '/dashboard/student/resume' },
  { id: 'placement',  label: 'Placement Readiness', icon: Target, badge: null,  active: false, path: '/dashboard/student/placement' },
  { id: 'action',     label: 'Action Plan',      icon: CheckCircle, badge: null,  active: false, path: '/dashboard/student/action-plan' },
  { id: 'potential',  label: 'Potential Gap',    icon: Zap,        badge: null,  active: false, path: '/dashboard/student/potential-gap' },
  { id: 'extra',      label: 'Extracurriculars', icon: Award,      badge: null,  active: false, path: '/dashboard/student/extracurricular' },
  { id: 'integrations', label: 'Integrations',   icon: Plug,       badge: null,  active: false, path: '/integrations' },
  { id: 'assignments',  label: 'Assignments',    icon: BookOpen,   badge: null,  active: false, path: '/student/assignments' },
  { id: 'attendance',   label: 'Attendance',     icon: CheckCircle,badge: null,  active: false, path: '/student/attendance' },
  { id: 'advisor',    label: 'AI Advisor',       icon: Search,     badge: null,  active: false, path: '/ai-advisor' },
]`,
  },
  faculty: {
    navLinksStr: `const navLinks = [
  { id: 'dashboard',  label: 'Dashboard',        icon: Home,       badge: null,  active: true, path: '/dashboard/faculty' },
  { id: 'analytics',  label: 'Subject Analytics',icon: Activity,   badge: null,  active: false, path: '/dashboard/faculty/analytics' },
  { id: 'alerts',     label: 'Student Alerts',   icon: AlertCircle,badge: '2',   active: false, path: '/dashboard/faculty/alerts' },
  { id: 'profiles',   label: 'Student Profiles', icon: Users,      badge: null,  active: false, path: '/dashboard/faculty/student/profile' },
  { id: 'co-attain',  label: 'CO Attainment',    icon: Target,     badge: null,  active: false, path: '/dashboard/faculty/co-attainment' },
  { id: 'parent-com', label: 'Parent Communication', icon: Bell,   badge: null,  active: false, path: '/dashboard/faculty/parent-communication' },
  { id: 'parent-vis', label: 'Parent Visit Mode',icon: Users,      badge: null,  active: false, path: '/dashboard/faculty/parent-visit' },
  { id: 'reports',    label: 'Reports',          icon: FileText,   badge: null,  active: false, path: '/dashboard/faculty/reports' },
  { id: 'advisor',    label: 'AI Advisor',       icon: Search,     badge: null,  active: false, path: '/ai-advisor' },
]`,
  },
  dean: {
    navLinksStr: `const navLinks = [
  { id: 'dashboard',  label: 'Dashboard',        icon: Home,       badge: null,  active: true, path: '/dashboard/dean' },
  { id: 'department', label: 'Department Overview', icon: Grid,    badge: null,  active: false, path: '/dashboard/dean/department' },
  { id: 'faculty',    label: 'Faculty Performance', icon: Users,   badge: null,  active: false, path: '/dashboard/dean/faculty-performance' },
  { id: 'forecast',   label: 'Cohort Forecasting',  icon: TrendingUp,badge: null,active: false, path: '/dashboard/dean/forecasting' },
  { id: 'curriculum', label: 'Curriculum Analysis', icon: BookOpen,badge: null,  active: false, path: '/dashboard/dean/curriculum' },
  { id: 'policy',     label: 'Policy Simulation',   icon: Activity,badge: null,  active: false, path: '/dashboard/dean/policy-simulation' },
  { id: 'accredit',   label: 'Accreditation Reports',icon: FileText,badge: null, active: false, path: '/dashboard/dean/accreditation' },
  { id: 'cross',      label: 'Cross-Branch Insights', icon: Target, badge: null, active: false, path: '/dashboard/dean/cross-branch' },
  { id: 'advisor',    label: 'AI Advisor',       icon: Search,     badge: null,  active: false, path: '/ai-advisor' },
]`,
  },
  admin: {
    navLinksStr: `const navLinks = [
  { id: 'dashboard',  label: 'Dashboard',        icon: Home,       badge: null,  active: true, path: '/dashboard/admin' },
  { id: 'config',     label: 'Configuration',    icon: Settings,   badge: null,  active: false, path: '/dashboard/admin/configuration' },
  { id: 'spi-config', label: 'SPI Weight Config',icon: Target,     badge: null,  active: false, path: '/dashboard/admin/spi-config' },
  { id: 'institution',label: 'Institution Settings',icon: Grid,    badge: null,  active: false, path: '/dashboard/admin/institution' },
  { id: 'logs',       label: 'System Logs',      icon: Activity,   badge: null,  active: false, path: '/dashboard/admin/configuration' },
]`,
  }
}

function processDirectory(dir, role) {
  const files = fs.readdirSync(dir)
  for (const file of files) {
    const fullPath = path.join(dir, file)
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath, role)
    } else if (file === 'page.js') {
      let content = fs.readFileSync(fullPath, 'utf8')
      
      const navLinksRegex = /const navLinks = \[\s*([\s\S]*?)\s*\]/m
      if (content.match(navLinksRegex)) {
        content = content.replace(navLinksRegex, roles[role].navLinksStr)
      }

      const onClickRegex = /onClick=\{\(\) => \{[\s\S]*?(?:setActiveNav|router\.push)[\s\S]*?\}\}/
      const newOnClick = `onClick={() => {
                if (link.path) {
                  router.push(link.path)
                } else {
                  if (typeof setActiveNav === 'function') setActiveNav(link.id)
                }
              }}`
      if (content.match(onClickRegex)) {
        content = content.replace(onClickRegex, newOnClick)
      }

      fs.writeFileSync(fullPath, content, 'utf8')
      console.log('Updated sidebars in', fullPath)
    }
  }
}

function cleanImports(dir) {
    const files = fs.readdirSync(dir)
    for (const file of files) {
        const fullPath = path.join(dir, file)
        if (fs.statSync(fullPath).isDirectory()) {
            cleanImports(fullPath)
        } else if (file === 'page.js') {
            let content = fs.readFileSync(fullPath, 'utf8')
            const importMatch = content.match(/import\s+\{([^}]+)\}\s+from\s+['"]lucide-react['"]/)
            if (importMatch) {
                let icons = importMatch[1].replace(/\n/g, ' ').split(',').map(s => s.trim()).filter(Boolean)
                const iconsToEnsure = ['Home', 'User', 'Activity', 'TrendingUp', 'Users', 'Bell', 'Award', 'Grid', 'FileText', 'Settings', 'LogOut', 'Search', 'Target', 'CheckCircle', 'Zap', 'BookOpen', 'AlertCircle', 'Plug']
                icons = [...new Set([...icons, ...iconsToEnsure])] 
                content = content.replace(importMatch[0], `import { ${icons.join(', ')} } from 'lucide-react'`)
                fs.writeFileSync(fullPath, content, 'utf8')
            }
        }
    }
}

const baseDir = path.join(__dirname, '../app/dashboard')
const roleDirs = ['student', 'faculty', 'dean', 'admin']

for (const role of roleDirs) {
  processDirectory(path.join(baseDir, role), role)
  cleanImports(path.join(baseDir, role))
}
