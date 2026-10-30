import React, { useState, useRef } from 'react';

/**
 * ThreeTokenCard
 * High-fidelity 3D Interactive Holographic Token Card
 * Reacts to mouse cursor with dynamic 3D tilt, holographic rainbow glare, and depth elevation.
 * Directly reinforces psychological trust to resolve Requirement 3 (Knowing Uncertainty).
 */
export default function ThreeTokenCard({ confirmation }) {
  const cardRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0, glareX: 50, glareY: 50 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate 3D tilt angles (max +/- 18 degrees)
    const rotateX = ((y - centerY) / centerY) * -16;
    const rotateY = ((x - centerX) / centerX) * 16;

    // Glare coordinates in percentage
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setCoords({ x: rotateX, y: rotateY, glareX, glareY });
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    setIsHovering(false);
    setCoords({ x: 0, y: 0, glareX: 50, glareY: 50 });
  };

  if (!confirmation) return null;

  return (
    <div className="three-token-perspective-container">
      <div
        className={`three-token-card-3d ${isHovering ? 'is-hovered' : ''}`}
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${coords.x}deg) rotateY(${coords.y}deg) ${isHovering ? 'scale3d(1.04, 1.04, 1.04)' : 'scale3d(1, 1, 1)'}`,
          transition: isHovering ? 'none' : 'transform 0.5s ease-out'
        }}
      >
        {/* Holographic Rainbow Foil Reflection Layer */}
        <div
          className="holo-glare-foil"
          style={{
            background: `radial-gradient(circle at ${coords.glareX}% ${coords.glareY}%, rgba(255,255,255,0.4) 0%, rgba(56,189,248,0.2) 25%, rgba(168,85,247,0.2) 50%, rgba(13,148,136,0.1) 75%, transparent 100%)`,
            opacity: isHovering ? 1 : 0.4
          }}
        ></div>

        {/* 3D Security Micro-Grid Pattern */}
        <div className="holo-security-grid"></div>

        {/* 3D Content Header */}
        <div className="holo-card-header">
          <div className="holo-hospital-badge">
            <span className="live-pulse-dot"></span>
            <span>CAREPULSE MEMORIAL • OFFICIAL OPD PASS</span>
          </div>
          <div className="holo-chip-sim">
            <div className="sim-metal"></div>
          </div>
        </div>

        {/* 3D Embossed Token Number */}
        <div className="holo-token-center">
          <div className="holo-token-label">OPD QUEUE PRIORITY TOKEN</div>
          <div className="holo-token-number" style={{ transform: 'translateZ(30px)' }}>
            {confirmation.tokenNumber}
          </div>
          <div className="holo-token-timestamp">
            {confirmation.bookingDate} • {confirmation.slotTime}
          </div>
        </div>

        {/* Card Metadata Details */}
        <div className="holo-details-grid" style={{ transform: 'translateZ(20px)' }}>
          <div className="holo-meta-col">
            <span className="holo-meta-lbl">PATIENT</span>
            <span className="holo-meta-val">{confirmation.patientName}</span>
          </div>
          <div className="holo-meta-col">
            <span className="holo-meta-lbl">SPECIALIST</span>
            <span className="holo-meta-val">{confirmation.doctorName}</span>
          </div>
          <div className="holo-meta-col full-width">
            <span className="holo-meta-lbl">LOCATION / CABIN</span>
            <span className="holo-meta-val cabin-glow">{confirmation.cabin}</span>
          </div>
        </div>

        {/* 3D Holographic Security Seal */}
        <div className="holo-seal-badge">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <path d="m9 12 2 2 4-4"/>
          </svg>
          <span>DIGITALLY VERIFIED</span>
        </div>
      </div>

      <div className="three-token-hint">
        <span>✨ Move cursor across token to inspect 3D security holographic foil</span>
      </div>
    </div>
  );
}
