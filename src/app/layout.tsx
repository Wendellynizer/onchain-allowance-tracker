import type { Metadata } from 'next';
import '@coinbase/onchainkit/styles.css';
import '@worldcoin/mini-apps-ui-kit-react/styles.css';
import { MiniKit } from '@worldcoin/minikit-js'
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: "Onchain Daily Allowance Tracker",
  description: "Track daily expenses with onchain transparency. Log, categorize, and manage budgets. Visualize spending habits and join shared wallets for group tracking. Experience financial literacy on Base.",
  other: {
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: "https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/thumbnail_94e108b1-4a65-4dfe-9cfd-9b5f8c1aa45a-tO79zhqJqVDCy73g96N67i4Tv6r5em",
      button: {
        title: "Open with Ohara",
        action: {
          type: "launch_frame",
          name: "Onchain Allowance Tracker",
          url: "https://turn-stopped-625.preview.series.engineering",
          splashImageUrl: "https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/farcaster/splash_images/splash_image1.svg",
          splashBackgroundColor: "#ffffff"
        }
      }
    })
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

 

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:ital@0;1&family=Rubik:ital,wght@0,300..900;1,300..900&family=Sora:wght@600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}