// self-care-app/src/app/gratitude-log/page.tsx
"use client";

import React, { useState, useEffect } from "react";

interface GratitudeItem {
  text: string;
  position: { top: string; left: string };
  id: number;
  visible: boolean;
}

const GratitudeLog: React.FC = () => {
  const [gratitudes, setGratitudes] = useState<GratitudeItem[]>([]);
  const [inputValue, setInputValue] = useState("");

  // Load saved gratitudes from localStorage
  useEffect(() => {
    const storedGratitudes = localStorage.getItem("gratitudes");
    if (storedGratitudes) {
      const parsedGratitudes = JSON.parse(storedGratitudes);
      const gratitudesWithVisibility = parsedGratitudes.map((gratitude: GratitudeItem, index: number) => ({
        ...gratitude,
        visible: false, // Initially set visibility to false
      }));
      setGratitudes(gratitudesWithVisibility);
    }
  }, []);

  // Save gratitudes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("gratitudes", JSON.stringify(gratitudes));
  }, [gratitudes]);

  // Add new gratitude and trigger the visibility with bounce
  const addGratitude = () => {
    if (inputValue.trim()) {
      const newGratitude: GratitudeItem = {
        text: inputValue.trim(),
        position: getRandomPosition(),
        id: Date.now(),
        visible: true, // Set visibility to true when it's added
      };
      setGratitudes((prev) => [...prev, newGratitude]);
      setInputValue("");
    }
  };

  const clearGratitudes = () => {
    setGratitudes([]); // Clear the state
    localStorage.removeItem("gratitudes"); // Clear from localStorage
  };

  const getRandomPosition = () => ({
    top: `${Math.floor(Math.random() * 90)}%`,
    left: `${Math.floor(Math.random() * 90)}%`,
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addGratitude();
    }
  };

  // Trigger bounce animation for existing gratitudes after page refresh
  useEffect(() => {
    if (gratitudes.length > 0) {
      gratitudes.forEach((gratitude, index) => {
        setTimeout(() => {
          setGratitudes((prev) => 
            prev.map((item, idx) => 
              idx === index ? { ...item, visible: true } : item
            )
          );
        }, index * 300); // Each item will appear with a slight delay
      });
    }
  }, [gratitudes.length]); // Trigger this effect only once when gratitudes are loaded

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-6 md:p-12">
      {/* Card Container */}
      <div className="w-full max-w-4xl bg-card rounded-lg shadow-lg p-8 md:p-12 relative overflow-hidden">
        {/* Header */}
        <header className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Gratitude Log
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            A space to reflect on the moments you're thankful for.
          </p>
        </header>

        {/* Input Section */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 mb-6">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What are you grateful for today?"
            className="flex-1 px-4 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={addGratitude}
            className="px-6 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/80 transition-all"
          >
            Add
          </button>
          <button
            onClick={clearGratitudes}
            className="px-6 py-2 rounded-md bg-muted hover:bg-muted/80 text-foreground transition-all"
          >
            Clear
          </button>
        </div>

        {/* Floating Gratitude Messages */}
        <div className="absolute inset-0 pointer-events-none">
          {gratitudes.map((gratitude, index) => (
            <div
              key={gratitude.id}
              className={`absolute text-sm md:text-lg font-medium text-primary transition-all ${
                gratitude.visible ? "animate-bounce" : "opacity-0"
              }`}
              style={gratitude.position}
            >
              {gratitude.text}
            </div>
          ))}
        </div>

        {/* Optional Empty State */}
        {gratitudes.length === 0 && (
          <p className="text-center text-muted-foreground mt-4">
            Add something you're grateful for to see it here!
          </p>
        )}
      </div>
    </main>
  );
};

export default GratitudeLog;
