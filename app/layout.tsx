import type { Metadata } from 'next';
import './globals.css';
import { FarcasterReady } from '@/components/FarcasterReady';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://minotaurus-iota.vercel.app';

const FC_EMBED = {
  version: '1' as const,
  imageUrl: `${APP_URL}/hero-image.png`,
  button: {
    title: 'Play Minotaurus',
    action: {
      type: 'launch_frame' as const,
      name: 'Minotaurus',
      url: APP_URL,
      splashImageUrl: `${APP_URL}/hero-image.png`,
      splashBackgroundColor: '#0a0e1a',
    },
  },
};

export const metadata: Metadata = {
  title: 'Minotaurus - Cyberpunk Maze Chase',
  description: 'Navigate the neon labyrinth and escape the Minotaur. Mini App for Base & Farcaster.',
  other: {
    viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
    'theme-color': '#0a0e1a',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'fc:miniapp': JSON.stringify(FC_EMBED),
    'fc:frame': JSON.stringify(FC_EMBED),
    'base:app_id': process.env.NEXT_PUBLIC_BASE_APP_ID || '',
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
      </head>
      <body className="min-h-screen bg-[#0a0e1a] text-white antialiased">
        <FarcasterReady />
        {children}
      </body>
    </html>
  );
}
