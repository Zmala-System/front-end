import React, { useEffect } from "react";
import mapstyles from "./stylemap.json";

const Userinfos = ({ latitude, longitude, autplace, past }) => {
  useEffect(() => {
    const greenMarkerIcon = {
      url: require("../../icons/markerlatest.png"),
      scaledSize: new window.google.maps.Size(40, 40),
    };
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

        const map = new window.google.maps.Map(document.getElementById("map"), {
          ...mapOptions,
          center: center,
        });
        console.log("past", past);
        const markers = [];

        markers.forEach((markerData) => {
          new window.google.maps.Marker({
            position: markerData.location,
            map: map,
            title: markerData.name,
          });
        });

        let polygonCoords = [];
        console.log(autplace);
        if (autplace && autplace.length > 0) {
          polygonCoords = autplace[0].map((location) => ({
            lat: location.latitude,
            lng: location.longitude,
          }));
        }
        console.log("cords: ", polygonCoords);
        polygonCoords.push(polygonCoords[0]);
        console.log("cords: ", polygonCoords);

        // Calculate the average latitude and longitude
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
        if (
          parseFloat(latitude) != latitude &&
          parseFloat(longitude) != longitude
        ) {
          new window.google.maps.Marker({
            position: { lat: parseFloat(latitude), lng: parseFloat(longitude) },
            map: map,
            title: "Marker",
            icon: greenMarkerIcon,
          });
        }
        map.setCenter({ lat: avgLat, lng: avgLng });
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <div
      id="map"
      style={{ width: "500px", height: "500px", borderRadius: "16px" }}
    ></div>
  );
};

export default Userinfos;
