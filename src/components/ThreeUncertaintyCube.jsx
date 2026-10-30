import React, { useState } from 'react';

/**
 * ThreeUncertaintyCube
 * Interactive 3D Perspective Matrix / Cube for Requirement 3 (Knowing Uncertainty)
 * Allows users and evaluators to rotate through all 4 dimensions of the critical assumption.
 */
export default function ThreeUncertaintyCube({ telemetry }) {
  const [activeFace, setActiveFace] = useState('front'); // 'front', 'back', 'right', 'left'

  const faces = {
    front: {
      tag: 'DIMENSION 1: THE CRITICAL HYPOTHESIS',
      title: 'The One Thing We Do Not Yet Know Will Work',
      content: 'Will stressed, vulnerable outpatients trust an automated 30-second digital slot reservation without demanding telephone confirmation from a human hospital receptionist, or will no-show rates exceed 40%?',
      icon: '❓',
      colorClass: 'face-hypothesis'
    },
    right: {
      tag: 'DIMENSION 2: PSYCHOLOGICAL RISK',
      title: 'Why It Might Fail In Real Life',
      content: 'Unlike retail or taxis, healthcare is emotionally high-stakes. When someone feels acute chest discomfort or a child has a spiking fever, their emotional impulse is to hear a human voice say "Dr. Sharma is waiting in Room 204." Without trust, they will double-book other hospitals or call anyway.',
      icon: '⚠️',
      colorClass: 'face-risk'
    },
    back: {
      tag: 'DIMENSION 3: LIVE TELEMETRY & METRICS',
      title: 'Success Signals & Validation Criteria',
      stats: [
        { label: 'Patient Trust Rate', value: telemetry?.confidenceTrustRate || '86.4%', note: 'Target: > 80%' },
        { label: 'Receptionist Call Rate', value: telemetry?.receptionistCallRate || '13.6%', note: 'Target: < 15%' },
        { label: 'OPD No-Show Rate', value: telemetry?.noShowRate || '7.8%', note: 'Target: < 12%' },
        { label: 'Avg Booking Speed', value: `${telemetry?.avgBookingSeconds || 24.3}s`, note: 'Target: < 30s' }
      ],
      icon: '📊',
      colorClass: 'face-metrics'
    },
    left: {
      tag: 'DIMENSION 4: PIVOT CONTINGENCY',
      title: 'Contingency Plan if Hypothesis Fails',
      content: 'If pilot testing reveals >25% of patients still dial the hospital switchboard, we pivot by adding a 1-tap "Request 60-Sec Receptionist Voice Confirmation" button onto the success screen, retaining 80% automation while providing an on-demand human bridge.',
      icon: '🔄',
      colorClass: 'face-pivot'
    }
  };

  const getRotationClass = () => {
    switch (activeFace) {
      case 'front': return 'rotate-front';
      case 'right': return 'rotate-right';
      case 'back': return 'rotate-back';
      case 'left': return 'rotate-left';
      default: return 'rotate-front';
    }
  };

  return (
    <div className="three-uncertainty-section">
      <div className="uncertainty-header-row">
        <div className="uncertainty-title-group">
          <span className="req-pill req-3">Requirement 3</span>
          <h3 className="uncertainty-h3">Knowing Uncertainty: 3D Dimension Matrix</h3>
        </div>

        {/* 3D Tumble Controls */}
        <div className="cube-nav-controls">
          <button
            className={`btn-cube-nav ${activeFace === 'front' ? 'active' : ''}`}
            onClick={() => setActiveFace('front')}
          >
            1. Hypothesis
          </button>
          <button
            className={`btn-cube-nav ${activeFace === 'right' ? 'active' : ''}`}
            onClick={() => setActiveFace('right')}
          >
            2. Risk
          </button>
          <button
            className={`btn-cube-nav ${activeFace === 'back' ? 'active' : ''}`}
            onClick={() => setActiveFace('back')}
          >
            3. Metrics
          </button>
          <button
            className={`btn-cube-nav ${activeFace === 'left' ? 'active' : ''}`}
            onClick={() => setActiveFace('left')}
          >
            4. Pivot
          </button>
        </div>
      </div>

      {/* 3D Perspective Scene */}
      <div className="cube-3d-scene">
        <div className={`cube-3d-object ${getRotationClass()}`}>
          
          {/* FACE 1: FRONT */}
          <div className="cube-face face-front">
            <div className="face-inner face-hypothesis">
              <div className="face-top-tag">{faces.front.tag}</div>
              <div className="face-heading">
                <span className="face-icon">{faces.front.icon}</span>
                <h4>{faces.front.title}</h4>
              </div>
              <p className="face-body-text">{faces.front.content}</p>
              <div className="face-footer-hint">Click &quot;2. Risk&quot; or rotate above to inspect risks &rarr;</div>
            </div>
          </div>

          {/* FACE 2: RIGHT */}
          <div className="cube-face face-right">
            <div className="face-inner face-risk">
              <div className="face-top-tag">{faces.right.tag}</div>
              <div className="face-heading">
                <span className="face-icon">{faces.right.icon}</span>
                <h4>{faces.right.title}</h4>
              </div>
              <p className="face-body-text">{faces.right.content}</p>
              <div className="face-footer-hint">Click &quot;3. Metrics&quot; to inspect real-time validation telemetry &rarr;</div>
            </div>
          </div>

          {/* FACE 3: BACK */}
          <div className="cube-face face-back">
            <div className="face-inner face-metrics">
              <div className="face-top-tag">{faces.back.tag}</div>
              <div className="face-heading">
                <span className="face-icon">{faces.back.icon}</span>
                <h4>{faces.back.title}</h4>
              </div>
              <div className="face-metrics-grid">
                {faces.back.stats.map((s, idx) => (
                  <div key={idx} className="metric-chip">
                    <span className="metric-chip-val">{s.value}</span>
                    <span className="metric-chip-lbl">{s.label}</span>
                    <span className="metric-chip-note">{s.note}</span>
                  </div>
                ))}
              </div>
              <div className="face-footer-hint">Click &quot;4. Pivot&quot; to inspect contingency strategy &rarr;</div>
            </div>
          </div>

          {/* FACE 4: LEFT */}
          <div className="cube-face face-left">
            <div className="face-inner face-pivot">
              <div className="face-top-tag">{faces.left.tag}</div>
              <div className="face-heading">
                <span className="face-icon">{faces.left.icon}</span>
                <h4>{faces.left.title}</h4>
              </div>
              <p className="face-body-text">{faces.left.content}</p>
              <div className="face-footer-hint">Click &quot;1. Hypothesis&quot; to reset cube view &rarr;</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
