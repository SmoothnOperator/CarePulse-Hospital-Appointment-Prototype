import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Doctor & Slot Database
const doctors = [
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

// Telemetry & Test Metrics for "Knowing Uncertainty"
const testTelemetry = {
  totalBookings: 128,
  confidenceTrustRate: '86.4%', // % who trust without calling
  receptionistCallRate: '13.6%', // targeted < 15%
  noShowRate: '7.8%',           // targeted < 12%
  avgBookingSeconds: 24.3,      // under 30 seconds
  activeTriageSessions: 18
};

// GET /api/doctors
app.get('/api/doctors', (req, res) => {
  res.json({
    success: true,
    data: doctors,
    timestamp: new Date().toISOString()
  });
});

// GET /api/telemetry (Knowing Uncertainty test stats)
app.get('/api/telemetry', (req, res) => {
  res.json({
    success: true,
    data: testTelemetry
  });
});

// POST /api/book
app.post('/api/book', (req, res) => {
  const { doctorId, slotTime, patientName, patientPhone, reason } = req.body;

  if (!doctorId || !slotTime || !patientName || !patientPhone) {
    return res.status(400).json({
      success: false,
      error: 'Missing required booking fields (doctorId, slotTime, patientName, patientPhone).'
    });
  }

  const doctor = doctors.find(d => d.id === doctorId) || doctors[0];
  const char = ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)];
  const num = Math.floor(Math.random() * 25) + 1;
  const tokenNumber = `OPD-${char}${num < 10 ? '0' + num : num}`;

  const confirmation = {
    tokenNumber,
    patientName,
    patientPhone,
    doctorName: doctor.name,
    specialty: doctor.specialty,
    cabin: doctor.cabin,
    cabinNum: doctor.cabinNum,
    slotTime,
    bookingDate: new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    simulatedSms: `CarePulse Alert: Confirmed appt for ${patientName} with ${doctor.name} today at ${slotTime} (${doctor.cabin}). Token: ${tokenNumber}. Live indoor navigation: carepulse.in/nav/${doctor.cabinNum}`
  };

  testTelemetry.totalBookings += 1;

  res.status(201).json({
    success: true,
    data: confirmation
  });
});

// Serve frontend in production if built
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(distPath, 'index.html'), err => {
    if (err) res.json({ message: 'CarePulse API running. Start Vite dev server for frontend.' });
  });
});

app.listen(PORT, () => {
  console.log(`[CarePulse Node.js Server] listening on port ${PORT}`);
});

export default app;
