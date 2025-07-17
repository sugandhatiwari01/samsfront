import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getClothingSuggestions } from "../utils/gemini";

const CLOTHING_KEYWORDS = [
  "summer outfit 2025",
  "casual wear men",
  "formal wear women",
  "street fashion 2025",
  "men's jacket outfit",
  "women's dress fashion",
  "casual streetwear",
  "ethnic outfit women",
  "smart casual men",
  "fashion model clothes",
];

const fallbackImages = [
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
  "https://images.unsplash.com/photo-1551854838-950b6aa18e8f",
  "https://images.unsplash.com/photo-1542062703-3b55b9ee69a5",
  "https://images.unsplash.com/photo-1600185365928-3e5f33c19435",
  "https://images.unsplash.com/photo-1520975918313-8d622b6dfd0e",
];

const CollectionSection = () => {
  const location = useLocation();
  const quizData = location.state?.quizData;

  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch image from Unsplash with fallback
  const fetchUnsplash = async (query, fallbackIdx = 0) => {
    const enhancedQuery = `${query} outfit fashion 2025 clothes`;
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
      enhancedQuery
    )}&per_page=1`;

    try {
      console.log("🔍 Fetching Unsplash for:", enhancedQuery);
      console.log("API URL:", url);

      const resp = await fetch(url, {
        headers: {
         Authorization: `Client-ID ${process.env.REACT_APP_UNSPLASH_KEY}`,

        },
      });

      const data = await resp.json();
      console.log("📷 Unsplash Response:", data);

      if (data.results && data.results.length > 0) {
        return {
          imageUrl: data.results[0].urls.regular,
          unsplashLink: data.results[0].links.html,
        };
      }
    } catch (e) {
      console.warn(`❌ Unsplash error: ${e.message}`);
    }

    // 🔁 Fallback query
    const fallbackQuery =
      CLOTHING_KEYWORDS[fallbackIdx % CLOTHING_KEYWORDS.length];
    return fetchUnsplash(fallbackQuery, fallbackIdx + 1);
  };

  const fetchMoreGeminiOutfits = async () => {
    if (!quizData) {
      console.warn("❗ No quiz data in location.state");
      setError("No quiz data found.");
      setLoading(false);
      return;
    }

    const prompt = `
You are a fashion AI expert crafting trendy, shoppable outfits for 2025. Based on:

- Height: ${quizData.height} cm
- Weight: ${quizData.weight} kg
- Gender: ${quizData.gender}
- Body Type: ${quizData.bodyType}
- Face Shape: ${quizData.faceShape}
- Skin Tone: ${quizData.skinTone}

Suggest 6 new outfits that:
- Flatter the ${quizData.bodyType} body type.
- Enhance the ${quizData.faceShape} face shape.
- Complement ${quizData.skinTone} skin tone.
- Match ${quizData.height} cm height and ${quizData.weight} kg weight.
- Follow 2025 fashion trends.

Each outfit must include the following keys in a JSON array:
[
  {
    "title": "TITLE DESCRIBING EXACT OUTFIT IN 2–3 WORDS",
    "description": "1–2 sentence vivid description (max 30 words)"
  }
]

Return only the JSON array with exactly 6 objects and no extra text and keep it gender specific.
`;

    try {
      const raw = await getClothingSuggestions(prompt);
      const match = raw.match(/\[\s*{[\s\S]*?}\s*]/);
      if (!match) throw new Error("No valid JSON array found.");

      const aiOutfits = JSON.parse(match[0]);
      console.log("🧠 AI Outfits:", aiOutfits);

      const enriched = await Promise.all(
        aiOutfits.map(async (o, idx) => {
          const googleLink = `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(
            o.title
          )}`;

          let imageUrl = "";
          try {
            const photo = await fetchUnsplash(o.title);
            imageUrl =
              photo?.imageUrl || fallbackImages[idx % fallbackImages.length];
          } catch (e) {
            console.warn("⚠️ Failed to fetch image, using fallback.");
            imageUrl = fallbackImages[idx % fallbackImages.length];
          }

          return {
            id: `ai-${idx}`,
            title: o.title,
            description: o.description,
            image: imageUrl,
            link: googleLink,
            category: "AI Recommendation",
          };
        })
      );

      setOutfits(enriched);
    } catch (err) {
      console.error("🚫 Error generating outfit suggestions:", err);
      setError("Failed to load shoppable outfits. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("🔁 Loading collection for:", quizData);
    fetchMoreGeminiOutfits();
  }, []);

  return (
    <section className="min-h-screen py-16 bg-gradient-to-br from-[#FDF6E3] to-[#D2B48C]">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Shoppable Outfit Recommendations
        </h2>

        {error && (
          <div className="text-center text-red-600 mb-8">{error}</div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gray-800"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {outfits.map(({ id, title, description, image, link }) => (
              <div
                key={id}
                className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
              >
                <img
                  src={image}
                  alt={title}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-gray-800">
                    {title}
                  </h3>
                  <p className="text-gray-600 mt-2">{description}</p>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition-colors"
                  >
                    View & Buy
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CollectionSection;
