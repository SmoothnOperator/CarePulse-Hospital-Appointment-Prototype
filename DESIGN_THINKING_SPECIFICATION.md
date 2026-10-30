# Design Thinking Project: Hospital Appointment Booking Prototype
**Project Name:** CarePulse Express OPD Scheduler  
**Methodology:** Design Thinking (Empathize, Define, Ideate, Prototype, Test)  
**Target User:** Distressed / Time-Constrained Outpatients & Caregivers  

---

## Executive Summary of the 3 Key Prototype Inquiries

| Design Thinking Inquiry | Specific Solution in Prototype | Location & Implementation |
| :--- | :--- | :--- |
| **1. User Interaction Point** | **Interactive Slot Touch-Chips & 1-Tap Lock Button** | Located inside the Doctor Card (`.interaction-point-wrapper`, highlighted with teal dashed boundary). Ergonomic &ge;48px touch targets for 1-hand mobile operation. |
| **2. Core Function** *(Circled & Labelled)* | **Instant Slot-Lock with Live OPD Queue Wait-Time Indicator** | Circled with a bold red bounding box (`border: 3px solid #ef4444`) and labelled with a floating badge: `🎯 CORE FUNCTION: Instant Slot Lock & Live OPD Queue`. |
| **3. Knowing Uncertainty** | **Patient Trust & No-Show Risk on Zero-Prepayment Digital Booking** | Banner at the top of the prototype and verified via instant Digital Token (`#OPD-B14`) and SMS reassurance simulation. |

---

## Requirement 1: User Interaction Point
> *Where does the user touch or operate the solution?*

### 1. The Physical & Digital Touchpoint Architecture
In traditional hospital booking portals, users are forced to touch 15+ disparate form fields across multiple pages before even discovering if a doctor is available. In this prototype, the interaction point is radically condensed into a **single, unified ergonomic touch-matrix**:

1. **Touchpoint A — Quick Triage Symptom Chips (Macro-Filter):**
   - **Location:** Directly beneath the search bar on the Hero section (`#symptomChipsRow`).
   - **Interaction:** The user taps one of five high-contrast specialty pills (e.g., `❤️ Heart / Chest`, `🦴 Joint / Bone Pain`, `👶 Child / Pediatric`).
   - **Feedback:** Instantly filters doctor cards within 0ms without page reloads or dropdown scrolling.

2. **Touchpoint B — Interactive Slot Chips (Primary Operation Point):**
   - **Location:** Inside the Doctor Card under the heading *"Select Slot for Consultation"*.
   - **Interaction:** The user physically touches or clicks a time chip (e.g., `10:30 AM [Next Available]`).
   - **Ergonomics:** Every chip has a minimum touch target height of **52px** and min-width of **130px**, satisfying WCAG 2.1 AAA touch target guidelines for mobile thumb-zone operation. This accommodates elderly patients, trembling hands, or stressed parents holding a sick infant.
   - **Visual Feedback:** 
     - Active state turns vibrant hospital teal (`#0D9488`) with white text and a soft elevation shadow.
     - Live text feedback updates immediately: *"Selected: 10:30 AM with Dr. Ananya Sharma (Room 204)"*.
     - The disabled "Lock Appointment" CTA button is instantaneously activated and pulses.

3. **Touchpoint C — The 1-Tap "Lock Appointment" Action Button:**
   - **Location:** Directly aligned with the slot grid.
   - **Interaction:** User taps `[Lock Appointment ->]`, bringing up the frictionless 2-field confirmation drawer requiring only **Patient Name** and **Mobile Number**.

---

## Requirement 2: Core Function (Circled and Labelled)
> *Which single element addresses the user's difficulty? Circled and labelled?*

### 1. The Core User Difficulty (The Pain Point)
Through patient empathy mapping and hospital receptionist interviews, the single greatest friction point in outpatient care is:
> **"Information Asymmetry & Time Sunk in Opaque Queues"**  
> *Patients wait 15–20 minutes on hold over the phone or fill out tedious multi-step web forms requiring insurance policy numbers, only to arrive at the hospital and discover the doctor has an unannounced 2-hour surgery delay or the queue is 20 people deep.*

### 2. The Single Element Addressing This Difficulty
The element is the **"Instant Slot-Lock with Live OPD Queue Wait-Time Indicator"** (`#coreFunctionElement`).

### 3. Visual Visualizer: Circled and Labelled
In the interactive prototype (`index.html`), this element is explicitly styled with:
- **Circled:** A distinct, pulsing crimson ring (`border: 3px solid #EF4444`, `box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.2)`).
- **Labelled:** A floating callout badge with an icon and arrow:
  ```
  ┌────────────────────────────────────────────────────────────────────────┐
  │ 🎯 CORE FUNCTION (CIRCLED & LABELLED)                                   │
  │ The 1-Click Instant Slot-Lock & Live Queue Indicator:                  │
  │ Directly eliminates the patient's primary difficulty (15-min phone     │
  │ wait & 5-page form fatigue) by allowing instant reservation of a       │
  │ verified consultation window in one tap.                               │
  └────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
  ╔════════════════════════════════════════════════════════════════════════╗
  ║ 🔴 [CIRCLED ELEMENT]                                                  ║
  ║  ⚡ Live OPD Queue: 4 patients ahead in Cabin 204 • Avg wait: ~12 mins ║
  ║  [10:30 AM Next]  [11:15 AM]  [12:00 PM]  [02:30 PM]                  ║
  ║  [Lock Appointment ➔]                                                  ║
  ╚════════════════════════════════════════════════════════════════════════╝
  ```

### 4. Why This Specific Element Solves the Friction:
1. **Upfront Transparency:** Real-time clinic wait time (`~12 mins wait`) and live patient queue count (`4 patients ahead`) are visible *before* booking.
2. **Elimination of the Form Barrier:** It converts a 15-minute administrative chore into a 30-second commitment.
3. **Desk-Bypass Tokenization:** Generates an immediate digital token that routes straight to the doctor's OPD cabin display, bypassing the receptionist bottleneck.

---

## Requirement 3: Knowing Uncertainty
> *What is the one thing we do not yet know will work?*

### 1. The Critical Hypothesis (The "Leap of Faith")
In Lean Startup and Design Thinking, the "Knowing Uncertainty" represents the single unproven assumption that could collapse the business or product model if wrong:

> **The Critical Uncertainty:**  
> *"Will stressed, vulnerable patients trust an automated 30-second digital slot reservation without demanding human telephone confirmation from hospital staff, or will no-show rates exceed 40%?"*

### 2. Why We Do Not Yet Know This Will Work (The Psychological Risk)
- **High-Stakes Anxiety:** Healthcare is not like ordering food or hailing a cab. When someone is in physical pain or worrying about a child's fever, their default psychological response is to seek **human verbal confirmation** (*"Will Dr. Sharma definitely be sitting in room 204 at 10:30 AM?"*).
- **The "Phantom Booking" Fear:** Patients fear arriving at the physical hospital only to hear a receptionist say, *"Our system didn't receive your online booking."*
- **Double-Booking & High No-Shows:** Because this prototype eliminates prepayment and credit card barriers to maximize speed, patients might book slots across 3 different hospitals simultaneously and only attend the fastest one.

### 3. How This Prototype Tests the Uncertainty
This prototype is deliberately engineered as a behavioral test rig to evaluate patient trust:

1. **Instant Tangible Proof (Digital Token Artifact):**
   Immediately after tapping confirm, the prototype renders a bold **OPD Token Card (`#OPD-B14`)** with doctor cabin assignment (`Room 204`).
2. **Simulated Multi-Channel Confirmation:**
   Simulates an automated SMS & WhatsApp notification containing:
   - Doctor Name & exact Cabin number
   - Token ID
   - 1-tap Google Maps indoor walking route
   - A 1-tap `[Cancel / Reschedule]` link so patients can surrender slots if symptoms subside.
3. **Live OPD Queue Counter:**
   Showing *"4 patients ahead in Cabin 204"* gives patients real-time operational feedback, proving the system is wired into the live hospital back-office.

### 4. Measurable Experimentation Metrics (Test Card)

```
┌────────────────────────────────────────────────────────────────────────┐
│ DESIGN THINKING TEST CARD                                              │
├────────────────────────────────────────────────────────────────────────┤
│ STEP 1: HYPOTHESIS                                                     │
│ We believe that patients will trust an instant digital OPD slot        │
│ reservation and show up without requiring telephone confirmation.       │
│                                                                        │
│ STEP 2: TEST                                                           │
│ We will test this by placing 50 outpatients through this 30-second     │
│ prototype flow during a 1-week pilot at CarePulse Hospital.            │
│                                                                        │
│ STEP 3: METRICS & SIGNALS                                              │
│ - Primary Metric: % of test users who call the hospital phone line      │
│   within 30 minutes of booking to "double check".                      │
│ - Secondary Metric: Physical attendance rate at Cabin 204 on time.     │
│                                                                        │
│ STEP 4: CRITERIA                                                       │
│ We are right if:                                                       │
│ - < 15% of users place a verification phone call.                      │
│ - No-show rate remains under 12%.                                      │
│                                                                        │
│ STEP 5: PIVOT CONTINGENCY (IF WE ARE WRONG)                            │
│ If > 35% of users still call the receptionist, add an optional 1-tap   │
│ "Request 60-Second Receptionist Voice Confirmation" button on the      │
│ final token screen.                                                    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Technical File Tree & Architecture (React + Three.js + Node.js)

```
design thinking project/
├── server/
│   └── index.js                      # Node.js Express API (/api/doctors, /api/book, /api/telemetry)
├── src/
│   ├── components/
│   │   ├── ThreeHeroScene.jsx        # 3D WebGL Campus Navigator (Medical cross, orbit nodes, raycasting)
│   │   ├── ThreeCoreFunctionHolo.jsx # 3D WebGL Holographic Reticle (Circled Core Function)
│   │   ├── ThreeTokenCard.jsx        # 3D Interactive Holographic Token Card (Mouse tilt & rainbow foil)
│   │   ├── ThreeUncertaintyCube.jsx  # 3D Matrix Cube for Requirement 3 (Tumble/rotate faces)
│   │   ├── FastBookingModal.jsx      # Frictionless 30-second patient form
│   │   └── DesignThinkingCanvasModal.jsx # Slide-out evaluation drawer
│   ├── App.jsx                       # Main React orchestrator
│   ├── main.jsx                      # React 19 root
│   └── index.css                     # 3D CSS perspective transforms, tactile buttons, medical theme
├── dist/                             # Compiled production build
├── vanilla-prototype.html            # Standalone zero-dependency vanilla HTML prototype
├── index.html                        # Vite entry mount
├── package.json                      # Dependencies & NPM scripts (dev, build, server, test)
├── vite.config.js                    # Vite configuration with API proxy
├── verify.js                         # Automated verification test suite
└── DESIGN_THINKING_SPECIFICATION.md  # Comprehensive Design Thinking report
```

### How to Run & Experience the Prototype:

#### 1. Interactive React + 3D Three.js + Node.js Application:
- **To start the Node.js Express backend:**
  ```bash
  npm run server
  ```
  *(Runs on http://localhost:5000 with `/api/doctors`, `/api/book`, `/api/telemetry`)*

- **To start the React 3D Vite development server:**
  ```bash
  npm run dev
  ```
  *(Opens on http://localhost:3000 with real-time hot module reloading & 3D canvas rendering)*

- **To run the production build:**
  ```bash
  npm run build
  npm run preview
  ```

#### 2. Standalone Zero-Dependency Prototype:
- Double-click [vanilla-prototype.html](file:///c:/Users/NIKHI/OneDrive/Desktop/design%20thinking%20project/vanilla-prototype.html) in any browser for immediate inspection without running any terminals.

#### 3. 3D Features to Inspect:
1. **Interactive 3D WebGL Campus Navigator:** Hover your mouse across the 3D scene to experience dynamic camera parallax. Click any of the orbiting department nodes (Cardiology, Orthopedics, Pediatrics, Neurology, Dermatology) to fly the camera and filter the doctor roster.
2. **3D Holographic Reticle Ring:** Observe the rotating 3D crimson targeting ring circling the Core Function on Doctor Card 1.
3. **3D Uncertainty Matrix Cube:** Click the face buttons (`1. Hypothesis`, `2. Risk`, `3. Metrics`, `4. Pivot`) to tumble the 3D cube and inspect the critical assumption dimensions.
4. **3D Holographic Token Card:** Book an appointment and move your cursor across the resulting token card to see physical 3D perspective tilt and shifting rainbow foil glare.

