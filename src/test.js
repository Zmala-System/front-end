import { useLazyQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { GET_ALL_PROSENERS_QUERY } from "./GraphQL/queries";

function Test() {
    const [getAllPrisoners, { loading: isDLoading, data: DeviceResponseData, error: queryDeviceError },] = useLazyQuery(GET_ALL_PROSENERS_QUERY);

    // send the query
    useEffect(() => {
        getAllPrisoners();
    }, []);

    useEffect(() => {
        if (!isDLoading) {
            if (queryDeviceError) {
                console.log(queryDeviceError);
            }
            if (DeviceResponseData) {
                console.log(
                    "Recieved Data  ==> ",
                    DeviceResponseData
                );
            }
        }
    }, [isDLoading, DeviceResponseData, queryDeviceError]);

    return (
        <div className="rounded-lg flex flex-col items-center justify-center p-8">
            <h1 className="text-5xl">Dashboard</h1>

        </div>
    );
}

export default Test;
