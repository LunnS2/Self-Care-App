"use client";

import ThemeSwitch from "@/components/theme-switch";
import { SignInButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground px-6 md:px-12 lg:px-24 transition-all duration-300
      ml-16 md:ml-20">
      <div className="w-full max-w-4xl bg-card rounded-lg shadow-lg p-6 md:p-12">
        {/* Logo */}
        <div className="flex items-center justify-center mb-6 md:mb-8">
          <Image
            src="/self-care-logo.svg"
            alt="Self-care logo"
            width={56}
            height={56}
            className="w-12 h-auto md:w-14"
            priority
          />
        </div>

        {/* Header Section */}
        <header className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Welcome to Your Self-Care Journey with{" "}
            <span className="text-primary">Dlife</span>
          </h1>
          <p className="mt-2 text-base md:text-lg text-muted-foreground">
            A place to relax, recharge, and focus on your well-being.
          </p>
        </header>

        {/* Main Content Section */}
        <section className="text-center">
          <p className="text-base md:text-lg text-muted-foreground mb-4">
            Take a moment for yourself. Explore resources that help you unwind,
            reflect, and grow.
          </p>
          <SignInButton mode="redirect">
            <button className="bg-primary hover:bg-primary/80 text-primary-foreground font-semibold py-2 px-6 rounded-full text-sm md:text-base">
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