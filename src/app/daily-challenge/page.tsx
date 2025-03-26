"use client";

import React, { useState } from "react";
import challenges from "../../data/challenges.json";
import { useConvexAuth } from "convex/react";

type Challenge = {
  category: string;
  difficulty: "easy" | "medium" | "hard";
  description: string;
};

// Added type for the challenge data in the JSON file
type JsonChallenge = {
  category: string;
  difficulty: string;
  description: string;
};

const DailyChallenge = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    "easy" | "medium" | "hard"
  >("easy");
  const [challenge, setChallenge] = useState<Challenge | null>(null);

  if (isLoading || !isAuthenticated) {
    return null;
  }

  const getRandomChallenge = () => {
    const filteredChallenges = challenges.filter(
      (ch: JsonChallenge) => ch.difficulty === selectedDifficulty
    );
    const randomChallenge =
      filteredChallenges[Math.floor(Math.random() * filteredChallenges.length)];
    setChallenge({
      ...randomChallenge,
      difficulty: randomChallenge.difficulty as "easy" | "medium" | "hard",
    });
  };

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground 
      px-6 md:px-12 lg:px-24 transition-all duration-300 ml-16 md:ml-20"
    >
      <div className="w-full max-w-4xl bg-card rounded-lg shadow-lg p-6 md:p-12">
        <header className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold text-foreground">
            Daily Challenge
          </h1>
          <p className="mt-2 text-base md:text-lg text-muted-foreground">
            Choose a difficulty and roll for your challenge.
          </p>
        </header>

        <div className="flex justify-center mb-4 md:mb-6">
          <select
            id="difficulty"
            value={selectedDifficulty}
            onChange={(e) =>
              setSelectedDifficulty(
                e.target.value as "easy" | "medium" | "hard"
              )
            }
            className="px-4 py-2 border border-muted rounded-md focus:outline-none 
            focus:ring-2 focus:ring-primary text-sm md:text-base text-center"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div className="text-center mb-4 md:mb-6">
          <button
            onClick={getRandomChallenge}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md 
            hover:bg-primary/80 focus:outline-none text-sm md:text-base"
          >
            Roll for Challenge
          </button>
        </div>

        {challenge && (
          <div
            className="mt-4 md:mt-6 p-4 md:p-6 bg-card text-card-foreground border border-card-foreground 
          rounded-lg shadow-md dark:bg-background dark:text-foreground dark:border-background"
          >
            <h2 className="text-lg md:text-xl font-semibold text-primary mb-2">
              {challenge.category}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground dark:text-muted-foreground">
              {challenge.description}
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default DailyChallenge;