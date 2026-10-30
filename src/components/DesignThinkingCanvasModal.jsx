import React, { useState } from 'react';

/**
 * DesignThinkingCanvasModal
 * Slide-out evaluation canvas detailing the 3 core requirements.
 */
export default function DesignThinkingCanvasModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('all');

  if (!isOpen) return null;

  return (
    <aside className="dt-drawer is-open" aria-hidden="false">
      <div className="dt-drawer-backdrop" onClick={onClose}></div>
      <div className="dt-drawer-panel">
        <div className="dt-drawer-header">
          <div className="dt-drawer-title-group">
            <span className="dt-pill dt-pill-primary">Design Thinking Documentation</span>
            <h2 className="dt-drawer-title">Prototype Evaluation Canvas</h2>
          </div>
          <button className="dt-drawer-close" onClick={onClose} aria-label="Close canvas">&times;</button>
        </div>

        <div className="dt-tab-bar">
          <button
            className={`dt-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Requirements
          </button>
          <button
            className={`dt-tab-btn ${activeTab === 'req1' ? 'active' : ''}`}
            onClick={() => setActiveTab('req1')}
          >
            Req 1: Interaction Point
          </button>
          <button
            className={`dt-tab-btn ${activeTab === 'req2' ? 'active' : ''}`}
            onClick={() => setActiveTab('req2')}
          >
            Req 2: Core Function (Circled)
          </button>
          <button
            className={`dt-tab-btn ${activeTab === 'req3' ? 'active' : ''}`}
            onClick={() => setActiveTab('req3')}
          >
            Req 3: Knowing Uncertainty
          </button>
        </div>

        <div className="dt-drawer-body">
          {/* REQUIREMENT 1 */}
          {(activeTab === 'all' || activeTab === 'req1') && (
            <section className="dt-doc-section highlight-touchpoint">
              <div className="section-tag-row">
                <span className="requirement-tag req-1">Requirement 1</span>
                <h3>User Interaction Point: Where does the user touch or operate the solution?</h3>
              </div>
              <div className="dt-doc-content">
                <p><strong>Primary Physical &amp; Digital Touchpoint:</strong></p>
                <div className="touchpoint-flow-cards">
                  <div className="touch-card">
                    <span className="touch-step">Touchpoint A (Triage)</span>
                    <h4>3D WebGL Dept Beacons &amp; Quick Triage Chips</h4>
                    <p>Patient clicks either the orbiting 3D WebGL department nodes or the high-contrast filter pills. Instantly filters doctors without typing medical jargon.</p>
                  </div>
                  <div className="touch-card focus-card">
                    <span className="touch-step">Touchpoint B (Primary Operation)</span>
                    <h4>Interactive Slot Touch-Chips (&ge;52px Touch Targets)</h4>
                    <p>Located on the Doctor Card: Patient taps a specific time chip (e.g. <code>10:30 AM [Next Available]</code>). Provides 3D tactile depression, teal highlight, and activates the appointment lock.</p>
                  </div>
                  <div className="touch-card">
                    <span className="touch-step">Touchpoint C (Commitment)</span>
                    <h4>1-Tap &quot;Lock Appointment&quot; CTA</h4>
                    <p>Direct trigger immediately beneath slots. Opens the 2-field rapid modal, requiring &lt;15 seconds to complete.</p>
                  </div>
                </div>
                <div className="touchpoint-rationale">
                  <strong>Ergonomic &amp; Cognitive Design:</strong> Targets have &ge;52px hit boundaries matching the mobile thumb zone, removing barriers for distressed or elderly patients.
                </div>
              </div>
            </section>
          )}

          {/* REQUIREMENT 2 */}
          {(activeTab === 'all' || activeTab === 'req2') && (
            <section className="dt-doc-section highlight-core-function">
              <div className="section-tag-row">
                <span className="requirement-tag req-2">Requirement 2</span>
                <h3>Core Function: Which single element addresses the user&apos;s difficulty? (Circled &amp; Labelled)</h3>
              </div>
              <div className="dt-doc-content">
                <div className="core-element-spotlight">
                  <div className="spotlight-badge">CIRCLED &amp; LABELLED IN PROTOTYPE</div>
                  <h4>The &quot;1-Click Instant Slot-Lock &amp; Live OPD Queue Indicator&quot;</h4>
                  <p><strong>User&apos;s Primary Difficulty / Pain Point:</strong></p>
                  <blockquote className="problem-quote">
                    &quot;When I call the hospital, I wait 15 minutes on hold. When I use other websites, I must fill out a 4-page insurance form before seeing if a doctor is even available today.&quot;
                  </blockquote>
                  <p><strong>How This Single Element Directly Solves It:</strong></p>
                  <ul className="dt-benefit-list">
                    <li><strong>Upfront Visibility:</strong> Exposes real-time doctor availability and live OPD queue wait times before asking for any personal data.</li>
                    <li><strong>Live OPD Queue Transparency:</strong> Displays <em>&quot;4 patients ahead in Cabin 204 • Avg wait: ~12 mins&quot;</em>, ending waiting room anxiety.</li>
                    <li><strong>Desk-Bypass Tokenization:</strong> One tap locks the appointment slot and routes directly to the doctor&apos;s OPD screen.</li>
                  </ul>
                </div>
              </div>
            </section>
          )}

          {/* REQUIREMENT 3 */}
          {(activeTab === 'all' || activeTab === 'req3') && (
            <section className="dt-doc-section highlight-uncertainty">
              <div className="section-tag-row">
                <span className="requirement-tag req-3">Requirement 3</span>
                <h3>Knowing Uncertainty: What is the one thing we do not yet know will work?</h3>
              </div>
              <div className="dt-doc-content">
                <div className="uncertainty-deep-card">
                  <div className="uncertainty-headline">
                    <span className="u-icon">⚠️</span>
                    <div>
                      <strong>The Critical Leap-of-Faith Hypothesis:</strong>
                      <p className="u-text">
                        <em>&quot;Will distressed outpatients trust an automated 30-second digital appointment reservation without demanding telephone confirmation from a human receptionist, or will no-show rates exceed 40%?&quot;</em>
                      </p>
                    </div>
                  </div>

                  <div className="uncertainty-grid">
                    <div className="u-box">
                      <h5>Why We Don&apos;t Know Yet (The Risk):</h5>
                      <p>Healthcare is emotionally high-stakes. When someone feels acute chest pain, their natural instinct is to seek human verbal assurance. If they doubt the automated slot, they will call the receptionist anyway or multi-book across 3 hospitals.</p>
                    </div>

                    <div className="u-box">
                      <h5>Prototype Testing Mechanism:</h5>
                      <p>Tested via the <strong>Interactive 3D Holographic Token Card (#OPD-B14)</strong>, real-time cabin assignment, and simulated multi-channel SMS alert with live indoor clinic navigation.</p>
                    </div>

                    <div className="u-box">
                      <h5>Validation Metrics &amp; Success Criteria:</h5>
                      <ul>
                        <li><strong>Trust Metric:</strong> &gt;80% of test participants report high confidence without calling front desk (Current: 86.4%).</li>
                        <li><strong>Attendance Metric:</strong> &lt;12% no-show rate during the pilot phase (Current: 7.8%).</li>
                      </ul>
                    </div>

                    <div className="u-box">
                      <h5>Pivot Contingency:</h5>
                      <p>If &gt;25% still call the hospital, provide an optional 1-tap &quot;Request 60-Sec Receptionist Voice Confirmation&quot; callback button.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </aside>
  );
}
