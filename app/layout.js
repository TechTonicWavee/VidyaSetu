import './globals.css'

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
      <body style={{ fontFamily: "'Inter', sans-serif" }}>
        {children}
      </body>
    </html>
  )
}
