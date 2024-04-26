import React, { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_ALL_PRISONERS_QUERY } from "./GraphQL/queries"; // Assuming query file location

function Test() {
  const [getAllPrisoners, { loading, error, data }] = useLazyQuery(
    GET_ALL_PRISONERS_QUERY,
    {
      context: { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } },
    },
  );
  const [prisoners, setPrisoners] = useState([]); // State to store fetched prisoners

  // Fetch data on component mount
  useEffect(() => {
    getAllPrisoners();
  }, [getAllPrisoners]); // Dependency array ensures fetch only happens once

  // Handle loading, error, and successful data retrieval
  useEffect(() => {
    if (loading) {
      console.log("Loading prisoners...");
    } else if (error) {
      console.error("Error fetching prisoners:", error);
    } else if (data) {
      setPrisoners(data?.prisoners || []); // Set prisoners state only if data exists
    }
  }, [loading, error, data]); // Dependency array for state changes

  if (loading) {
    return <div>Loading prisoners...</div>; // Display loading message
  }

  if (error) {
    return <div>Error fetching prisoners: {error.message}</div>; // Display error message
  }

  return (
    <div className="rounded-lg flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl">Dashboard</h1>
      {prisoners.length > 0 ? (
        <ul>
          {prisoners.map((prisoner) => (
            <li key={prisoner.id}>
              {/* Display prisoner details here */}
              <span>Name: {prisoner.name}</span>
              <span>Age: {prisoner.age}</span>
              <span>Bracelet ID: {prisoner.braceletId}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No prisoners found.</p>
      )}
    </div>
  );
}

export default Test;
