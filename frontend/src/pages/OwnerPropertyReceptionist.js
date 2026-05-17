import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import useOwnerProperty from "../hooks/useOwnerProperty";
import OwnerPageShell from "../components/OwnerPageShell";

function formatAssignError(payload) {
  if (!payload) return "Could not assign receptionist.";
  const { detail } = payload;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((entry) =>
        typeof entry === "string" ? entry : entry?.string || String(entry),
      )
      .join(" ");
  }
  return "Could not assign receptionist.";
}

export default function OwnerPropertyReceptionist() {
  const { property, loading, propertyId } = useOwnerProperty();
  const [receptionist, setReceptionist] = useState(null);
  const [deskLoading, setDeskLoading] = useState(true);
  const [assignUsername, setAssignUsername] = useState("");
  const [assignError, setAssignError] = useState("");

  useEffect(() => {
    if (!propertyId || loading) return undefined;
    let cancelled = false;
    (async () => {
      setDeskLoading(true);
      try {
        const r = await api.get(`listings/properties/${propertyId}/receptionist/`);
        if (!cancelled) setReceptionist(r.data.receptionist);
      } catch {
        if (!cancelled) setReceptionist(null);
      } finally {
        if (!cancelled) setDeskLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [propertyId, loading]);

  if (loading) {
    return (
      <OwnerPageShell maxWidth="640px">
        <p style={styles.muted}>Loading…</p>
      </OwnerPageShell>
    );
  }

  if (!property) return null;

  const assignReceptionist = async () => {
    const u = assignUsername.trim();
    if (!u) {
      setAssignError("Enter the receptionist username.");
      return;
    }
    setAssignError("");
    try {
      await api.post(`listings/properties/${propertyId}/receptionist/`, { username: u });
      const r = await api.get(`listings/properties/${propertyId}/receptionist/`);
      setReceptionist(r.data.receptionist);
      setAssignUsername("");
    } catch (e) {
      setAssignError(formatAssignError(e?.response?.data));
    }
  };

  const unassignReceptionist = async () => {
    if (!window.confirm("Remove the receptionist from this property?")) return;
    try {
      await api.delete(`listings/properties/${propertyId}/receptionist/`);
      setReceptionist(null);
    } catch {
      alert("Could not remove assignment.");
    }
  };

  return (
    <OwnerPageShell maxWidth="640px">
      <Link to="/home" style={styles.backLink}>
        ← Back to your properties
      </Link>

      <header style={styles.header}>
        <h1 style={styles.title}>Receptionist</h1>
        <p style={styles.subtitle}>
          {property.name} · {property.city}, {property.country}
        </p>
        <p style={styles.addr}>{property.address}</p>
      </header>

      <section style={styles.panel}>
        {deskLoading ? (
          <p style={styles.muted}>Loading assignment…</p>
        ) : receptionist ? (
          <>
            <p style={styles.assignedLine}>
              Assigned: <strong>{receptionist.username}</strong>
            </p>
            <button type="button" style={styles.secondaryBtn} onClick={unassignReceptionist}>
              Remove receptionist
            </button>
          </>
        ) : (
          <>
            <label style={styles.label} htmlFor="rec-username">
              Receptionist username
            </label>
            <div style={styles.row}>
              <input
                id="rec-username"
                style={styles.input}
                placeholder="Receptionist username"
                value={assignUsername}
                onChange={(e) => {
                  setAssignUsername(e.target.value);
                  setAssignError("");
                }}
              />
              <button type="button" style={styles.primaryBtn} onClick={assignReceptionist}>
                Assign
              </button>
            </div>
            {assignError ? (
              <p style={styles.error} role="alert">
                {assignError}
              </p>
            ) : null}
          </>
        )}

        <p style={styles.hint}>
          One receptionist per property. They manage bookings and room availability from their home page.
        </p>
        <p style={styles.warn}>
          You cannot assign a receptionist who is already working at someone else&apos;s property. Their current
          owner must remove them first; after that they appear available for your listing.
        </p>
      </section>
    </OwnerPageShell>
  );
}

const styles = {
  backLink: {
    display: "inline-block",
    marginBottom: "20px",
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "14px",
  },
  header: { marginBottom: "24px" },
  title: { fontSize: "28px", margin: "0 0 8px 0" },
  subtitle: { fontSize: "16px", color: "#4b5563", margin: "0 0 4px 0" },
  addr: { fontSize: "14px", color: "#6b7280", margin: 0 },
  panel: {
    background: "white",
    borderRadius: "12px",
    padding: "20px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
  },
  muted: { color: "#6b7280" },
  assignedLine: { fontSize: "16px", margin: "0 0 16px 0" },
  label: { display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "8px", color: "#374151" },
  row: { display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center", marginBottom: "8px" },
  input: {
    flex: "1 1 200px",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
  },
  primaryBtn: {
    background: "#2563eb",
    color: "white",
    padding: "10px 18px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
  },
  secondaryBtn: {
    padding: "8px 14px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    background: "white",
    cursor: "pointer",
    fontWeight: "600",
  },
  error: { margin: "0 0 12px 0", fontSize: "13px", color: "#b91c1c" },
  hint: {
    margin: "16px 0 8px 0",
    fontSize: "12px",
    color: "#6b7280",
    lineHeight: 1.45,
  },
  warn: {
    margin: 0,
    fontSize: "12px",
    color: "#92400e",
    lineHeight: 1.45,
    paddingLeft: "10px",
    borderLeft: "3px solid #fbbf24",
  },
};
