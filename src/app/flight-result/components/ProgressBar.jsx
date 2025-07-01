import React, { useState, useEffect } from "react";

const ProgressBar = ({ loading }) => {
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(true);
  const [canComplete, setCanComplete] = useState(false);

  useEffect(() => {
    let interval;
    const minDuration = 4000; // Minimum animation duration (4 seconds)
    const maxProgress = 95; // Pause at 95% until loading is false
    const speed = 100; // Update every 100ms
    const increment = maxProgress / (minDuration / speed); // Calculate increment for 4s

    // Start a timer to allow completion after minDuration
    const timer = setTimeout(() => {
      setCanComplete(true);
    }, minDuration);

    if (!loading && canComplete) {
      // Complete progress and hide when loading is false and min duration has passed
      setProgress(100);
      setTimeout(() => setShowProgress(false), 400);

      return () => clearTimeout(timer);
    }

    // When loading, run progress animation
    setShowProgress(true);
    setProgress(0);

    interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= maxProgress) {
          clearInterval(interval);

          return maxProgress;
        }

        return prev + increment;
      });
    }, speed);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [loading, canComplete]);

  if (!showProgress) return null;

  return (
    <div className="h-2.5 w-full rounded-full bg-gray-200">
      <div
        className="h-2.5 rounded-full bg-blue-600 transition-all duration-300 ease-in-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar;
