import React,{useState} from 'react'
import { useJsApiLoader } from "@react-google-maps/api";
import { Select } from "../Map/Select";
import { Check } from "@mui/icons-material";
import { useMutation } from "@apollo/client";
import { ADD_PRISONER_LOCATION_MUTATION } from '../../GraphQL/mutations';
import isEmpty from 'lodash/isEmpty';
function Addlocation({handleClose,prisoner}) {
    const [Data, setData] = useState();
    const [addPrisonerLocation] = useMutation(ADD_PRISONER_LOCATION_MUTATION,
        {
          context: {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            },
          },
      );
    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: process.env.React_APP_GOOGLE_MAPS_API_KEY,
      });

      const handleGeofenceUpdate = (eventType, geofenceData) => {
        setData(geofenceData);
        console.log(geofenceData);
        console.log("Geofence update:", eventType, geofenceData);
      };
      const handleaddlocation=async (deviceID,authorizedLocations)=>{
        let  authorizedLocationn=[];
        if (!isEmpty(Data)) {
          authorizedLocationn = Data.map(({ lat, lng }) => ({ latitude: lat, longitude: lng }));
        }
        console.log("auth:",authorizedLocationn);
        try {
          const { data } = await addPrisonerLocation({
            variables: { deviceId:deviceID, authorizedLocations:[authorizedLocationn] },
          });
          console.log("Location added successfully:", data.addPrisonerLocation);
        } catch (error) {
          console.error("Failed to add location:", error.message);
        }
        handleClose();
      }
  return (
    <>
    <div className="fixed inset-0 bg-black bg-opacity-25 min-w-96 backdrop-blur-md flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl flex min-w-96 flex flex-col space-y-4">
          <h1 className="text-2xl">Add a new Authorized Location</h1>
          <Select isLoaded={isLoaded} onGeofenceEvent={handleGeofenceUpdate} />
          <button
          style={{ backgroundColor: "#05FF00" }}
          className="flex justify-between items-center text-white rounded-2xl px-4 py-3 font-bold shadow-2xl transition-transform transform-gpu hover:scale-105 hover:shadow-lg "
          onClick={()=>handleaddlocation(prisoner.deviceId, prisoner.authorizedLocations)}
        >
          Save
          <Check />
        </button>
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
  )
}

export default Addlocation