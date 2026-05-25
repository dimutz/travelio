import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function BookingClientDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const bookingData = location.state;

    const [clientName, setClientName] = useState("");
    const [clientPhone, setClientPhone] = useState("");
    const [specialRequests, setSpecialRequests] = useState("");
    const [errors, setErrors] = useState({});

    if (!bookingData) return <p>Error: Booking data is missing. Go back to property.</p>;

    // Validare nume - doar litere și spații
    const handleNameChange = (e) => {
        const value = e.target.value;
        if (/^[a-zA-Z\s]*$/.test(value) || value === "") {
            setClientName(value);
            if (value.trim().length >= 3 || value === "") {
                setErrors(prev => ({ ...prev, name: "" }));
            }
        }
    };

    // Validare telefon - doar cifre
    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, "");
        if (value.length <= 15) {
            setClientPhone(value);
        }
    };

    // Formatare telefon cu spații: 07xx xxx xxx
    const formatPhone = (phone) => {
        if (!phone) return "";
        if (phone.length <= 2) return phone;
        if (phone.length <= 4) return phone.slice(0, 2) + phone.slice(2);
        if (phone.length <= 7) return phone.slice(0, 2) + phone.slice(2, 4) + " " + phone.slice(4);
        return phone.slice(0, 2) + phone.slice(2, 4) + " " + phone.slice(4, 7) + " " + phone.slice(7, 10);
    };

    // Validare telefon
    const validatePhone = () => {
        if (!clientPhone) {
            setErrors(prev => ({ ...prev, phone: "Phone number is required" }));
            return false;
        }
        if (clientPhone.length < 10) {
            setErrors(prev => ({ ...prev, phone: "Phone must be at least 10 digits (format: 07xx xxx xxx)" }));
            return false;
        }
        setErrors(prev => ({ ...prev, phone: "" }));
        return true;
    };

    // Validare nume
    const validateName = () => {
        if (!clientName.trim()) {
            setErrors(prev => ({ ...prev, name: "Name is required" }));
            return false;
        }
        if (clientName.trim().length < 3) {
            setErrors(prev => ({ ...prev, name: "Name must be at least 3 characters" }));
            return false;
        }
        setErrors(prev => ({ ...prev, name: "" }));
        return true;
    };

    const handleGoToPayment = () => {
        const isNameValid = validateName();
        const isPhoneValid = validatePhone();

        if (!isNameValid || !isPhoneValid) {
            return;
        }

        navigate("/checkout/payment", {
            state: {
                ...bookingData,
                clientName: clientName.trim(),
                clientPhone,
                specialRequests
            }
        });
    };

    return (
        <div style={{ padding: "40px", maxWidth: "600px", margin: "0 auto" }}>
            <h2>Client details</h2>
            <p style={{ color: "#6b7280", marginBottom: "20px" }}>
                Reservation for <strong>{bookingData.propertyName}</strong> ({bookingData.days} nights)
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {/* Nume */}
                <div>
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={clientName}
                        onChange={handleNameChange}
                        onBlur={validateName}
                        style={{
                            padding: "12px",
                            borderRadius: "8px",
                            border: errors.name ? "2px solid #ef4444" : "1px solid #d1d5db",
                            width: "100%",
                            boxSizing: "border-box",
                            transition: "border 0.2s"
                        }}
                    />
                    {errors.name && (
                        <p style={{ color: "#ef4444", fontSize: "13px", marginTop: "6px", fontWeight: "500" }}>
                            {errors.name}
                        </p>
                    )}
                </div>

                {/* Telefon */}
                <div>
                    <input
                        type="text"
                        placeholder="Phone Number (07xx xxx xxx)"
                        value={formatPhone(clientPhone)}
                        onChange={handlePhoneChange}
                        onBlur={validatePhone}
                        maxLength="12"
                        style={{
                            padding: "12px",
                            borderRadius: "8px",
                            border: errors.phone ? "2px solid #ef4444" : "1px solid #d1d5db",
                            width: "100%",
                            boxSizing: "border-box",
                            transition: "border 0.2s",
                            fontSize: "16px"
                        }}
                    />
                    {errors.phone && (
                        <p style={{ color: "#ef4444", fontSize: "13px", marginTop: "6px", fontWeight: "500" }}>
                            {errors.phone}
                        </p>
                    )}
                </div>

                {/* Special Requests */}
                <div>
                    <textarea
                        placeholder="Special requests (optional)"
                        value={specialRequests}
                        onChange={e => setSpecialRequests(e.target.value)}
                        style={{
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #d1d5db",
                            minHeight: "100px",
                            width: "100%",
                            boxSizing: "border-box"
                        }}
                    />
                </div>

                {/* Buton */}
                <button
                    onClick={handleGoToPayment}
                    style={{
                        padding: "14px",
                        background: "#2563eb",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        transition: "background 0.2s"
                    }}
                    onMouseOver={e => e.target.style.background = "#1d4ed8"}
                    onMouseOut={e => e.target.style.background = "#2563eb"}
                >
                    Proceed to Payment
                </button>
            </div>
        </div>
    );
}