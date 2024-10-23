"use client"

import { useTheme } from "next-themes";

export default function Home() {
  const {setTheme} = useTheme();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <button onClick={() => setTheme("light")}>LIGHT</button>
      <button onClick={() => setTheme("dark")}>DARK</button>
      <button onClick={() => setTheme("system")}>SYSTEM</button>
    </main>
  )
}