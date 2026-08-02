import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import AuthProvider from "@/components/AuthProvider";
import CustomCursor from "@/components/CustomCursor";

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

export const metadata = {
  name: "Gaurav Bhindwar",
  author: "Gaurav Bhindwar",
  keywords: "Gaurav Bhindwar, Portfolio, Gaurav Bhindwar Portfolio",
  title: "Gaurav Bhindwar",
  description: "Gaurav Bhindwar's portfolio website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark">
      <body className={`${inter.variable} ${plusJakartaSans.variable} font-sans bg-base-100 text-base-content`}>
        <CustomCursor />
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
