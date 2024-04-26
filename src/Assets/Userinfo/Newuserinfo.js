import React,{useState,useEffect} from 'react';
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import { Check } from "@mui/icons-material";
import AddFriendIcon from "@mui/icons-material/PersonAdd";
import Usericon from "../../icons/User.svg";
import './Newuserinfo.css';

function Newuserinfo({ showAddFriendIcon, handleadduserclick }) {
    const [username, setUsername] = useState(''); 
    const [settingsdown,Setsettingsdown]=useState(false);
    const [notificationsdown,Setnotificationsdown]=useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    useEffect(() => {
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
      }
    }, []);
    const handlelogout=()=>{
      localStorage.removeItem("token");
      window.location.reload();
    };
  return (
    <div className="relative">
    <div className={`bg-[#4A3AFF] ${settingsdown || notificationsdown ? "rounded-t-2xl":"rounded-2xl"} flex flex-row justify-center items-center space-x-2 p-2`}>
    <div
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {showAddFriendIcon && (
            <div className="cursor-pointer">
              <AddFriendIcon
                style={{ fontSize: 20, color: "white" }}
                onClick={handleadduserclick}
              />
              {showTooltip && (
                <div className="absolute top-8 left-8 bg-black text-white px-2 py-1 rounded">
                  Add prisoner
                </div>
              )}
            </div>
          )}
        </div>
        <NotificationsIcon
          className="text-white cursor-pointer"
          onClick={()=>{
            Setsettingsdown(false);
            Setnotificationsdown(!notificationsdown);
          }}
        />
        <SettingsIcon
          className="text-white cursor-pointer"
          onClick={()=>{
            Setnotificationsdown(false);
            Setsettingsdown(!settingsdown);
            }}
        />
    <div className="flex flex-row bg-white justify-center items-center px-2  space-x-4 rounded-2xl">
          <img
            src={Usericon}
            alt="User Icon"
            style={{ width: "32px", height: "32px" }}
          />
          <div className="flex flex-col justify-center items-center">
            <p>{username} </p>
            <p>Administrator</p>
          </div>
          <LogoutIcon className="text-black cursor-pointer" 
          onClick={handlelogout}/>
        </div>
    </div>
    <div className={`absolute w-full z-50 user ${ settingsdown ? "up ":"down"}`}>
        <div >
            <div className={`h-full rounded-b-2xl bg-[#4A3AFF] p-4 rounded-b-xl flex flex-col items-center justify-center space-y-2 `}>
            <input
            type="password"
            placeholder="Enter your password"
            className="rounded-2xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-xl"
            style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.4)" }}
          />
          <input
            type="password"
            placeholder="Confirm your password"
            className="rounded-2xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-xl"
            style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.4)" }}
          />
          <button
            style={{ backgroundColor: "#05FF00" }}
            className="flex justify-between items-center text-white rounded-full px-4 py-2 font-bold shadow-2xl max-w-36 transition-transform transform-gpu hover:scale-105 hover:shadow-lg"
            onClick={()=>{
                Setsettingsdown(false);
            }}
          >
            Save
            <Check />
          </button>
            </div>
        </div>
    </div>
    <div className={`absolute w-full z-50 user ${notificationsdown ? "up ":"down "}`}>
        <div>
            <div className={`rounded-b-2xl h-full bg-[#4A3AFF] p-4 flex flex-col items-center justify-center space-y-2 `}>
                <p>Notification 1</p>
                <p>Notification 2</p>
            </div>
        </div>
    </div>
    </div>

  )
}

export default Newuserinfo