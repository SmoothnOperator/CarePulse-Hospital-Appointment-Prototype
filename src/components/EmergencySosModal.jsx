import React, { useState, useEffect, useRef } from 'react';
import ThreeAmbulanceTracker from './ThreeAmbulanceTracker.jsx';

/**
 * EmergencySosModal
 * Full-screen Emergency SOS Console with 3D WebGL Ambulance Dispatch Tracker,
 * live GPS ETA countdown, trauma bay reservation, and Web Audio siren generator.
 */
export default function EmergencySosModal({ isOpen, onClose, lang = 'en', t }) {
  const [etaSeconds, setEtaSeconds] = useState(342); // 5m 42s
  const [selectedTriage, setSelectedTriage] = useState('chest-pain');
  const [isSirenPlaying, setIsSirenPlaying] = useState(false);
  const [isDispatched, setIsDispatched] = useState(true);
  const audioCtxRef = useRef(null);
  const sirenOscRef = useRef(null);
  const sirenGainRef = useRef(null);

  // Live ETA countdown timer
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setEtaSeconds((prev) => (prev > 10 ? prev - 1 : 10));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Web Audio API Siren Synthesizer
  const toggleSirenAudio = () => {
    if (isSirenPlaying) {
      if (sirenOscRef.current) {
        try {
          sirenOscRef.current.stop();
          sirenOscRef.current.disconnect();
        } catch {}
      }
      setIsSirenPlaying(false);
    } else {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        audioCtxRef.current = ctx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';

        // European/American emergency wail (alternating 650Hz - 900Hz)
        const now = ctx.currentTime;
        osc.frequency.setValueAtTime(650, now);

        // LFO for pitch modulation
        const lfo = ctx.createOscillator();
        lfo.frequency.setValueAtTime(1.2, now); // 1.2 Hz wail
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(250, now);

        lfo.connect(osc.frequency);
        lfo.start();

        gain.gain.setValueAtTime(0.08, now); // comfortable volume
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        sirenOscRef.current = osc;
        sirenGainRef.current = gain;
        setIsSirenPlaying(true);
      } catch (e) {
        console.warn('AudioContext unavailable:', e);
      }
    }
  };

  // Cleanup audio on modal close
  useEffect(() => {
    return () => {
      if (sirenOscRef.current) {
        try {
          sirenOscRef.current.stop();
          sirenOscRef.current.disconnect();
        } catch {}
      }
    };
  }, []);

  if (!isOpen) return null;

  const formatEta = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' + rem : rem}`;
  };

  return (
    <div className="modal-overlay emergency-overlay is-active" role="dialog" aria-modal="true">
      <div className="modal-window emergency-window">
        {/* Top Header */}
        <div className="emergency-modal-header">
          <div className="emergency-title-cluster">
            <span className="emergency-blinking-pill">
              <span className="siren-pulse-dot"></span>
              {t.emergencySosBtn}
            </span>
            <h2 className="emergency-headline">{t.emergencySosTitle}</h2>
            <p className="emergency-subline">{t.emergencySosSubtitle}</p>
          </div>
          <button className="modal-close-btn emergency-close" onClick={onClose} aria-label="Close Emergency Window">
            &times;
          </button>
        </div>

        {/* 3D WebGL Ambulance Scene */}
        <div className="emergency-3d-wrapper">
          <ThreeAmbulanceTracker isDispatched={isDispatched} etaSeconds={etaSeconds} />
        </div>

        {/* Real-time Dispatch Telemetry Banner */}
        <div className="dispatch-telemetry-grid">
          <div className="telemetry-box eta-box">
            <span className="telemetry-lbl">{t.liveEta}</span>
            <span className="telemetry-val eta-countdown">{formatEta(etaSeconds)}</span>
            <span className="telemetry-sub">Unit ALS-04 (Advanced Life Support)</span>
          </div>

          <div className="telemetry-box">
            <span className="telemetry-lbl">Hospital Destination</span>
            <span className="telemetry-val text-green">Trauma Bay #01</span>
            <span className="telemetry-sub">Emergency Team Notified &amp; Prepped</span>
          </div>

          <div className="telemetry-box">
            <span className="telemetry-lbl">Traffic Clearance</span>
            <span className="telemetry-val text-blue">Green Corridor</span>
            <span className="telemetry-sub">Signal Override Active</span>
          </div>
        </div>

        {/* Emergency Triage Selector */}
        <div className="emergency-triage-section">
          <span className="triage-section-lbl">Select Condition for Immediate Doctor Alert:</span>
          <div className="emergency-triage-chips">
            {[
              { id: 'chest-pain', label: '❤️ Severe Chest Pain / Heart Attack' },
              { id: 'breathing', label: '🫁 Breathing Distress' },
              { id: 'trauma', label: '🩸 Road Trauma / Bleeding' },
              { id: 'stroke', label: '🧠 Stroke / Unconscious' }
            ].map((c) => (
              <button
                key={c.id}
                type="button"
                className={`emergency-chip ${selectedTriage === c.id ? 'active' : ''}`}
                onClick={() => setSelectedTriage(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Controls & Emergency Calls */}
        <div className="emergency-actions-row">
          <a href="tel:108" className="btn-emergency-action call-108">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>{t.call108}</span>
          </a>

          <a href="tel:08044229900" className="btn-emergency-action call-er">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>{t.callErDesk}</span>
          </a>

          <button
            type="button"
            className={`btn-siren-toggle ${isSirenPlaying ? 'active' : ''}`}
            onClick={toggleSirenAudio}
            title="Toggle Web Audio Emergency Siren"
          >
            <span>{isSirenPlaying ? '🔊 Siren: ON' : '🔈 Siren: OFF'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
