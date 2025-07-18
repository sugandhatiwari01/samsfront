import React, { useEffect } from "react";
import {Link} from "react-router-dom"; 
import Home from "./Home";

const HomePage = () => {
  useEffect(() => {
    window.lucide?.createIcons();
  }, []);

  return (
    <div className="bg-white text-gray-800 font-['Segoe UI']">
      {/* Navbar */}
      
      {/* Image Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 px-6 pt-6">
       <Home />
        
      </section>

      {/* Tagline */}
      <section className="text-center my-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#603813]">
          Create your own type fashion model
        </h1>
      </section>
    </div>
  );
};

export default HomePage;
