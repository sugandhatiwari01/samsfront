import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser, resetPassword } from "../utils/api";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotForm, setShowForgotForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    securityQuestion: "",
    securityAnswer: "",
  });
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("userId");
    if (user) navigate("/", { replace: true });
  }, [navigate]);

  const toggleForm = () => setIsLogin((prev) => !prev);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const res = await loginUser({
          email: formData.email,
          password: formData.password,
        });
        if (res.token) {
          localStorage.setItem("token", res.token);
          localStorage.setItem("userId", res.user.id);
          navigate("/");
        } else {
          alert("Login failed: " + res.error);
        }
      } else {
        const res = await registerUser({
          username: formData.name,
          email: formData.email,
          password: formData.password,
          securityQuestion: formData.securityQuestion,
          securityAnswer: formData.securityAnswer,
        });
        if (res.message) {
          alert("Registration successful! Please log in.");
          setIsLogin(true);
        } else {
          alert("Registration failed: " + res.error);
        }
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await resetPassword({
        email: formData.email,
        answer: formData.securityAnswer,
        newPassword,
      });
      if (res.message) {
        alert("Password reset successfully!");
        setShowForgotForm(false);
        setFormData({
          name: "",
          email: "",
          password: "",
          securityQuestion: "",
          securityAnswer: "",
        });
        setNewPassword("");
      } else {
        alert("Reset failed: " + res.error);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Side */}
      <div
        className="hidden md:block bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/736x/be/f1/8f/bef18f0e52d908b6086e699b182d1d1d.jpg')"
        }}
      ></div>

      {/* Right Side */}
      <div className="flex items-center justify-center bg-gradient-to-br from-[#fdf6e3] to-[#d2b48c] p-6">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          {!showForgotForm ? (
            <>
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                {isLogin ? "Welcome Back" : "Join SAMS Label"}
              </h2>
              <form className="space-y-5" onSubmit={handleSubmit}>
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full mt-1 px-4 py-2 border rounded-lg"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full mt-1 px-4 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full mt-1 px-4 py-2 border rounded-lg"
                  />
                </div>

                {!isLogin && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Security Question</label>
                      <select
                        name="securityQuestion"
                        value={formData.securityQuestion}
                        onChange={handleChange}
                        required
                        className="w-full mt-1 px-4 py-2 border rounded-lg"
                      >
                        <option value="">Select a question</option>
                        <option value="Your favorite color?">Your favorite color?</option>
                        <option value="Your pet's name?">Your pet's name?</option>
                        <option value="Your childhood nickname?">Your childhood nickname?</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Answer</label>
                      <input
                        type="text"
                        name="securityAnswer"
                        value={formData.securityAnswer}
                        onChange={handleChange}
                        required
                        className="w-full mt-1 px-4 py-2 border rounded-lg"
                      />
                    </div>
                  </>
                )}

                {isLogin && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center text-sm">
                      <input type="checkbox" className="mr-2" />
                      Remember me
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotForm(true)}
                      className="text-sm text-pink-500 hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-stone-500 hover:bg-stone-600 text-white font-semibold py-2 rounded-lg"
                >
                  {isLogin ? "Log In" : "Sign Up"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  onClick={toggleForm}
                  className="text-pink-500 hover:underline focus:outline-none"
                >
                  {isLogin ? "Sign Up" : "Log In"}
                </button>
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-center mb-4">Reset Password</h2>
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Security Question</label>
                  <select
                    name="securityQuestion"
                    value={formData.securityQuestion}
                    onChange={handleChange}
                    required
                    className="w-full mt-1 px-4 py-2 border rounded-lg"
                  >
                    <option value="">Select a question</option>
                    <option value="Your favorite color?">Your favorite color?</option>
                    <option value="Your pet's name?">Your pet's name?</option>
                    <option value="Your childhood nickname?">Your childhood nickname?</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Answer</label>
                  <input
                    type="text"
                    name="securityAnswer"
                    value={formData.securityAnswer}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg"
                >
                  Reset Password
                </button>
                <button
                  type="button"
                  onClick={() => setShowForgotForm(false)}
                  className="w-full text-sm text-pink-500 mt-2 hover:underline"
                >
                  Back to Login
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
