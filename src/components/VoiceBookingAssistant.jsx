import React, { useState, useEffect, useRef } from 'react';

/**
 * VoiceBookingAssistant
 * Speech-to-text voice assistant with real-time audio visualization,
 * natural language symptom-to-doctor slot parser, and speech synthesis response.
 */
export default function VoiceBookingAssistant({
  isOpen,
  onClose,
  lang = 'en',
  t,
  onVoiceMatch
}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('');
  const recognitionRef = useRef(null);

  // Initialize SpeechRecognition if available
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setFeedback(t.listeningText);
      };

      recognition.onresult = (event) => {
        const spokenText = event.results[0][0].transcript;
        setTranscript(spokenText);
        parseAndMatchQuery(spokenText);
      };

      recognition.onerror = (e) => {
        console.warn('Speech recognition error:', e.error);
        setIsListening(false);
        setFeedback('Could not capture audio. Please select a sample prompt below.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [lang, t]);

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
      setFeedback(t.listeningText);
      try {
        recognitionRef.current.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Recognition start error:', err);
      }
    }
  };

  // Speak audio feedback using SpeechSynthesis
  const speakResponse = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Parse natural language queries into doctors and slots
  const parseAndMatchQuery = (query) => {
    const q = query.toLowerCase();
    let matchedDocId = 'doc-1';
    let matchedSlot = { id: 's1', time: '10:30 AM', status: 'fast', label: 'Next Available' };
    let confirmationVoice = '';

    if (q.includes('child') || q.includes('pedia') || q.includes('rajesh') || q.includes('बच्च') || q.includes('शिशु')) {
      matchedDocId = 'doc-2';
      matchedSlot = { id: 's7', time: '11:00 AM', status: 'fast', label: 'Next Available' };
      confirmationVoice = lang === 'hi'
        ? 'बाल रोग विशेषज्ञ डॉ. राजेश वर्मा के साथ सुबह 11 बजे का स्लॉट चुना गया है।'
        : 'Matched Pediatrics with Dr. Rajesh Varma for 11:00 AM today.';
    } else if (q.includes('ortho') || q.includes('bone') || q.includes('joint') || q.includes('knee') || q.includes('हड्डी') || q.includes('जोड़')) {
      matchedDocId = 'doc-3';
      matchedSlot = { id: 's11', time: '01:00 PM', status: 'fast', label: 'Next Available' };
      confirmationVoice = lang === 'hi'
        ? 'हड्डी विशेषज्ञ डॉ. मीरा कुलकर्णी के साथ दोपहर 1 बजे का स्लॉट चुना गया है।'
        : 'Matched Orthopedics with Dr. Meera Kulkarni for 1:00 PM today.';
    } else if (q.includes('neuro') || q.includes('brain') || q.includes('headache') || q.includes('मस्तिष्क') || q.includes('सिर')) {
      matchedDocId = 'doc-4';
      matchedSlot = { id: 's15', time: '11:30 AM', status: 'fast', label: 'Next Available' };
      confirmationVoice = lang === 'hi'
        ? 'न्यूरो विशेषज्ञ डॉ. रोहन देशमुख के साथ सुबह 11:30 बजे का स्लॉट चुना गया है।'
        : 'Matched Neurology with Dr. Rohan Deshmukh for 11:30 AM today.';
    } else if (q.includes('skin') || q.includes('allergy') || q.includes('rash') || q.includes('त्वचा') || q.includes('एलर्जी')) {
      matchedDocId = 'doc-5';
      matchedSlot = { id: 's18', time: '10:00 AM', status: 'fast', label: 'Next Available' };
      confirmationVoice = lang === 'hi'
        ? 'त्वचा रोग विशेषज्ञ डॉ. प्रिया नंबियार के साथ सुबह 10 बजे का स्लॉट चुना गया है।'
        : 'Matched Dermatology with Dr. Priya Nambiar for 10:00 AM today.';
    } else {
      // Default to Cardiology (Dr. Sharma)
      matchedDocId = 'doc-1';
      matchedSlot = { id: 's1', time: '10:30 AM', status: 'fast', label: 'Next Available' };
      confirmationVoice = lang === 'hi'
        ? 'हृदय रोग विशेषज्ञ डॉ. अनन्या शर्मा के साथ 10:30 बजे का स्लॉट चुना गया है।'
        : 'Matched Cardiology with Dr. Ananya Sharma for 10:30 AM today.';
    }

    setFeedback(confirmationVoice);
    speakResponse(confirmationVoice);

    setTimeout(() => {
      onVoiceMatch(matchedDocId, matchedSlot);
      onClose();
    }, 1200);
  };

  const samplePrompts = lang === 'hi'
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
            <span>AI Voice Triage</span>
          </div>
          <h3 className="voice-title">{t.voiceModalTitle}</h3>
          <p className="voice-subtitle">{t.voiceModalDesc}</p>
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
                  parseAndMatchQuery(prompt);
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
