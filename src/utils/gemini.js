import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

export const getClothingSuggestions = async (promptText) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(promptText);
    const response = await result.response;
    console.log("API Response:", response);
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const listAvailableModels = async () => {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    if (!response.ok) {
      throw new Error(`Failed to list models: ${response.status}`);
    }
    const data = await response.json();
    console.log("Available Models:", data);
    return data.models;
  } catch (error) {
    console.error("Error listing models:", error);
    throw error;
  }
};
//collection
