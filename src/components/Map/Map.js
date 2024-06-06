import React, { useEffect, useState } from "react";
import mapstyles from "./stylemap.json";
import { useSubscriptionContext } from "../../Context/SubscriptionContext";

const Maps = () => {
  const { incomingData } = useSubscriptionContext();
  const [markers, setMarkers] = useState([]);
  const [map, setMap] = useState(null);
  const [infoWindow, setInfoWindow] = useState(null);

  useEffect(() => {
    if (incomingData) {
      const [prisonerId, prisonerName, lat, lon, battery, alert1, alert2] =
        incomingData.split("/");
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lon);

      setMarkers((prevMarkers) => {
        const existingMarkerIndex = prevMarkers.findIndex(
          (marker) => marker.id === prisonerId
        );

        if (existingMarkerIndex !== -1) {
          const existingMarker = prevMarkers[existingMarkerIndex];
          if (
            existingMarker.lat !== latitude ||
            existingMarker.lon !== longitude
          ) {
            const updatedMarkers = [...prevMarkers];
            updatedMarkers[existingMarkerIndex] = {
              ...existingMarker,
              lat: latitude,
              lon: longitude,
            };
            return updatedMarkers;
          }
          return prevMarkers;
        }

        return [
          ...prevMarkers,
          { id: prisonerId, name: prisonerName, lat: latitude, lon: longitude },
        ];
      });
    }
  }, [incomingData]);

  useEffect(() => {
    const mapOptions = {
      zoom: 10,
      styles: mapstyles,
    };

    const initializeMap = (position) => {
      const center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      const mapInstance = new window.google.maps.Map(
        document.getElementById("map"),
        {
          ...mapOptions,
          center: center,
        }
      );

      const input = document.getElementById("autocomplete-input");
      const autocomplete = new window.google.maps.places.Autocomplete(input);
      autocomplete.bindTo("bounds", mapInstance);

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) {
          console.log("No details available for input: '" + place.name + "'");
          return;
        }
        mapInstance.setCenter(place.geometry.location);
        mapInstance.setZoom(15);
        new window.google.maps.Marker({
          position: place.geometry.location,
          map: mapInstance,
          title: place.name,
        });
      });

      setMap(mapInstance);
      setInfoWindow(new window.google.maps.InfoWindow());
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(initializeMap);
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    if (map && infoWindow) {
      markers.forEach((markerData) => {
        const marker = new window.google.maps.Marker({
          position: { lat: markerData.lat, lng: markerData.lon },
          map: map,
          title: markerData.name,
        });

        marker.addListener("click", () => {
          infoWindow.setContent(`
          <div style="font-family: Arial, sans-serif; padding: 10px; line-height: 1.6;">
          <p style="font-size: 16px; font-weight: bold;"><strong>ID:</strong> ${markerData.id}</p>
          <p style="font-size: 16px; font-weight: bold;"><strong>Name:</strong> ${markerData.name}</p>
        </div>
          `);
          infoWindow.open(map, marker);
        });
      });
    }
  }, [markers, map, infoWindow]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        height: "84vh",
      }}
    >
      <input
        id="autocomplete-input"
        type="text"
        placeholder="Search for a place"
        style={{
          width: "360px",
          padding: "10px",
          margin: "10px 0",
          borderRadius: "16px",
          border: "1px solid #ccc",
          boxShadow: "0 1px 6px rgba(0, 0, 0, 0.1)",
          fontSize: "16px",
          outline: "none",
        }}
      />
      <div
        id="map"
        style={{ width: "100%", height: "90%", borderRadius: "16px" }}
      ></div>
    </div>
  );
};

export default Maps;
