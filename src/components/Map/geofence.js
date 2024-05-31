import React from "react";
import { GoogleMap, Marker, Polygon } from "@react-google-maps/api";
import mapstyles from "./stylemap.json";

export const GeofenceShow = (props) => {
  const { isLoaded } = props;
  const mapContainerStyle = {
    width: "100%",
    height: "83vh",
  };
  const center = {
    lat: 28.0339, // Algeria's approximate center latitude
    lng: 1.6596, // Algeria's approximate center longitude
  };
  const markers = [
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

  const geofencePath = [
    { lat: 36.752887, lng: 3.042048 }, // Algiers
    { lat: 36.737232, lng: 3.086472 }, // Point near Algiers
    { lat: 36.719472, lng: 3.068733 }, // Another point near Algiers
    { lat: 36.734561, lng: 3.014093 }, // Another point near Algiers
  ];

  return (
    isLoaded && (
      <>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={8} // Adjusted zoom level for better visibility of geofence
          options={{
            styles: mapstyles,
          }}
        >
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={marker.location}
              title={marker.name}
            />
          ))}
          <Polygon
            paths={geofencePath}
            options={{
              fillColor: "rgba(173, 216, 230, 0.5)",
              fillOpacity: 0.5,
              strokeColor: "rgba(0, 0, 255, 0.5)",
              strokeOpacity: 0.8,
              strokeWeight: 2,
              clickable: false,
              draggable: false,
              editable: false,
              visible: true,
              zIndex: 1,
            }}
          />
        </GoogleMap>
      </>
    )
  );
};

export default GeofenceShow;
