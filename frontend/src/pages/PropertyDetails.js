import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import AnimatedBackground from "../components/AnimatedBackground";

function formatBookingError(err) {
  if (!err.response) {
    return "Network error. Please try again.";
  }
  const { status, data } = err.response;
  if (status === 401) {
    return "Your session expired. Please log in again.";
  }
  if (status === 404) {
    return "Booking endpoint not found. Ensure the API is running and up to date.";
  }
  if (typeof data === "string") return data;
  if (data?.detail) return data.detail;
  if (data && typeof data === "object") {
    const messages = [];
    for (const val of Object.values(data)) {
      if (Array.isArray(val)) messages.push(...val.filter(Boolean));
      else if (typeof val === "string") messages.push(val);
    }
    if (messages.length) return messages[0];
  }
  return `Could not complete booking (HTTP ${status}).`;
}

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setProperty(null);
      try {
        const propRes = await api.get(`listings/properties/${id}/`);
        const propData = propRes.data;

        let me = null;
        try {
          const meRes = await api.get("auth/me/");
          me = meRes.data;
        } catch {
          me = null;
        }

        const pid = Number(id);
        if (me?.role === "owner") {
          const myRes = await api.get("listings/my-properties/");
          const ids = (Array.isArray(myRes.data) ? myRes.data : []).map((p) => p.id);
          if (!ids.includes(pid)) {
            if (!cancelled) navigate("/home", { replace: true });
            return;
          }
        } else if (me?.role === "receptionist") {
          const aid = me.assigned_property?.id;
          if (aid == null || aid !== pid) {
            if (!cancelled) navigate("/home", { replace: true });
            return;
          }
        }

        if (!cancelled) setProperty(propData);
      } catch (err) {
        console.error("Error loading property:", err);
        if (!cancelled) setProperty(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const handleNextStep = () => {
    const days = calculateDays();
    if (days <= 0) {
      alert("Please select a valid period (minimum 1 night).");
      return;
    }

    navigate("/checkout/client", {
      state: {
        propertyId: Number(id),
        propertyName: property.name,
        checkIn: startDate,
        checkOut: endDate,
        guests: guests,
        days: days,
        capacity: property.capacity
      }
    });
  };

  if (loading) return <p style={{ padding: "40px" }}>Loading...</p>;
  if (!property) return <p style={{ padding: "40px" }}>Property not found.</p>;

  return (
    <>
      <AnimatedBackground />

      <div style={{ ...styles.container, position: "relative", zIndex: 10 }}>
      <button onClick={() => navigate(-1)} style={styles.backBtn}>← Back</button>
      
      <div style={styles.content}>
        <div style={styles.imageGallery}>
          {property.images && property.images.length > 0 ? (
            property.images.map((img, idx) => (
              <img
                key={img.id ?? idx}
                src={img.image_url || img.image}
                style={styles.mainImg}
                alt={property.name}
              />
            ))
          ) : (
              <div style={styles.noImage}>No images available</div>
          )}
        </div>

        <div style={styles.detailsCard}>
          <h1>{property.name}</h1>
          <p><strong>Proprietar:</strong> {property.owner_username || "Information unavailable"}</p>
          <p><strong>Adresă:</strong> {property.address}, {property.city}, {property.country}</p>
          <p><strong>Capacitate:</strong> {property.capacity || "1"} persoane</p>
          
          <p style={{ marginTop: "15px", lineHeight: "1.6" }}>{property.description}</p>
          
          <div style={styles.bookingBox}>
            <h3>Book now</h3>
            
            <label style={styles.label}>Check-in date:</label>
            <input 
              type="date" 
              min={today} 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)} 
              style={styles.input} 
            />
            
            <label style={styles.label}>Check-out date:</label>
            <input 
              type="date" 
              min={startDate || today} 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)} 
              style={styles.input} 
            />

            {calculateDays() > 0 && (
              <p style={styles.infoText}>Length of stay: <strong>{calculateDays()} zile</strong></p>
            )}
            
            <label style={styles.label}>Number of guests: (Max: {property.capacity}):</label>
            <input 
              type="number" 
              min="1" 
              max={property.capacity}
              value={guests} 
              onChange={(e) => setGuests(parseInt(e.target.value))} 
              style={styles.input} 
            />
            
            <button 
              onClick={handleNextStep} 
              style={{
                ...styles.bookBtn, 
                opacity: (calculateDays() > 0 && guests <= property.capacity) ? 1 : 0.6
              }}
              disabled={calculateDays() <= 0 || guests > property.capacity}
            >
              Confirm Booking
            </button>
          </div>

          {/* Rooms section - show if owner */}
          {property.rooms && property.rooms.length > 0 && (
            <div style={{ marginTop: "30px" }}>
              <h3>Rooms</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
                {property.rooms.map((room) => (
                  <div
                    key={room.id}
                    style={{
                      padding: "15px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      backgroundColor: "#f9fafb"
                    }}
                  >
                    <p><strong>{room.room_type}</strong></p>
                    <p>Capacity: {room.capacity} guests</p>
                    <p>Status: <strong>{room.availability_status}</strong></p>
                    {room.description && <p>{room.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
    </>
  );
}

const styles = {
  container: { padding: "40px", maxWidth: "1200px", margin: "0 auto" },
  backBtn: { background: "none", border: "none", color: "#1d4ed8", cursor: "pointer", marginBottom: "20px", fontSize: "16px" },
  content: { display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "40px" },
  mainImg: { width: "100%", borderRadius: "12px", marginBottom: "15px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" },
  noImage: { height: "300px", background: "#f3f4f6", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" },
  detailsCard: { background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", height: "fit-content" },
  bookingBox: { marginTop: "25px", padding: "20px", background: "#f9fafb", borderRadius: "12px", border: "1px solid #f1f5f9" },
  label: { display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "600", color: "#374151" },
  input: { display: "block", width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "16px" },
  infoText: { marginBottom: "15px", color: "#2563eb", fontSize: "15px" },
  bookBtn: { width: "100%", padding: "14px", background: "#2563eb", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "bold", fontSize: "16px", transition: "all 0.2s" }
};