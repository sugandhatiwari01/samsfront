import React, { useState } from "react";
import { submitQuiz } from "../utils/api";

const BodyType = () => {
  const [form, setForm] = useState({
    shoulder: "",
    bust: "",
    waist: "",
    hips: ""
  });

  const [result, setResult] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const shoulder = parseFloat(form.shoulder);
    const bust = parseFloat(form.bust);
    const waist = parseFloat(form.waist);
    const hips = parseFloat(form.hips);

    let bodyType = "Unable to determine";

    const bustWaistDiff = bust - waist;
    const hipWaistDiff = hips - waist;
    const shoulderHipDiff = Math.abs(shoulder - hips);

    if (Math.abs(bust - hips) <= 5 && bustWaistDiff >= 20) {
      bodyType = "Hourglass";
    } else if (hips - bust >= 10) {
      bodyType = "Pear";
    } else if (bust - hips >= 10) {
      bodyType = "Inverted Triangle";
    } else if (bustWaistDiff < 15 && hipWaistDiff < 15) {
      bodyType = "Rectangle";
    } else if (bustWaistDiff >= 15 && bust - hips > 5 && waist < bust) {
      bodyType = "Apple";
    }

    setResult(`Your body type is: ${bodyType}`);

    // Send result to backend
    try {
      const res = await submitQuiz({
        userId: localStorage.getItem("userId"),
        faceShape: "", // Leave blank if unknown
        bodyType: bodyType,
        stylePreferences: [] // Leave empty or collect from other pages
      });
      console.log("Submitted to backend:", res);
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit quiz:", err);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#fdf6e3] to-[#d2b48c] min-h-screen flex items-center justify-center font-sans">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-[#5C4033] mb-4">
          Find Your Body Type
        </h1>
        <p className="text-sm text-center text-gray-500 mb-6">
          Enter your body measurements in centimeters.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {["shoulder", "bust", "waist", "hips"].map((field) => (
            <div key={field}>
              <label className="block font-medium capitalize">{field}</label>
              <input
                type="number"
                name={field}
                value={form[field]}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white p-2 rounded"
          >
            Get My Body Type
          </button>
        </form>

        {result && (
          <div className="mt-6 text-center text-xl font-semibold text-purple-800">
            {result}
            {submitted && <p className="text-sm text-green-600 mt-2">Saved successfully!</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default BodyType;
