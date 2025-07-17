import React, { useState } from "react";
import { getClothingSuggestions } from "../utils/gemini";
import { useNavigate } from "react-router-dom";
import { submitQuiz } from "../utils/api";

const StyleAIForm = () => {
  const [formData, setFormData] = useState({
    height: "",
    weight: "",
    gender: "female",
    bodyType: "",
    faceShape: "",
    skinTone: "",
  });

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getClothingRecommendations = async () => {
    try {
      const prompt = `
You are a fashion AI expert crafting vibrant, trendy, casual-chic outfits for 2025. Based on:

- Height: ${formData.height} cm
- Weight: ${formData.weight} kg
- Gender: ${formData.gender}
- Body Type: ${formData.bodyType}
- Face Shape: ${formData.faceShape}
- Skin Tone: ${formData.skinTone}

Suggest exactly 4 outfits that:
- Flatter the ${formData.bodyType} body type.
- Enhance the ${formData.faceShape} face shape.
- Use vibrant colors that complement ${formData.skinTone} skin tone.
- Suit ${formData.height} cm height and ${formData.weight} kg weight.
- Incorporate 2025 trends.

Each outfit must include:
- A bold, searchable title which is simple (e.g., "Velvet Wrap Dress", "Linen Blazer Combo").
- A vivid 1-2 sentence description (max 30 words).

Format exactly as:
- **Title**: Description

Return 4 outfit suggestions, nothing else.
`;

      const rawText = await getClothingSuggestions(prompt);

      const parsed = rawText
        .split("\n")
        .filter((line) => line.trim().startsWith("-"))
        .map((line) => {
          const match = line.match(/- \*\*(.+?)\*\*: (.+)/);
          return match
            ? { title: match[1].trim(), description: match[2].trim() }
            : { title: "Outfit", description: line.trim().replace(/^-/, "") };
        });

      const enriched = parsed.map((item) => ({
        ...item,
        imageUrl: null, // You can add image URLs later via Unsplash or generation
      }));

      return enriched;
    } catch (err) {
      console.error("Gemini error:", err.message);
      setError("Failed to fetch AI suggestions. Please try again.");
      return [];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { height, weight, bodyType, faceShape, skinTone } = formData;

    if (!height || !weight || !bodyType || !faceShape || !skinTone) {
      setError("Please fill all required fields.");
      return;
    }

    setLoading(true);
    setError(null);

    const results = await getClothingRecommendations();
    setRecommendations(results);
    setLoading(false);

    const stylePreferences = results.map((r) => r.title.toLowerCase());

    try {
      const res = await submitQuiz({
        userId: localStorage.getItem("userId"),
        faceShape,
        bodyType,
        stylePreferences,
      });
      console.log("Quiz submitted:", res);
    } catch (err) {
      console.error("Submit error:", err.message);
      setError("Unable to save your quiz. Please try again.");
    }
  };

  const handleViewMore = () => {
  navigate("/CollectionSection", {
    state: {
      quizData: formData, // 👈 pass original quiz data
    },
  });
};

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#fdf6e3] to-[#d2b48c] flex items-center justify-center py-10 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white text-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-3xl space-y-6"
      >
        <h1 className="text-4xl font-bold text-center text-[#5C4033]">Find Your Perfect Fit</h1>
        <p className="text-center text-lg text-gray-600">
          Discover vibrant, trendy outfits tailored just for you with AI-powered style suggestions.
        </p>

        {/* Measurements */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Height (in cm)</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Weight (in kg)</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-500"
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="nonbinary">Non-binary</option>
            </select>
          </div>
        </div>

        {/* Body Type */}
        <div>
          <label className="block mb-2 font-medium">Body Type</label>
          <div className="grid grid-cols-3 sm:grid-cols-3 gap-4">
            {["pear", "apple", "hourglass", "rectangle", "inverted", "trapezoid"].map((type) => {
              const selected = formData.bodyType === type;
              return (
                <label
                  key={type}
                  className={`cursor-pointer flex flex-col items-center p-2 rounded-lg transition ${
                    selected ? "ring-2 ring-purple-500 bg-purple-50" : "hover:scale-105"
                  }`}
                >
                  <input
                    type="radio"
                    name="bodyType"
                    value={type}
                    checked={selected}
                    onChange={handleChange}
                    className="sr-only"
                    required
                  />
                  <img
                    src={`images/${type}.png`}
                    alt={type}
                    className="w-20 h-20 object-contain border-2 border-gray-300 rounded-lg"
                  />
                  <span className="text-sm mt-1 capitalize">{type}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Face Shape */}
        <div>
          <label className="block mb-2 font-medium text-center">Select Your Face Shape</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 justify-items-center">
            {["heart", "square", "pear", "rectangle", "round", "oval", "diamond", "oblong"].map((shape) => {
              const selected = formData.faceShape === shape;
              return (
                <label
                  key={shape}
                  className={`flex flex-col items-center cursor-pointer p-2 rounded-lg transition ${
                    selected ? "ring-2 ring-purple-500 bg-purple-50" : "hover:scale-105"
                  }`}
                >
                  <input
                    type="radio"
                    name="faceShape"
                    value={shape}
                    checked={selected}
                    onChange={handleChange}
                    className="sr-only"
                    required
                  />
                  <img
                    src={`images/${shape}.jpg`}
                    alt={shape}
                    className="w-20 h-20 object-contain border-2 border-gray-300 rounded-lg"
                  />
                  <span className="mt-2 text-sm capitalize">{shape}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Skin Tone */}
        <div>
          <label className="block mb-2 font-medium">Skin Tone</label>
          <div className="flex space-x-4">
            {[
              { label: "fair", color: "#fce6d6" },
              { label: "medium", color: "#e0ac69" },
              { label: "olive", color: "#c68642" },
              { label: "dark", color: "#8d5524" },
            ].map((tone) => {
              const selected = formData.skinTone === tone.label;
              return (
                <label
                  key={tone.label}
                  className={`flex flex-col items-center cursor-pointer transition ${
                    selected ? "ring-2 ring-purple-500 p-1 rounded-lg bg-purple-50" : "hover:scale-105"
                  }`}
                >
                  <input
                    type="radio"
                    name="skinTone"
                    value={tone.label}
                    checked={selected}
                    onChange={handleChange}
                    className="sr-only"
                    required
                  />
                  <span
                    className="w-10 h-10 rounded-full border-2 border-gray-300"
                    style={{ backgroundColor: tone.color }}
                  ></span>
                  <span className="text-sm mt-1 capitalize">{tone.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg transition font-semibold ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Loading..." : "Get AI Style Suggestions"}
        </button>

        {error && <p className="mt-4 text-red-600 text-center font-medium">{error}</p>}

        {recommendations.length > 0 && (
          <div className="mt-8 text-gray-800">
            <h2 className="text-3xl font-bold text-[#5C4033] mb-6 text-center">
              Your Personalized Style Picks
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {recommendations.map((item, index) => (
                <div
                  key={index}
                  className="bg-[#fdfaf5] border border-gray-200 p-4 rounded-xl shadow-md hover:shadow-lg transition"
                >
                  <h3 className="text-lg font-bold text-[#5C4033] mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="rounded-md object-cover w-full h-48 mb-2"
                    />
                  )}
                  <a
                    href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(item.title + " outfit")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 text-sm hover:underline"
                  >
                    🔍 Explore More Looks
                  </a>
                </div>
              ))}
            </div>
            <button
              onClick={handleViewMore}
              className="mt-6 w-full bg-[#5C4033] hover:bg-[#4A3327] text-white p-3 rounded-lg transition font-semibold"
            >
              View More Outfits
            </button>
          </div>
        )}
      </form>
    </section>
  );
};

export default StyleAIForm;
