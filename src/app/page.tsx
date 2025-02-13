// self-care-app\src\app\page.tsx

"use client";

import ThemeSwitch from "@/components/theme-switch";
import { SignInButton, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-24">
      <div className="w-full max-w-4xl bg-card rounded-lg shadow-lg p-12">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <img
            src="/self-care-logo.svg"
            alt="Self-care logo"
            className="w-14 h-auto"
          />
        </div>
        {/* Header Section */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground">
            Welcome to Your Self-Care Journey with{" "}
            <span className="text-primary">Dlife</span>
          </h1>
          <p className="mt-2 text-xl text-muted-foreground">
            A place to relax, recharge, and focus on your well-being.
          </p>
        </header>

        {/* Main Content Section */}
        <section className="text-center">
          <p className="text-lg text-muted-foreground mb-4">
            Take a moment for yourself. Explore resources that help you unwind,
            reflect, and grow.
          </p>
          <SignInButton mode="redirect">
            <button className="bg-primary hover:bg-primary/80 text-primary-foreground font-semibold py-2 px-6 rounded-full">
              Start Your Journey
            </button>
          </SignInButton>
        </section>
      </div>
      <div className="text-center align-middle justify-center mt-4">
        <ThemeSwitch />
      </div>
    </main>
  );
}
