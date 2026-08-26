import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import AuthProvider from "@/components/AuthProvider";
import CustomCursor from "@/components/CustomCursor";
import WhatsAppButton from "@/components/WhatsAppButton";
import FlashBanner from "@/components/FlashBanner";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter'
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-jakarta'
});

const SITE_URL = "https://gauravbhindwar.dev";
const SITE_TITLE = "Gaurav Kumar - Software Architect & AI Engineer";
const SITE_DESCRIPTION =
  "Portfolio of Gaurav Kumar - a full stack software architect and AI/GenAI engineer specializing in Next.js, React, Node.js, and scalable AI-driven systems. Explore projects, work experience, and get in touch.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | Gaurav Kumar",
  },
  description: SITE_DESCRIPTION,
  applicationName: "Gaurav Kumar Portfolio",
  authors: [{ name: "Gaurav Kumar", url: SITE_URL }],
  creator: "Gaurav Kumar",
  publisher: "Gaurav Kumar",
  keywords: [
    "Gaurav Kumar",
    "GauravKumar",
    "Gaurav Bhindwar",
    "gauravbhindwar",
    "Gaurav Kumar portfolio",
    "Gaurav Kumar developer",
    "Software Architect",
    "AI Engineer",
    "GenAI Engineer",
    "Full Stack Developer",
    "Next.js developer",
    "React developer",
    "Node.js developer",
    "Manipal University Jaipur",
  ],
  category: "technology",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Gaurav Kumar Portfolio",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/gaurav.jpg",
        width: 800,
        height: 800,
        alt: "Gaurav Kumar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/gaurav.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  verification: {
    // Fill in once you register with Google Search Console / Bing Webmaster
    // Tools - the verification meta tag is required before either will
    // start crawling and ranking this domain for search.
    // google: 'your-google-site-verification-code',
    // other: { 'msvalidate.01': 'your-bing-verification-code' },
  },
};

export const viewport = {
  themeColor: "#0b1326",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Gaurav Kumar",
  alternateName: ["GauravKumar", "Gaurav Bhindwar", "gauravbhindwar"],
  url: SITE_URL,
  image: `${SITE_URL}/gaurav.jpg`,
  jobTitle: "Software Architect & AI Engineer",
  description: SITE_DESCRIPTION,
  sameAs: [
    "https://github.com/gauravbhindwar",
    "https://www.linkedin.com/in/gauravbhindwar/",
  ],
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Manipal University Jaipur",
  },
  knowsAbout: [
    "Software Architecture",
    "Artificial Intelligence",
    "Generative AI",
    "Next.js",
    "React",
    "Node.js",
    "Full Stack Development",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${plusJakartaSans.variable} font-sans bg-base-100 text-base-content`}>
        <CustomCursor />
        <AuthProvider>
          <ThemeProvider>
            {children}
            <WhatsAppButton />
            <FlashBanner />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
