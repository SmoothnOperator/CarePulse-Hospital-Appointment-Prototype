# CarePulse — Hospital Booking Appointment Prototype

An interactive, 3D-powered Hospital Appointment Booking Prototype developed with **Design Thinking principles**, **React 19**, **Three.js**, and **Node.js (Express)**.

---

## 🎯 Design Thinking Core Framework

This prototype was engineered to address 3 core Design Thinking requirements:

### 1. User Interaction Point
- **Where the user operates the solution:** Interactive Slot Touch-Chips located directly on the Specialist Doctor Cards (`#interactionPointSlots`).
- **Ergonomic Design:** Minimum 52px touch targets exceeding WCAG AAA standards for single-thumb mobile operation by distressed, weak, or elderly patients.

### 2. Core Function (Circled & Labelled)
- **Single Element Addressing User Difficulty:** The **1-Click Instant Slot-Lock & Live OPD Queue Wait-Time Indicator** (`#coreFunctionElement`).
- **Circled & Labelled:** Highlighted by a pulsing crimson bounding circle and a rotating 3D WebGL holographic targeting reticle (`ThreeCoreFunctionHolo`).
- **Problem Solved:** Eliminates 15-minute phone queues and multi-page form drop-offs by providing live queue transparency and 1-tap slot locking.

### 3. Knowing Uncertainty
- **Critical Leap-of-Faith Hypothesis:** *"Will stressed outpatients trust an automated 30-second digital appointment reservation without demanding telephone confirmation from a human receptionist, or will no-show rates exceed 40%?"*
- **Solution & Test Mechanism:**
  - **3D Interactive Holographic Token Card (`#OPD-B14`):** Realistic gyroscopic tilt with shifting rainbow glare foil providing tangible psychological proof of booking.
  - **Multi-channel SMS Simulation:** Simulated instant SMS with indoor cabin navigation.
  - **3D Uncertainty Matrix Cube:** Rotate through the 4 dimensions (Hypothesis, Risk, Live Telemetry, Pivot Strategy).

---

## 🚀 Tech Stack

- **Frontend:** React 19, Vite, Three.js (WebGL 3D graphics), Lucide Icons
- **Backend:** Node.js, Express, CORS
- **Styling:** Modern Medical Design System with CSS 3D Perspective Transforms
- **Fallback:** Standalone zero-dependency HTML prototype (`vanilla-prototype.html`)

---

## 💻 Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation
```bash
# Install dependencies
npm install
```

### Running the App
```bash
# 1. Start the Node.js Express backend (Port 5000)
npm run server

# 2. In a separate terminal, start the React 3D Vite dev server (Port 3000)
npm run dev
```

### Production Build & Test
```bash
# Run tests (verifies all 3 Design Thinking requirements)
npm test

# Build for production
npm run build
```

---

## 📂 Project Structure

```
design thinking project/
├── server/
│   └── index.js                      # Node.js Express API (/api/doctors, /api/book, /api/telemetry)
├── src/
│   ├── components/
│   │   ├── ThreeHeroScene.jsx        # 3D WebGL Campus Navigator (Orbit nodes, heartbeat, raycasting)
│   │   ├── ThreeCoreFunctionHolo.jsx # 3D WebGL Holographic Reticle (Circled Core Function)
│   │   ├── ThreeTokenCard.jsx        # 3D Interactive Holographic Token Card
│   │   ├── ThreeUncertaintyCube.jsx  # 3D Matrix Cube (Hypothesis, Risk, Metrics, Pivot)
│   │   ├── FastBookingModal.jsx      # Frictionless 30-second booking modal
│   │   └── DesignThinkingCanvasModal.jsx # Evaluation documentation drawer
│   ├── App.jsx                       # Main React Application
│   ├── main.jsx                      # React 19 Root
│   └── index.css                     # 3D perspective transforms & design system
├── vanilla-prototype.html            # Standalone zero-dependency browser prototype
├── verify.js                         # Automated verification test suite
└── DESIGN_THINKING_SPECIFICATION.md  # Detailed Design Thinking specification
```
