import React, { useState, useEffect } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import { Check } from "@mui/icons-material";
import AddFriendIcon from "@mui/icons-material/PersonAdd";
import "./Newuserinfo.css";
import { useMutation } from "@apollo/client";
import { CHANGE_ADMIN_PASSWORD } from "../../GraphQL/mutations";
import "reactjs-popup/dist/index.css";
import { CREATE_PRISONER_MUTATION } from "../../GraphQL/mutations";
import Popup from "reactjs-popup";
import { useJsApiLoader } from "@react-google-maps/api";
import { Select } from "../../components/Map/Select";
function Newuserinfo({ show }) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.React_APP_GOOGLE_MAPS_API_KEY,
  });
  const [username, setUsername] = useState("");
  const [settingsdown, Setsettingsdown] = useState(false);
  const [notificationsdown, Setnotificationsdown] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);
  const handlelogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.reload();
  };
  const [
    changeAdminPassword,
    { loading: changeploading, error: changeperror },
  ] = useMutation(CHANGE_ADMIN_PASSWORD, {
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  });
  const handleSavePassword = async (password, confirmPassword) => {
    try {
      const { data } = await changeAdminPassword({
        variables: { password, confirmPassword },
      });
      console.log("Password changed successfully:", data.changeAdminPassword);
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };
  const [Data, setData] = useState();
  const [Name, setName] = useState("");
  const [DateOfBirth, setDateOfBirth] = useState("");
  const [error, setError] = useState(""); // State for error message
  const [BraceletId, setBraceletId] = useState("");
  const [DateOfDetention, setDateOfDetention] = useState("");
  const [PeriodOfDetention, setPeriodOfDetention] = useState("");
  const [datafilled, setDatafilled] = useState(false);
  const [createPrisoner] = useMutation(CREATE_PRISONER_MUTATION, {
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  });

  const handleGeofenceUpdate = (eventType, geofenceData) => {
    setData(geofenceData);
    console.log("Geofence update:", eventType, geofenceData);
  };

  const handleSave = async () => {
    if (
      Data === "" ||
      Name === "" ||
      DateOfBirth === "" ||
      DateOfDetention === "" ||
      PeriodOfDetention === ""
    ) {
      setDatafilled(true);
    } else {
      setDatafilled(false);
      try {
        const authorizedLocations = Data.map(({ lat, lng }) => ({
          latitude: lat,
          longitude: lng,
        }));
        await createPrisoner({
          variables: {
            prisonerInput: {
              name: Name,
              dateOfImprisonment: DateOfDetention,
              authorizedLocations: [authorizedLocations],
              deviceId: BraceletId,
            },
          },
        });
        window.location.reload();
      } catch (error) {
        setError(error.message);
        console.error("Error creating prisoner:", error);
      }
    }
  };
  return (
    <div className="relative">
      <div
        className={`bg-[#4A3AFF] ${
          settingsdown || notificationsdown ? "rounded-t-2xl" : "rounded-2xl"
        } flex flex-row justify-center items-center space-x-2 p-2`}
      >
            <Popup
              trigger={
                <button
                  variant="contained"
                  style={{ backgroundColor: "#FFFFFF" }}
                  className="flex m-2 justify-between items-center min-w-[12rem] text-[#4A3AFF] rounded-xl px-1 py-1 md:px-3 md:py-2 font-semibold shadow-lg transition-transform transform-gpu hover:scale-105 hover:shadow-2xl "
                >
                  Add A Prisoner
                  <AddFriendIcon />
                </button>
              }
              className=""
              modal
              contentStyle={{
                borderRadius: "8px",
                padding: "10px",
                width: "50%",
              }}
            >
              {(close) => (
                <div className="">
                  <div className="flex flex-col text-center border-b-2 border-b-black font-bold text-lg p-2 w-full">
                    Add Prisoner
                  </div>
                  <div className="bg-white p-8 rounded-xl flex w-full">
                    <div className="flex flex-col space-y-8 pr-4 w-full ">
                      <input
                        placeholder="Name"
                        value={Name}
                        onChange={(e) => setName(e.target.value)}
                        style={{
                          width: "360px",
                          padding: "10px",
                          margin: "10px 0",
                          borderRadius: "16px",
                          border: "1px solid #ccc",
                          boxShadow: "0 1px 6px rgba(0, 0, 0, 0.1)",
                          fontSize: "16px",
                          outline: "none",
                        }}
                      />
                      <input
                        placeholder="Date of birth"
                        type="Date"
                        value={DateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        style={{
                          width: "360px",
                          padding: "10px",
                          margin: "10px 0",
                          borderRadius: "16px",
                          border: "1px solid #ccc",
                          boxShadow: "0 1px 6px rgba(0, 0, 0, 0.1)",
                          fontSize: "16px",
                          outline: "none",
                        }}
                      />
                      <input
                        placeholder="Bracelet ID"
                        value={BraceletId}
                        onChange={(e) => setBraceletId(e.target.value)}
                        style={{
                          width: "360px",
                          padding: "10px",
                          margin: "10px 0",
                          borderRadius: "16px",
                          border: "1px solid #ccc",
                          boxShadow: "0 1px 6px rgba(0, 0, 0, 0.1)",
                          fontSize: "16px",
                          outline: "none",
                        }}
                      />
                      <input
                        placeholder="Date of detention"
                        type="Date"
                        value={DateOfDetention}
                        onChange={(e) => setDateOfDetention(e.target.value)}
                        style={{
                          width: "360px",
                          padding: "10px",
                          margin: "10px 0",
                          borderRadius: "16px",
                          border: "1px solid #ccc",
                          boxShadow: "0 1px 6px rgba(0, 0, 0, 0.1)",
                          fontSize: "16px",
                          outline: "none",
                        }}
                      />
                      <input
                        placeholder="Period of detention"
                        value={PeriodOfDetention}
                        onChange={(e) => setPeriodOfDetention(e.target.value)}
                        style={{
                          width: "360px",
                          padding: "10px",
                          margin: "10px 0",
                          borderRadius: "16px",
                          border: "1px solid #ccc",
                          boxShadow: "0 1px 6px rgba(0, 0, 0, 0.1)",
                          fontSize: "16px",
                          outline: "none",
                        }}
                      />
                    </div>

                    <div className="flex flex-col items-end px-4">
                      <Select
                        isLoaded={isLoaded}
                        onGeofenceEvent={handleGeofenceUpdate}
                      />
                      {datafilled && (
                        <p className="error-message">Please fill all fields</p>
                      )}
                      {error && <p className="error-message">{error}</p>}
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-center">
                    <button
                      variant="contained"
                      style={{ backgroundColor: "#FF0000" }}
                      onClick={close}
                      className="flex justify-between items-center text-white rounded-xl px-3 py-2 font-bold shadow-2xl min-w-36 transition-transform transform-gpu hover:scale-105 hover:shadow-lg mr-4"
                    >
                      Cancel
                    </button>
                    <button
                      style={{ backgroundColor: "#05FF00" }}
                      className="flex justify-between items-center text-white rounded-xl px-3 py-2 font-bold shadow-2xl min-w-36 transition-transform transform-gpu hover:scale-105 hover:shadow-lg "
                      onClick={handleSave}
                    >
                      Save
                      <Check />
                    </button>
                  </div>
                </div>
              )}
            </Popup>



        <NotificationsIcon
          className="text-white cursor-pointer"
          onClick={() => {
            Setsettingsdown(false);
            Setnotificationsdown(!notificationsdown);
          }}
        />
        <SettingsIcon
          className="text-white cursor-pointer"
          onClick={() => {
            Setnotificationsdown(false);
            Setsettingsdown(!settingsdown);
          }}
        />
        <div className="flex flex-row bg-white justify-center items-center px-4 py-2 space-x-4 rounded-xl">
          <div className="flex flex-col justify-center items-center">
            <p className="font-bold">{username} </p>
          </div>
          <LogoutIcon
            className="text-black cursor-pointer"
            onClick={handlelogout}
          />
        </div>
      </div>
      <div
        className={`absolute w-full z-50 user ${settingsdown ? "up " : "down"}`}
      >
        <div>
          <div
            className={`h-full rounded-b-2xl bg-[#4A3AFF] p-4 rounded-b-xl flex flex-col items-center justify-center space-y-2 `}
          >
            <input
              type="password"
              placeholder="Enter your password"
              style={{
                width: "350px",
                padding: "10px",
                margin: "10px 0",
                borderRadius: "16px",
                border: "1px solid #ccc",
                boxShadow: "0 1px 6px rgba(0, 0, 0, 0.1)",
                fontSize: "16px",
                outline: "none",
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm your password"
              style={{
                width: "350px",
                padding: "10px",
                margin: "10px 0",
                borderRadius: "16px",
                border: "1px solid #ccc",
                boxShadow: "0 1px 6px rgba(0, 0, 0, 0.1)",
                fontSize: "16px",
                outline: "none",
              }}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              style={{ backgroundColor: "#05FF00" }}
              className="flex min-w-[7rem] justify-between items-center text-white rounded-xl px-4 py-2 font-bold shadow-2xl max-w-36 transition-transform transform-gpu hover:scale-105 hover:shadow-lg"
              onClick={() => {
                handleSavePassword(password, confirmPassword);
                Setsettingsdown(false);
              }}
            >
              Save
              <Check />
            </button>
          </div>
        </div>
      </div>
      <div
        className={`absolute w-full z-50 user ${
          notificationsdown ? "up " : "down "
        }`}
      >
        <div>
          <div
            className={`rounded-b-2xl h-full bg-[#4A3AFF] p-4 flex flex-col items-center justify-center space-y-2 `}
          >
            <p>Notification 1</p>
            <p>Notification 2</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Newuserinfo;
