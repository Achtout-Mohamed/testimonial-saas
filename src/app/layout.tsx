import './globals.css'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'TestimonialPro - Collect Customer Testimonials Easily',
  description: 'The easiest way to collect and display customer testimonials. Start free with 10 testimonials included. Perfect for small businesses and agencies.',
  keywords: 'testimonials, customer reviews, social proof, business tools, SaaS',
  authors: [{ name: 'Mohamed Achtout' }],
  openGraph: {
    title: 'TestimonialPro - Collect Customer Testimonials Easily',
    description: 'The easiest way to collect and display customer testimonials. Start free!',
    url: 'https://testimonial-saas-fwvi.vercel.app',
    siteName: 'TestimonialPro',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TestimonialPro - Collect Customer Testimonials Easily',
    description: 'The easiest way to collect and display customer testimonials. Start free!',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}