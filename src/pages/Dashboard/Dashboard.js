import React from "react";
import { useState, useEffect } from "react";
import Newuserinfo from "../../Assets/Userinfo/Newuserinfo";
import "./dashboard.css";
import { useJsApiLoader } from "@react-google-maps/api";
import Maps from "../../components/Map/Map";
import { useSubscriptionContext } from "../../Context/SubscriptionContext";
import { useLazyQuery } from "@apollo/client";
import { GET_ALL_PRISONERS_QUERY } from "../../GraphQL/queries";

function Dashboard() {
  const PrisonerLocation = ({ deviceId }) => {
    const { incomingData, dId, setdId } = useSubscriptionContext();
    let prisonerId, prisonerName, latitude, longitude, battery, alert1, alert2;
    setdId(deviceId);
    console.log(dId);
    console.log(incomingData);
  
    if (!incomingData || !dId) {
      return <p>Battery Level not Available</p>;
    }
    if (incomingData) {
      [prisonerId, prisonerName, latitude, longitude, battery, alert1, alert2] =
        incomingData.locationChangedPrisoner.split("/");
      if (prisonerId === dId) {
        return <div>{battery}</div>;
      } else {
        return <div>Battery Level Not Avaialbe</div>;
      }
    }
  };
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.React_APP_GOOGLE_MAPS_API_KEY,
  });
  const [getAllPrisoners, { loading, error, data }] = useLazyQuery(
    GET_ALL_PRISONERS_QUERY,
    {
      context: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    }
  );
  const [prisoners, setPrisoners] = useState([]);
  useEffect(() => {
    getAllPrisoners();
  }, [getAllPrisoners]);

  useEffect(() => {
    if (loading) {
      console.log("Loading prisoners...");
    } else if (error) {
      console.error("Error fetching prisoners:", error);
    } else if (data) {
      setPrisoners(data.getPrisoners || []);
    }
  }, [loading, error, data]);
  return (
    <div className="rounded-lg flex flex-col items-center justify-center p-4 dashboard">
      <div className="flex flex-row justify-between items-center w-full mb-4">
        <h1 className="text-5xl">Dashboard</h1>
        <Newuserinfo show={false} />
      </div>
      <Maps isLoaded={isLoaded} />
    </div>
  );
}

export default Dashboard;
