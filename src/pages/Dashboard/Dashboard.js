import React from "react";
import { Maps } from "../../components/Map/Map";
import { useJsApiLoader } from "@react-google-maps/api";
import Newuserinfo from "../../Assets/Userinfo/Newuserinfo";
import './dashboard.css';


function Dashboard() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.React_APP_GOOGLE_MAPS_API_KEY,
  });

  return (
    <div className="rounded-lg flex flex-col items-center justify-center p-4 dashboard">
      <div className="flex flex-row justify-between items-center w-full mb-4">
        <h1 className="text-5xl">Dashboard</h1>
        <Newuserinfo/>
      </div>
      <Maps isLoaded={isLoaded} />
    </div>
  );
}

export default Dashboard;
