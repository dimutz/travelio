import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import './OwnerProperties.css';

export default function OwnerDashboard() {
  const [ownerProperties, setOwnerProperties] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);

  const pastelColors = ['pastel-blue', 'pastel-purple', 'pastel-green', 'pastel-yellow', 'pastel-pink'];

  const loadOwnerProperties = useCallback(async () => {
    setPropertiesLoading(true);
    try {
      const res = await api.get("listings/my-properties/");
      setOwnerProperties(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error(e);
      setOwnerProperties([]);
    } finally {
      setPropertiesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOwnerProperties();
  }, [loadOwnerProperties]);

  return (
    <section className="owner-properties-container">

      {}
      <div className="owner-header">
        <h2>Your properties</h2>

        {}
        <Link to="/create-property" className="btn-add-property" style={{ textDecoration: 'none' }}>
          Add property
        </Link>
      </div>

      {propertiesLoading ? (
        <p className="status-message">Loading…</p>
      ) : ownerProperties.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
          <p>You have no listings yet.</p>
          <Link to="/create-property" className="btn-action-small btn-create-room" style={{ textDecoration: 'none', display: 'inline-block', marginTop: '10px' }}>
            Create a property
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {ownerProperties.map((prop, index) => {
            const colorClass = pastelColors[index % pastelColors.length];

            return (
              <article key={prop.id} className="property-card">

                {/* IMAGINEA PROPRIETĂȚII SAU FUNDAL PASTELAT */}
                <div className={`card-image ${colorClass}`}>
                  {prop.images && prop.images.length > 0 && (
                    <img
                      src={prop.images[0].image_url || prop.images[0].image}
                      alt={prop.name}
                    />
                  )}
                </div>

                {/* INFORMAȚIILE PROPRIETĂȚII */}
                <div className="card-info">
                  <h3>{prop.name}</h3>
                  <p className="location">
                    {prop.city}, {prop.country} · Max guests: {prop.capacity || prop.max_guests || 'N/A'}
                  </p>
                  <p className="description" style={{ marginTop: '5px' }}>
                    {prop.address || 'Fără adresă'}
                  </p>
                  <p className="description" style={{ fontSize: '12px', marginTop: '5px' }}>
                    {(prop.rooms || []).length} room{(prop.rooms || []).length === 1 ? "" : "s"}
                  </p>
                </div>

                {}
                <div className="owner-action-buttons">
                  <Link
                    to={`/owner/properties/${prop.id}/rooms`}
                    className="btn-action-small btn-create-room"
                    style={{ textDecoration: 'none', textAlign: 'center' }}
                  >
                    Create room
                  </Link>
                  <Link
                    to={`/owner/properties/${prop.id}/receptionist`}
                    className="btn-action-small btn-assign"
                    style={{ textDecoration: 'none', textAlign: 'center' }}
                  >
                    Assign receptionist
                  </Link>
                </div>

              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}