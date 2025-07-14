import { PauseIcon, PlayIcon, RefreshCcwIcon } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const App = () => {
  const POMODORO = 25 * 60; // 6 seconds for testing
  const BREAK = 5 * 60; // 6 seconds for testing

  const [secondsLeft, setSecondsLeft] = useState(POMODORO);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    let startTime = Date.now();
    let expectedEnd = startTime + secondsLeft * 1000;

    if (isRunning) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, Math.round((expectedEnd - now) / 1000));

        setSecondsLeft(remaining);

        if (remaining === 0) {
          clearInterval(intervalRef.current);
          const nextIsBreak = !isBreak;
          setIsBreak(nextIsBreak);

          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
          }

          setSecondsLeft(nextIsBreak ? BREAK : POMODORO);
          setIsRunning(true); // continue auto-run
        }
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, isBreak]);

  useEffect(() => {
    const formatted = formatTime(secondsLeft);
    document.title = isRunning
      ? `${isBreak ? "☕" : "⏰"} ${formatted} | Cutesie Pomodoro Timer`
      : "Cutesie Pomodoro Timer";
  }, [secondsLeft, isBreak, isRunning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(isBreak ? BREAK : POMODORO);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pink-100 text-pink-900 font-cute px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-xl p-8 text-center w-full max-w-md border-4 border-pink-300"
      >
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl mb-2 font-bold"
        >
          🍓 Pomodoro Timer 🍓
        </motion.h1>
        <motion.p
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-lg mb-4"
        >
          {isBreak
            ? "✨ Break time! Relax a little ✨"
            : "💖 Time to focus and shine! 💖"}
        </motion.p>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="text-6xl font-mono mb-4"
        >
          {formatTime(secondsLeft)}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="flex gap-3 justify-center"
        >
          {!isRunning ? (
            <button
              onClick={startTimer}
              className="bg-pink-400 flex gap-1 items-center justify-center hover:bg-pink-500 text-white font-bold py-2 px-4 rounded-xl"
            >
              <PlayIcon size={20} />
              <p>Start</p>
            </button>
          ) : (
            <button
              onClick={pauseTimer}
              className="bg-yellow-300 flex gap-1 items-center justify-center hover:bg-yellow-400 text-pink-900 font-bold py-2 px-4 rounded-xl"
            >
              <PauseIcon size={20} />
              <p>Pause</p>
            </button>
          )}
          <button
            onClick={resetTimer}
            className="bg-red-300 flex gap-1 items-center justify-center hover:bg-red-400 text-white font-bold py-2 px-4 rounded-xl"
          >
            <RefreshCcwIcon size={20} />
            <p>Reset</p>
          </button>
        </motion.div>
      </motion.div>

      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-6 text-sm opacity-80"
      >
        Made with 💕 for productive girlies ✨
      </motion.p>

      <audio
        ref={audioRef}
        src="https://www.myinstants.com/media/sounds/bell_L8gGriH.mp3"
        preload="auto"
      />
    </div>
  );
};

export default App;
