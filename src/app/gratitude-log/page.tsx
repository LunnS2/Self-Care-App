"use client";

import { useConvexAuth } from "convex/react";
import React, { useState, useEffect } from "react";

interface GratitudeItem {
  text: string;
  position: { top: string; left: string };
  id: number;
  visible: boolean;
}

const GratitudeLog: React.FC = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [gratitudes, setGratitudes] = useState<GratitudeItem[]>([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const storedGratitudes = localStorage.getItem("gratitudes");
    if (storedGratitudes) {
      const parsedGratitudes = JSON.parse(storedGratitudes);
      setGratitudes(parsedGratitudes);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("gratitudes", JSON.stringify(gratitudes));
  }, [gratitudes]);

  if (isLoading || !isAuthenticated) {
    return null;
  }

  const getRandomPosition = () => ({
    top: `${Math.floor(Math.random() * 90)}%`,
    left: `${Math.floor(Math.random() * 90)}%`,
  });

  const addGratitude = () => {
    if (inputValue.trim()) {
      const newGratitude: GratitudeItem = {
        text: inputValue.trim(),
        position: getRandomPosition(),
        id: Date.now(),
        visible: true,
      };
      setGratitudes((prev) => [...prev, newGratitude]);
      setInputValue("");
    }
  };

  const clearGratitudes = () => {
    setGratitudes([]);
    localStorage.removeItem("gratitudes");
  };

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground 
      px-6 md:px-12 lg:px-24 transition-all duration-300 ml-16 md:ml-20"
    >
      <div className="w-full max-w-4xl bg-card rounded-lg shadow-lg p-6 md:p-12 relative overflow-hidden">
        <header className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Gratitude Log
          </h1>
          <p className="mt-2 text-base md:text-lg text-muted-foreground">
            A space to reflect on the moments you&apos;re thankful for.
          </p>
        </header>

        {/* Input Section */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 mb-4 md:mb-6">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="What are you grateful for today?"
            className="flex-1 px-4 py-2 rounded-md border border-input bg-background 
            text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm md:text-base"
          />
          <button
            onClick={addGratitude}
            className="px-6 py-2 rounded-md bg-primary text-primary-foreground 
            hover:bg-primary/80 transition-all text-sm md:text-base"
          >
            Add
          </button>
          <button
            onClick={clearGratitudes}
            className="px-6 py-2 rounded-md bg-muted hover:bg-muted/80 text-foreground 
            transition-all text-sm md:text-base"
          >
            Clear
          </button>
        </div>

        {/* Floating Gratitude Messages */}
        <div className="absolute inset-0 pointer-events-none">
          {gratitudes.map((gratitude) => (
            <div
              key={gratitude.id}
              className={`absolute text-sm md:text-lg font-medium text-primary 
              transition-all ${gratitude.visible ? "animate-bounce" : "opacity-0"}`}
              style={gratitude.position}
            >
              {gratitude.text}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {gratitudes.length === 0 && (
          <p className="text-center text-base md:text-lg text-muted-foreground mt-4">
            Add something you&apos;re grateful for to see it here!
          </p>
        )}
      </div>
    </main>
  );
};

export default GratitudeLog;
