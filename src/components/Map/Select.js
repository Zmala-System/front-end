import {
  GoogleMap,
  DrawingManager,
  Polygon,
  Autocomplete,
} from "@react-google-maps/api";
import { useState, useRef, useEffect } from "react";
import mapstyles from "./stylemap.json";

export const Select = (props) => {
  const { isLoaded } = props;
  const [map, setMap] = useState(null);
  const [geofences, setGeofences] = useState([]);
  const drawingManagerRef = useRef(null);
  const containerStyle = {
    width: "500px",
    height: "500px",
  };
  const [center, setCenter] = useState({});

  useEffect(() => {
    if (map) {
      const drawingManager = new window.google.maps.drawing.DrawingManager({
        drawingMode: null,
        drawingControl: true,
        drawingControlOptions: {
          position: window.google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [window.google.maps.drawing.OverlayType.POLYGON],
        },
        polygonOptions: {
          fillColor: "#f0f0f0f0",
          fillOpacity: 0.35,
          clickable: true,
          editable: true,
          strokeColor: "#000000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
        },
      });
      drawingManagerRef.current = drawingManager;
      drawingManager.setMap(map);
      window.google.maps.event.addListener(
        drawingManager,
        "overlaycomplete",
        (event) => {
          const polygon = event.overlay;
          const paths = polygon.getPaths().getAt(0).getArray();
          const coordinates = paths.map((path) => {
            return { lat: path.lat(), lng: path.lng() };
          });
          setGeofences([...geofences, coordinates]);
          props.onGeofenceEvent("polygon_drawn", coordinates);
        }
      );
    }
  }, [map]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    isLoaded && (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <Autocomplete>
          <input
            inputRef={center}
            fullWidth
            placeholder="Pickup Location"
            className="text-field"
            type="text"
          />
        </Autocomplete>
        <GoogleMap
          mapContainerStyle={{
            ...containerStyle,
            borderRadius: "16px",
          }}
          center={center}
          zoom={10}
          onLoad={(map) => setMap(map)}
          options={{
            styles: mapstyles,
          }}
        >
          {geofences.map((coordinates, index) => (
            <Polygon
              key={index}
              paths={coordinates}
              options={{
                fillColor: "#FFFFFF",
                fillOpacity: 0.35,
                strokeColor: "#FFFFFF",
                strokeOpacity: 0.8,
                strokeWeight: 2,
              }}
            />
          ))}
        </GoogleMap>
      </div>
    )
  );
};
