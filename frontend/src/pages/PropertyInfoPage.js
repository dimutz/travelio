import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import AnimatedBackground from "../components/AnimatedBackground";

export default function PropertyInfoPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            setLoading(true);
            setProperty(null);
            try {
                const propRes = await api.get(`listings/properties/${id}/`);
                const propData = propRes.data;

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
    }, [id]);

    if (loading) return <p style={{ padding: "40px", textAlign: "center" }}>Loading...</p>;
    if (!property) return <p style={{ padding: "40px", textAlign: "center" }}>Property not found.</p>;

    return (
        <>
            <AnimatedBackground />
            <div style={{
                ...styles.container,
                position: "relative",
                zIndex: 10
            }}>
            <button onClick={() => navigate(-1)} style={styles.backBtn}>← Back</button>

            <div style={styles.content}>
                {/* Gallery */}
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

                {/* Details */}
                <div style={styles.detailsCard}>
                    {/* Header */}
                    <h1 style={styles.title}>{property.name}</h1>

                    <div style={styles.ratingSection}>
                        <span style={styles.rating}>
                            ⭐ {property.rating_average > 0 ? property.rating_average.toFixed(1) : "No rating yet"}
                        </span>
                    </div>

                    {/* Basic Info */}
                    <div style={styles.infoSection}>
                        <h3 style={styles.sectionTitle}>Basic Information</h3>
                        <div style={styles.infoGrid}>
                            <div style={styles.infoItem}>
                                <span style={styles.label}>Owner</span>
                                <p>{property.owner_username || "N/A"}</p>
                            </div>
                            <div style={styles.infoItem}>
                                <span style={styles.label}>Property Type</span>
                                <p>{property.property_type || "N/A"}</p>
                            </div>
                            <div style={styles.infoItem}>
                                <span style={styles.label}>Capacity</span>
                                <p>{property.capacity || "1"} guests</p>
                            </div>
                            <div style={styles.infoItem}>
                                <span style={styles.label}>Location</span>
                                <p>{property.city}, {property.country}</p>
                            </div>
                        </div>
                    </div>

                    {/* Address */}
                    <div style={styles.infoSection}>
                        <h3 style={styles.sectionTitle}>Address</h3>
                        <p style={styles.paragraph}>{property.address || "N/A"}</p>
                    </div>

                    {/* Description */}
                    <div style={styles.infoSection}>
                        <h3 style={styles.sectionTitle}>About</h3>
                        <p style={styles.paragraph}>{property.description || "No description available"}</p>
                    </div>

                    {/* Rooms */}
                    {property.rooms && property.rooms.length > 0 && (
                        <div style={styles.infoSection}>
                            <h3 style={styles.sectionTitle}>Rooms</h3>
                            <div style={styles.roomsGrid}>
                                {property.rooms.map((room) => (
                                    <div key={room.id} style={styles.roomCard}>
                                        <div style={styles.roomHeader}>
                                            <h4 style={styles.roomType}>{room.room_type}</h4>
                                            <span style={{
                                                ...styles.roomStatus,
                                                backgroundColor: room.availability_status === 'available' ? '#d1fae5' : '#fecaca',
                                                color: room.availability_status === 'available' ? '#065f46' : '#991b1b'
                                            }}>
                                                {room.availability_status}
                                            </span>
                                        </div>

                                        <div style={styles.roomDetails}>
                                            <p><strong>Capacity:</strong> {room.capacity} guests</p>
                                            <p><strong>Price:</strong> ${room.price_per_night || "N/A"} / night</p>
                                            {room.description && (
                                                <p style={{ marginTop: "10px", color: "#6b7280", fontSize: "14px" }}>
                                                    {room.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Empty Rooms Message */}
                    {(!property.rooms || property.rooms.length === 0) && (
                        <div style={styles.infoSection}>
                            <p style={{ color: "#9ca3af", fontStyle: "italic" }}>No rooms available yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </>
    );
}

const styles = {
    container: {
        padding: "40px 20px",
        maxWidth: "1200px",
        margin: "0 auto"
    },
    backBtn: {
        background: "none",
        border: "none",
        color: "#2563eb",
        cursor: "pointer",
        marginBottom: "20px",
        fontSize: "16px",
        fontWeight: "500",
        padding: "8px 12px",
        borderRadius: "6px",
        transition: "all 0.2s"
    },
    content: {
        display: "grid",
        gridTemplateColumns: "1.2fr 0.8fr",
        gap: "40px"
    },
    imageGallery: {
        display: "flex",
        flexDirection: "column"
    },
    mainImg: {
        width: "100%",
        borderRadius: "12px",
        marginBottom: "15px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        objectFit: "cover",
        height: "300px"
    },
    noImage: {
        height: "300px",
        background: "#f3f4f6",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#9ca3af"
    },
    detailsCard: {
        background: "white",
        padding: "30px",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
    },
    title: {
        fontSize: "28px",
        fontWeight: "bold",
        color: "#1f2937",
        marginBottom: "10px"
    },
    ratingSection: {
        marginBottom: "20px",
        paddingBottom: "20px",
        borderBottom: "1px solid #e5e7eb"
    },
    rating: {
        fontSize: "18px",
        color: "#f59e0b"
    },
    infoSection: {
        marginTop: "25px",
        paddingTop: "20px",
        borderTop: "1px solid #f3f4f6"
    },
    sectionTitle: {
        fontSize: "18px",
        fontWeight: "700",
        color: "#1f2937",
        marginBottom: "15px"
    },
    infoGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: "15px"
    },
    infoItem: {
        padding: "12px",
        background: "#f9fafb",
        borderRadius: "8px"
    },
    label: {
        display: "block",
        fontSize: "12px",
        fontWeight: "600",
        color: "#6b7280",
        marginBottom: "4px",
        textTransform: "uppercase"
    },
    paragraph: {
        lineHeight: "1.6",
        color: "#4b5563",
        fontSize: "15px"
    },
    roomsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "15px"
    },
    roomCard: {
        padding: "15px",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        backgroundColor: "#f9fafb"
    },
    roomHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "12px"
    },
    roomType: {
        fontSize: "16px",
        fontWeight: "700",
        color: "#1f2937",
        margin: 0
    },
    roomStatus: {
        padding: "4px 8px",
        borderRadius: "4px",
        fontSize: "12px",
        fontWeight: "600"
    },
    roomDetails: {
        fontSize: "14px",
        color: "#4b5563"
    }
};