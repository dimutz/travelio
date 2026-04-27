import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [days, setDays] = useState(1);
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`listings/properties/${id}/`)
      .then((res) => setProperty(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBooking = async () => {
    try {
      await api.post("bookings/create/", {
        property: id,
        number_of_days: days,
        number_of_guests: guests,
      });
      alert("Rezervare efectuată cu succes!");
      navigate("/profile");
    } catch (err) {
      alert("Eroare la rezervare. Verifică dacă ești logat.");
    }
  };

  if (loading) return <p style={{ padding: "40px" }}>Se încarcă...</p>;
  if (!property) return <p style={{ padding: "40px" }}>Proprietatea nu a fost găsită.</p>;

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.backBtn}>← Înapoi</button>
      
      <div style={styles.content}>
        <div style={styles.imageGallery}>
          {property.images && property.images.length > 0 ? (
            property.images.map((img, idx) => (
              <img key={idx} src={img.image_url || img.image} style={styles.mainImg} alt="property" />
            ))
          ) : (
            <div style={styles.noImage}>Fără imagini disponibile</div>
          )}
        </div>

        <div style={styles.detailsCard}>
          <h1>{property.name}</h1>
          <p><strong>Locație:</strong> {property.city}, {property.country}</p>
          <p>{property.description}</p>
          
          <div style={styles.bookingBox}>
            <h3>Rezervă acum</h3>
            <label>Număr zile:</label>
            <input type="number" min="1" value={days} onChange={(e) => setDays(e.target.value)} style={styles.input} />
            
            <label>Număr persoane:</label>
            <input type="number" min="1" value={guests} onChange={(e) => setGuests(e.target.value)} style={styles.input} />
            
            <button onClick={handleBooking} style={styles.bookBtn}>Confirmă Rezervarea</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "40px", maxWidth: "1000px", margin: "0 auto" },
  backBtn: { background: "none", border: "none", color: "#2563eb", cursor: "pointer", marginBottom: "20px" },
  content: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" },
  mainImg: { width: "100%", borderRadius: "12px", marginBottom: "10px" },
  noImage: { height: "300px", background: "#e5e7eb", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" },
  detailsCard: { background: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" },
  bookingBox: { marginTop: "20px", padding: "20px", borderTop: "1px solid #eee" },
  input: { display: "block", width: "100%", padding: "10px", margin: "10px 0", borderRadius: "6px", border: "1px solid #ddd" },
  bookBtn: { width: "100%", padding: "12px", background: "#2563eb", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }
};