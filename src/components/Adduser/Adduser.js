import React from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import CloseIcon from "@mui/icons-material/Close";
import { Check } from "@mui/icons-material";
import { Select } from "../Map/Select";

function Adduser({ handleClose, handleSaveUser, handleChange, formData }) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.React_APP_GOOGLE_MAPS_API_KEY,
  });
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-25 min-w-96 backdrop-blur-md flex items-center justify-center">
        <div className="bg-white p-8 rounded-[50px] flex min-w-96">
          <div className="flex flex-col space-y-8 pr-4 min-w-96">
            <h1 className="text-2xl">Add User</h1>
            <input
              placeholder="Name"
              className="rounded-full px-4 py-3 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-xl"
              style={{ boxShadow: "0 0 20px rgba(0, 0, 0, 0.4)" }}
            />
            <input
              placeholder="Date of birth"
              className="rounded-full px-4 py-3 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-xl"
              style={{ boxShadow: "0 0 20px rgba(0, 0, 0, 0.4)" }}
            />
            <input
              placeholder="Bracelet ID"
              className="rounded-full px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-xl"
              style={{ boxShadow: "0 0 20px rgba(0, 0, 0, 0.4)" }}
            />
            <input
              placeholder="Date of detention"
              className="rounded-full px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-xl"
              style={{ boxShadow: "0 0 20px rgba(0, 0, 0, 0.4)" }}
            />
            <input
              placeholder="Period of detention"
              className="rounded-full px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-xl"
              style={{ boxShadow: "0 0 20px rgba(0, 0, 0, 0.4)" }}
            />
          </div>
          <div className="flex flex-col items-end px-4">
            <Select isLoaded={isLoaded} />
            <div className="flex my-4 ">
              <button
                variant="contained"
                style={{ backgroundColor: "#FF0000" }}
                onClick={handleClose}
                className="flex justify-between items-center text-white rounded-full px-4 py-3 font-bold shadow-2xl min-w-36 transition-transform transform-gpu hover:scale-105 hover:shadow-lg mr-4"
              >
                Cancel
                <CloseIcon />
              </button>
              <button
                onClick={handleSaveUser}
                style={{ backgroundColor: "#05FF00" }}
                className="flex justify-between items-center text-white rounded-full px-4 py-3 font-bold shadow-2xl min-w-36 transition-transform transform-gpu hover:scale-105 hover:shadow-lg "
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
