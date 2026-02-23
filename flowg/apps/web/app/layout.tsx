import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./preview.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "FlowG — Animation Library",
  description:
    "Zero-bloat, attribute-driven animation library with a hybrid CSS/GSAP engine.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-(family-name:--font-geist-sans) antialiased`}>
        {children}
      </body>
    </html>
  );
}
