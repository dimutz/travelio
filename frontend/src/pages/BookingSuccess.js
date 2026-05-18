import { useLocation, Link } from "react-router-dom";

export default function BookingSuccess() {
    const location = useLocation();
    const data = location.state;

    if (!data) return <p>Selected dates are unavailable.</p>;

    return (
        <div style={{ padding: "60px 20px", display: "flex", justifyContent: "center" }}>
            <div style={{
                background: "#d1f4e0",
                border: "1px solid #a7f3d0",
                padding: "40px",
                borderRadius: "24px",
                textAlign: "center",
                maxWidth: "600px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
            }}>

                <div style={{ fontSize: "50px", marginBottom: "20px" }}>🎉</div>
                <h1 style={{ color: "#166534", marginBottom: "15px" }}>Booking Completed Successfully!</h1>

                <p style={{ fontSize: "16px", color: "#14532d", lineHeight: "1.6", marginBottom: "30px" }}>
                    Your booking at <strong>{data.propertyName}</strong>, from <strong>{data.checkIn}</strong> to <strong>{data.checkOut}</strong> for <strong>{data.guests}</strong> guests, has been registered.
                    <br /><br />
                    Additional details and confirmation have been saved to your account.
                </p>

                <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
                    <Link to="/home" style={{ padding: "12px 24px", background: "white", color: "#166534", textDecoration: "none", borderRadius: "8px", fontWeight: "bold" }}>
                        Back to Home
                    </Link>
                    <Link to="/profile" style={{ padding: "12px 24px", background: "#166534", color: "white", textDecoration: "none", borderRadius: "8px", fontWeight: "bold" }}>
                        View My Bookings
                    </Link>
                </div>
            </div>
        </div>
    );
}