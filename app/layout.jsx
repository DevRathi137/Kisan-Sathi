import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata = {
  metadataBase: new URL("https://kisansathi.vercel.app"),
  title: {
    default: "KisanSathi — AI-Powered Smart Agriculture",
    template: "%s | KisanSathi",
  },
  description:
    "KisanSathi empowers Indian farmers with AI-driven tools for crop recommendation, water management, rainfall prediction, and fertilizer guidance.",
  keywords: [
    "smart farming",
    "AI agriculture",
    "crop recommendation",
    "Indian farmers",
    "kisan",
    "rainfall prediction",
    "fertilizer recommendation",
    "water management",
    "precision farming",
    "Madhya Pradesh farming",
  ],
  authors: [{ name: "KisanSathi" }],
  creator: "KisanSathi",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://kisansathi.vercel.app",
    siteName: "KisanSathi",
    title: "KisanSathi — AI-Powered Smart Agriculture",
    description:
      "Empowering Indian farmers with AI-driven tools for smarter, sustainable agriculture.",
    images: [{ url: "/Hero.png", width: 1200, height: 630, alt: "KisanSathi" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "KisanSathi — AI-Powered Smart Agriculture",
    description: "Empowering Indian farmers with AI-driven tools.",
    images: ["/Hero.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <Navbar />
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
