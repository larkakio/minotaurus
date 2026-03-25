import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://minotaurus-iota.vercel.app';

export const metadata: Metadata = {
  title: 'Minotaurus - Cyberpunk Maze Chase',
  description: 'Navigate the neon labyrinth and escape the Minotaur. Mini App for Base & Farcaster.',
  other: {
    viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
    'theme-color': '#0a0e1a',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'base:app_id': process.env.NEXT_PUBLIC_BASE_APP_ID || '698455687a0334031d1344ea',
  },
  openGraph: {
    title: 'Minotaurus',
    description: 'Cyberpunk maze chase game. Navigate heroes through the neon labyrinth.',
    images: [{ url: `${APP_URL}/hero-image.png`, width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-[#0a0e1a]">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#0a0e1a" />
        <meta name="base:app_id" content="698455687a0334031d1344ea" />
      </head>
      <body className="min-h-screen bg-[#0a0e1a] text-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
