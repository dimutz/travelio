import React from "react";
import "./AnimatedBackground.css";

export default function AnimatedBackground() {
    return (
        <div className="animated-bg-container">
            {/* Gradient background pastel */}
            <div className="gradient-bg"></div>

            {/* Nori animate */}
            <div className="cloud cloud-1"></div>
            <div className="cloud cloud-2"></div>
            <div className="cloud cloud-3"></div>
            <div className="cloud cloud-4"></div>
            <div className="cloud cloud-5"></div>
        </div>
    );
}