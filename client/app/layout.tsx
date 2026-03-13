import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import Proivders from "./providers";
import { redirect } from "next/navigation";
import NavigationListener from "@/components/navigationListener";
import localFont from "next/font/local";
import ContentLayout from "@/components/contentLayout";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Numitz",
  description: "A platform for competitive mathematics",
};
const rawkner = localFont({
  src: [
    {
      path: "../public/fonts/rawkner/Rawkner-Black.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "../public/fonts/rawkner/Rawkner-Round.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "../public/fonts/rawkner/Rawkner-Oblique.woff2",
      weight: "900",
      style: "oblique",
    },
    {
      path: "../public/fonts/rawkner/Rawkner-RoundOblique.woff2",
      weight: "900",
      style: "oblique",
    },
  ],
  variable: "--font-rawkner",
});

const satoshi = localFont({
  src: [
    {
      path: "../public/fonts/satoshi/Satoshi-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/satoshi/Satoshi-LightItalic.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "../public/fonts/satoshi/Satoshi-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/satoshi/Satoshi-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/satoshi/Satoshi-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/satoshi/Satoshi-MediumItalic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../public/fonts/satoshi/Satoshi-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/satoshi/Satoshi-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
    {
      path: "../public/fonts/satoshi/Satoshi-Black.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "../public/fonts/satoshi/Satoshi-BlackItalic.woff2",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-satoshi",
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${rawkner.variable} ${satoshi.variable}`}
    >
      <head>
        {/* MathJax v4 Configuration */}
        <script
          id="mathjax-config"
          dangerouslySetInnerHTML={{
            __html: `
        window.MathJax = {
          tex: {
            // Inline math: support \( ... \) and $ ... $
            inlineMath: [['\\\\(', '\\\\)'], ['$', '$']],
            // Display math: support \[ ... \] and $$ ... $$
            displayMath: [['\\\\[', '\\\\]'], ['$$', '$$']],
            processEscapes: true,
            tags: 'ams',             // support \tag{} numbering
            tagSide: 'right',
            tagIndent: '0.2em'
          },
          options: {
            skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'], 
          },
          chtml: {
            // font variant
            scale: 1,
            mtextInheritFont: true
          },
          startup: {
            pageReady() {
              // ensures MathJax finishes typesetting before Next.js hydration
              return MathJax.startup.defaultPageReady();
            }
          }
        };
      `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* MathJax v4 CDN */}
        <Script
          src="https://cdn.jsdelivr.net/npm/mathjax@4/tex-chtml.js"
          strategy="afterInteractive"
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Proivders>
            <NavigationListener />
            <ContentLayout children={children} />
            <Toaster />
            <Footer />
          </Proivders>
        </ThemeProvider>
      </body>
    </html>
  );
}
