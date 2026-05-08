import './globals.css'
import { ToastProvider } from '@/components/ToastContext'
import { KeyboardShortcutProvider } from '@/components/KeyboardShortcuts'
import { DemoProvider } from '@/components/DemoContext'
import { GlobalBreadcrumbs } from '@/components/GlobalBreadcrumbs'
import { DemoFloatingButton } from '@/components/DemoFloatingButton'

export const metadata = {
  title: 'Educator Analytics OS — AI-Powered Student Intelligence Platform',
  description: 'Multi-role AI-powered web application for engineering colleges in India. Track Student Potential Index, career paths, and institutional analytics.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'Inter', sans-serif" }} className="page-fade-in">
        <ToastProvider>
          <KeyboardShortcutProvider>
            <DemoProvider>
              <div className="flex flex-col min-h-screen">
                <GlobalBreadcrumbs />
                <div className="flex-1 overflow-hidden">
                  {children}
                </div>
              </div>
              <DemoFloatingButton />
            </DemoProvider>
          </KeyboardShortcutProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
