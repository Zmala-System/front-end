import React, { createContext, useContext, useState } from "react";
import { useSubscription } from "@apollo/client";
import { LOCATION_CHANGED_PRISONER } from "../GraphQL/queries";

const SubscriptionContext = createContext();

export const useSubscriptionContext = () => {
  return useContext(SubscriptionContext);
};

export const SubscriptionProvider = ({ children }) => {
  const [incomingData, setIncomingData] = useState(null);
  const [dId, setdId] = useState(null);
  useSubscription(LOCATION_CHANGED_PRISONER, {
    variables: { deviceId: dId },
    onSubscriptionData: ({ subscriptionData }) => {
      const { data } = subscriptionData;
      console.log(data);
      setIncomingData(data);
    },
  });

  const contextValue = {
    incomingData,
    dId,
    setdId,
  };

  return (
    <SubscriptionContext.Provider value={contextValue}>
      {children}
    </SubscriptionContext.Provider>
  );
};
