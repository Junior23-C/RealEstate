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
    default: "Aliaj Real Estate - Premium Properties for Rent & Sale",
    template: "%s | Aliaj Real Estate"
  },
  description: "Discover exceptional properties for rent and sale. Your trusted partner in real estate with premium listings, professional service, and expert guidance.",
  keywords: ["real estate", "properties for rent", "properties for sale", "houses", "apartments", "condos", "aliaj real estate"],
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
  },
  openGraph: {
    title: "Aliaj Real Estate - Premium Properties for Rent & Sale",
    description: "Discover exceptional properties for rent and sale. Your trusted partner in real estate.",
    url: "https://aliaj-re.com",
    siteName: "Aliaj Real Estate",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Aliaj Real Estate - Premium Properties",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aliaj Real Estate - Premium Properties for Rent & Sale",
    description: "Discover exceptional properties for rent and sale. Your trusted partner in real estate.",
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
