import React, { useState, useEffect } from "react";
import "reactjs-popup/dist/index.css";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { Check } from "@mui/icons-material";
import { Add as AddIcon } from '@material-ui/icons';
import Masonry from "react-responsive-masonry";
import "./Users.css";
import Adduser from "../../components/Adduser/Adduser";
import { GET_ALL_PRISONERS_QUERY } from "../../GraphQL/queries";
import { UPDATE_PRISONER_INFO_MUTATION, DELETE_PRISONER_MUTATION, ADD_PRISONER_LOCATION_MUTATION } from "../../GraphQL/mutations";
import { useLazyQuery, useMutation } from "@apollo/client";
import Newuserinfo from "../../Assets/Userinfo/Newuserinfo";
import Changelocation from "../../components/Adduser/Changelocation";
import isEmpty from 'lodash/isEmpty';
import Addlocation from "../../components/Adduser/Addlocation";

function Newusers() {
  const [getAllPrisoners, { loading, error, data }] = useLazyQuery(GET_ALL_PRISONERS_QUERY, {
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    },
  });
  const [Data, setData] = useState();
  const [prisoners, setPrisoners] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [openchange, setOpenchange] = useState(false);
  const [openadd, setOpenadd] = useState(false);
  const [selectedPrisonerIndex, setSelectedPrisonerIndex] = useState(null);
  const [selectedPrisoner, setSelectedPrisoner] = useState(null);
  const [name, setName] = useState("");
  const [deviceID, setDeviceID] = useState("");
  const [dateofdetention, setDateOfDetention] = useState("");
  const [deletePrisoner, { loading: deleteLoading, error: deleteError }] = useMutation(DELETE_PRISONER_MUTATION, {
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    },
  });
  const [updatePrisonerInfo] = useMutation(UPDATE_PRISONER_INFO_MUTATION, {
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
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
    ); // Display loading message
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

  const toggleEditVisible = (index) => {
    setSelectedPrisonerIndex(index === selectedPrisonerIndex ? null : index);
  };

  const handleSaveGeofenceData = (geofenceData) => {
    setData(geofenceData);
    setOpenchange(false);
  };

  const handleSaveEdit = async (deviceId) => {
    let authorizedLocations = [];
    if (!isEmpty(Data)) {
      authorizedLocations = Data.map(({ lat, lng }) => ({ latitude: lat, longitude: lng }));
    }

    try {
      const { data: { updatePrisonerInfo: updatedPrisonerInfo } } = await updatePrisonerInfo({
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

  const handlechngelocation = () => {
    setOpenchange(true);
  };

  const handleclosechange = () => {
    setOpenchange(false);
  };

  const handleaddloc = (prisoner) => {
    setOpenadd(true);
    setSelectedPrisoner(prisoner);
  };

  const handlecloseadd = () => {
    setOpenadd(false);
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
    <div className="rounded-lg flex flex-col p-4 users">
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
        <Newuserinfo showAddFriendIcon={true} handleadduserclick={handleAddUserClick} />
      </div>
      <Masonry
        columnsCount={4}
        className="grid grid-cols-3 mt-4 p-6 grid-container"
        style={{ maxHeight: "calc(100vh - 180px)", overflowY: "auto" }}
        gutter="40px"
      >
        {sprisoners.map((prisoner, index) => (
          <div
            key={index}
            className={`flex flex-col p-6 rounded-2xl bg-white shadow-xl ${
              selectedPrisonerIndex === index ? "bg-blue-200" : ""
            }`}
            style={{
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
            }}
          >
            <p className="py-2">
              <span className="font-semibold text-xl">Name: </span>
              <span className="text-xl">{prisoner.name}</span>
            </p>
            <p>
              <span className="font-semibold text-xl">DeviceID: </span>
              <span className="text-xl">{prisoner.deviceId}</span>
            </p>
            <div>
              {selectedPrisonerIndex === index && (
                <div className="space-y-4 flex flex-col justify-center items-center w-full">
                  <hr className="mt-4 w-full h-2" />
                  <input
                    placeholder="Name"
                    className="rounded-2xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-xl"
                    style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.4)" }}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <input
                    placeholder="Device ID"
                    className="rounded-2xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-xl"
                    style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.4)" }}
                    onChange={(e) => setDeviceID(e.target.value)}
                  />
                  <input
                    placeholder="Date of Detention"
                    className="rounded-2xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-xl"
                    style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.4)" }}
                    onChange={(e) => setDateOfDetention(e.target.value)}
                  />
                  <button
                    style={{ backgroundColor: "#05FF00" }}
                    onClick={handlechngelocation}
                    className="flex justify-between items-center min-w-24 text-white rounded-2xl px-3 py-2 font-semibold shadow-lg transition-transform transform-gpu hover:scale-105 hover:shadow-2xl  "
                  >
                    Change Authorized location
                    <Check />
                  </button>
                  <button
                    style={{ backgroundColor: "#05FF00" }}
                    onClick={() => handleSaveEdit(prisoner.deviceId)}
                    className="flex justify-between items-center min-w-24 text-white rounded-2xl px-3 py-2 font-semibold shadow-lg transition-transform transform-gpu hover:scale-105 hover:shadow-2xl  "
                  >
                    Save
                    <Check />
                  </button>
                  <hr className="mt-4 w-full h-2" />
                </div>
              )}
            </div>
            <div className="flex justify-between pt-4 my-2">
              <button
                variant="contained"
                style={{ backgroundColor: "#FF0000" }}
                className="flex justify-between items-center text-white rounded-2xl px-3 py-2 font-semibold shadow-lg transition-transform transform-gpu hover:scale-105 hover:shadow-2xl "
                onClick={() => handleDelete(prisoner.deviceId)}
              >
                <CloseIcon />
              </button>
              <button
                onClick={() => handleaddloc(prisoner)}
                style={{ backgroundColor: "#05FF00" }}
                className="flex justify-between items-center text-white rounded-2xl px-4 py-3 font-bold shadow-2xl  transition-transform transform-gpu hover:scale-105 hover:shadow-lg "
              >
                add location
                <AddIcon />
              </button>
              <button
                variant="contained"
                style={{ backgroundColor: "#4A3AFF" }}
                className="flex justify-between items-center text-white rounded-2xl px-2 py-2 font-semibold shadow-lg transition-transform transform-gpu hover:scale-105 hover:shadow-2xl "
                onClick={() => toggleEditVisible(index)}
                disabled={selectedPrisonerIndex === index}
              >
                <EditIcon />
              </button>
            </div>
          </div>
        ))}
      </Masonry>
      {open && (
        <Adduser
          handleClose={handleClose}
        />
      )}
      {openchange && (
        <Changelocation
          handleClose={handleclosechange}
          handleSave={handleSaveGeofenceData}
        />
      )}
      {openadd && (
        <Addlocation
          handleClose={handlecloseadd}
          prisoner={selectedPrisoner}
        />
      )}
    </div>
  );
}

export default Newusers;
