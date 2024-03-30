import React, { useState } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { Check } from "@mui/icons-material";
import Usericon from "../../icons/User.svg";

function Userinfo() {
  const [showPasswordInputs, setShowPasswordInputs] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSettingsClick = () => {
    setShowPasswordInputs(!showPasswordInputs);
    setShowNotifications(false);
  };

  const handleNotificationsClick = () => {
    setShowNotifications(!showNotifications);
    setShowPasswordInputs(false);
  };

  return (
    <div className="relative bg-[#4A3AFF] justify-center items-center rounded-2xl p-3 space-y-2">
      <div className="flex flex-row justify-center items-center space-x-2">
        <NotificationsIcon
          className="text-white cursor-pointer"
          onClick={handleNotificationsClick}
        />
        <SettingsIcon
          className="text-white cursor-pointer"
          onClick={handleSettingsClick}
        />
        <div className="flex flex-row bg-white justify-center items-center px-2 py-1 space-x-4 rounded-full">
          <img
            src={Usericon}
            alt="User Icon"
            style={{ width: "32px", height: "32px" }}
          />
          <div className="flex flex-col justify-center items-center">
            <p>Abderahmane</p>
            <p>Administrator</p>
          </div>
          <LogoutIcon className="text-black cursor-pointer" />
        </div>
      </div>
      <div
        className={`absolute top-full w-full left-1/2 transform -translate-x-1/2 bg-[#4A3AFF] p-4 rounded-xl flex flex-col items-center justify-center space-y-2 ${
          showPasswordInputs ? "opacity-100 scale-100" : "opacity-0 scale-90"
        } transition-opacity duration-300 transition-transform duration-300`}
        style={{ zIndex: showPasswordInputs ? 1 : -1 }}
      >
        <input
          type="password"
          placeholder="Enter your password"
          className="rounded-full px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-xl"
          style={{ boxShadow: "0 0 20px rgba(0, 0, 0, 0.4)" }}
        />
        <input
          type="password"
          placeholder="Confirm your password"
          className="rounded-full px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-xl"
          style={{ boxShadow: "0 0 20px rgba(0, 0, 0, 0.4)" }}
        />
        <button
          style={{ backgroundColor: "#05FF00" }}
          className="flex justify-between items-center text-white rounded-full px-4 py-2 font-bold shadow-2xl max-w-36 transition-transform transform-gpu hover:scale-105 hover:shadow-lg"
          onClick={handleSettingsClick}
        >
          Save
          <Check />
        </button>
      </div>
      <div
        className={`absolute top-full w-full left-1/2 transform -translate-x-1/2 bg-[#4A3AFF] p-4 rounded-xl flex flex-col items-center justify-center space-y-2 ${
          showNotifications ? "opacity-100 scale-100" : "opacity-0 scale-90"
        } transition-opacity duration-300 transition-transform duration-300`}
        style={{ zIndex: showNotifications ? 1 : -1 }}
      >

        <p>Notification 1</p>
        <p>Notification 2</p>
      </div>
    </div>
  );
}

export default Userinfo;
