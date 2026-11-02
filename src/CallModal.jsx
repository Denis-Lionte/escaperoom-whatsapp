import React, { useState, useEffect } from 'react';
import { 
  Phone, PhoneOff, Mic, Volume2, ShieldAlert, Sparkles, User
} from 'lucide-react';
import { sounds } from './audio';

export default function CallModal({ contact, rule, onClose }) {
  const [callState, setCallState] = useState('ringing'); // 'ringing' | 'connected' | 'ended'
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    // Play ringing tone
    sounds.startRinging();

    // Auto accept after 3.5 seconds to start the eerie sequence
    const ringTimer = setTimeout(() => {
      acceptCall();
    }, 3500);

    return () => {
      clearTimeout(ringTimer);
      sounds.stopRinging();
      sounds.stopSpeech();
    };
  }, []);

  const acceptCall = () => {
    sounds.stopRinging();
    setCallState('connected');
    
    // Play static and speak voice line
    const stopStatic = sounds.startCallStatic();
    
    if (rule?.callVoiceLine) {
      setTimeout(() => {
        sounds.speakVoiceLine(rule.callVoiceLine);
      }, 1000);
    }

    const maxSec = rule?.callDurationSec || 12;

    const timer = setInterval(() => {
      setDuration(prev => {
        if (prev >= maxSec) {
          clearInterval(timer);
          stopStatic();
          sounds.stopSpeech();
          setCallState('ended');
          setTimeout(() => {
            onClose();
          }, 1800);
          return maxSec;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const formatTimer = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDecline = () => {
    sounds.stopRinging();
    sounds.stopSpeech();
    setCallState('ended');
    setTimeout(() => {
      onClose();
    }, 500);
  };

  return (
    <div className="call-modal-overlay">
      <div className="call-box">
        {/* Animated Sound Wave or Glitch Background */}
        <div className={`call-glow ${callState === 'connected' ? 'active-glow' : ''}`}></div>

        <div className="call-header">
          <div className="call-avatar-wrap">
            <img 
              src={contact.avatar} 
              alt={contact.name} 
              className="call-avatar"
              onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=C&background=111b21&color=25d366'; }}
            />
            {callState === 'connected' && <div className="pulse-ring"></div>}
          </div>
          
          <h2 className="call-name">{contact.name}</h2>
          <p className="call-subtitle">WhatsApp Voice Call</p>
          
          <div className="call-status-pill">
            {callState === 'ringing' && <span className="ringing-txt">Incoming Call...</span>}
            {callState === 'connected' && <span className="connected-txt">Connected {formatTimer(duration)}</span>}
            {callState === 'ended' && <span className="ended-txt">Call Ended</span>}
          </div>
        </div>

        {callState === 'connected' && (
          <div className="call-in-progress-display">
            <div className="sound-wave-bars">
              {[...Array(12)].map((_, idx) => (
                <div key={idx} className="bar" style={{ animationDelay: `${(idx * 0.1)}s` }}></div>
              ))}
            </div>

            {rule?.callVoiceLine && (
              <div className="call-transcript-box">
                <div className="trans-header">
                  <Volume2 size={15} />
                  <span>Incoming Audio Stream</span>
                </div>
                <p className="trans-text">"{rule.callVoiceLine}"</p>
              </div>
            )}
          </div>
        )}

        <div className="call-action-buttons">
          {callState === 'ringing' ? (
            <>
              <button className="call-btn decline-btn" onClick={handleDecline} title="Decline">
                <PhoneOff size={26} />
              </button>
              <button className="call-btn accept-btn" onClick={acceptCall} title="Accept">
                <Phone size={26} />
              </button>
            </>
          ) : (
            <button className="call-btn hangup-btn" onClick={handleDecline} title="End Call">
              <PhoneOff size={28} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

