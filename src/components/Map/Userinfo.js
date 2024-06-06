import React, { useEffect } from "react";
import mapstyles from "./stylemap.json";
import greenMarkerIcon from "../../icons/markerlatest.png"; // Use an import statement for the image

const Userinfos = ({ latitude, longitude, autplace, past }) => {
  useEffect(() => {
    const mapOptions = {
      zoom: 18,
      styles: mapstyles,
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        const map = new window.google.maps.Map(document.getElementById("map"), {
          ...mapOptions,
          center: center,
        });

        const markers = past || [];

        markers.forEach((markerData) => {
          new window.google.maps.Marker({
            position: markerData.location,
            map: map,
            title: markerData.name,
          });
        });

        let polygonCoords = [];
        if (autplace && autplace.length > 0) {
          polygonCoords = autplace[0].map((location) => ({
            lat: location.latitude,
            lng: location.longitude,
          }));
        }

        // Close the polygon by adding the first coordinate to the end
        if (polygonCoords.length > 0) {
          polygonCoords.push(polygonCoords[0]);
        }

        const avgLat =
          polygonCoords.reduce((sum, coord) => sum + coord.lat, 0) /
          polygonCoords.length;
        const avgLng =
          polygonCoords.reduce((sum, coord) => sum + coord.lng, 0) /
          polygonCoords.length;

        const polygon = new window.google.maps.Polygon({
          paths: polygonCoords,
          strokeColor: "#FFFFFF",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#FFFFFF",
          fillOpacity: 0.35,
        });

        polygon.setMap(map);

        // Check if latitude and longitude are valid numbers
        if (!isNaN(parseFloat(latitude)) && !isNaN(parseFloat(longitude))) {
          new window.google.maps.Marker({
            position: { lat: parseFloat(latitude), lng: parseFloat(longitude) },
            map: map,
            title: "Marker",
            icon: {
              url: greenMarkerIcon,
              scaledSize: new window.google.maps.Size(40, 40),
            },
          });
        }

        map.setCenter({ lat: avgLat, lng: avgLng });
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, [latitude, longitude, autplace, past]);

  return (
    <div
      id="map"
      style={{ width: "500px", height: "500px", borderRadius: "16px" }}
    ></div>
  );
};

export default Userinfos;
