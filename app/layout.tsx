import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AuthProvider from '@/components/AuthProvider';
import ConditionalLayout from '@/components/ConditionalLayout';
import { SITE_COPY, SITE_NAME } from '@/lib/site-content';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: `${SITE_NAME} - Made in Kerala Export B2B Platform`,
  description: SITE_COPY.metadataDescription,
  openGraph: {
    title: `${SITE_NAME} - Made in Kerala Export B2B Platform`,
    description: SITE_COPY.metadataDescription,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} - Made in Kerala Export B2B Platform`,
    description: SITE_COPY.metadataDescription,
  },
  icons: {
    icon: [
      { url: '/epicLandLogo.webp?v=20260308', type: 'image/webp' },
      { url: '/epicLandLogo.webp?v=20260308', rel: 'shortcut icon', type: 'image/webp' },
    ],
    shortcut: '/epicLandLogo.webp?v=20260308',
    apple: '/epicLandLogo.webp?v=20260308',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <AuthProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </AuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
