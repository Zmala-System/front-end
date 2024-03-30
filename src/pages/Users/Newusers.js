import React, { useState } from "react";
import "reactjs-popup/dist/index.css";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import AddFriendIcon from "@mui/icons-material/PersonAdd";
import { Check } from "@mui/icons-material";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useJsApiLoader } from "@react-google-maps/api";
import Userinfo from "../../Assets/Userinfo/Userinfo";
import "./Users.css";
import Adduser from "../../components/Adduser/Adduser";

const CustomAlert = ({ message, onClose }) => {
  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Warning</DialogTitle>
      <DialogContent>{message}</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>OK</Button>
      </DialogActions>
    </Dialog>
  );
};

function Newusers() {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.React_APP_GOOGLE_MAPS_API_KEY,
  });
  const initialPrisonners = [
    {
      name: "first",
      age: "34 years old",
      geofence: [],
      braceletId: Math.floor(Math.random() * 10000),
    },
    {
      name: "second",
      age: "66 years old",
      geofence: [],
      braceletId: Math.floor(Math.random() * 10000),
    },
    {
      name: "third",
      age: "34 years old",
      geofence: [],
      braceletId: Math.floor(Math.random() * 10000),
    },
    {
      name: "fourth",
      age: "66 years old",
      geofence: [],
      braceletId: Math.floor(Math.random() * 10000),
    },
    {
      name: "fifth",
      age: "34 years old",
      geofence: [],
      braceletId: Math.floor(Math.random() * 10000),
    },
    {
      name: "sixth",
      age: "66 years old",
      geofence: [],
      braceletId: Math.floor(Math.random() * 10000),
    },
    {
      name: "seventh",
      age: "34 years old",
      geofence: [],
      braceletId: Math.floor(Math.random() * 10000),
    },
    {
      name: "eightth",
      age: "66 years old",
      geofence: [],
      braceletId: Math.floor(Math.random() * 10000),
    },
    {
      name: "ninth",
      age: "30 years old",
      geofence: [],
      braceletId: Math.floor(Math.random() * 10000),
    },
    {
      name: "tenth",
      age: "40 years old",
      geofence: [],
      braceletId: Math.floor(Math.random() * 10000),
    },
  ];

  const [prisonners, setPrisonners] = useState(initialPrisonners);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    braceletId: "",
    dateOfDetention: "",
    dateOfRelease: "",
    geofence: [],
  });
  const [selectedPrisonerIndex, setSelectedPrisonerIndex] = useState(null);
  const filteredPrisoners = prisonners.filter((prisoner) =>
    prisoner.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const toggleEditVisible = (index) => {
    setSelectedPrisonerIndex(index === selectedPrisonerIndex ? null : index);
    console.log("shown");
  };
  const handleSaveEdit = (index, newBraceletId) => {
    setPrisonners((prevPrisoners) =>
      prevPrisoners.map((prisoner, i) =>
        i === index ? { ...prisoner, braceletId: newBraceletId } : prisoner
      )
    );
    setSelectedPrisonerIndex(null);
  };

  const handleAddUserClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleSaveUser = () => {
    setPrisonners((prevPrisonners) => [...prevPrisonners, formData]);
    setFormData({
      name: "",
      age: "",
      braceletId: "",
      dateOfDetention: "",
      dateOfRelease: "",
      geofence: [],
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleGeofenceUpdate = (eventType, coordinates) => {
    setPrisonners((prevPrisoners) => {
      const updatedPrisoners = [...prevPrisoners];
      const lastAddedUserIndex = updatedPrisoners.length - 1;
      updatedPrisoners[lastAddedUserIndex].geofence = coordinates;
      return updatedPrisoners;
    });
  };

  return (
    <div className="rounded-lg flex flex-col p-8">
      <div className="flex flex-row justify-between items-center">
        <h1 className="font-bold text-4xl">Users</h1>
        <button
          style={{ backgroundColor: "#4A3AFF" }}
          className="flex justify-between items-center text-white rounded-full px-4 py-3 font-bold shadow-2xl min-w-36 transition-transform transform-gpu hover:scale-105 hover:shadow-lg "
          onClick={handleAddUserClick}
        >
          Add User
          <AddFriendIcon style={{ fontSize: 20 }} />
        </button>
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-full px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-xl"
            style={{ boxShadow: "0 0 20px rgba(0, 0, 0, 0.4)" }}
          />
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
        </div>
        <Userinfo />
      </div>
      <div></div>
      <Masonry
        columnsCount={3}
        className=" grid grid-cols-3 mt-4 p-6 grid-container"
        style={{ maxHeight: "calc(100vh - 180px)", overflowY: "auto" }}
        gutter="40px"
      >
        {filteredPrisoners.map((prisoner, index) => (
          <div
            key={index}
            className={`flex flex-col p-6 rounded-3xl bg-white shadow-xl ${
              selectedPrisonerIndex === index ? "bg-blue-200" : ""
            }`}
            style={{
              boxShadow: "0 0 20px rgba(0, 0, 0, 0.2)",
            }}
          >
            <p className="text-xl font-semibold py-1">{prisoner.name}</p>
            <p className="text-xl font-semibold py-1">{prisoner.age}</p>
            <p className="text-xl font-semibold py-1">{prisoner.braceletId}</p>

            <div>
              {selectedPrisonerIndex === index && (
                <div className="space-y-4 flex flex-col justify-center items-center w-full">
                  <hr className="mt-4 w-full h-2" />
                  <input
                    placeholder="Bracelet ID"
                    className="rounded-full px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-xl"
                    style={{ boxShadow: "0 0 20px rgba(0, 0, 0, 0.4)" }}
                  />
                  <button
                    style={{ backgroundColor: "#05FF00" }}
                    onClick={() => handleSaveEdit(index, prisoner.braceletId)}
                    className="flex justify-between items-center text-white rounded-full px-4 py-3 font-bold shadow-2xl min-w-36 transition-transform transform-gpu hover:scale-105 hover:shadow-lg "
                  >
                    Save
                    <Check />
                  </button>
                  <hr className="mt-4 w-full h-2" />
                </div>
              )}
            </div>

            <div className="flex justify-between my-2">
              <button
                variant="contained"
                style={{ backgroundColor: "#FF0000" }}
                className="flex justify-between items-center text-white rounded-full px-4 py-3 font-bold shadow-2xl min-w-36 transition-transform transform-gpu hover:scale-105 hover:shadow-lg "
              >
                Delete
                <CloseIcon />
              </button>
              <button
                variant="contained"
                style={{ backgroundColor: "#4A3AFF" }}
                className="flex justify-between items-center text-white rounded-full px-4 py-3 font-bold shadow-2xl min-w-36 transition-transform transform-gpu hover:scale-105 hover:shadow-lg "
                onClick={() => toggleEditVisible(index)}
                disabled={selectedPrisonerIndex === index}
              >
                Edit
                <EditIcon />
              </button>
            </div>
          </div>
        ))}
      </Masonry>
      {open && (
        <Adduser
          handleClose={handleClose}
          handleSaveUser={handleSaveUser}
          handleChange={handleChange}
          formData={formData}
        />
      )}
    </div>
  );
}

export default Newusers;
