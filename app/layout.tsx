import { ClerkProvider } from "@clerk/nextjs";
import { ui } from "@clerk/ui";
import { shadcn } from "@clerk/ui/themes";
import type { Metadata } from "next";
import { IBM_Plex_Serif, Mona_Sans } from "next/font/google";

import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";

const ibmPlexSerif = IBM_Plex_Serif({  
  variable: "--font-ibm-plex-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const monaSans = Mona_Sans({  
  variable: "--font-mona-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bookify",
  description: "Transform your books into interactive AI conversations. Upload PDFs, and chat with your books using voice.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body 
        className={`${ibmPlexSerif.variable} ${monaSans.variable} relative font-sans antialiased`}>
        <ClerkProvider ui={ui} appearance={{ theme: shadcn }}>
          <Navbar />
          {children}
          <Toaster /> 
        </ClerkProvider>
      </body>
    </html>
  );
}