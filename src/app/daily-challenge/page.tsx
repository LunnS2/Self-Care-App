// self-care-app/src/app/daily-challenge/page.tsx

"use client";

import React, { useState } from "react";
import challenges from "../../data/challenges.json";
import { useConvexAuth } from "convex/react";

type Challenge = {
  category: string;
  difficulty: "easy" | "medium" | "hard";
  description: string;
};

const DailyChallenge = () => {
  // Get authentication status
  const { isAuthenticated, isLoading } = useConvexAuth();

  // If authentication is loading or user is not authenticated, return null
  if (isLoading || !isAuthenticated) {
    return null;
  }
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    "easy" | "medium" | "hard"
  >("easy");
  const [challenge, setChallenge] = useState<Challenge | null>(null);

  const getRandomChallenge = () => {
    const filteredChallenges = challenges.filter(
      (ch) => ch.difficulty === selectedDifficulty
    );
    const randomChallenge =
      filteredChallenges[Math.floor(Math.random() * filteredChallenges.length)];
    setChallenge(randomChallenge as Challenge);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-24">
      <div className="w-full max-w-4xl bg-card rounded-lg shadow-lg p-12">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-semibold text-foreground">
            Daily Challenge
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Choose a difficulty and roll for your challenge.
          </p>
        </header>

        {/* Difficulty Selection */}
        <div className="flex justify-center mb-6">
          <select
            id="difficulty"
            value={selectedDifficulty}
            onChange={(e) =>
              setSelectedDifficulty(
                e.target.value as "easy" | "medium" | "hard"
              )
            }
            className="px-4 py-2 border text-center border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Roll for Challenge Button */}
        <div className="text-center mb-6">
          <button
            onClick={getRandomChallenge}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/80 focus:outline-none"
          >
            Roll for Challenge
          </button>
        </div>

        {/* Displaying Challenge */}
        {challenge && (
          <div className="mt-6 p-6 bg-card text-card-foreground border border-card-foreground rounded-lg shadow-md dark:bg-background dark:text-foreground dark:border-background">
          <h2 className="text-xl font-semibold text-primary mb-2">
            {challenge.category}
          </h2>
          <p className="text-muted-foreground dark:text-muted-foreground">
            {challenge.description}
          </p>
        </div>
        
        )}
      </div>
    </div>
  );
};

export default DailyChallenge;
