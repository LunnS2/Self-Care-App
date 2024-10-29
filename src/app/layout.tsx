import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import SideBar from "@/components/side-bar";
import ConvexClientProvider from "@/providers/convex-client-provider";
import { ClerkProvider, UserButton } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Self-Care-App",
  description: "Your self-care app of choice",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider dynamic>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <ConvexClientProvider>
              {children}
            </ConvexClientProvider>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
