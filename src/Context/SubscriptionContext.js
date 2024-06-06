import React, { createContext, useContext, useState } from "react";
import { useSubscription } from "@apollo/client";
import { LOCATION_CHANGED_PRISONER } from "../GraphQL/queries";

const SubscriptionContext = createContext();

export const useSubscriptionContext = () => {
  return useContext(SubscriptionContext);
};

export const SubscriptionProvider = ({ children }) => {
  const [incomingData, setIncomingData] = useState(null);

  useSubscription(LOCATION_CHANGED_PRISONER, {
    onSubscriptionData: ({ subscriptionData }) => {
      const { data } = subscriptionData;
      setIncomingData(data.locationChangedPrisoner);
    },
  });

  const contextValue = {
    incomingData,
  };

  return (
    <SubscriptionContext.Provider value={contextValue}>
      {children}
    </SubscriptionContext.Provider>
  );
};
