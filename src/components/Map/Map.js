import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api";
import { useState } from "react";
import styling from "./stylemap.json";

export const Maps = (props) => {
  const { isLoaded } = props;
  const [map, setMap] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const containerStyle = {
    width: "100%",
    height: "83vh",
  };
  const center = {
    lat: 36.166667,
    lng: 1.333333,
  };
  const markers = [
    {
      name: "location-1",
      status: "l7oman",
      location: {
        lat: 36.166667,
        lng: 1.333333,
      },
    },
    {
      name: "location-2",
      status: "l7oman",
      location: {
        lat: 36.7753606,
        lng: 3.0601882,
      },
    },
    {
      name: "location-3",
      status: "l7oman",
      location: {
        lat: 35.2167,
        lng: -0.647565,
      },
    },
    {
      name: "location-4",
      status: "l7oman",
      location: {
        lat: 41.11373,
        lng: 8.415038,
      },
    },
  ];
  return (
    isLoaded && (
      <>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
          onLoad={(map) => setMap(map)}
          styles={styling}  
        >
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={marker.location}
              onClick={() => setSelectedMarker(marker)}
            />
          ))}
          {selectedMarker && (
            <InfoWindow
              position={selectedMarker.location}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <>
                <h1>Location: {selectedMarker.name}</h1>
                <h1>Status: {selectedMarker.status}</h1>
                <button
                  onClick={() => setSelectedMarker(null)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Close
                </button>
              </>
            </InfoWindow>
          )}
        </GoogleMap>
      </>
    )
  );
};
