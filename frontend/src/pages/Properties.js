import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Properties() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    api.get("listings/properties/").then((res) => {
      setProperties(res.data);
    });
  }, []);

  return (
    <div>
      <h2>Properties</h2>

      {properties.map((p) => (
        <div key={p.id}>
          <h3>{p.name}</h3>
          <p>{p.city}</p>
        </div>
      ))}
    </div>
  );
}
