import React, { useState, useEffect } from "react";
import "reactjs-popup/dist/index.css";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Check } from "@mui/icons-material";
import "./Users.css";
import { GET_ALL_PRISONERS_QUERY } from "../../GraphQL/queries";
import { useJsApiLoader } from "@react-google-maps/api";
import {
  UPDATE_PRISONER_INFO_MUTATION,
  DELETE_PRISONER_MUTATION,
} from "../../GraphQL/mutations";
import { useLazyQuery, useMutation } from "@apollo/client";
import Newuserinfo from "../../Assets/Userinfo/Newuserinfo";
import isEmpty from "lodash/isEmpty";
import Popup from "reactjs-popup";
import { useSubscriptionContext } from "../../Context/SubscriptionContext";
import { Select } from "../../components/Map/Select";
import Userinfos from "../../components/Map/Userinfo";

function Newusers() {
  const PrisonerLocation = ({ deviceId }) => {
    const { incomingData, dId, setdId } = useSubscriptionContext();
    let prisonerId, prisonerName, latitude, longitude, battery, alert1, alert2;
    setdId(deviceId);
    console.log(dId);
    console.log(incomingData);
    if (!incomingData || !dId) {
      return <p>Battery Level not Available</p>;
    }
    if (incomingData && incomingData.locationChangedPrisoner) {
      [prisonerId, prisonerName, latitude, longitude, battery, alert1, alert2] =
        incomingData.locationChangedPrisoner.split("/");
      if (prisonerId === dId) {
        setLatitude(latitude);
        setLongitude(longitude);
        setsid(dId);
        console.log(latitude);
        console.log(longitude);
        return <div>{battery}%</div>;
      } else {
        return <div>Battery Level Not Avaialbe</div>;
      }
    }
  };
  const [sid, setsid] = useState(null);
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
  const [Data, setData] = useState();
  const [prisoners, setPrisoners] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPrisonerIndex, setSelectedPrisonerIndex] = useState(null);
  const [name, setName] = useState("");
  const [deviceID, setDeviceID] = useState("");
  const [dateofdetention, setDateOfDetention] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
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
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.React_APP_GOOGLE_MAPS_API_KEY,
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
      console.log(prisoners);
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
          <Newuserinfo show={true} />
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
          <Newuserinfo show={true} />
        </div>
        Error fetching prisoners: {error.message}
      </div>
    );
  }

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
  if (sprisoners.length === 0) {
    return (
      <div>
        <div className="flex flex-row justify-between items-center p-4">
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
          <Newuserinfo show={true} />
        </div>
        <div className="flex flex-col items-center justify-center mt-10">
          <p className="text-2xl font-semibold text-gray-600">
            No Prisoner Found
          </p>
        </div>
      </div>
    );
  }
  console.log(sprisoners);

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
        <Newuserinfo show={true} />
      </div>
      <div
        className="content grid-container mt-4 "
        style={{ maxHeight: "90%" }}
      >
        <table className="table ">
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
                    className="hover:bg-[#e7e7e7]  cursor-pointer rounded-full space-y-2"
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
                            style={{ backgroundColor: "#4A3AFF" }}
                            className="flex m-2 justify-between items-center min-w-[7rem] text-white rounded-xl px-1 py-1 md:px-3 md:py-2 font-semibold shadow-lg transition-transform transform-gpu hover:scale-105 hover:shadow-2xl "
                          >
                            Edit
                            <EditIcon />
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
                            <div className="text-center text-lg p-2 flex flex-col items-center w-full space-y-4">
                              <input
                                placeholder="Name"
                                className="rounded-2xl px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-xl"
                                style={{
                                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.4)",
                                }}
                                onChange={(e) => setName(e.target.value)}
                              />
                              <input
                                placeholder="Device ID"
                                className="rounded-2xl px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-xl"
                                style={{
                                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.4)",
                                }}
                                onChange={(e) => setDeviceID(e.target.value)}
                              />
                              <input
                                placeholder="Date of Detention"
                                className="rounded-2xl px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-xl"
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
                                className="flex  min-w-[7rem] justify-between items-center text-white rounded-xl p-2 font-semibold shadow-lg transition-transform transform-gpu hover:scale-105 hover:shadow-2xl "
                                onClick={() => {
                                  close();
                                }}
                              >
                                Cancel
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-6 w-6"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  available
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                              <button
                                variant="contained"
                                style={{ backgroundColor: "#4CAF50" }}
                                className="flex min-w-[7rem] justify-between items-center text-white rounded-xl p-2 font-semibold shadow-lg transition-transform transform-gpu hover:scale-105 hover:shadow-2xl "
                                onClick={() => {
                                  console.log("Prisoner Deleted ");
                                  handleSaveEdit(prisoner.deviceId);
                                  close();
                                }}
                              >
                                Save
                                <Check />
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
                            style={{ backgroundColor: "#D32C2C" }}
                            className="flex m-2 justify-between items-center text-white rounded-xl px-1 py-1 md:px-3 md:py-2 font-semibold shadow-lg transition-transform transform-gpu hover:scale-105 hover:shadow-2xl min-w-[7rem]"
                          >
                            Delete
                            <DeleteIcon />
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
                                className="flex justify-between items-center text-white rounded-xl p-2 font-semibold shadow-lg transition-transform transform-gpu hover:scale-105 hover:shadow-2xl min-w-[7rem]"
                                onClick={() => {
                                  close();
                                }}
                              >
                                Cancel
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-6 w-6"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                              <button
                                variant="contained"
                                style={{ backgroundColor: "#4CAF50" }}
                                className="flex justify-between items-center text-white rounded-xl p-2 font-semibold shadow-lg transition-transform transform-gpu hover:scale-105 hover:shadow-2xl min-w-[7rem]"
                                onClick={() => {
                                  console.log("Prisoner Deleted ");
                                  handleDelete(prisoner.deviceId);
                                  close();
                                }}
                              >
                                Confirm
                                <Check />
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
                  width: "900px",
                }}
              >
                {(close) => (
                  <div className="flex flex-col items-center w-full space-y-4">
                    <div className="text-center border-b-2 border-b-black font-bold text-lg p-2 w-full">
                      {prisoner.name}'Infos
                    </div>
                    <div className="flex flex-row">
                      <div className=" text-lg p-6 ">
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
                        <p>
                          <span className="font-bold">Bracelet Battery: </span>
                          <span>
                            <PrisonerLocation deviceId={prisoner.deviceId} />
                          </span>
                        </p>
                        <p className="font-bold">Latest Alerts:</p>
                        {prisoner.alerts && prisoner.alerts.length > 0 ? (
                          <ul>
                            {prisoner.alerts.map((alert, idx) => (
                              <li key={idx} className="mt-2">
                                {alert}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <>
                          {console.log("alerts",prisoner.alerts)}
                          <p>No alerts available</p>
                          </>
                        )}
                      </div>
                      {sid === prisoner.deviceId ? (
                        <Userinfos
                          latitude={latitude}
                          longitude={longitude}
                          autplace={prisoner.authorizedLocations}
                          past={prisoner.currentLocations}
                        />
                      ) : (
                        <Userinfos
                          latitude={-1}
                          longitude={-1}
                          autplace={prisoner.authorizedLocations}
                          past={prisoner.currentLocations}
                        />
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        variant="contained"
                        style={{ backgroundColor: "#FF0000" }}
                        className="flex justify-between items-center text-white rounded-xl p-2 font-semibold shadow-lg transition-transform transform-gpu hover:scale-105 hover:shadow-2xl min-w-[7rem] "
                        onClick={() => {
                          close();
                        }}
                      >
                        Cancel
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </Popup>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Newusers;
