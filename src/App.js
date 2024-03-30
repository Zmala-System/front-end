import React, { useState } from "react";
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
import "@fontsource/inter";
import Newusers from "./pages/Users/Newusers";

export default function App() {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.React_APP_GOOGLE_MAPS_API_KEY,
  });

  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <div className="font-sans">
      <Router>
        <Routes>
          <Route
            path="/login"
            element={<Login setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/*"
            element={
              isLoggedIn ? (
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
