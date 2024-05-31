import { createContext, useContext, useState, useEffect } from "react";
import { useSubscription } from "@apollo/client";
import { SubscripeToTopic } from "../GraphQL/queries";

// Create a context for managing subscription-related data
const SubscriptionContext = createContext();

// Custom hook to access the subscription context
export const useSubscriptionContext = () => {
  return useContext(SubscriptionContext);
};

// Provider component for managing subscription-related state and data
export const SubscriptionProvider = ({ children }) => {
  // State to hold incoming subscription data [ex prisenor change location]
  const [incomingData, setIncomingData] = useState(null);

  // Use the useSubscription hook from Apollo Client to subscribe to a topic [ex subscribe using use id]
  const { data, loading, error } = useSubscription(SubscripeToTopic, {
    variables: { deviceId:"deviceid" }, // Subscription variables
    onData: (options) => {
      // Callback function for incoming data
      const { data } = options;
      setIncomingData(data); // Update incomingData state with new data
      console.log(data);
      console.log(incomingData);
    },
    onError: (err) => {
      // Callback function for subscription errors
      console.log(err); // Log the error to the console
    },
  });

  // Combine relevant subscription data and state into a context value
  const contextValue = {
    incomingData, // Incoming subscription data
    loading, // Loading state while fetching subscription data
    error, // Error state for any subscription errors
  };

  // Provide the context value to the children components using SubscriptionContext.Provider
  return (
    <SubscriptionContext.Provider value={contextValue}>
      {children}
    </SubscriptionContext.Provider>
  );
};
