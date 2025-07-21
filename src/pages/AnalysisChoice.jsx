import React from "react";
import { Link } from "react-router-dom";

const AnalysisChoice = () => {
  return (
    <div className="bg-gradient-to-br from-[#fdf6e3] via-stone-300 to-[#d2b48c] min-h-screen flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-6xl px-4 py-10 space-y-10">
        <h1 className="text-4xl font-bold text-center text-[#5C4033] mb-10">
          What would you like to analyze?
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Face Analysis */}
          <Link
            to="/face"
            className="relative group overflow-hidden rounded-2xl shadow-lg transform hover:scale-105 transition duration-500"
          >
            <img
              src="/images/faceimg.jpg"
              alt="Face Shape Analysis"
              className="w-full h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-60 transition duration-300 flex items-center justify-center">
              <h2 className="text-white text-3xl font-semibold">
                Face Shape Analysis
              </h2>
            </div>
          </Link>

          {/* Body Analysis */}
          <Link
            to="/body"
            className="relative group overflow-hidden rounded-2xl shadow-lg transform hover:scale-105 transition duration-500"
          >
            <img
              src="public/images/bodyimg.jpg"
              alt="Body Shape Analysis"
              className="w-full h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-60 transition duration-300 flex items-center justify-center">
              <h2 className="text-white text-3xl font-semibold">
                Body Shape Analysis
              </h2>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AnalysisChoice;
