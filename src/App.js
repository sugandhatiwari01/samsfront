import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import SplashScreen from "./pages/SplashScreen";
import AuthPage from "./pages/AuthPage";


// Page Components
import HomePage from "./pages/HomePage";
import AnalysisChoice from "./pages/AnalysisChoice";
import FaceQuiz from "./pages/FaceQuiz";
import BodyType from "./pages/BodyType";
import StyleAIForm from "./pages/StyleAIForm";
import CollectionSection from "./pages/CollectionSection";
import ProtectedRoute from "./pages/ProtectedRoute"; // ⬅️ import this

function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <div className="min-h-screen">
      {showSplash ? (
        <SplashScreen onComplete={handleSplashComplete} />
      ) : (
        
          <Router>
            
            <Routes>
<Route
  path="/"
  element={
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  }
/>
<Route
  path="/analyze"
  element={
    <ProtectedRoute>
      <AnalysisChoice />
    </ProtectedRoute>
  }
/>              <Route path="/face" element={
  
      <ProtectedRoute>
<FaceQuiz />
    </ProtectedRoute>

} />
              <Route path="/body" element={
                    <ProtectedRoute>
<BodyType />

    </ProtectedRoute>
}

/>
              <Route path="/styleaiform" element={
                    <ProtectedRoute>
                <StyleAIForm />
                    </ProtectedRoute>

                } />
              
              <Route path="/auth" element={
               
               <AuthPage />

                } />
<Route
  path="/CollectionSection"
  element={
    <ProtectedRoute>
      <CollectionSection />
    </ProtectedRoute>
  }
/>              <Route
                path="*"
                element={
                  <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#fdf6e3] to-[#d2b48c]">
                    <p className="text-2xl font-semibold text-red-600">
                      404 – Page Not Found
                    </p>
                  </div>
                }
              />
            </Routes>
          </Router>
       
      )}
    </div>
  );
}

export default App;
