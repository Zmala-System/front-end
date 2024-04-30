import React from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import mapstyles from './stylemap.json';

export const Maps = (props) => {
  const { isLoaded } = props;
  const mapContainerStyle = {
    width: "100%",
    height: "83vh",
  };
  const center = {
    lat: 36.166667,
    lng: 1.333333,
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

  return (
    isLoaded && (
      <>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={10}
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
        </GoogleMap>
      </>
    )
  );
};

export default Maps;
