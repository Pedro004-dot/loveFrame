import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LoveFrame - Crie a Retrospectiva do Seu Relacionamento",
  description: "Como o Spotify Wrapped, mas do seu amor 💕. Transforme memórias em presente digital com retrospectivas personalizadas do seu relacionamento. Crie stories interativos e compartilhe sua história de amor.",
  keywords: ["retrospectiva", "relacionamento", "presente", "amor", "casal", "memórias", "wrapped", "stories", "presente digital"],
  authors: [{ name: "LoveFrame" }],
  creator: "LoveFrame",
  publisher: "LoveFrame",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://loveframe.com.br'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "LoveFrame - Crie a Retrospectiva do Seu Relacionamento",
    description: "Como o Spotify Wrapped, mas do seu amor 💕. Transforme memórias em presente digital com retrospectivas personalizadas.",
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://loveframe.com.br',
    siteName: "LoveFrame",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LoveFrame - Retrospectiva de Relacionamento',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "LoveFrame - Crie a Retrospectiva do Seu Relacionamento",
    description: "Como o Spotify Wrapped, mas do seu amor 💕. Transforme memórias em presente digital.",
    images: ['/og-image.png'],
    creator: '@loveframe',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
