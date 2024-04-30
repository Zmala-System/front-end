import React, { useState, useEffect } from "react";
import { GoogleMap, InfoWindow, Marker, Polygon, DrawingManager } from "@react-google-maps/api";
import { loadScript } from "@react-google-maps/api";

const libraries = ["places"]; // Add other libraries if needed

const containerStyle = {
  width: "100%",
  height: "83vh",
};

const center = {
  lat: 36.166667,
  lng: 1.333333,
};

const markers = [
  // ... markers data
];

const geofences = [
    {
      name: "Geofence 1",
      coordinates: [
        { lat: 36.17, lng: 1.34 },
        { lat: 36.18, lng: 1.35 },
        { lat: 36.17, lng: 1.36 },
        { lat: 36.16, lng: 1.35 },
        { lat: 36.17, lng: 1.34 }, // Close the polygon
      ],
    },
    // Add more geofences with their coordinates here
  ];

const Showauth = ({ isLoaded }) => {
  const [map, setMap] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [drawingManager, setDrawingManager] = useState(null);

  useEffect(() => {
    if (!map) {
      loadScript({
        googleMapsApiKey: YOUR_API_KEY, // Replace with your API key
        libraries,
      })
        .then(() => console.log("Google Maps API loaded"))
        .catch((error) => console.error("Error loading Google Maps API:", error));
    }
  }, [map]);

  useEffect(() => {
    if (!drawingManager && map) {
      const manager = new DrawingManager({
        drawingMode: google.maps.ControlPosition.OVERLAY,
        drawingControl: true,
        drawingModes: ["polygon"],
        map,
      });
      setDrawingManager(manager);
    }
  }, [map]);

  return (
    isLoaded && (
      <>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
          onLoad={(map) => setMap(map)}
        >
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={marker.location}
              onClick={() => setSelectedMarker(marker)}
            />
          ))}
          {geofences.map((geoFence) => (
            <Polygon
              key={geoFence.name}
              paths={geoFence.coordinates}
              options={{
                strokeColor: "#FF0000",
                strokeOpacity: 0.8,
                fillColor: "#FF0000",
                fillOpacity: 0.35,
                editable: false, // Set to true if editing geofences is required
              }}
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
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => setSelectedMarker(null)}
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

export default Showauth;
