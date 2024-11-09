"use client"

import { UserButton } from "@clerk/nextjs"

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-700 text-gray-100 p-24">
      <div className="w-full max-w-4xl bg-gray-800 rounded-lg shadow-lg p-12">
        {/* Header Section */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-100">Welcome to Your Self-Care Journey</h1>
          <p className="mt-2 text-xl text-gray-400">A place to relax, recharge, and focus on your well-being.</p>
        </header>

        {/* Main Content Section */}
        <section className="text-center">
          <p className="text-lg text-gray-300 mb-4">
            Take a moment for yourself. Explore resources that help you unwind, reflect, and grow.
          </p>
          <button className="bg-teal-400 hover:bg-teal-500 text-gray-900 font-semibold py-2 px-6 rounded-full">
            Start Your Journey
          </button>
        </section>
      </div>
    </main>
  )
}
