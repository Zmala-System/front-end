import React from "react";
import { useSubscriptionContext } from "./Context/SubscriptionContext";

const PrisonerLocation = () => {
  const { incomingData,dId,setdId } = useSubscriptionContext();
  let prisonerId, prisonerName, latitude, longitude, battery, alert1, alert2;
  setdId("1542");
  if (!incomingData || !dId) {
    return <p>No Battery Level available</p>;
  }
  if (incomingData) {
    [prisonerId, prisonerName, latitude, longitude, battery, alert1, alert2] =
      incomingData.locationChangedPrisoner.split("/");
  }

  return (
    <div>
      {incomingData ? (
        <div>
          <p> PrisonerId: {prisonerId}</p>
          <div>Prisoner Name: {prisonerName}</div>
          <div>Latitude: {latitude}</div>
          <div>Longitude: {longitude}</div>
          <div>Battery: {battery}</div>
          <div>Alert 1: {alert1}</div>
          <div>Alert 2: {alert2}</div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

const SomeComponent = () => {
  return (
    <div>
      <h2>Prisoner Location Tracker</h2>
      <PrisonerLocation />
    </div>
  );
};

export default SomeComponent;
