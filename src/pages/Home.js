import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

export default function HomePage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("userId");
    if (!user) {
      navigate("/auth", { replace: true });
      return;
    }

    setIsLoggedIn(true);

    fetch(`https://api.unsplash.com/search/photos?query=clothes&per_page=18&orientation=squarish&client_id=dyE9BMK6zBpUhJIEAN8YP40abAnj5IqWePcOJa_mHVM`)
      .then((res) => res.json())
      .then((data) => {
        const fetchedImages = data.results.map((img, idx) => ({
          src: img.urls.small,
          alt: `item-${idx}`,
        }));
        setItems(fetchedImages);
      })
      .catch((err) => console.error("Error fetching images:", err));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    navigate("/auth");
  };


  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* ✅ Background Image as a Layer */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/736x/bd/49/2d/bd492df9baa34038900e35b1af04b757.jpg')",
        }}
      ></div>

      {/* Navbar */}
      <nav className="w-full fixed top-0 left-0 z-50 flex justify-between items-center px-8 py-4 bg-gradient-to-r from-[#f5f5dc] to-[#a1887f] shadow-md">
        <h1 className="text-lg font-bold text-gray-800">SAMS LABEL</h1>
        <ul className="flex space-x-6 text-sm md:text-base font-medium text-gray-700">
          <li><a href="/">Home</a></li>
          <li><a href="/analyze">Explore Yourself</a></li>
          <li><a href="/CollectionSection">Collection</a></li>
          <li><a href="/styleaiform">Ask SAMS</a></li>
          {isLoggedIn ? (
            <li>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:underline"
              >
                Sign Out
              </button>
            </li>
          ) : (
            <li><a href="/auth">Login / Sign Up</a></li>
          )}
        </ul>
      </nav>

      {/* Content Layer */}
      <div className="relative w-full h-full pt-24 z-10">
        {/* Image Grid */}
        <div className="absolute inset-0 grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-6 p-10 place-items-center">
          {items.map((item, idx) => (
            <img
              key={idx}
              src={item.src}
              alt={item.alt}
              className="w-24 h-24 object-cover rounded-xl shadow-lg floating fade-in"
              style={{ animationDelay: `${idx * 0.1}s` }}
            />
          ))}
        </div>

        {/* Center Message */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="bg-orange-50 backdrop-blur-md rounded-xl px-6 py-8 text-center max-w-xl">
            <h2 className="text-4xl md:text-5xl font-semibold text-gray-800 leading-snug">
              Hey <span className="inline-block animate-wave">👋</span>, I am{" "}
              <span className="text-indigo-600 italic font-bold">SAMS</span>
              <br />
              Your Personal AI Stylist
            </h2>
            <p className="mt-4 text-gray-600 text-lg">
              Ask <a href="/styleaiform" className="text-indigo-500 underline">SAMS</a> for fashion tips and fit guides
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
