import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../icons/logo.png";
import { Dashboard, People } from "@material-ui/icons";

function Newsidebar() {
  const location = useLocation();
  const [items, setItems] = useState(() => [
    { icon: <Dashboard />, path: "/" },
    { icon: <People />, path: "/users" },
  ]);

  useEffect(() => {
    setItems([
      {
        icon: (
          <Dashboard
            style={{
              fontSize: location.pathname === "/" ? "1.5rem" : "1rem",
              color: location.pathname === "/" ? "black" : "white",
              transition: "font-size 0.2s, color 0.2s",
              width: "2rem",
            }}
          />
        ),
        path: "/",
      },
      {
        icon: (
          <People
            style={{
              fontSize: location.pathname === "/users" ? "1.5rem" : "1rem",
              color: location.pathname === "/users" ? "black" : "white",
              transition: "font-size 0.2s, color 0.2s",
              width: "2rem",
            }}
          />
        ),
        path: "/users",
      },
    ]);
  }, [location.pathname]);

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <img src={logo} alt="LOGO" className="h-[100px] w-[100px] ml-4 mt-2" />
      <div className="flex-grow flex flex-col justify-center items-center">
        <nav className="bg-[#4A3AFF] rounded-full ml-2">
          <ul>
            {items.map((item, index) => (
              <li key={index}>
                <Link
                  className="flex text-xl justify-center items-center"
                  to={item.path}
                >
                  <div
                    className={`flex m-1 py-2 px-1 justify-center items-center ${
                      location.pathname === item.path
                        ? "bg-white rounded-full transition-opacity duration-500"
                        : "transition-opacity duration-500 opacity-50"
                    }`}
                  >
                    {item.icon}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Newsidebar;
