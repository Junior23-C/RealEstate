import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { OrganizationStructuredData } from "@/components/structured-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Aliaj Real Estate Albania - Premium Properties for Rent & Sale in Tirana",
    template: "%s | Aliaj Real Estate Albania"
  },
  description: "Discover exceptional properties for rent and sale in Albania. Your trusted real estate partner in Tirana, Durrës, and throughout Albania. Premium listings, professional service.",
  keywords: ["real estate albania", "properties for rent tirana", "properties for sale albania", "houses albania", "apartments tirana", "condos albania", "aliaj real estate", "agjenci imobiliare", "shtepi me qera", "shtepi per shitje", "apartamente tirane", "prona ne shqiperi"],
  authors: [{ name: "Aliaj Real Estate" }],
  creator: "Aliaj Real Estate",
  publisher: "Aliaj Real Estate",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://aliaj-re.com"),
  alternates: {
    canonical: "/",
    languages: {
      'en': '/en',
      'sq': '/sq',
    },
  },
  openGraph: {
    title: "Aliaj Real Estate Albania - Premium Properties for Rent & Sale",
    description: "Discover exceptional properties for rent and sale in Albania. Your trusted real estate partner in Tirana and throughout Albania.",
    url: "https://aliaj-re.com",
    siteName: "Aliaj Real Estate Albania",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Aliaj Real Estate - Premium Properties in Albania",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aliaj Real Estate Albania - Premium Properties for Rent & Sale",
    description: "Discover exceptional properties for rent and sale in Albania. Your trusted real estate partner.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="theme-color" content="#000000" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
        <OrganizationStructuredData />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
