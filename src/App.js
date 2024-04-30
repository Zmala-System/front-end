import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useJsApiLoader } from "@react-google-maps/api";
import "./index.css";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Newsidebar from "./components/Sidebar/Newsidebar";
import { jwtDecode } from "jwt-decode";
import Newusers from "./pages/Users/Newusers";

function checkToken() {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp > currentTime) {
        return true; 
      } else {
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Invalid token:", error.message);
      localStorage.removeItem("token");
    }
  }

  return false;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp > currentTime) {
          setIsLoggedIn(true);
        } else {
          localStorage.removeItem("token"); 
          console.log("dashboard not shown");
        }
      } catch (error) {
        console.error("Invalid token:", error.message);
        localStorage.removeItem("token"); 
      }
    }
  }, []);
  const isTokenValid = checkToken();
  return (
    <div className="">
      <Router>
        <Routes>
          <Route
            path="/login"
            element={<Login />} 
          />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/*"
            element={
              isTokenValid ? (
                <div className="flex flex-row">
                  <Newsidebar />
                  <main className="flex-grow">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/users" element={<Newusers />} />
                    </Routes>
                  </main>
                </div>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </Router>
    </div>
  );
}
