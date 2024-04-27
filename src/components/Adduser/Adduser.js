import React, { useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import CloseIcon from "@mui/icons-material/Close";
import { Check } from "@mui/icons-material";
import { Select } from "../Map/Select";
import { CREATE_PRISONER_MUTATION } from "../../GraphQL/mutations";
import { useMutation } from "@apollo/client";

function Adduser({ handleClose }) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.React_APP_GOOGLE_MAPS_API_KEY,
  });
  const [Data, setData] = useState();
  const [Name, setName] = useState("");
  const [DateOfBirth, setDateOfBirth] = useState("");
  const [BraceletId, setBraceletId] = useState("");
  const [DateOfDetention, setDateOfDetention] = useState("");
  const [PeriodOfDetention, setPeriodOfDetention] = useState("");
  const [createPrisoner] = useMutation(CREATE_PRISONER_MUTATION, 
    {
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    },
  });

  const handleGeofenceUpdate = (eventType, geofenceData) => {
    setData(geofenceData);
    console.log("Geofence update:", eventType, geofenceData);
  };

  const handleSave = async () => {
    try {
      const authorizedLocations = Data.map(({ lat, lng }) => ({ latitude: lat, longitude: lng }));
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
  
      handleClose(); 
      window.location.reload();
    } catch (error) {
      console.error("Error creating prisoner:", error);
    }
  };
  

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-25 min-w-96 backdrop-blur-md flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl flex min-w-96">
          <div className="flex flex-col space-y-8 pr-4 min-w-96">
            <h1 className="text-2xl">Add User</h1>
            <input
              placeholder="Name"
              value={Name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-2xl px-4 py-3 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-xl"
              style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.4)" }}
            />
            <input
              placeholder="Date of birth"
              value={DateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="rounded-2xl px-4 py-3 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-xl"
              style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.4)" }}
            />
            <input
              placeholder="Bracelet ID"
              value={BraceletId}
              onChange={(e) => setBraceletId(e.target.value)}
              className="rounded-2xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-xl"
              style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.4)" }}
            />
            <input
              placeholder="Date of detention"
              value={DateOfDetention}
              onChange={(e) => setDateOfDetention(e.target.value)}
              className="rounded-2xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-xl"
              style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.4)" }}
            />
            <input
              placeholder="Period of detention"
              value={PeriodOfDetention}
              onChange={(e) => setPeriodOfDetention(e.target.value)}
              className="rounded-2xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-xl"
              style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.4)" }}
            />
          </div>
          <div className="flex flex-col items-end px-4">
            <Select isLoaded={isLoaded} onGeofenceEvent={handleGeofenceUpdate} />
            <div className="flex my-4">
              <button
                variant="contained"
                style={{ backgroundColor: "#FF0000" }}
                onClick={handleClose}
                className="flex justify-between items-center text-white rounded-full px-4 py-2 font-bold shadow-2xl min-w-36 transition-transform transform-gpu hover:scale-105 hover:shadow-lg mr-4"
              >
                Cancel
                <CloseIcon />
              </button>
              <button
                style={{ backgroundColor: "#05FF00" }}
                className="flex justify-between items-center text-white rounded-full px-4 py-3 font-bold shadow-2xl min-w-36 transition-transform transform-gpu hover:scale-105 hover:shadow-lg "
                onClick={handleSave}
              >
                Save
                <Check />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Adduser;


