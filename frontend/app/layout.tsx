import type { ReactNode } from 'react'
import { Inter, Newsreader, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap', adjustFontFallback: false })
const newsreader = Newsreader({ subsets: ['latin'], variable: '--font-newsreader', display: 'swap', adjustFontFallback: false })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono', display: 'swap', adjustFontFallback: false })
import { ToastProvider } from '@/components/ToastContext'
import { KeyboardShortcutProvider } from '@/components/KeyboardShortcuts'
import { DemoProvider } from '@/components/DemoContext'
import { ThemeProvider } from '@/components/ThemeProvider'

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
    <html lang="en" className={`${inter.variable} ${newsreader.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="font-sans antialiased page-fade-in bg-bg text-content transition-colors">
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
