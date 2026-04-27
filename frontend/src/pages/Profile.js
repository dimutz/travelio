import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Profile = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const username = localStorage.getItem('username') || 'Utilizator';

    useEffect(() => {
        // Luăm rezervările de la backend
        // Notă: Endpoint-ul 'listings/my-bookings/' trebuie să existe pe backend
        api.get('listings/my-bookings/')
            .then(res => {
                setBookings(Array.isArray(res.data) ? res.data : []);
            })
            .catch(err => {
                console.error("Eroare la încărcarea rezervărilor:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div style={styles.container}>
            {/* Header Profil */}
            <div style={styles.headerSection}>
                <Link to="/" style={styles.backLink}>← Înapoi la Căutare</Link>
                <div style={styles.userCircle}>{username[0].toUpperCase()}</div>
                <h1 style={styles.title}>Salut, {username}!</h1>
                <p style={styles.subtitle}>Aici poți gestiona rezervările și detaliile contului tău.</p>
            </div>

            <div style={styles.contentGrid}>
                {/* Secțiunea Rezervări */}
                <div style={styles.mainContent}>
                    <h2 style={styles.sectionTitle}>Rezervările mele</h2>
                    {loading ? (
                        <p>Se încarcă rezervările...</p>
                    ) : bookings.length === 0 ? (
                        <div style={styles.emptyState}>
                            <p>Nu ai nicio rezervare activă momentan.</p>
                            <Link to="/" style={styles.bookNowBtn}>Caută o cazare acum</Link>
                        </div>
                    ) : (
                        <div style={styles.bookingList}>
                            {bookings.map(booking => (
                                <div key={booking.id} style={styles.bookingCard}>
                                    <div style={styles.cardInfo}>
                                        <h3 style={styles.propertyTitle}>{booking.property_name}</h3>
                                        <p style={styles.cardDetail}>📅 <strong>Perioada:</strong> {booking.start_date} - {booking.end_date}</p>
                                        <p style={styles.cardDetail}>💰 <strong>Total plătit:</strong> {booking.total_price} RON</p>
                                    </div>
                                    <div style={{...styles.statusBadge, backgroundColor: booking.status === 'confirmed' ? '#dcfce7' : '#fef9c3'}}>
                                        {booking.status === 'confirmed' ? 'Confirmată' : 'În așteptare'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Secțiunea Info Cont (Sidebar) */}
                <div style={styles.sidebar}>
                    <h2 style={styles.sectionTitle}>Detalii Cont</h2>
                    <div style={styles.infoBox}>
                        <p style={styles.infoItem}><strong>Nume de utilizator:</strong> {username}</p>
                        <p style={styles.infoItem}><strong>Membru din:</strong> 2026</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { minHeight: "100vh", padding: "40px", background: "#f6f7fb", fontFamily: "Arial, sans-serif" },
    headerSection: { textAlign: "center", marginBottom: "40px" },
    backLink: { display: "block", marginBottom: "20px", color: "#2563eb", textDecoration: "none", fontWeight: "bold" },
    userCircle: { width: "80px", height: "80px", background: "#2563eb", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", margin: "0 auto 16px", fontWeight: "bold" },
    title: { fontSize: "32px", margin: "0 0 8px 0" },
    subtitle: { color: "#6b7280", margin: 0 },
    contentGrid: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: "30px", maxWidth: "1100px", margin: "0 auto" },
    sectionTitle: { fontSize: "20px", marginBottom: "20px", borderBottom: "2px solid #e5e7eb", paddingBottom: "10px" },
    mainContent: { background: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" },
    sidebar: { background: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", height: "fit-content" },
    bookingList: { display: "flex", flexDirection: "column", gap: "16px" },
    bookingCard: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", border: "1px solid #e5e7eb", borderRadius: "8px" },
    propertyTitle: { margin: "0 0 8px 0", fontSize: "18px" },
    cardDetail: { margin: "4px 0", fontSize: "14px", color: "#4b5563" },
    statusBadge: { padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", color: "#166534" },
    emptyState: { textAlign: "center", padding: "40px 0" },
    bookNowBtn: { display: "inline-block", marginTop: "16px", background: "#2563eb", color: "white", padding: "10px 20px", borderRadius: "8px", textDecoration: "none" },
    infoBox: { fontSize: "14px" },
    infoItem: { marginBottom: "12px" },
    editBtn: { width: "100%", padding: "8px", border: "1px solid #d1d5db", borderRadius: "6px", background: "white", cursor: "pointer", marginTop: "10px" }
};

export default Profile;