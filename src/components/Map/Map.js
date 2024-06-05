import React, { useEffect } from "react";
import mapstyles from "./stylemap.json";

const Maps = () => {
  useEffect(() => {
    const mapOptions = {
      zoom: 10,
      styles: mapstyles,
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        const map = new window.google.maps.Map(
          document.getElementById("map"),
          {
            ...mapOptions,
            center: center,
          }
        );

        const markers = [
          {
            name: "location-2",
            status: "l7oman",
            location: {
              lat: 36.1581,
              lng: 1.3372,
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

        markers.forEach((markerData) => {
          new window.google.maps.Marker({
            position: markerData.location,
            map: map,
            title: markerData.name,
          });
        });

        const polygonCoords = [
          { lat: 36.166667, lng: 1.333333 },
          { lat: 36.1581, lng: 1.3372 },
          { lat: 35.2167, lng: -0.647565 },
          { lat: 41.11373, lng: 8.415038 },
        ];
        const polygon = new window.google.maps.Polygon({
          paths: polygonCoords,
          strokeColor: "#FFFFFF",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#FFFFFF",
          fillOpacity: 0.35,
        });

        polygon.setMap(map);
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <div
      id="map"
      style={{ width: "100%", height: "84vh", borderRadius: "16px" }}
    ></div>
  );
};

export default Maps;
