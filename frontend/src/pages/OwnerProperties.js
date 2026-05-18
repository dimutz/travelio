import { useEffect, useState } from "react";
import api from "../api/axios";

export default function OwnerProperties() {
    const [myProperties, setMyProperties] = useState([]);

    useEffect(() => {
        api.get("listings/owner/my-properties/")
            .then((res) => {
                console.log("Data received from the server:", res.data);
                setMyProperties(res.data);
            })
            .catch((err) => {
                console.error("Complete error details:", err.response);
            });
    }, []);

    return (
        <div>
            <h2>My properties</h2>
            {myProperties.length === 0 ? (
                <p>You currently do not own any properties.</p>
            ) : (
                myProperties.map((p) => (
                    <div key={p.id} style={{ border: "1px solid #ddd", padding: "10px", margin: "10px" }}>
                        <h3>{p.name}</h3>
                        <p>{p.city}, {p.country}</p>
                        <p>Tip: {p.property_type}</p>
                    </div>
                ))
            )}
        </div>
    );
}