import React, { useState, useEffect } from 'react';
import ThreeHeroScene from './components/ThreeHeroScene.jsx';
import ThreeCoreFunctionHolo from './components/ThreeCoreFunctionHolo.jsx';
import ThreeTokenCard from './components/ThreeTokenCard.jsx';
import ThreeUncertaintyCube from './components/ThreeUncertaintyCube.jsx';
import FastBookingModal from './components/FastBookingModal.jsx';
import DesignThinkingCanvasModal from './components/DesignThinkingCanvasModal.jsx';

// Fallback doctors in case server is not running
const initialDoctors = [
  {
    id: 'doc-1',
    name: 'Dr. Ananya Sharma, MD, DM',
    specialty: 'Cardiology',
    title: 'Senior Cardiologist & Interventional Specialist',
    experience: '14 Yrs Exp',
    languages: 'English, Hindi, Kannada',
    rating: 4.9,
    reviews: 420,
    fee: '₹800 ($10)',
    cabin: 'Room 204 (2nd Floor)',
    cabinNum: '204',
    initials: 'DA',
    colorTheme: 'blue',
    queueLength: 4,
    avgWaitMins: 12,
    slots: [
      { id: 's1', time: '10:30 AM', status: 'fast', label: 'Next Available' },
      { id: 's2', time: '11:15 AM', status: 'available', label: 'Available' },
      { id: 's3', time: '12:00 PM', status: 'available', label: 'Available' },
      { id: 's4', time: '02:30 PM', status: 'limited', label: 'Only 1 Left' },
      { id: 's5', time: '03:45 PM', status: 'available', label: 'Available' },
      { id: 's6', time: '05:00 PM', status: 'booked', label: 'Booked' }
    ]
  },
  {
    id: 'doc-2',
    name: 'Dr. Rajesh Varma, MD (Pediatrics)',
    specialty: 'Pediatrics',
    title: 'Senior Child Specialist & Neonatologist',
    experience: '11 Yrs Exp',
    languages: 'English, Hindi, Telugu',
    rating: 4.9,
    reviews: 310,
    fee: '₹700 ($9)',
    cabin: 'Room 108 (Ground Floor)',
    cabinNum: '108',
    initials: 'RV',
    colorTheme: 'teal',
    queueLength: 2,
    avgWaitMins: 8,
    slots: [
      { id: 's7', time: '11:00 AM', status: 'fast', label: 'Next Available' },
      { id: 's8', time: '11:45 AM', status: 'available', label: 'Available' },
      { id: 's9', time: '01:15 PM', status: 'available', label: 'Available' },
      { id: 's10', time: '04:30 PM', status: 'available', label: 'Available' }
    ]
  },
  {
    id: 'doc-3',
    name: 'Dr. Meera Kulkarni, MS (Ortho)',
    specialty: 'Orthopedics',
    title: 'Spine & Knee Specialist • Arthroscopy Expert',
    experience: '16 Yrs Exp',
    languages: 'English, Hindi, Marathi',
    rating: 4.8,
    reviews: 580,
    fee: '₹900 ($11)',
    cabin: 'Room 312 (3rd Floor)',
    cabinNum: '312',
    initials: 'MK',
    colorTheme: 'purple',
    queueLength: 5,
    avgWaitMins: 18,
    slots: [
      { id: 's11', time: '01:00 PM', status: 'fast', label: 'Next Available' },
      { id: 's12', time: '02:15 PM', status: 'available', label: 'Available' },
      { id: 's13', time: '04:00 PM', status: 'available', label: 'Available' },
      { id: 's14', time: '05:30 PM', status: 'available', label: 'Available' }
    ]
  },
  {
    id: 'doc-4',
    name: 'Dr. Rohan Deshmukh, MD, DM',
    specialty: 'Neurology',
    title: 'Neuro Physician & Stroke Specialist',
    experience: '13 Yrs Exp',
    languages: 'English, Hindi',
    rating: 4.9,
    reviews: 290,
    fee: '₹1000 ($12)',
    cabin: 'Room 401 (4th Floor)',
    cabinNum: '401',
    initials: 'RD',
    colorTheme: 'amber',
    queueLength: 3,
    avgWaitMins: 15,
    slots: [
      { id: 's15', time: '11:30 AM', status: 'fast', label: 'Next Available' },
      { id: 's16', time: '03:00 PM', status: 'available', label: 'Available' },
      { id: 's17', time: '04:45 PM', status: 'available', label: 'Available' }
    ]
  },
  {
    id: 'doc-5',
    name: 'Dr. Priya Nambiar, MD (Dermatology)',
    specialty: 'Dermatology',
    title: 'Cosmetic Dermatologist & Trichologist',
    experience: '9 Yrs Exp',
    languages: 'English, Malayalam, Hindi',
    rating: 4.7,
    reviews: 350,
    fee: '₹750 ($9)',
    cabin: 'Room 215 (2nd Floor)',
    cabinNum: '215',
    initials: 'PN',
    colorTheme: 'teal',
    queueLength: 1,
    avgWaitMins: 5,
    slots: [
      { id: 's18', time: '10:00 AM', status: 'fast', label: 'Next Available' },
      { id: 's19', time: '12:30 PM', status: 'available', label: 'Available' },
      { id: 's20', time: '03:15 PM', status: 'available', label: 'Available' }
    ]
  }
];

export default function App() {
  const [doctors, setDoctors] = useState(initialDoctors);
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [show3DHero, setShow3DHero] = useState(true);
  const [showDtCanvas, setShowDtCanvas] = useState(false);
  const [telemetry, setTelemetry] = useState(null);

  // Active slot selection state per doctor: { [doctorId]: slotObject }
  const [selectedSlots, setSelectedSlots] = useState({});

  // Active booking dialog target: { doctor, slot }
  const [bookingTarget, setBookingTarget] = useState(null);

  // Success confirmation modal payload
  const [bookingConfirmation, setBookingConfirmation] = useState(null);

  // Fetch doctors and telemetry from Node.js backend
  useEffect(() => {
    fetch('/api/doctors')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) setDoctors(data.data);
      })
      .catch(() => console.log('Operating in standalone React client mode.'));

    fetch('/api/telemetry')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) setTelemetry(data.data);
      })
      .catch(() => {});
  }, []);

  // Filter doctors
  const filteredDoctors = doctors.filter(doc => {
    const matchesDept = selectedSpecialty === 'all' || doc.specialty.toLowerCase() === selectedSpecialty.toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query ||
      doc.name.toLowerCase().includes(query) ||
      doc.specialty.toLowerCase().includes(query) ||
      doc.title.toLowerCase().includes(query);
    return matchesDept && matchesSearch;
  });

  const handleSelectSlot = (doctorId, slot) => {
    if (slot.status === 'booked') return;
    setSelectedSlots(prev => ({
      ...prev,
      [doctorId]: slot
    }));
  };

  const handleOpenBooking = (doctor) => {
    const slot = selectedSlots[doctor.id];
    if (!slot) return;
    setBookingTarget({ doctor, slot });
  };

  const handleBookingSuccess = (confirmationData) => {
    setBookingTarget(null);
    setBookingConfirmation(confirmationData);
  };

  return (
    <div className={`app-root ${showAnnotations ? '' : 'hide-dt-annotations'}`}>
      
      {/* ========================================================
           1. TOP DESIGN THINKING CONTROLLER BAR
           ======================================================== */}
      <aside className="dt-controller-bar" id="dtControllerBar">
        <div className="dt-bar-container">
          <div className="dt-badge-group">
            <span className="dt-pill dt-pill-primary">Design Thinking Sprint</span>
            <span className="dt-pill dt-pill-neutral">3D Interactive Prototype</span>
          </div>

          <div className="dt-controls">
            <label className="dt-toggle-label" htmlFor="reactDtAnnotationToggle">
              <span className="toggle-text">Show DT Annotations (Circled &amp; Labelled)</span>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  id="reactDtAnnotationToggle"
                  checked={showAnnotations}
                  onChange={(e) => setShowAnnotations(e.target.checked)}
                />
                <span className="slider"></span>
              </div>
            </label>

            <button
              className="dt-inspect-btn secondary"
              onClick={() => setShow3DHero(!show3DHero)}
            >
              {show3DHero ? '🌐 3D Campus: ON' : '🌐 3D Campus: OFF'}
            </button>

            <button
              className="dt-inspect-btn"
              onClick={() => setShowDtCanvas(true)}
            >
              📋 View Design Thinking Canvas
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================
           2. KNOWING UNCERTAINTY 3D MATRIX (REQUIREMENT 3)
           ======================================================== */}
      {showAnnotations && (
        <section className="dt-uncertainty-3d-wrapper" id="uncertaintyBanner">
          <div className="container">
            <ThreeUncertaintyCube telemetry={telemetry} />
          </div>
        </section>
      )}

      {/* ========================================================
           3. SITE HEADER
           ======================================================== */}
      <header className="site-header">
        <div className="container header-inner">
          <div className="brand">
            <div className="brand-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                <path d="M12 7v6"/>
                <path d="M9 10h6"/>
              </svg>
            </div>
            <div className="brand-text">
              <span className="brand-title">CarePulse</span>
              <span className="brand-subtitle">Memorial Super-Speciality Hospital</span>
            </div>
          </div>

          <nav className="nav-links">
            <a href="#departments" className="nav-link active">Find Doctor</a>
            <a href="#live-queue" className="nav-link">Live OPD Queue</a>
            <a href="#emergency" className="nav-link emergency-link">
              <span className="pulse-dot"></span> Emergency: 108 / (080) 4422-9900
            </a>
          </nav>
        </div>
      </header>

      {/* ========================================================
           4. HERO & 3D WEBGL CAMPUS SCENE
           ======================================================== */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-text">
            <div className="hero-pill">⚡ 3D Interactive Fast-Track OPD Appointments</div>
            <h1 className="hero-title">Book Verified Doctor Slots in Under 30 Seconds</h1>
            <p className="hero-subtitle">
              No 20-minute phone queues. No complex 5-page insurance forms. Select your symptom or department, tap an available slot, and walk straight into your consultation.
            </p>
          </div>

          {/* 3D WebGL Canvas Scene */}
          {show3DHero && (
            <ThreeHeroScene
              selectedSpecialty={selectedSpecialty}
              onSelectSpecialty={(dept) => setSelectedSpecialty(dept)}
            />
          )}

          {/* USER INTERACTION POINT A: QUICK SEARCH & SYMPTOM TRIAGE */}
          <div className="triage-search-card" id="interactionPointSearch">
            <div className="dt-touchpoint-marker" data-requirement="user-touchpoint">
              <span className="marker-badge">👉 Touchpoint A: Symptom / Specialty Triage</span>
            </div>

            <div className="search-input-wrap">
              <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                id="doctorSearchInput"
                placeholder="Search by doctor name, symptom (e.g. chest pain, knee ache, fever)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                  style={{ display: 'block' }}
                >
                  &times;
                </button>
              )}
            </div>

            <div className="symptom-chips-row">
              <span className="chips-label">Quick Triage:</span>
              {[
                { id: 'all', label: 'All Specialties' },
                { id: 'Cardiology', label: '❤️ Heart / Chest' },
                { id: 'Orthopedics', label: '🦴 Joint / Bone' },
                { id: 'Pediatrics', label: '👶 Child / Pediatric' },
                { id: 'Neurology', label: '🧠 Neuro / Stroke' },
                { id: 'Dermatology', label: '🌿 Skin / Allergy' }
              ].map(item => (
                <button
                  key={item.id}
                  className={`symptom-chip ${selectedSpecialty.toLowerCase() === item.id.toLowerCase() ? 'active' : ''}`}
                  onClick={() => setSelectedSpecialty(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
           5. MAIN DOCTOR SCHEDULING INTERFACE
           ======================================================== */}
      <main className="main-content container" id="departments">
        <div className="section-header">
          <div>
            <h2 className="section-title">Available Doctors &amp; Today&apos;s Real-Time Slots</h2>
            <p className="section-desc">Showing verified available slots with live queue estimates for today</p>
          </div>
          <div className="filter-summary">
            <span>Showing {filteredDoctors.length} Specialist{filteredDoctors.length === 1 ? '' : 's'}</span>
          </div>
        </div>

        <div className="doctors-grid">
          {filteredDoctors.map((doc, idx) => {
            const isPrimaryTarget = doc.id === 'doc-1';
            const selectedSlot = selectedSlots[doc.id];

            return (
              <article
                key={doc.id}
                className={`doctor-card ${isPrimaryTarget ? 'primary-prototype-card' : ''}`}
                data-doctor-id={doc.id}
              >
                {/* DOCTOR PROFILE */}
                <div className="doctor-profile">
                  <div className="avatar-wrap">
                    <div className={`avatar-fallback fallback-${doc.colorTheme}`}>
                      {doc.initials}
                    </div>
                    <div className="status-indicator online" title={`On Duty in ${doc.cabin}`}></div>
                  </div>
                  <div className="doctor-details">
                    <div className={`specialty-tag tag-${doc.colorTheme}`}>{doc.specialty}</div>
                    <h3 className="doctor-name">{doc.name}</h3>
                    <p className="doctor-meta">{doc.title} • {doc.experience} • {doc.languages}</p>
                    <div className="doctor-stats">
                      <span className="stat-badge rating">★ {doc.rating} ({doc.reviews}+ reviews)</span>
                      <span className="stat-badge fee">Fee: {doc.fee}</span>
                      <span className="stat-badge cabin">Cabin: {doc.cabin}</span>
                    </div>
                  </div>
                </div>

                {/* ========================================================
                     REQUIREMENT 2: CORE FUNCTION (CIRCLED & LABELLED)
                     With 3D WebGL Holographic Reticle Ring
                     ======================================================== */}
                <div
                  className={`core-function-container ${isPrimaryTarget ? 'is-circled' : ''}`}
                  id={isPrimaryTarget ? 'coreFunctionElement' : undefined}
                >
                  {/* 3D WebGL Holographic Reticle for Core Function */}
                  {isPrimaryTarget && showAnnotations && (
                    <ThreeCoreFunctionHolo isActive={showAnnotations} />
                  )}

                  {/* ANNOTATION BADGE & ARROW */}
                  {isPrimaryTarget && showAnnotations && (
                    <div className="dt-annotation-callout">
                      <div className="callout-badge">
                        <span className="callout-icon">🎯</span>
                        <div className="callout-text">
                          <strong className="callout-title">CORE FUNCTION (CIRCLED &amp; LABELLED)</strong>
                          <p className="callout-desc">
                            <strong>1-Click Instant Slot-Lock &amp; Live OPD Queue:</strong> Directly eliminates the patient&apos;s primary difficulty (15-min phone queue &amp; 5-page form fatigue) by allowing instant reservation in one tap.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="core-function-body">
                    {/* Live queue status */}
                    <div className="live-status-bar">
                      <div className="live-pulse-indicator">
                        <span className="pulse-ring"></span>
                        <strong>Live OPD Queue:</strong> {doc.queueLength} patients ahead in {doc.cabin.split('(')[0]}
                      </div>
                      <div className="wait-time-tag">⚡ Avg wait: ~{doc.avgWaitMins} mins</div>
                    </div>

                    {/* ========================================================
                         REQUIREMENT 1: USER INTERACTION POINT (TOUCH CHIPS)
                         ======================================================== */}
                    <div
                      className="interaction-point-wrapper"
                      id={isPrimaryTarget ? 'interactionPointSlots' : undefined}
                    >
                      {isPrimaryTarget && showAnnotations && (
                        <div className="dt-touchpoint-marker slot-marker" data-requirement="user-touchpoint">
                          <span className="marker-badge">👉 Touchpoint B: Interactive Slot Touch-Chips (&ge;52px Targets)</span>
                        </div>
                      )}

                      <div className="slot-picker-header">
                        <span className="slot-picker-label">Select Slot for Consultation:</span>
                        <span className="slot-guarantee">✓ Guaranteed Doctor Seat</span>
                      </div>

                      {/* 3D TACTILE SLOTS GRID */}
                      <div className="slots-chips-grid">
                        {doc.slots.map(s => {
                          const isSelected = selectedSlot && selectedSlot.id === s.id;
                          const isBooked = s.status === 'booked';

                          return (
                            <button
                              key={s.id}
                              type="button"
                              className={`slot-chip tactile-3d ${isSelected ? 'selected' : ''} ${isBooked ? 'is-disabled' : ''}`}
                              disabled={isBooked}
                              onClick={() => handleSelectSlot(doc.id, s)}
                            >
                              <span className="slot-time">{s.time}</span>
                              <span className={`slot-badge ${s.status}`}>{s.label}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* ACTION ROW */}
                      <div className="instant-action-row">
                        <div className={`selected-slot-feedback ${selectedSlot ? 'has-selection' : ''}`}>
                          {selectedSlot
                            ? `Selected: ${selectedSlot.time} with ${doc.name} (${doc.cabin})`
                            : 'Tap any slot chip above to reserve instantly'}
                        </div>
                        <button
                          type="button"
                          className="btn-book-instant"
                          disabled={!selectedSlot}
                          onClick={() => handleOpenBooking(doc)}
                        >
                          <span>Lock Appointment</span>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                          </svg>
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </main>

      {/* ========================================================
           6. FAST 30-SECOND BOOKING MODAL
           ======================================================== */}
      {bookingTarget && (
        <FastBookingModal
          doctor={bookingTarget.doctor}
          slot={bookingTarget.slot}
          onClose={() => setBookingTarget(null)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {/* ========================================================
           7. 3D HOLOGRAPHIC TOKEN SUCCESS MODAL
           ======================================================== */}
      {bookingConfirmation && (
        <div className="modal-overlay is-active" role="dialog" aria-modal="true">
          <div className="modal-window token-window">
            <button
              className="modal-close-btn"
              onClick={() => setBookingConfirmation(null)}
            >
              &times;
            </button>

            <div className="token-card">
              <div className="token-card-header">
                <div className="success-icon-wrap">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h3 className="token-title">Appointment Confirmed!</h3>
                <p className="token-subtitle">Directly synchronized to the doctor&apos;s OPD console.</p>
              </div>

              {/* 3D Interactive Holographic Token Card */}
              <ThreeTokenCard confirmation={bookingConfirmation} />

              {/* Simulated SMS Alert */}
              <div className="token-sms-preview">
                <div className="sms-preview-header">📱 Simulated SMS Sent to Patient:</div>
                <p className="sms-preview-text">{bookingConfirmation.simulatedSms}</p>
              </div>

              <div className="token-actions">
                <button
                  className="btn-primary-action"
                  onClick={() => setBookingConfirmation(null)}
                >
                  Book Another Appointment
                </button>
                <button
                  className="btn-secondary-action"
                  onClick={() => {
                    setBookingConfirmation(null);
                    setShowDtCanvas(true);
                  }}
                >
                  View Design Thinking Analysis
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
           8. DESIGN THINKING CANVAS DRAWER
           ======================================================== */}
      <DesignThinkingCanvasModal
        isOpen={showDtCanvas}
        onClose={() => setShowDtCanvas(false)}
      />

    </div>
  );
}
