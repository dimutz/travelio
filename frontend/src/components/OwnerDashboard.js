import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function OwnerDashboard() {
  const [ownerProperties, setOwnerProperties] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);

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
    <section>
      <div style={styles.toolbar}>
        <h2 style={styles.title}>Your properties</h2>
        <Link to="/create-property" style={styles.addLink}>
          Add property
        </Link>
      </div>

      {propertiesLoading ? (
        <p style={styles.muted}>Loading…</p>
      ) : ownerProperties.length === 0 ? (
        <div style={styles.empty}>
          <p>You have no listings yet.</p>
          <Link to="/create-property" style={styles.primaryBtn}>
            Create a property
          </Link>
        </div>
      ) : (
        <div style={styles.propertyList}>
          {ownerProperties.map((prop) => (
            <article key={prop.id} style={styles.propertyCard}>
              <div style={styles.cardMain}>
                <h3 style={styles.propertyName}>{prop.name}</h3>
                <p style={styles.propertyMeta}>
                  {prop.city}, {prop.country} · Max guests: {prop.capacity}
                </p>
                <p style={styles.propertyAddr}>{prop.address}</p>
                <p style={styles.roomCount}>
                  {(prop.rooms || []).length} room{(prop.rooms || []).length === 1 ? "" : "s"}
                </p>
              </div>
              <div style={styles.cardActions}>
                <Link to={`/owner/properties/${prop.id}/rooms`} style={styles.actionBtn}>
                  Create room
                </Link>
                <Link to={`/owner/properties/${prop.id}/receptionist`} style={styles.actionBtnSecondary}>
                  Assign receptionist
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

const styles = {
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "12px",
    marginBottom: "20px",
  },
  title: { fontSize: "20px", margin: 0 },
  addLink: {
    padding: "8px 14px",
    background: "#374151",
    color: "white",
    textDecoration: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
  },
  muted: { color: "#6b7280" },
  empty: { textAlign: "center", padding: "24px", color: "#6b7280" },
  primaryBtn: {
    display: "inline-block",
    marginTop: "10px",
    background: "#2563eb",
    color: "white",
    padding: "10px 18px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "14px",
  },
  propertyList: { display: "flex", flexDirection: "column", gap: "12px" },
  propertyCard: {
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    overflow: "hidden",
    background: "white",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "stretch",
    justifyContent: "space-between",
    gap: "12px",
    padding: "16px",
  },
  cardMain: { flex: "1 1 220px", minWidth: 0 },
  propertyName: { margin: "0 0 6px 0", fontSize: "17px", fontWeight: "700" },
  propertyMeta: { margin: "0 0 4px 0", fontSize: "13px", color: "#6b7280" },
  propertyAddr: { margin: "0 0 6px 0", fontSize: "14px", color: "#4b5563" },
  roomCount: { margin: 0, fontSize: "13px", color: "#9ca3af" },
  cardActions: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    justifyContent: "center",
    flex: "0 0 auto",
  },
  actionBtn: {
    padding: "10px 16px",
    background: "#2563eb",
    color: "white",
    textDecoration: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    textAlign: "center",
    whiteSpace: "nowrap",
  },
  actionBtnSecondary: {
    padding: "10px 16px",
    background: "white",
    color: "#374151",
    textDecoration: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    textAlign: "center",
    border: "1px solid #d1d5db",
    whiteSpace: "nowrap",
  },
};
