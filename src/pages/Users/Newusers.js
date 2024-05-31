import React, { useState, useEffect } from "react";
import "reactjs-popup/dist/index.css";
import SearchIcon from "@mui/icons-material/Search";
import { useJsApiLoader } from "@react-google-maps/api";
import "./Users.css";
import Adduser from "../../components/Adduser/Adduser";
import { GET_ALL_PRISONERS_QUERY } from "../../GraphQL/queries";
import {
  UPDATE_PRISONER_INFO_MUTATION,
  DELETE_PRISONER_MUTATION,
  ADD_PRISONER_LOCATION_MUTATION,
} from "../../GraphQL/mutations";
import { useLazyQuery, useMutation } from "@apollo/client";
import Newuserinfo from "../../Assets/Userinfo/Newuserinfo";
import isEmpty from "lodash/isEmpty";
import Popup from "reactjs-popup";
import { Select } from "../../components/Map/Select";
import { GeofenceShow } from "../../components/Map/geofence";

function Newusers() {
  const [getAllPrisoners, { loading, error, data }] = useLazyQuery(
    GET_ALL_PRISONERS_QUERY,
    {
      context: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    }
  );
  const [addPrisonerLocation] = useMutation(ADD_PRISONER_LOCATION_MUTATION, {
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  });
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.React_APP_GOOGLE_MAPS_API_KEY,
  });
  const [Data, setData] = useState();
  const [prisoners, setPrisoners] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedPrisonerIndex, setSelectedPrisonerIndex] = useState(null);
  const [name, setName] = useState("");
  const [deviceID, setDeviceID] = useState("");
  const [dateofdetention, setDateOfDetention] = useState("");
  const [deletePrisoner, { loading: deleteLoading, error: deleteError }] =
    useMutation(DELETE_PRISONER_MUTATION, {
      context: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    });
  const [updatePrisonerInfo] = useMutation(UPDATE_PRISONER_INFO_MUTATION, {
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  });

  const sprisoners = prisoners.filter((prisoner) =>
    prisoner.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    getAllPrisoners();
  }, [getAllPrisoners]);

  useEffect(() => {
    if (loading) {
      console.log("Loading prisoners...");
    } else if (error) {
      console.error("Error fetching prisoners:", error);
    } else if (data) {
      setPrisoners(data.getPrisoners || []);
    }
  }, [loading, error, data]);

  if (loading) {
    return (
      <div>
        <div className="flex flex-row justify-between items-center p-4">
          <h1 className="font-bold text-4xl">Prisoners</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-full px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-xl"
              style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.4)" }}
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
          </div>
          <Newuserinfo />
        </div>
        Loading prisoners...
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="flex flex-row justify-between items-center p-4">
          <h1 className="font-bold text-4xl">Prisoners</h1>
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
          <Newuserinfo />
        </div>
        Error fetching prisoners: {error.message}
      </div>
    );
  }

  const handleaddlocation = async (deviceID, authorizedLocations) => {
    let authorizedLocationn = [];
    if (!isEmpty(Data)) {
      authorizedLocationn = Data.map(({ lat, lng }) => ({
        latitude: lat,
        longitude: lng,
      }));
    }
    console.log("auth:", authorizedLocationn);
    try {
      const { data } = await addPrisonerLocation({
        variables: {
          deviceId: deviceID,
          authorizedLocations: [authorizedLocationn],
        },
      });
      console.log("Location added successfully:", data.addPrisonerLocation);
    } catch (error) {
      console.error("Failed to add location:", error.message);
    }
    handleClose();
  };
  const handleGeofenceUpdate = (eventType, geofenceData) => {
    setData(geofenceData);
    console.log(geofenceData);
    console.log("Geofence update:", eventType, geofenceData);
  };
  const handleSaveEdit = async (deviceId) => {
    let authorizedLocations = [];
    if (!isEmpty(Data)) {
      authorizedLocations = Data.map(({ lat, lng }) => ({
        latitude: lat,
        longitude: lng,
      }));
    }

    try {
      const {
        data: { updatePrisonerInfo: updatedPrisonerInfo },
      } = await updatePrisonerInfo({
        variables: {
          DeviceId: deviceId,
          prisonerInput: {
            name: name,
            dateOfImprisonment: dateofdetention,
            authorizedLocations: [authorizedLocations],
            deviceId: deviceID,
          },
        },
      });
      console.log(updatedPrisonerInfo);
      if (updatedPrisonerInfo) {
        console.log("Prisoner updated successfully:", updatedPrisonerInfo);
        setSelectedPrisonerIndex(null);
        window.location.reload();
      } else {
        console.error("Failed to update prisoner.");
      }
    } catch (error) {
      console.error("Error updating prisoner:", error.message);
    }
  };

  const handleAddUserClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async (deviceId) => {
    if (deleteError) {
      console.log("error", typeof deleteError);
    }
    try {
      const deletedPrisoner = await deletePrisoner({ variables: { deviceId } });
      if (deletedPrisoner) {
        console.log("Prisoner deleted successfully:", deletedPrisoner);
        window.location.reload();
      } else {
        console.error("Prisoner deletion failed: Prisoner not found.");
      }
    } catch (error) {
      console.error("Unexpected error deleting prisoner:", error.message);
    }
  };

  return (
    <div className="rounded-lg flex flex-col p-4 users ">
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-5xl">Prisoners</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-2xl px-3 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-l"
            style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.4)" }}
          />
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
        </div>
        <Newuserinfo
          showAddFriendIcon={true}
          handleadduserclick={handleAddUserClick}
        />
      </div>
      <div className="flex flex-col m-2 p-2">
        <table className="table">
          <thead>
            <tr>
              <th className="p-2">Index</th>
              <th className="p-2">Name</th>
              <th className="p-2">DeviceID</th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sprisoners.map((prisoner, index) => (
              <Popup
                trigger={
                  <tr
                    key={prisoner.deviceId}
                    className="hover:bg-[#e7e7e7] cursor-pointer rounded-full spacey2"
                  >
                    <td className="text-lg p-2">{index + 1}</td>
                    <td className="text-lg p-2">
                      <p className="text-lg  p-2 cursor-pointer">
                        {prisoner.name}
                      </p>
                    </td>
                    <td className="text-lg p-2">{prisoner.deviceId}</td>
                    <td>
                      <Popup
                        trigger={
                          <button
                            variant="contained"
                            style={{ backgroundColor: "#FF0000" }}
                            className="flex m-2 justify-between items-center text-white rounded-2xl px-1 py-1 md:px-3 md:py-2 font-semibold shadow-lg transition-transform transform-gpu hover:scale-105 hover:shadow-2xl "
                          >
                            Add New Authorized Location
                          </button>
                        }
                        modal
                        contentStyle={{
                          borderRadius: "8px",
                          padding: "10px",
                          width: "500px",
                        }}
                      >
                        {(close) => (
                          <div className="flex flex-col items-center w-full space-y-4">
                            <div className="text-center border-b-2 border-b-black font-bold text-lg p-2 w-full">
                              Add Location
                            </div>
                            <div className="text-center text-lg p-2 w-full">
                              <Select
                                isLoaded={isLoaded}
                                onGeofenceEvent={handleGeofenceUpdate}
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                variant="contained"
                                style={{ backgroundColor: "#FF0000" }}
                                className="flex justify-between items-center text-white rounded-xl p-2 font-semibold shadow-lg transition-transform transform-gpu hover:scale-105 hover:shadow-2xl "
                                onClick={() => {
                                  close();
                                }}
                              >
                                Cancel
                              </button>
                              <button
                                variant="contained"
                                style={{ backgroundColor: "#FF0000" }}
                                className="flex justify-between items-center text-white rounded-xl p-2 font-semibold shadow-lg transition-transform transform-gpu hover:scale-105 hover:shadow-2xl "
                                onClick={() => {
                                  console.log("Prisoner Deleted ");
                                  handleaddlocation(
                                    prisoner.deviceId,
                                    prisoner.authorizedLocations
                                  );
                                  close();
                                }}
                              >
                                Confirm
                              </button>
                            </div>
                          </div>
                        )}
                      </Popup>
                    </td>
                    <td>
                      <Popup
                        trigger={
                          <button
                            variant="contained"
                            style={{ backgroundColor: "#FF0000" }}
                            className="flex m-2 justify-between items-center text-white rounded-2xl px-1 py-1 md:px-3 md:py-2 font-semibold shadow-lg transition-transform transform-gpu hover:scale-105 hover:shadow-2xl "
                          >
                            Delete
                          </button>
                        }
                        className=""
                        modal
                        contentStyle={{
                          borderRadius: "8px",
                          padding: "10px",
                          width: "500px",
                        }}
                      >
                        {(close) => (
                          <div className="flex flex-col items-center w-full space-y-4">
                            <div className="text-center border-b-2 border-b-black font-bold text-lg p-2 w-full">
                              Delete Confirmation
                            </div>
                            <div className="text-center text-lg p-2 w-full">
                              Do you Really want to delete the prisoner?
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                variant="contained"
                                style={{ backgroundColor: "#FF0000" }}
                                className="flex justify-between items-center text-white rounded-xl p-2 font-semibold shadow-lg transition-transform transform-gpu hover:scale-105 hover:shadow-2xl "
                                onClick={() => {
                                  close();
                                }}
                              >
                                Cancel
                              </button>
                              <button
                                variant="contained"
                                style={{ backgroundColor: "#FF0000" }}
                                className="flex justify-between items-center text-white rounded-xl p-2 font-semibold shadow-lg transition-transform transform-gpu hover:scale-105 hover:shadow-2xl "
                                onClick={() => {
                                  console.log("Prisoner Deleted ");
                                  handleDelete(prisoner.deviceId);
                                  close();
                                }}
                              >
                                Confirm
                              </button>
                            </div>
                          </div>
                        )}
                      </Popup>
                    </td>
                    <td>
                      <Popup
                        trigger={
                          <button
                            variant="contained"
                            style={{ backgroundColor: "#FF0000" }}
                            className="flex m-2 justify-between items-center text-white rounded-2xl px-1 py-1 md:px-3 md:py-2 font-semibold shadow-lg transition-transform transform-gpu hover:scale-105 hover:shadow-2xl "
                          >
                            Edit
                          </button>
                        }
                        className=""
                        modal
                        contentStyle={{
                          borderRadius: "8px",
                          padding: "10px",
                          width: "500px",
                        }}
                      >
                        {(close) => (
                          <div className="flex flex-col items-center w-full space-y-4">
                            <div className="text-center border-b-2 border-b-black font-bold text-lg p-2 w-full">
                              Edit Prisoner
                            </div>
                            <div className="text-center text-lg p-2 w-full">
                              <input
                                placeholder="Name"
                                className="rounded-2xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-xl"
                                style={{
                                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.4)",
                                }}
                                onChange={(e) => setName(e.target.value)}
                              />
                              <input
                                placeholder="Device ID"
                                className="rounded-2xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-xl"
                                style={{
                                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.4)",
                                }}
                                onChange={(e) => setDeviceID(e.target.value)}
                              />
                              <input
                                placeholder="Date of Detention"
                                className="rounded-2xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-xl"
                                style={{
                                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.4)",
                                }}
                                onChange={(e) =>
                                  setDateOfDetention(e.target.value)
                                }
                              />
                              <Select
                                isLoaded={isLoaded}
                                onGeofenceEvent={handleGeofenceUpdate}
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                variant="contained"
                                style={{ backgroundColor: "#FF0000" }}
                                className="flex justify-between items-center text-white rounded-xl p-2 font-semibold shadow-lg transition-transform transform-gpu hover:scale-105 hover:shadow-2xl "
                                onClick={() => {
                                  close();
                                }}
                              >
                                Cancel
                              </button>
                              <button
                                variant="contained"
                                style={{ backgroundColor: "#FF0000" }}
                                className="flex justify-between items-center text-white rounded-xl p-2 font-semibold shadow-lg transition-transform transform-gpu hover:scale-105 hover:shadow-2xl "
                                onClick={() => {
                                  console.log("Prisoner Deleted ");
                                  handleSaveEdit(prisoner.deviceId);
                                  close();
                                }}
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        )}
                      </Popup>
                    </td>
                  </tr>
                }
                modal
                contentStyle={{
                  borderRadius: "8px",
                  padding: "10px",
                  width: "500px",
                }}
              >
                {(close) => (
                  <div className="flex flex-col items-center w-full space-y-4">
                    <div className="text-center border-b-2 border-b-black font-bold text-lg p-2 w-full">
                      {prisoner.name}'Infos
                    </div>
                    <div className="text-center text-lg p-2 w-full">
                      <p>
                        <span className="font-bold">Name: </span>
                        <span>{prisoner.name}</span>
                      </p>
                      <p>
                        <span className="font-bold">DeviceId: </span>
                        <span>{prisoner.deviceId}</span>
                      </p>
                      <p>
                        <span className="font-bold">
                          Date of Imprisonment:{" "}
                        </span>
                        <span>{prisoner.dateOfImprisonment}</span>
                      </p>
                      <GeofenceShow
                        isLoaded={isLoaded}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        variant="contained"
                        style={{ backgroundColor: "#FF0000" }}
                        className="flex justify-between items-center text-white rounded-xl p-2 font-semibold shadow-lg transition-transform transform-gpu hover:scale-105 hover:shadow-2xl "
                        onClick={() => {
                          close();
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </Popup>
            ))}
          </tbody>
        </table>
      </div>
      {open && <Adduser handleClose={handleClose} />}
    </div>
  );
}

export default Newusers;
