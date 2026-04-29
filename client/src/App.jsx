// client/src/App.jsx

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Page components
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";

// Components
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar"; // Persistent Navbar

function App() {
  return (
    <Router>
      {/* Persistent Navbar for all pages */}
      <Navbar />

      {/* Main container with Tailwind styling */}
      <div className="bg-slate-100 min-h-screen text-slate-800">
        <main className="container mx-auto p-4 md:p-8">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Route */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
