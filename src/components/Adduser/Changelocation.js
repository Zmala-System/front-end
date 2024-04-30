import React from 'react'
import { useJsApiLoader } from "@react-google-maps/api";
import { Select } from "../Map/Select";
import { Check } from "@mui/icons-material";

function Changelocation({handleClose,handleSave}) {
    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: process.env.React_APP_GOOGLE_MAPS_API_KEY,
      });

      const handleGeofenceUpdate = (eventType, geofenceData) => {
        handleSave(geofenceData);
        console.log(geofenceData);
        console.log("Geofence update:", eventType, geofenceData);
      };
      return (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-25 min-w-96 backdrop-blur-md flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl flex min-w-96 flex flex-col space-y-4">
                <h1 className="text-2xl">Change Authorized location</h1>
                <Select isLoaded={isLoaded} onGeofenceEvent={handleGeofenceUpdate} />
            <button
          style={{ backgroundColor: "#FF0000" }}
          className="flex justify-between items-center text-white rounded-2xl px-4 py-3 font-bold shadow-2xl transition-transform transform-gpu hover:scale-105 hover:shadow-lg "
          onClick={handleClose}
        >
          Cancel
          <Check />
        </button>
            </div>
          </div>
        </>
      );
}

export default Changelocation