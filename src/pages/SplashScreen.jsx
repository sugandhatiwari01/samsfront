import React, { useState, useEffect } from "react";

const SplashScreen = ({ onComplete }) => {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFading(true);
      setTimeout(onComplete, 500); // Wait for fade-out animation
    }, 3000); // Show splash for 3 seconds
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-[#fdf6e3] to-[#d2b48c] flex items-center justify-center transition-opacity duration-500 ${isFading ? "opacity-0" : "opacity-100"}`}
      onClick={onComplete} // Skip on click
    >
      <div className="text-center space-y-6">
        <h1 className="text-5xl sm:text-6xl font-bold text-[#5C4033] animate-pulse">
          Find Your Perfect Fit
        </h1>
        <p className="text-xl text-gray-600">
          Discover AI-powered style tailored to you
        </p>
        <div className="flex justify-center">
          <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-sm text-gray-500 italic">Click anywhere to skip</p>
      </div>
    </div>
  );
};

export default SplashScreen;