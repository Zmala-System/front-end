import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  split,
  HttpLink,
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { SubscriptionClient } from "subscriptions-transport-ws";
import App from "./App";

import { SubscriptionProvider } from "./Context/SubscriptionContext";
import SomeComponent from "./SomeComponent";

// Define the server link for both HTTP and WebSocket connections
const serverLink = "127.0.0.1:4000/zmala";

// Create an HTTP link using Apollo Client's HttpLink
const httpLink = new HttpLink({
  uri: "http://" + serverLink, // Construct the URI for HTTP connection
  credentials: "same-origin", // Set credentials option for HTTP connection
});

// Create a WebSocket link using Apollo Client's WebSocketLink
const wsLink = new WebSocketLink(
  // Construct the URI for WebSocket connection
  new SubscriptionClient("ws://" + serverLink, {
    reconnect: true, // Enable reconnection
    lazy: true, // Lazily connect to the WebSocket server
    connectionParams: {
      authToken: "USER TOCKEN", // Provide any necessary authentication token
    },
  })
);

// Define a split link based on the operation type: subscription or others
const splitLink = split(
  ({ query }) => {
    // Get the main definition of the query
    const definition = getMainDefinition(query);
    // Check if the query is a subscription operation
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink, // Use WebSocket link for subscription operations
  httpLink // Use HTTP link for other operations
);

// Create an Apollo Client instance with the split link and an in-memory cache
const client = new ApolloClient({
  link: splitLink, // Set the link for Apollo Client
  cache: new InMemoryCache(), // Use an in-memory cache
  headers: {
    Authorization: localStorage.getItem("token") || "",
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <SubscriptionProvider>
        <App/>
      </SubscriptionProvider>
    </ApolloProvider>
  </React.StrictMode>
);
reportWebVitals();
