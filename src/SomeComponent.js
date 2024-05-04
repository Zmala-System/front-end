import React from 'react';
import { useSubscriptionContext } from './Context/SubscriptionContext';

function SomeComponent() {
    const { incomingData, loading, error } = useSubscriptionContext();

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <h1>Subscription Data</h1>
            {incomingData ? (
                <pre>{JSON.stringify(incomingData, null, 2)}</pre>
            ) : (
                <p>No data received yet.</p>
            )}
        </div>
    );
}

export default SomeComponent;
