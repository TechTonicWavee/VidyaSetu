import type { ReactNode } from 'react'
import './globals.css'
import { ToastProvider } from '@/components/ToastContext'
import { KeyboardShortcutProvider } from '@/components/KeyboardShortcuts'
import { DemoProvider } from '@/components/DemoContext'
import { ThemeProvider } from '@/components/ThemeProvider'

if (typeof console !== 'undefined') {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('The width(-1) and height(-1) of chart should be greater than 0')
    ) {
      return;
    }
    originalWarn(...args);
  };
}

export const metadata = {
  title: 'VidyaSetu — AI-Powered Student Intelligence Platform',
  description: 'Multi-role AI-powered web application for engineering colleges in India. Track Student Potential Index, career paths, and institutional analytics.',
}

// Sets the `dark` class on <html> before hydration/paint so switching themes
// (or loading with a system dark-mode preference) never flashes the wrong theme.
const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('vs_theme');
    var dark = stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (dark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body style={{ fontFamily: "'Inter', sans-serif" }} className="page-fade-in bg-white dark:bg-navy transition-colors">
        <ThemeProvider>
          <ToastProvider>
            <KeyboardShortcutProvider>
              <DemoProvider>
                <div className="flex flex-col min-h-screen">
                  <div className="flex-1 overflow-hidden">
                    {children}
                  </div>
                </div>
              </DemoProvider>
            </KeyboardShortcutProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
