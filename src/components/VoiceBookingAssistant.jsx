import React, { useState, useEffect, useRef } from 'react';

/**
 * VoiceBookingAssistant
 * Trilingual Voice AI Assistant (English, Hindi, Kannada)
 * Real-time SpeechRecognition (en-US, hi-IN, kn-IN), natural language triage parser,
 * Kannada & Hindi SpeechSynthesis output, and sample prompt chips.
 */
export default function VoiceBookingAssistant({
  isOpen,
  onClose,
  lang = 'en',
  t,
  onVoiceMatch
}) {
  const [activeVoiceLang, setActiveVoiceLang] = useState(lang === 'kn' ? 'kn' : lang === 'hi' ? 'hi' : 'en');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('');
  const recognitionRef = useRef(null);

  // Sync active voice language with parent lang if changed
  useEffect(() => {
    setActiveVoiceLang(lang === 'kn' ? 'kn' : lang === 'hi' ? 'hi' : 'en');
  }, [lang]);

  // Map language to speech recognition code
  const getRecognitionLangCode = (lng) => {
    if (lng === 'kn') return 'kn-IN';
    if (lng === 'hi') return 'hi-IN';
    return 'en-US';
  };

  // Initialize SpeechRecognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = getRecognitionLangCode(activeVoiceLang);

      recognition.onstart = () => {
        setIsListening(true);
        setFeedback(
          activeVoiceLang === 'kn'
            ? 'ಕೇಳಿಸಿಕೊಳ್ಳಲಾಗುತ್ತಿದೆ... ಮಾತನಾಡಿ'
            : activeVoiceLang === 'hi'
            ? 'सुन रहे हैं... कृपया बोलें'
            : 'Listening... speak now'
        );
      };

      recognition.onresult = (event) => {
        const spokenText = event.results[0][0].transcript;
        setTranscript(spokenText);
        parseAndMatchQuery(spokenText, activeVoiceLang);
      };

      recognition.onerror = (e) => {
        console.warn('Speech recognition error:', e.error);
        setIsListening(false);
        setFeedback(
          activeVoiceLang === 'kn'
            ? 'ಧ್ವನಿ ಗ್ರಹಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ಕೆಳಗಿನ ವಾಕ್ಯಗಳಲ್ಲಿ ಒಂದನ್ನು ಆರಿಸಿ.'
            : activeVoiceLang === 'hi'
            ? 'आवाज नहीं सुनी जा सकी। कृपया नीचे दिए गए उदाहरण पर क्लिक करें।'
            : 'Could not capture audio. Please select a sample prompt below.'
        );
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [activeVoiceLang]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setFeedback('Speech recognition not supported in this browser. Please click a prompt below.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      try {
        recognitionRef.current.lang = getRecognitionLangCode(activeVoiceLang);
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Recognition start error:', err);
      }
    }
  };

  // Speak audio response in English, Hindi, or Kannada
  const speakResponse = (text, lng) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = getRecognitionLangCode(lng);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Natural language query parser supporting English, Hindi, and Kannada
  const parseAndMatchQuery = (query, currentLng) => {
    const q = query.toLowerCase();
    let matchedDocId = 'doc-1';
    let matchedSlot = { id: 's1', time: '10:30 AM', status: 'fast', label: 'Next Available' };
    let confirmationVoice = '';

    // Pediatrics (ಮಕ್ಕಳು, ಶಿಶು, बच्चे, child, pedia, rajesh)
    if (
      q.includes('ಮಕ್ಕ') ||
      q.includes('ಶಿಶು') ||
      q.includes('ಮಗು') ||
      q.includes('child') ||
      q.includes('pedia') ||
      q.includes('rajesh') ||
      q.includes('बच्च')
    ) {
      matchedDocId = 'doc-2';
      matchedSlot = { id: 's7', time: '11:00 AM', status: 'fast', label: 'Next Available' };
      if (currentLng === 'kn') {
        confirmationVoice = 'ಮಕ್ಕಳ ತಜ್ಞ ಡಾ. ರಾಜೇಶ್ ವರ್ಮಾ ಅವರೊಂದಿಗೆ ಬೆಳಗ್ಗೆ 11:00 ಗಂಟೆಯ ಸ್ಲಾಟ್ ಆಯ್ಕೆಮಾಡಲಾಗಿದೆ.';
      } else if (currentLng === 'hi') {
        confirmationVoice = 'बाल रोग विशेषज्ञ डॉ. राजेश वर्मा के साथ सुबह 11 बजे का स्लॉट चुना गया है।';
      } else {
        confirmationVoice = 'Matched Pediatrics with Dr. Rajesh Varma for 11:00 AM today.';
      }
    }
    // Orthopedics (ಮೂಳೆ, ಕೀಲು, ಕಾಲು, हड्डी, जोड़, ortho, bone, joint, knee)
    else if (
      q.includes('ಮೂಳೆ') ||
      q.includes('ಕೀಲು') ||
      q.includes('ಕಾಲು') ||
      q.includes('ಹಿಂದಿ') ||
      q.includes('हड्डी') ||
      q.includes('जोड़') ||
      q.includes('ortho') ||
      q.includes('bone') ||
      q.includes('joint') ||
      q.includes('knee') ||
      q.includes('meera')
    ) {
      matchedDocId = 'doc-3';
      matchedSlot = { id: 's11', time: '01:00 PM', status: 'fast', label: 'Next Available' };
      if (currentLng === 'kn') {
        confirmationVoice = 'ಮೂಳೆ ಮತ್ತು ಕೀಲು ತಜ್ಞೆ ಡಾ. ಮೀರಾ ಕುಲಕರ್ಣಿ ಅವರೊಂದಿಗೆ ಮಧ್ಯಾಹ್ನ 1:00 ಗಂಟೆಯ ಸ್ಲಾಟ್ ಆಯ್ಕೆಮಾಡಲಾಗಿದೆ.';
      } else if (currentLng === 'hi') {
        confirmationVoice = 'हड्डी विशेषज्ञ डॉ. मीरा कुलकर्णी के साथ दोपहर 1 बजे का स्लॉट चुना गया है।';
      } else {
        confirmationVoice = 'Matched Orthopedics with Dr. Meera Kulkarni for 1:00 PM today.';
      }
    }
    // Neurology (ಮೆದುಳು, ತಲೆನೋವು, ನರ, मस्तिष्क, सिर, neuro, brain, headache)
    else if (
      q.includes('ಮೆದುಳು') ||
      q.includes('ತಲೆನೋವು') ||
      q.includes('ನರ') ||
      q.includes('मस्तिष्क') ||
      q.includes('सिर') ||
      q.includes('neuro') ||
      q.includes('brain') ||
      q.includes('headache') ||
      q.includes('rohan')
    ) {
      matchedDocId = 'doc-4';
      matchedSlot = { id: 's15', time: '11:30 AM', status: 'fast', label: 'Next Available' };
      if (currentLng === 'kn') {
        confirmationVoice = 'ನರರೋಗ ತಜ್ಞ ಡಾ. ರೋಹನ್ ದೇಶಮುಖ್ ಅವರೊಂದಿಗೆ ಬೆಳಗ್ಗೆ 11:30 ರ ಸ್ಲಾಟ್ ಆಯ್ಕೆಮಾಡಲಾಗಿದೆ.';
      } else if (currentLng === 'hi') {
        confirmationVoice = 'न्यूरो विशेषज्ञ डॉ. रोहन देशमुख के साथ सुबह 11:30 बजे का स्लॉट चुना गया है।';
      } else {
        confirmationVoice = 'Matched Neurology with Dr. Rohan Deshmukh for 11:30 AM today.';
      }
    }
    // Dermatology (ಚರ್ಮ, ತುರಿಕೆ, त्वचा, एलर्जी, skin, allergy, rash, priya)
    else if (
      q.includes('ಚರ್ಮ') ||
      q.includes('ತುರಿಕೆ') ||
      q.includes('ಅಲರ್ಜಿ') ||
      q.includes('त्वचा') ||
      q.includes('एलर्जी') ||
      q.includes('skin') ||
      q.includes('allergy') ||
      q.includes('rash') ||
      q.includes('priya')
    ) {
      matchedDocId = 'doc-5';
      matchedSlot = { id: 's18', time: '10:00 AM', status: 'fast', label: 'Next Available' };
      if (currentLng === 'kn') {
        confirmationVoice = 'ಚರ್ಮ ರೋಗ ತಜ್ಞೆ ಡಾ. ಪ್ರಿಯಾ ನಂಬಿಯಾರ್ ಅವರೊಂದಿಗೆ ಬೆಳಗ್ಗೆ 10:00 ಗಂಟೆಯ ಸ್ಲಾಟ್ ಆಯ್ಕೆಮಾಡಲಾಗಿದೆ.';
      } else if (currentLng === 'hi') {
        confirmationVoice = 'त्वचा रोग विशेषज्ञ डॉ. प्रिया नंबियार के साथ सुबह 10 बजे का स्लॉट चुना गया है।';
      } else {
        confirmationVoice = 'Matched Dermatology with Dr. Priya Nambiar for 10:00 AM today.';
      }
    }
    // Default to Cardiology (Dr. Ananya Sharma)
    else {
      matchedDocId = 'doc-1';
      matchedSlot = { id: 's1', time: '10:30 AM', status: 'fast', label: 'Next Available' };
      if (currentLng === 'kn') {
        confirmationVoice = 'ಹೃದಯ ತಜ್ಞೆ ಡಾ. ಅನನ್ಯಾ ಶರ್ಮಾ ಅವರೊಂದಿಗೆ ಬೆಳಗ್ಗೆ 10:30 ರ ಸ್ಲಾಟ್ ಆಯ್ಕೆಮಾಡಲಾಗಿದೆ.';
      } else if (currentLng === 'hi') {
        confirmationVoice = 'हृदय रोग विशेषज्ञ डॉ. अनन्या शर्मा के साथ 10:30 बजे का स्लॉट चुना गया है।';
      } else {
        confirmationVoice = 'Matched Cardiology with Dr. Ananya Sharma for 10:30 AM today.';
      }
    }

    setFeedback(confirmationVoice);
    speakResponse(confirmationVoice, currentLng);

    setTimeout(() => {
      onVoiceMatch(matchedDocId, matchedSlot);
      onClose();
    }, 1300);
  };

  // Sample prompt chips by language
  const samplePrompts =
    activeVoiceLang === 'kn'
      ? [
          'ಎದೆ ನೋವಿದೆ, ಹೃದಯ ತಜ್ಞರ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಬೇಕು',
          'ಮಗುವಿಗೆ ಜ್ವರವಿದೆ, ಮಕ್ಕಳ ವೈದ್ಯರನ್ನು ಬುಕ್ ಮಾಡಿ',
          'ಕೀಲು ಮತ್ತು ಮೂಳೆ ನೋವಿನ ತಜ್ಞರನ್ನು ಭೇಟಿ ಮಾಡಬೇಕು',
          'ಚರ್ಮ ರೋಗ ಮತ್ತು ಅಲರ್ಜಿ ವೈದ್ಯರ ಸ್ಲಾಟ್'
        ]
      : activeVoiceLang === 'hi'
      ? [
          'सीने में दर्द है, हृदय रोग डॉक्टर चाहिए',
          'बच्चे को बुखार है, पीडियाट्रिशियन बुक करें',
          'घुटने में दर्द है, ऑर्थोपेडिक स्लॉट चाहिए',
          'स्किन एलर्जी के डॉक्टर से मिलना है'
        ]
      : [
          'Book Cardiology slot with Dr. Sharma for chest pain',
          'Need child pediatrician Dr. Rajesh Varma',
          'Book knee and joint specialist slot',
          'Skin allergy doctor available today'
        ];

  if (!isOpen) return null;

  return (
    <div className="modal-overlay voice-overlay is-active" role="dialog" aria-modal="true">
      <div className="modal-window voice-window">
        <button className="modal-close-btn" onClick={onClose} aria-label="Close Voice Assistant">&times;</button>

        <div className="voice-modal-header">
          <div className="voice-badge">
            <span className="pulse-mic-dot"></span>
            <span>AI Voice Triage • 3 Languages</span>
          </div>
          <h3 className="voice-title">{t.voiceModalTitle}</h3>
          <p className="voice-subtitle">{t.voiceModalDesc}</p>
        </div>

        {/* Voice Language Selector Tabs (English, Hindi, Kannada) */}
        <div className="voice-lang-tabs">
          <button
            type="button"
            className={`voice-lang-tab ${activeVoiceLang === 'en' ? 'active' : ''}`}
            onClick={() => setActiveVoiceLang('en')}
          >
            English (en-US)
          </button>
          <button
            type="button"
            className={`voice-lang-tab ${activeVoiceLang === 'hi' ? 'active' : ''}`}
            onClick={() => setActiveVoiceLang('hi')}
          >
            हिन्दी (hi-IN)
          </button>
          <button
            type="button"
            className={`voice-lang-tab ${activeVoiceLang === 'kn' ? 'active' : ''}`}
            onClick={() => setActiveVoiceLang('kn')}
          >
            ಕನ್ನಡ (kn-IN)
          </button>
        </div>

        {/* Audio Wave Visualizer & Mic Button */}
        <div className="voice-mic-container">
          <div className={`voice-wave-ring ${isListening ? 'listening' : ''}`}>
            <span className="wave wave-1"></span>
            <span className="wave wave-2"></span>
            <span className="wave wave-3"></span>
            <button
              type="button"
              className={`btn-main-mic ${isListening ? 'active' : ''}`}
              onClick={toggleListening}
              aria-label={isListening ? t.stopListening : t.startListening}
            >
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="22" />
              </svg>
            </button>
          </div>

          <div className="voice-status-feedback">
            {feedback || (isListening ? t.listeningText : t.startListening)}
          </div>
          {transcript && <div className="voice-transcript-bubble">&quot;{transcript}&quot;</div>}
        </div>

        {/* Quick Clickable Voice Prompts */}
        <div className="voice-prompts-section">
          <span className="prompts-label">{t.trySaying}</span>
          <div className="prompts-chips-grid">
            {samplePrompts.map((prompt, i) => (
              <button
                key={i}
                type="button"
                className="voice-prompt-chip"
                onClick={() => {
                  setTranscript(prompt);
                  parseAndMatchQuery(prompt, activeVoiceLang);
                }}
              >
                <span>&quot;{prompt}&quot;</span>
                <span className="prompt-arrow">&rarr;</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
