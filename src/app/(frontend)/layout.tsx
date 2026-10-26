import type { Metadata } from 'next'
import './styles.css'

export const metadata: Metadata = {
  title: 'GAMEX — Premium Gaming Arena Booking',
  description: 'Discover gaming arenas and try the GAMEX booking demo.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#09090f] text-[#f0eeff] antialiased">{children}</body>
    </html>
  )
}
