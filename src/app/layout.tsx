import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import SideBar from "@/components/side-bar";
import ConvexClientProvider from "@/providers/convex-client-provider";
import { ClerkProvider, SignedIn, UserButton } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Self-Care-App",
  description: "Your self-care app of choice",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider dynamic>
      <html lang="en">
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ConvexClientProvider>
              {children}
              <SideBar />
              <header className="fixed top-0 right-0 p-2">
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </header>
            </ConvexClientProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}