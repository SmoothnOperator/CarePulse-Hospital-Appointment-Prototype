/**
 * CAREPULSE HOSPITAL PROTOTYPE - APPLICATION LOGIC
 * Design Thinking Prototype Edition
 */

document.addEventListener('DOMContentLoaded', () => {
  // Current appointment selection state
  const state = {
    selectedDoctor: null,
    selectedSlot: null,
    selectedCabin: null,
    selectedDoctorId: null,
    showAnnotations: true,
  };

  // DOM Elements
  const annotationToggle = document.getElementById('dtAnnotationToggle');
  const openDtDrawerBtn = document.getElementById('openDtDrawerBtn');
  const closeDtDrawerBtn = document.getElementById('closeDtDrawerBtn');
  const dtDrawerBackdrop = document.getElementById('dtDrawerBackdrop');
  const dtCanvasDrawer = document.getElementById('dtCanvasDrawer');
  const uncertaintyDetailBtn = document.getElementById('uncertaintyDetailBtn');
  const viewDtAnalysisFromSuccessBtn = document.getElementById('viewDtAnalysisFromSuccessBtn');

  // Search & Filters
  const searchInput = document.getElementById('doctorSearchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const symptomChips = document.querySelectorAll('.symptom-chip');
  const doctorCards = document.querySelectorAll('.doctor-card');
  const resultsCount = document.getElementById('resultsCount');

  // Modals
  const bookingModal = document.getElementById('bookingModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const fastBookingForm = document.getElementById('fastBookingForm');
  const summaryDoctorName = document.getElementById('summaryDoctorName');
  const summaryCabin = document.getElementById('summaryCabin');
  const summarySlotTime = document.getElementById('summarySlotTime');
  const trustCabin = document.getElementById('trustCabin');

  // Success Modal
  const tokenSuccessModal = document.getElementById('tokenSuccessModal');
  const closeSuccessModalBtn = document.getElementById('closeSuccessModalBtn');
  const newBookingBtn = document.getElementById('newBookingBtn');
  const generatedTokenNumber = document.getElementById('generatedTokenNumber');
  const confirmedPatientName = document.getElementById('confirmedPatientName');
  const confirmedDoctor = document.getElementById('confirmedDoctor');
  const confirmedTimeAndCabin = document.getElementById('confirmedTimeAndCabin');
  const confirmedPhone = document.getElementById('confirmedPhone');
  const simulatedSmsText = document.getElementById('simulatedSmsText');

  // Set today's date formatted
  const currentDateDisplay = document.getElementById('currentDateDisplay');
  if (currentDateDisplay) {
    const today = new Date();
    currentDateDisplay.textContent = today.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  }

  /* ========================================================
     1. DESIGN THINKING ANNOTATION TOGGLE
     ======================================================== */
  function updateAnnotationState() {
    state.showAnnotations = annotationToggle.checked;
    if (state.showAnnotations) {
      document.body.classList.remove('hide-dt-annotations');
    } else {
      document.body.classList.add('hide-dt-annotations');
    }
  }

  if (annotationToggle) {
    annotationToggle.addEventListener('change', updateAnnotationState);
  }

  // Drawer Open/Close
  function openDtDrawer() {
    dtCanvasDrawer.classList.add('is-open');
    dtCanvasDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDtDrawer() {
    dtCanvasDrawer.classList.remove('is-open');
    dtCanvasDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (openDtDrawerBtn) openDtDrawerBtn.addEventListener('click', openDtDrawer);
  if (closeDtDrawerBtn) closeDtDrawerBtn.addEventListener('click', closeDtDrawer);
  if (dtDrawerBackdrop) dtDrawerBackdrop.addEventListener('click', closeDtDrawer);
  if (uncertaintyDetailBtn) {
    uncertaintyDetailBtn.addEventListener('click', () => {
      openDtDrawer();
      const uSection = document.querySelector('.highlight-uncertainty');
      if (uSection) uSection.scrollIntoView({ behavior: 'smooth' });
    });
  }
  if (viewDtAnalysisFromSuccessBtn) {
    viewDtAnalysisFromSuccessBtn.addEventListener('click', () => {
      closeSuccessModal();
      openDtDrawer();
    });
  }

  /* ========================================================
     2. REQUIREMENT 1: USER INTERACTION POINT (SLOT SELECTION)
     ======================================================== */
  const slotChips = document.querySelectorAll('.slot-chip:not(:disabled)');

  slotChips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      const card = chip.closest('.doctor-card');
      const docId = card.getAttribute('data-doctor-id');
      const docName = chip.getAttribute('data-doc');
      const cabin = chip.getAttribute('data-cabin');
      const time = chip.getAttribute('data-time');

      // Clear selection in this card
      card.querySelectorAll('.slot-chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');

      // Update state
      state.selectedDoctorId = docId;
      state.selectedDoctor = docName;
      state.selectedCabin = cabin;
      state.selectedSlot = time;

      // Update feedback & button
      const feedback = document.getElementById(`slotFeedback-${docId}`);
      const bookBtn = document.getElementById(`btnBookInstant-${docId}`);

      if (feedback) {
        feedback.textContent = `Selected: ${time} with ${docName} (${cabin})`;
        feedback.classList.add('has-selection');
      }

      if (bookBtn) {
        bookBtn.removeAttribute('disabled');
        bookBtn.classList.add('pulse-ready');
      }
    });
  });

  // Lock Appointment Button triggers modal
  const bookInstantButtons = document.querySelectorAll('.btn-book-instant');
  bookInstantButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (!state.selectedSlot || !state.selectedDoctor) return;
      openBookingModal();
    });
  });

  /* ========================================================
     3. BOOKING MODAL & ZERO-FRICTION FORM
     ======================================================== */
  function openBookingModal() {
    summaryDoctorName.textContent = state.selectedDoctor;
    summaryCabin.textContent = state.selectedCabin;
    summarySlotTime.textContent = state.selectedSlot;
    if (trustCabin) trustCabin.textContent = state.selectedCabin.replace(/[^0-9]/g, '') || '204';

    bookingModal.classList.add('is-active');
    bookingModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus first input
    setTimeout(() => {
      const nameInput = document.getElementById('patientNameInput');
      if (nameInput) nameInput.focus();
    }, 150);
  }

  function closeBookingModal() {
    bookingModal.classList.remove('is-active');
    bookingModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeBookingModal);

  // Form submission: Generates token & addresses Requirement 3
  if (fastBookingForm) {
    fastBookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const patientName = document.getElementById('patientNameInput').value.trim();
      const patientPhone = document.getElementById('patientPhoneInput').value.trim();

      if (!patientName || !patientPhone) return;

      // Generate randomized realistic OPD token (e.g. OPD-B14)
      const tokenChar = ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)];
      const tokenNum = Math.floor(Math.random() * 25) + 1;
      const fullToken = `OPD-${tokenChar}${tokenNum < 10 ? '0' + tokenNum : tokenNum}`;

      // Populate success modal
      generatedTokenNumber.textContent = fullToken;
      confirmedPatientName.textContent = patientName;
      confirmedDoctor.textContent = state.selectedDoctor;
      confirmedTimeAndCabin.textContent = `Today at ${state.selectedSlot} • ${state.selectedCabin}`;
      confirmedPhone.textContent = `To +91 ${patientPhone}`;

      simulatedSmsText.textContent = `\"CarePulse Alert: Confirmed appt for ${patientName} with ${state.selectedDoctor} today at ${state.selectedSlot} (${state.selectedCabin}). Token: ${fullToken}. Live navigation: carepulse.in/nav/${state.selectedCabin.replace(/[^0-9]/g, '') || '204'}\"`;

      closeBookingModal();
      openSuccessModal();
    });
  }

  function openSuccessModal() {
    tokenSuccessModal.classList.add('is-active');
    tokenSuccessModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeSuccessModal() {
    tokenSuccessModal.classList.remove('is-active');
    tokenSuccessModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (closeSuccessModalBtn) closeSuccessModalBtn.addEventListener('click', closeSuccessModal);
  if (newBookingBtn) {
    newBookingBtn.addEventListener('click', () => {
      closeSuccessModal();
      // Reset form & selections
      if (fastBookingForm) fastBookingForm.reset();
      document.querySelectorAll('.slot-chip').forEach(c => c.classList.remove('selected'));
      document.querySelectorAll('.btn-book-instant').forEach(b => b.setAttribute('disabled', 'true'));
      document.querySelectorAll('.selected-slot-feedback').forEach(f => {
        f.textContent = 'Select a slot to proceed';
        f.classList.remove('has-selection');
      });
      state.selectedDoctor = null;
      state.selectedSlot = null;
    });
  }

  /* ========================================================
     4. SEARCH & SYMPTOM FILTERING
     ======================================================== */
  function filterDoctors() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const activeChip = document.querySelector('.symptom-chip.active');
    const selectedDept = activeChip ? activeChip.getAttribute('data-dept') : 'all';

    let visibleCount = 0;

    doctorCards.forEach(card => {
      const docSpecialty = card.getAttribute('data-specialty') || '';
      const text = card.textContent.toLowerCase();

      const matchesDept = (selectedDept === 'all' || docSpecialty.toLowerCase() === selectedDept.toLowerCase());
      const matchesSearch = (!query || text.includes(query));

      if (matchesDept && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (resultsCount) {
      resultsCount.textContent = `Showing ${visibleCount} Specialist${visibleCount === 1 ? '' : 's'}`;
    }

    if (clearSearchBtn) {
      clearSearchBtn.style.display = query ? 'block' : 'none';
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterDoctors);
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      clearSearchBtn.style.display = 'none';
      filterDoctors();
      searchInput.focus();
    });
  }

  symptomChips.forEach(chip => {
    chip.addEventListener('click', () => {
      symptomChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      filterDoctors();
    });
  });

  // Global escape key handler to close modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeBookingModal();
      closeSuccessModal();
      closeDtDrawer();
    }
  });

  console.log('CarePulse Design Thinking Prototype initialized.');
});
