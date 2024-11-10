// self-care-app/src/app/gratitude-log/page.tsx
"use client";
import React, { useState, useEffect } from 'react';

interface GratitudeItem {
  text: string;
  position: { top: string; left: string };
}

const GratitudeLog: React.FC = () => {
  const [gratitudes, setGratitudes] = useState<GratitudeItem[]>([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const storedGratitudes = localStorage.getItem('gratitudes');
    if (storedGratitudes) {
      setGratitudes(JSON.parse(storedGratitudes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('gratitudes', JSON.stringify(gratitudes));
  }, [gratitudes]);

  const addGratitude = () => {
    if (inputValue.trim()) {
      const newGratitude: GratitudeItem = {
        text: inputValue.trim(),
        position: getRandomPosition()
      };
      setGratitudes([...gratitudes, newGratitude]);
      setInputValue('');
    }
  };

  const clearGratitudes = () => {
    setGratitudes([]);
    localStorage.removeItem('gratitudes');
  };

  const getRandomPosition = () => ({
    top: `${Math.floor(Math.random() * 90)}%`,
    left: `${Math.floor(Math.random() * 90)}%`,
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addGratitude();
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 md:p-8 overflow-hidden">
      <h1 className="text-3xl font-bold mb-6">Gratitude Log</h1>
      
      {/* Form for input */}
      <div className="flex space-x-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter something you're grateful for"
          className="px-4 py-2 border text-center border-gray-300 rounded-md focus:outline-none w-[300px]"
        />
        <button onClick={addGratitude} className="px-4 py-2 bg-teal-400 hover:bg-teal-500 text-white rounded-md">
          Add
        </button>
        <button onClick={clearGratitudes} className="px-4 py-2 bg-red-400 hover:bg-red-500 text-white rounded-md">
          Clear
        </button>
      </div>

      {/* Floating gratitude statements */}
      <div className="absolute inset-0 pointer-events-none">
        {gratitudes.map((gratitude, index) => (
          <div
            key={index}
            className="absolute text-lg font-semibold text-teal-400 animate-bounce transition-transform"
            style={gratitude.position}
          >
            {gratitude.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GratitudeLog;
