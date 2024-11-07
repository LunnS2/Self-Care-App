"use client"

import React, { useState } from "react";

// Assuming you have imported the JSON data. 
// In a real-world scenario, this might come from a separate file or API.
import challenges from "../../data/challenges.json";

// Define the Challenge type explicitly
type Challenge = {
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
};

const DailyChallenge = () => {
  // State for selected difficulty and the challenge to display
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [challenge, setChallenge] = useState<Challenge | null>(null);

  // Function to pick a random challenge based on the selected difficulty
  const getRandomChallenge = () => {
    const filteredChallenges = challenges.filter(
      (ch) => ch.difficulty === selectedDifficulty
    );
    
    // Ensure the challenge has the correct type
    const randomChallenge = filteredChallenges[Math.floor(Math.random() * filteredChallenges.length)];
    
    // Type assertion to ensure the object matches the Challenge type
    setChallenge(randomChallenge as Challenge); 
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 md:p-8">
      <h1 className="text-2xl font-semibold mb-6">Daily Challenge</h1>

      {/* Difficulty Selection */}
      <div className="mb-4">
        <label htmlFor="difficulty" className="mr-2">Choose Difficulty:</label>
        <select
          id="difficulty"
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
          className="px-4 py-2 border rounded"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {/* Roll for Challenge Button */}
      <button
        onClick={getRandomChallenge}
        className="px-6 py-2 bg-gray-900 text-white rounded hover:bg-gray-800"
      >
        Roll for Challenge
      </button>

      {/* Display the challenge if one is selected */}
      {challenge && (
        <div className="mt-6 p-4 border rounded bg-white shadow-md w-full md:w-1/2">
          <h2 className="text-xl font-semibold mb-2">{challenge.category}</h2>
          <p>{challenge.description}</p>
        </div>
      )}
    </div>
  );
};

export default DailyChallenge;
