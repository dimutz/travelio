import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function BookingPayment() {
    const location = useLocation();
    const navigate = useNavigate();
    const data = location.state;

    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("card");
    const [expMonth, setExpMonth] = useState("");
    const [expYear, setExpYear] = useState("");

    // Card payment
    const [cardName, setCardName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [cardCVC, setCardCVC] = useState("");

    // Bank transfer
    const [bankIBAN, setBankIBAN] = useState("");
    const [bankName, setBankName] = useState("");

    // Errors
    const [errors, setErrors] = useState({});

    if (!data) return <p style={{ padding: "40px", textAlign: "center" }}>Error: Missing data. Return to the home page.</p>;

    const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => (currentYear + i).toString());

    // ===== VALIDARE CARD =====
    const handleCardNameChange = (e) => {
        const value = e.target.value;
        // Doar litere și spații
        if (/^[a-zA-Z\s]*$/.test(value) || value === "") {
            setCardName(value);
            setErrors(prev => ({ ...prev, cardName: "" }));
        }
    };

    const handleCardNumberChange = (e) => {
        const value = e.target.value.replace(/\D/g, "");
        if (value.length <= 16) {
            setCardNumber(value);
            setErrors(prev => ({ ...prev, cardNumber: "" }));
        }
    };

    const handleCardCVCChange = (e) => {
        const value = e.target.value.replace(/\D/g, "");
        if (value.length <= 3) {
            setCardCVC(value);
            setErrors(prev => ({ ...prev, cardCVC: "" }));
        }
    };

    // Formatare card: XXXX XXXX XXXX XXXX
    const formatCardNumber = (card) => {
        if (!card) return "";
        return card.replace(/(\d{4})(?=\d)/g, "$1 ");
    };

    // ===== VALIDARE IBAN =====
    const handleIBANChange = (e) => {
        const value = e.target.value.toUpperCase().replace(/\s/g, "");
        if (/^[A-Z0-9]*$/.test(value) && value.length <= 34) {
            setBankIBAN(value);
            setErrors(prev => ({ ...prev, bankIBAN: "" }));
        }
    };

    const formatIBAN = (iban) => {
        if (!iban) return "";
        // Formatare: Grupe de 4 caractere
        return iban.replace(/(.{4})/g, "$1 ").trim();
    };

    const handleBankNameChange = (e) => {
        const value = e.target.value;
        if (/^[a-zA-Z0-9\s\-]*$/.test(value) || value === "") {
            setBankName(value);
            setErrors(prev => ({ ...prev, bankName: "" }));
        }
    };

    // ===== VALIDĂRI COMPLETE =====
    const validateCard = () => {
        const newErrors = {};

        // Nume pe card
        if (!cardName.trim()) {
            newErrors.cardName = "Name on card is required";
        } else if (cardName.trim().length < 3) {
            newErrors.cardName = "Name must be at least 3 characters";
        } else if (!/^[a-zA-Z\s]+$/.test(cardName)) {
            newErrors.cardName = "Name can only contain letters";
        }

        // Numar card
        if (!cardNumber) {
            newErrors.cardNumber = "Card number is required";
        } else if (cardNumber.length < 13) {
            newErrors.cardNumber = "Card number must be 13-16 digits";
        } else if (cardNumber.length > 16) {
            newErrors.cardNumber = "Card number must not exceed 16 digits";
        }

        // CVC
        if (!cardCVC) {
            newErrors.cardCVC = "CVC is required";
        } else if (cardCVC.length !== 3) {
            newErrors.cardCVC = "CVC must be exactly 3 digits";
        }

        // Data expirare
        if (!expMonth || !expYear) {
            newErrors.expiry = "Expiry date is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateIBAN = () => {
        const newErrors = {};

        // IBAN
        if (!bankIBAN) {
            newErrors.bankIBAN = "IBAN is required";
        } else if (bankIBAN.length < 15) {
            newErrors.bankIBAN = "IBAN must be at least 15 characters";
        } else if (bankIBAN.length > 34) {
            newErrors.bankIBAN = "IBAN must not exceed 34 characters";
        } else if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/.test(bankIBAN)) {
            newErrors.bankIBAN = "IBAN format is invalid (starts with 2 letters + 2 digits)";
        }

        // Nume banca
        if (!bankName.trim()) {
            newErrors.bankName = "Bank name is required";
        } else if (bankName.trim().length < 2) {
            newErrors.bankName = "Bank name must be at least 2 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleConfirmFinalBooking = async () => {
        // Validare pe baza metodei de plată
        const isValid = paymentMethod === "card" ? validateCard() : validateIBAN();

        if (!isValid) return;

        setLoading(true);
        try {
            await api.post("bookings/create/", {
                property: data.propertyId,
                check_in: data.checkIn,
                check_out: data.checkOut,
                number_of_guests: data.guests,
                number_of_days: data.days,
            });

            navigate("/booking-success", { state: data });
        } catch (err) {
            console.error(err);
            alert("A apărut o eroare la procesarea rezervării.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "40px 20px", maxWidth: "600px", margin: "0 auto", fontFamily: "sans-serif" }}>
            <h2 style={{ marginBottom: "5px", color: "#1f2937" }}>Payment and Confirmation</h2>
            <p style={{ color: "#6b7280", marginBottom: "30px" }}>
                Finalize the reservation for <strong>{data.propertyName}</strong>
            </p>

            {/* --- SELECTAREA METODEI DE PLATĂ --- */}
            <div style={{ display: "flex", gap: "15px", marginBottom: "30px" }}>
                <div
                    onClick={() => {
                        setPaymentMethod("card");
                        setErrors({});
                    }}
                    style={{
                        flex: 1,
                        padding: "20px",
                        border: paymentMethod === "card" ? "2px solid #2563eb" : "1px solid #e5e7eb",
                        background: paymentMethod === "card" ? "#eff6ff" : "white",
                        borderRadius: "12px",
                        cursor: "pointer",
                        transition: "all 0.2s"
                    }}
                >
                    <h4 style={{ margin: "0 0 5px 0", color: paymentMethod === "card" ? "#1d4ed8" : "#374151" }}>💳 Card payment</h4>
                    <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>Pay the full amount now.</p>
                </div>

                <div
                    onClick={() => {
                        setPaymentMethod("bank");
                        setErrors({});
                    }}
                    style={{
                        flex: 1,
                        padding: "20px",
                        border: paymentMethod === "bank" ? "2px solid #2563eb" : "1px solid #e5e7eb",
                        background: paymentMethod === "bank" ? "#eff6ff" : "white",
                        borderRadius: "12px",
                        cursor: "pointer",
                        transition: "all 0.2s"
                    }}
                >
                    <h4 style={{ margin: "0 0 5px 0", color: paymentMethod === "bank" ? "#1d4ed8" : "#374151" }}>🏦 Bank transfer</h4>
                    <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>Transfer via IBAN to secure the booking.</p>
                </div>
            </div>

            {/* --- CARD PAYMENT --- */}
            {paymentMethod === "card" && (
                <div style={{ background: "#f9fafb", padding: "25px", borderRadius: "16px", marginBottom: "25px", border: "1px solid #e5e7eb" }}>
                    <h3 style={{ margin: "0 0 20px 0", fontSize: "16px", color: "#1f2937" }}>
                        Enter card details
                    </h3>

                    {/* Card Name */}
                    <div>
                        <label style={styles.label}>Name on card</label>
                        <input
                            type="text"
                            placeholder="Ex: Popescu Ion"
                            value={cardName}
                            onChange={handleCardNameChange}
                            onBlur={() => validateCard()}
                            style={{
                                ...styles.input,
                                border: errors.cardName ? "2px solid #ef4444" : "1px solid #d1d5db"
                            }}
                        />
                        {errors.cardName && (
                            <p style={{ color: "#ef4444", fontSize: "13px", marginTop: "4px", marginBottom: "15px" }}>
                                {errors.cardName}
                            </p>
                        )}
                    </div>

                    {/* Card Number */}
                    <div>
                        <label style={styles.label}>Card number</label>
                        <input
                            type="text"
                            placeholder="0000 0000 0000 0000"
                            value={formatCardNumber(cardNumber)}
                            onChange={handleCardNumberChange}
                            onBlur={() => validateCard()}
                            maxLength="19"
                            style={{
                                ...styles.input,
                                border: errors.cardNumber ? "2px solid #ef4444" : "1px solid #d1d5db"
                            }}
                        />
                        {errors.cardNumber && (
                            <p style={{ color: "#ef4444", fontSize: "13px", marginTop: "4px", marginBottom: "15px" }}>
                                {errors.cardNumber}
                            </p>
                        )}
                    </div>

                    {/* Expiry & CVC */}
                    <div style={{ display: "flex", gap: "15px" }}>
                        <div style={{ flex: 1 }}>
                            <label style={styles.label}>Expiry date</label>
                            <div style={styles.combinedInputBox}>
                                <select
                                    style={styles.invisibleSelect}
                                    value={expMonth}
                                    onChange={(e) => setExpMonth(e.target.value)}
                                    onBlur={() => validateCard()}
                                >
                                    <option value="" disabled>MM</option>
                                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>

                                <span style={styles.slash}>/</span>

                                <select
                                    style={styles.invisibleSelect}
                                    value={expYear}
                                    onChange={(e) => setExpYear(e.target.value)}
                                    onBlur={() => validateCard()}
                                >
                                    <option value="" disabled>YY</option>
                                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                            </div>
                            {errors.expiry && (
                                <p style={{ color: "#ef4444", fontSize: "13px", marginTop: "4px" }}>
                                    {errors.expiry}
                                </p>
                            )}
                        </div>

                        <div style={{ width: "100px" }}>
                            <label style={styles.label}>CVC/CVV</label>
                            <input
                                type="text"
                                placeholder="123"
                                value={cardCVC}
                                onChange={handleCardCVCChange}
                                onBlur={() => validateCard()}
                                maxLength="3"
                                style={{
                                    ...styles.input,
                                    border: errors.cardCVC ? "2px solid #ef4444" : "1px solid #d1d5db"
                                }}
                            />
                            {errors.cardCVC && (
                                <p style={{ color: "#ef4444", fontSize: "13px", marginTop: "4px" }}>
                                    {errors.cardCVC}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* --- BANK TRANSFER --- */}
            {paymentMethod === "bank" && (
                <div style={{ background: "#f9fafb", padding: "25px", borderRadius: "16px", marginBottom: "25px", border: "1px solid #e5e7eb" }}>
                    <h3 style={{ margin: "0 0 20px 0", fontSize: "16px", color: "#1f2937" }}>
                        Bank transfer details
                    </h3>

                    {/* Bank Name */}
                    <div>
                        <label style={styles.label}>Bank name</label>
                        <input
                            type="text"
                            placeholder="Ex: ING Bank / Raiffeisen"
                            value={bankName}
                            onChange={handleBankNameChange}
                            onBlur={() => validateIBAN()}
                            style={{
                                ...styles.input,
                                border: errors.bankName ? "2px solid #ef4444" : "1px solid #d1d5db"
                            }}
                        />
                        {errors.bankName && (
                            <p style={{ color: "#ef4444", fontSize: "13px", marginTop: "4px", marginBottom: "15px" }}>
                                {errors.bankName}
                            </p>
                        )}
                    </div>

                    {/* IBAN */}
                    <div>
                        <label style={styles.label}>IBAN</label>
                        <input
                            type="text"
                            placeholder="RO00 XXXX XXXX XXXX XXXX XXXX"
                            value={formatIBAN(bankIBAN)}
                            onChange={handleIBANChange}
                            onBlur={() => validateIBAN()}
                            maxLength="38"
                            style={{
                                ...styles.input,
                                border: errors.bankIBAN ? "2px solid #ef4444" : "1px solid #d1d5db",
                                fontFamily: "monospace",
                                letterSpacing: "2px"
                            }}
                        />
                        {errors.bankIBAN && (
                            <p style={{ color: "#ef4444", fontSize: "13px", marginTop: "4px", marginBottom: "15px" }}>
                                {errors.bankIBAN}
                            </p>
                        )}
                        <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "-10px", marginBottom: "15px" }}>
                            Format: RO + 2 digits + alphanumeric (15-34 characters)
                        </p>
                    </div>
                </div>
            )}

            {/* --- BUTON CONFIRMARE --- */}
            <button
                onClick={handleConfirmFinalBooking}
                disabled={loading}
                style={{
                    width: "100%",
                    padding: "16px",
                    background: "#10b981",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    fontWeight: "bold",
                    fontSize: "16px",
                    cursor: loading ? "not-allowed" : "pointer",
                    transition: "background 0.2s",
                    opacity: loading ? 0.7 : 1
                }}
                onMouseOver={(e) => !loading && (e.target.style.background = "#059669")}
                onMouseOut={(e) => !loading && (e.target.style.background = "#10b981")}
            >
                {loading
                    ? "Se procesează..."
                    : paymentMethod === "card"
                        ? "Confirm and Pay in full"
                        : "Confirm and Transfer"
                }
            </button>
            <p style={{ textAlign: "center", fontSize: "12px", color: "#9ca3af", marginTop: "15px" }}>
                🔒 Secured payment. Your data is protected.
            </p>
        </div>
    );
}

const styles = {
    label: {
        display: "block",
        marginBottom: "8px",
        fontSize: "13px",
        fontWeight: "600",
        color: "#4b5563"
    },
    input: {
        width: "100%",
        padding: "12px",
        marginBottom: "15px",
        borderRadius: "8px",
        border: "1px solid #d1d5db",
        fontSize: "15px",
        outline: "none",
        boxSizing: "border-box",
        background: "white",
        transition: "border 0.2s"
    },
    combinedInputBox: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        height: "45px",
        padding: "0 10px",
        marginBottom: "15px",
        borderRadius: "8px",
        border: "1px solid #d1d5db",
        background: "white",
        boxSizing: "border-box"
    },
    invisibleSelect: {
        flex: 1,
        border: "none",
        outline: "none",
        background: "transparent",
        fontSize: "15px",
        color: "#4b5563",
        cursor: "pointer",
        textAlign: "center",
        appearance: "none",
        WebkitAppearance: "none",
        MozAppearance: "none",
    },
    slash: {
        fontSize: "18px",
        color: "#9ca3af",
        margin: "0 5px",
        pointerEvents: "none"
    }
};