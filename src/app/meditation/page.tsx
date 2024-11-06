"use client";

import React, { useState, useEffect } from "react";

function Meditation() {
  const [timeLeft, setTimeLeft] = useState<number>(0); // Timer in seconds
  const [initialTime, setInitialTime] = useState<number>(0); // Store the initial time set by the user
  const [isCounting, setIsCounting] = useState<boolean>(false); // Controls whether the timer is active
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [endSound, setEndSound] = useState<HTMLAudioElement | null>(null); // Timer end sound
  const [timerEnded, setTimerEnded] = useState<boolean>(false); // Flag for timer completion
  const [selectedAudio, setSelectedAudio] =
    useState<string>("/audios/nature.mp3"); // Default audio
  const [resetting, setResetting] = useState<boolean>(false); // Flag to track reset state
  const [mounted, setMounted] = useState<boolean>(false); // Track if component has mounted

  // Handle audio selection change
  const handleAudioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAudio(e.target.value);
  };

  // Handle play action
  const handlePlay = () => {
    if (!audio) {
      const newAudio = new Audio(selectedAudio);
      newAudio.loop = true; // Set audio to loop
      setAudio(newAudio);
      newAudio.play();
    } else {
      audio.src = selectedAudio;
      audio.loop = true; // Ensure looping is enabled when audio changes
      audio.play();
    }
  };

  // Handle pause action
  const handlePause = () => {
    audio?.pause();
  };

  // Timer countdown effect
  useEffect(() => {
    // Prevent countdown if timer is not started or if we are resetting
    if (isCounting && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(interval); // Cleanup on unmount
    } else if (timeLeft === 0 && !timerEnded && !resetting && mounted) {
      // Only set timerEnded if it's not a reset or initial mount
      setTimerEnded(true); // Timer has ended, only set when not resetting
    }
  }, [isCounting, timeLeft, timerEnded, resetting, mounted]);

  // Load the end sound once when component mounts
  useEffect(() => {
    const newEndSound = new Audio("/audios/timer-end.mp3"); // Your timer end sound file
    setEndSound(newEndSound);
  }, []);

  // Play the end sound only when the timer ends naturally
  useEffect(() => {
    if (timerEnded && endSound) {
      endSound.play(); // Play the timer end sound when time is up
    }
  }, [timerEnded, endSound]);

  // Start timer countdown
  const startTimer = () => {
    if (timeLeft > 0) {
      setIsCounting(true); // Start the countdown
      setTimerEnded(false); // Reset the "ended" state when starting a new timer
    }
  };

  // Increase timer by 1 minute
  const incrementTimer = () => {
    setTimeLeft((prevTime) => prevTime + 60); // Add 60 seconds (1 minute)
    setTimerEnded(false); // Reset the "ended" state when incrementing the timer
  };

  // Increase timer by 5 minutes
  const incrementFiveMinutes = () => {
    setTimeLeft((prevTime) => prevTime + 5 * 60); // Add 5 minutes (300 seconds)
    setTimerEnded(false); // Reset the "ended" state when incrementing the timer
  };

  // Decrease timer by 1 minute
  const decrementTimer = () => {
    if (timeLeft > 60) {
      // Prevent going below 0 minutes
      setTimeLeft((prevTime) => prevTime - 60); // Subtract 60 seconds (1 minute)
    }
  };

  // Decrease timer by 5 minutes
  const decrementFiveMinutes = () => {
    if (timeLeft > 5 * 60) {
      // Prevent going below 0 minutes
      setTimeLeft((prevTime) => prevTime - 5 * 60); // Subtract 5 minutes (300 seconds)
    }
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Reset the timer to the initial time
  const resetTimer = () => {
    setResetting(true); // Set the resetting flag to true
    setIsCounting(false); // Stop the timer
    setTimeLeft(initialTime); // Reset to the initial time
    setTimerEnded(false); // Reset the "ended" state to avoid sound playback
  };

  // Set initial time when component mounts
  useEffect(() => {
    const defaultTime = 15 * 60; // Default to 15 minutes (900 seconds)
    setInitialTime(defaultTime);
    setTimeLeft(defaultTime); // Ensure timer starts with a non-zero time
    setMounted(true); // Set mounted flag to true after initial mount
  }, []);

  // Reset the resetting flag after a short delay
  useEffect(() => {
    if (resetting) {
      setTimeout(() => setResetting(false), 500); // Short delay to reset the flag
    }
  }, [resetting]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 md:p-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Meditation Timer
      </h1>

      {/* Audio Selector */}
      <select
        value={selectedAudio}
        onChange={handleAudioChange}
        className="mb-6 p-3 bg-gray-900 text-white rounded hover:bg-gray-800 focus:outline-none"
      >
        <option value="/audios/nature.mp3">Nature Sounds</option>
        <option value="/audios/ocean.mp3">Calm Ocean</option>
        <option value="/audios/rain.mp3">Rainy Day</option>
        <option value="/audios/birds.mp3">Forest Birds</option>
        <option value="/audios/night.mp3">Peaceful Night</option>
      </select>

      {/* Play/Pause Buttons */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={handlePlay}
          className="p-3 bg-gray-900 text-white rounded hover:bg-gray-800 focus:outline-none"
        >
          Play
        </button>
        <button
          onClick={handlePause}
          className="p-3 bg-gray-900 text-white rounded hover:bg-gray-800 focus:outline-none"
        >
          Pause
        </button>
      </div>

      {/* Timer Display */}
      <div className="mt-10 flex flex-col items-center">
        <p className="text-4xl font-semibold text-gray-900 mb-4">
          {formatTime(timeLeft)}
        </p>

        {/* Timer Control Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <div className="flex gap-4">
            <button
              onClick={decrementFiveMinutes}
              className="p-3 px-6 bg-gray-900 text-white rounded hover:bg-gray-800 focus:outline-none"
            >
              -5 Min
            </button>
            <button
              onClick={decrementTimer}
              className="p-3 px-6 bg-gray-900 text-white rounded hover:bg-gray-800 focus:outline-none"
            >
              -1 Min
            </button>
          </div>
          <div className="flex gap-4">
            <button
              onClick={incrementTimer}
              className="p-3 px-6 bg-gray-900 text-white rounded hover:bg-gray-800 focus:outline-none"
            >
              +1 Min
            </button>
            <button
              onClick={incrementFiveMinutes}
              className="p-3 px-6 bg-gray-900 text-white rounded hover:bg-gray-800 focus:outline-none"
            >
              +5 Min
            </button>
          </div>
        </div>

        {/* Start/Reset Timer Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={startTimer}
            className="p-3 px-6 bg-gray-900 text-white rounded hover:bg-gray-800 focus:outline-none"
          >
            Start Timer
          </button>
          <button
            onClick={resetTimer}
            className="p-3 px-6 bg-gray-900 text-white rounded hover:bg-gray-800 focus:outline-none"
          >
            Reset Timer
          </button>
        </div>
      </div>
    </div>
  );
}

export default Meditation;
