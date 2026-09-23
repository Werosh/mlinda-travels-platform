import type { Metadata } from 'next'
import { Inter, Fraunces } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toast'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    default: 'Mlinda Travels - Hotels & Car Rentals in Sri Lanka',
    template: '%s | Mlinda Travels',
  },
  description:
    'Discover, compare, and book the finest hotels and car rentals across Sri Lanka. Seamless booking, real-time availability, and exceptional service with Mlinda Travels.',
  keywords: ['Sri Lanka hotels', 'car rental Sri Lanka', 'travel booking', 'Colombo hotels', 'Mlinda Travels'],
  openGraph: {
    title: 'Mlinda Travels',
    description: 'Premium hotel and car rental booking in Sri Lanka',
    type: 'website',
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${fraunces.variable} font-sans antialiased bg-background text-foreground`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}

