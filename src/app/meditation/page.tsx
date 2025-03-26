"use client";

import { useConvexAuth } from "convex/react";
import React, { useState, useEffect, useCallback } from "react";

function Meditation() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [initialTime, setInitialTime] = useState<number>(0);
  const [isCounting, setIsCounting] = useState<boolean>(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [endSound, setEndSound] = useState<HTMLAudioElement | null>(null);
  const [timerEnded, setTimerEnded] = useState<boolean>(false);
  const [selectedAudio, setSelectedAudio] = useState<string>("/audios/nature.mp3");
  const [resetting, setResetting] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  // Memoized functions
  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const handleAudioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAudio(e.target.value);
  };

  const handlePlay = useCallback(() => {
    if (!audio) {
      const newAudio = new Audio(selectedAudio);
      newAudio.loop = true;
      setAudio(newAudio);
      newAudio.play();
    } else {
      audio.src = selectedAudio;
      audio.loop = true;
      audio.play();
    }
  }, [audio, selectedAudio]);

  const handlePause = useCallback(() => {
    audio?.pause();
  }, [audio]);

  const startTimer = useCallback(() => {
    if (timeLeft > 0) {
      setIsCounting(true);
      setTimerEnded(false);
    }
  }, [timeLeft]);

  const incrementTimer = useCallback(
    () => setTimeLeft((prevTime) => prevTime + 60),
    []
  );
  const incrementFiveMinutes = useCallback(
    () => setTimeLeft((prevTime) => prevTime + 5 * 60),
    []
  );
  const decrementTimer = useCallback(
    () => timeLeft > 60 && setTimeLeft((prevTime) => prevTime - 60),
    [timeLeft]
  );
  const decrementFiveMinutes = useCallback(
    () => timeLeft > 5 * 60 && setTimeLeft((prevTime) => prevTime - 5 * 60),
    [timeLeft]
  );

  const resetTimer = useCallback(() => {
    setResetting(true);
    setIsCounting(false);
    setTimeLeft(initialTime);
    setTimerEnded(false);
  }, [initialTime]);

  // Initial setup
  useEffect(() => {
    const defaultTime = 15 * 60;
    setInitialTime(defaultTime);
    setTimeLeft(defaultTime);
    setMounted(true);
  }, []);

  // Timer effects
  useEffect(() => {
    if (isCounting && timeLeft > 0) {
      const interval = setInterval(
        () => setTimeLeft((prevTime) => prevTime - 1),
        1000
      );
      return () => clearInterval(interval);
    } else if (timeLeft === 0 && !timerEnded && !resetting && mounted) {
      setTimerEnded(true);
    }
  }, [isCounting, timeLeft, timerEnded, resetting, mounted]);

  // End sound setup
  useEffect(() => {
    const newEndSound = new Audio("/audios/timer-end.mp3");
    setEndSound(newEndSound);
    return () => newEndSound.pause(); // Cleanup
  }, []);

  // Play end sound when timer ends
  useEffect(() => {
    if (timerEnded && endSound) {
      endSound.play();
    }
  }, [timerEnded, endSound]);

  // Reset completion
  useEffect(() => {
    if (resetting) {
      const timeout = setTimeout(() => setResetting(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [resetting]);

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-8 ml-16 md:ml-20">
      <div className="w-full max-w-4xl bg-card rounded-lg shadow-lg p-12">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">Meditation Timer</h1>
          <p className="mt-2 text-base md:text-lg text-muted-foreground">
            Customize your meditation session with soothing sounds and a timer.
          </p>
        </header>

        {/* Audio Selector */}
        <div className="text-center mb-6">
          <label className="block text-base md:text-lg text-muted-foreground mb-2">
            Select Background Sound
          </label>
          <select
            value={selectedAudio}
            onChange={handleAudioChange}
            className="px-4 py-2 border text-center border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="/audios/nature.mp3">Nature Sounds</option>
            <option value="/audios/ocean.mp3">Calm Ocean</option>
            <option value="/audios/rain.mp3">Rainy Day</option>
            <option value="/audios/birds.mp3">Forest Birds</option>
            <option value="/audios/night.mp3">Peaceful Night</option>
          </select>
        </div>

        {/* Timer Display */}
        <div className="text-center mb-6">
          <p className="text-4xl font-semibold mb-4">{formatTime(timeLeft)}</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <button
              onClick={decrementFiveMinutes}
              className="bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/80"
            >
              -5 Min
            </button>
            <button
              onClick={decrementTimer}
              className="bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/80"
            >
              -1 Min
            </button>
            <button
              onClick={incrementTimer}
              className="bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/80"
            >
              +1 Min
            </button>
            <button
              onClick={incrementFiveMinutes}
              className="bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/80"
            >
              +5 Min
            </button>
          </div>
        </div>

        {/* Timer Controls */}
        <div className="flex justify-center gap-4">
          <button
            onClick={startTimer}
            className="bg-primary text-primary-foreground py-2 px-6 rounded-lg hover:bg-primary/80"
          >
            Start Timer
          </button>
          <button
            onClick={resetTimer}
            className="bg-muted text-muted-foreground py-2 px-6 rounded-lg hover:bg-muted/80"
          >
            Reset Timer
          </button>
        </div>

        {/* Audio Controls */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={handlePlay}
            className="bg-primary text-primary-foreground py-2 px-6 rounded-lg hover:bg-primary/80"
          >
            Play Sound
          </button>
          <button
            onClick={handlePause}
            className="bg-muted text-muted-foreground py-2 px-6 rounded-lg hover:bg-muted/80"
          >
            Stop Sound
          </button>
        </div>
      </div>
    </main>
  );
}

export default Meditation;