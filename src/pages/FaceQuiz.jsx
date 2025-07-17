import React, { useState } from "react";
import { submitQuiz } from "../utils/api";

const steps = [
  {
    question: "What is the widest part of your face?",
    name: "width",
    options: [
      { value: "forehead", label: "Forehead", scores: { heart: 2, inverted: 1 } },
      { value: "cheekbones", label: "Cheekbones", scores: { round: 2, diamond: 2 } },
      { value: "jawline", label: "Jawline", scores: { square: 2, pear: 2 } }
    ]
  },
  {
    question: "What is the shape of your jawline?",
    name: "jawline",
    options: [
      { value: "pointed", label: "Pointed", scores: { heart: 2, oval: 1 } },
      { value: "rounded", label: "Rounded", scores: { round: 2, diamond: 1 } },
      { value: "square", label: "Square", scores: { square: 3, rectangle: 2 } }
    ]
  },
  {
    question: "How would you describe the length of your face?",
    name: "length",
    options: [
      { value: "short", label: "Short", scores: { round: 2, square: 1 } },
      { value: "average", label: "Average", scores: { oval: 2, heart: 1 } },
      { value: "long", label: "Long", scores: { oblong: 3, rectangle: 2 } }
    ]
  },
  {
    question: "How does your chin appear?",
    name: "chin",
    options: [
      { value: "pointed", label: "Pointed", scores: { heart: 2, diamond: 2 } },
      { value: "round", label: "Rounded", scores: { round: 2, oval: 1 } },
      { value: "flat", label: "Flat", scores: { square: 2, rectangle: 2 } }
    ]
  },
  {
    question: "Do you usually wear the same size hat and sunglasses?",
    name: "proportion",
    options: [
      { value: "yes", label: "Yes", scores: { oval: 2, round: 1 } },
      { value: "no", label: "No", scores: { diamond: 1, rectangle: 1, oblong: 1 } }
    ]
  }
];

const FaceQuiz = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [shapeScores, setShapeScores] = useState({
    heart: 0, square: 0, pear: 0, rectangle: 0, round: 0,
    oval: 0, diamond: 0, oblong: 0
  });
  const [result, setResult] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleNext = async () => {
    const current = steps[currentStep];
    if (!userAnswers[current.name]) {
      alert("Please select an option.");
      return;
    }

    const selected = current.options.find(o => o.value === userAnswers[current.name]);
    const updatedScores = { ...shapeScores };
    for (const [shape, points] of Object.entries(selected.scores)) {
      updatedScores[shape] += points;
    }
    setShapeScores(updatedScores);

    if (currentStep === steps.length - 1) {
      const bestShape = Object.entries(updatedScores).reduce((a, b) =>
        b[1] > a[1] ? b : a
      )[0];
      setResult(bestShape);

      // Submit to backend
      try {
        const res = await submitQuiz({
          userId: localStorage.getItem("userId"),
          faceShape: bestShape,
          bodyType: "", // Can be updated after BodyType
          stylePreferences: [] // Will be filled in StyleAIForm
        });
        console.log("Submitted:", res);
        setSubmitted(true);
      } catch (err) {
        console.error("Submission failed:", err);
        alert("Failed to save result.");
      }
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleOptionChange = (stepName, value) => {
    setUserAnswers({ ...userAnswers, [stepName]: value });
  };

  const restartQuiz = () => {
    setCurrentStep(0);
    setUserAnswers({});
    setShapeScores({
      heart: 0, square: 0, pear: 0, rectangle: 0,
      round: 0, oval: 0, diamond: 0, oblong: 0
    });
    setResult(null);
    setSubmitted(false);
  };

  const step = steps[currentStep];

  return (
    <div className="bg-gradient-to-br from-[#fdf6e3] to-[#d2b48c] min-h-screen flex items-center justify-center font-sans">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full">
        {result ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-purple-700 mb-4">
              Your Face Shape: {result.toUpperCase()}
            </h2>
            <p className="text-gray-600 mb-4">
              Based on your answers, your likely face shape is <strong>{result}</strong>.
            </p>
            {submitted && (
              <p className="text-green-600 text-sm mb-6">Saved to your account!</p>
            )}
            <button
              onClick={restartQuiz}
              className="bg-purple-600 text-white px-4 py-2 rounded"
            >
              Restart Quiz
            </button>
          </div>
        ) : (
          <>
            <div className="text-sm text-gray-500 mb-2">
              Step {currentStep + 1} / {steps.length}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className="bg-purple-600 h-2 rounded-full"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{step.question}</h2>
            <form className={`grid ${step.options.length > 4 ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
              {step.options.map(option => (
                <label
                  key={option.value}
                  className={`option-item cursor-pointer block border-2 rounded-lg overflow-hidden transition-all ${
                    userAnswers[step.name] === option.value
                      ? 'ring-2 ring-purple-500'
                      : 'border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name={step.name}
                    value={option.value}
                    className="hidden"
                    checked={userAnswers[step.name] === option.value}
                    onChange={() => handleOptionChange(step.name, option.value)}
                  />
                  {option.image && (
                    <img
                      src={option.image}
                      alt={option.label}
                      className="w-full h-32 object-contain"
                    />
                  )}
                  <div className="text-center py-2 bg-gray-100 text-sm">{option.label}</div>
                </label>
              ))}
            </form>
            <div className="mt-6 flex justify-between">
              <button
                onClick={handleBack}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded disabled:opacity-50"
                disabled={currentStep === 0}
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
              >
                {currentStep === steps.length - 1 ? "Submit" : "Next"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FaceQuiz;
