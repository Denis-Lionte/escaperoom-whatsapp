import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Paperclip, Send, Smile, Mic, CheckCheck,
  Phone, Lock, Play, Pause, LogOut, UserPlus, X, User
} from 'lucide-react';
import { sounds } from './audio';
import CallModal from './CallModal';

export default function WhatsAppWeb({ data, onUpdateMessages, onLogout }) {
  const [contacts, setContacts] = useState(data.contacts || []);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCallRule, setActiveCallRule] = useState(null);
  const [activeCallContact, setActiveCallContact] = useState(null);
  const [activeTypingContactId, setActiveTypingContactId] = useState(null);
  const [playingAudioId, setPlayingAudioId] = useState(null);

  // New contact modal state
  const [showNewContact, setShowNewContact] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactStatus, setNewContactStatus] = useState('');

  const messagesEndRef = useRef(null);

  // Sync when parent data changes (e.g. after admin saves)
  useEffect(() => {
    setContacts(data.contacts || []);
  }, [data.contacts]);

  const activeContact = contacts.find(c => c.id === selectedContactId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeContact?.messages, activeTypingContactId]);

  // ─── Add new contact by the Doctor ───────────────────────────────────────────
  const handleCreateContact = (e) => {
    e.preventDefault();
    if (!newContactName.trim()) return;

    const trimmedInput = newContactName.trim();
    const cleanDigits = trimmedInput.replace(/\D/g, '');
    const isCourierNumber = cleanDigits === '0752593149' || cleanDigits === '40752593149' || trimmedInput.includes('0752593149');

    const newContact = {
      id: `contact_${Date.now()}`,
      name: isCourierNumber ? 'Curier Urgent (0752593149)' : trimmedInput,
      avatar: isCourierNumber 
        ? 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=150&auto=format&fit=crop&q=80'
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(trimmedInput)}&background=2a3942&color=25d366`,
      status: isCourierNumber ? 'Livrări rapide sanatoriu' : (newContactStatus.trim() || 'Disponibil'),
      lastSeen: 'online',
      unread: 0,
      messages: [],
      isCourier: isCourierNumber,
      doctorCreated: true,
    };

    const updated = [...contacts, newContact];
    setContacts(updated);
    onUpdateMessages(updated);
    setSelectedContactId(newContact.id);
    setNewContactName('');
    setNewContactStatus('');
    setShowNewContact(false);
  };

  // ─── Send message ─────────────────────────────────────────────────────────────
  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeContact) return;

    sounds.playSent();

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg = {
      id: `msg_${Date.now()}`,
      sender: 'me',
      type: 'text',
      content: inputText.trim(),
      timestamp: timeStr,
      status: 'read',
    };

    const sentText = inputText.trim();
    setInputText('');

    const updatedContacts = contacts.map(c =>
      c.id === activeContact.id
        ? { ...c, messages: [...(c.messages || []), newMsg] }
        : c
    );
    setContacts(updatedContacts);
    onUpdateMessages(updatedContacts);

    checkRules(sentText, activeContact, updatedContacts);
  };

  // ─── Rule matching ────────────────────────────────────────────────────────────
  const checkRules = (playerText, contact, currentContacts) => {
    // 🚚 Verificare specială Curier (număr secret 0752593149)
    const isCourier = contact.isCourier || 
      contact.name?.includes('0752593149') || 
      contact.name?.replace(/\D/g, '') === '0752593149';

    if (isCourier) {
      // Verificăm dacă este primul mesaj primit de la curier
      const hasPreviousCourierReply = contact.messages?.some(m => m.sender === 'them');
      if (!hasPreviousCourierReply) {
        setActiveTypingContactId(contact.id);
        setTimeout(() => {
          setActiveTypingContactId(null);
          sounds.playReceived();
          const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const courierMsg = {
            id: `msg_curier_${Date.now()}`,
            sender: 'them',
            type: 'text',
            content: 'Salut! Sunt la intrarea Pavilionului 9 cu pachetul de la Bogdan. Bate de 5 ori în ușa de la intrare ca să știu că ești tu și îți dau coletul!',
            timestamp: timeStr,
            status: 'received',
          };
          const finalContacts = currentContacts.map(c =>
            c.id === contact.id
              ? { ...c, messages: [...(c.messages || []), courierMsg] }
              : c
          );
          setContacts(finalContacts);
          onUpdateMessages(finalContacts);
        }, 1500);
        return;
      }
    }

    const rules = data.rules || [];
    const textLower = playerText.toLowerCase();

    const match = rules.find(r => {
      if (!r.enabled) return false;
      if (r.contactId !== contact.id) return false;
      const target = (r.triggerPhrase || '').toLowerCase().trim();
      if (!target) return false;
      return r.triggerType === 'exact' ? textLower === target : textLower.includes(target);
    });

    if (!match) return;

    const delay = match.delayMs || 1800;
    setActiveTypingContactId(contact.id);

    setTimeout(() => {
      setActiveTypingContactId(null);

      if (match.responseType === 'call') {
        setActiveCallContact(contact);
        setActiveCallRule(match);
        return;
      }

      sounds.playReceived();
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const responseMsg = {
        id: `msg_resp_${Date.now()}`,
        sender: 'them',
        type: match.responseType,
        content: match.responseContent,
        caption: match.responseCaption || '',
        timestamp: timeStr,
        status: 'received',
      };

      const finalContacts = currentContacts.map(c =>
        c.id === contact.id
          ? { ...c, messages: [...(c.messages || []), responseMsg] }
          : c
      );
      setContacts(finalContacts);
      onUpdateMessages(finalContacts);

      if (match.responseType === 'audio' && match.responseCaption) {
        sounds.speakVoiceLine(match.responseCaption);
      }
    }, delay);
  };

  const toggleAudio = (msgId, text) => {
    if (playingAudioId === msgId) {
      sounds.stopSpeech();
      setPlayingAudioId(null);
    } else {
      sounds.speakVoiceLine(text);
      setPlayingAudioId(msgId);
      setTimeout(() => setPlayingAudioId(null), 7000);
    }
  };

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="wa-app-layout">
      <div className="wa-top-strip"></div>

      <div className="wa-window">
        {/* ── SIDEBAR ─────────────────────────────────────── */}
        <aside className="wa-sidebar">
          <div className="sidebar-header">
            <div className="user-profile-thumb">
              <img
                src={data.settings?.doctorAvatar}
                alt="Doctor"
                onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=Dr&background=1f2c34&color=25d366'; }}
              />
              <span className="online-indicator"></span>
            </div>

            <div className="header-doctor-title">
              <h4>{data.settings?.doctorName || 'Dr. Sterian'}</h4>
              <span className="doctor-badge">Physician Terminal</span>
            </div>

            <div className="sidebar-actions">
              {/* New Contact button — only for the Doctor */}
              <button
                className="wa-icon-btn"
                onClick={() => setShowNewContact(true)}
                title="New Contact"
              >
                <UserPlus size={18} />
              </button>
              <button className="wa-icon-btn" onClick={onLogout} title="Log Out">
                <LogOut size={18} />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="sidebar-search">
            <div className="search-input-wrap">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search contacts"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Contact List */}
          <div className="contact-list">
            {filteredContacts.map(contact => {
              const lastMsg = contact.messages?.at(-1);
              const isTyping = activeTypingContactId === contact.id;
              return (
                <div
                  key={contact.id}
                  className={`contact-item ${contact.id === selectedContactId ? 'active' : ''}`}
                  onClick={() => setSelectedContactId(contact.id)}
                >
                  <div className="contact-avatar-wrap">
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}&background=2a3942&color=00a884`; }}
                    />
                  </div>
                  <div className="contact-info">
                    <div className="contact-name-row">
                      <span className="contact-name">{contact.name}</span>
                      <span className="contact-time">{lastMsg?.timestamp || ''}</span>
                    </div>
                    <div className="contact-last-msg-row">
                      {isTyping ? (
                        <span className="typing-green">typing...</span>
                      ) : (
                        <span className="last-message-snippet">
                          {lastMsg ? (
                            <>
                              {lastMsg.sender === 'me' && <CheckCheck size={14} className="msg-ticks read" />}
                              {lastMsg.type === 'image' && '📷 Photo'}
                              {lastMsg.type === 'audio' && '🎤 Voice message'}
                              {lastMsg.type === 'text' && lastMsg.content}
                            </>
                          ) : contact.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredContacts.length === 0 && (
              <div className="empty-contacts-hint">
                <User size={32} />
                <p>No contacts yet.</p>
                <p>Click <UserPlus size={13} style={{ display: 'inline' }} /> to add one.</p>
              </div>
            )}
          </div>
        </aside>

        {/* ── CHAT AREA ────────────────────────────────────── */}
        {activeContact ? (
          <main className="wa-chat-area">
            <header className="chat-header">
              <div className="chat-header-contact">
                <img
                  src={activeContact.avatar}
                  alt={activeContact.name}
                  className="chat-header-avatar"
                  onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(activeContact.name)}&background=2a3942&color=00a884`; }}
                />
                <div className="chat-header-details">
                  <h3>{activeContact.name}</h3>
                  <p className="chat-status-subtitle">
                    {activeTypingContactId === activeContact.id
                      ? <span className="typing-text">typing...</span>
                      : activeContact.status || 'online'}
                  </p>
                </div>
              </div>
              <div className="chat-header-actions">
                <button className="wa-icon-btn" title="Voice Call" onClick={() => {
                  setActiveCallContact(activeContact);
                  setActiveCallRule({ callVoiceLine: '', callDurationSec: 10 });
                }}>
                  <Phone size={19} />
                </button>
              </div>
            </header>

            {/* Messages */}
            <div className="chat-messages-container">
              <div className="encryption-pill">
                <Lock size={12} />
                <span>Messages and calls are end-to-end encrypted for internal Sanatorium staff only.</span>
              </div>

              {activeContact.messages?.map((msg, index) => {
                const isMe = msg.sender === 'me';
                return (
                  <div key={msg.id || index} className={`message-bubble-row ${isMe ? 'msg-outgoing' : 'msg-incoming'}`}>
                    <div className="message-bubble">
                      {msg.type === 'text' && <div className="bubble-text">{msg.content}</div>}

                      {msg.type === 'image' && (
                        <div className="bubble-media">
                          <img src={msg.content} alt="Clue" className="media-image" onClick={() => window.open(msg.content, '_blank')} />
                          {msg.caption && <p className="media-caption">{msg.caption}</p>}
                        </div>
                      )}

                      {msg.type === 'audio' && (
                        <div className="bubble-audio">
                          <button className="audio-play-circle" onClick={() => toggleAudio(msg.id, msg.caption || 'Audio clue.')}>
                            {playingAudioId === msg.id ? <Pause size={16} /> : <Play size={16} />}
                          </button>
                          <div className="audio-wave-visualizer">
                            <div className={`wave-bars ${playingAudioId === msg.id ? 'pulsing' : ''}`}>
                              {[4,12,18,9,22,14,8,16,20,11,6,17,13,7].map((h, i) => (
                                <span key={i} style={{ height: `${h}px` }}></span>
                              ))}
                            </div>
                            <span className="audio-duration">0:14</span>
                          </div>
                        </div>
                      )}

                      <div className="bubble-meta">
                        <span className="bubble-time">{msg.timestamp}</span>
                        {isMe && <CheckCheck size={15} className="msg-ticks read" />}
                      </div>
                    </div>
                  </div>
                );
              })}

              {activeTypingContactId === activeContact.id && (
                <div className="message-bubble-row msg-incoming">
                  <div className="message-bubble typing-bubble">
                    <span className="dot"></span><span className="dot"></span><span className="dot"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form className="chat-footer-bar" onSubmit={handleSendMessage}>
              <button type="button" className="wa-icon-btn"><Smile size={22} /></button>
              <button type="button" className="wa-icon-btn"><Paperclip size={22} /></button>
              <div className="chat-input-field-wrap">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  autoFocus
                />
              </div>
              {inputText.trim()
                ? <button type="submit" className="wa-icon-btn send-btn"><Send size={20} /></button>
                : <button type="button" className="wa-icon-btn"><Mic size={22} /></button>
              }
            </form>
          </main>
        ) : (
          <div className="wa-no-chat-selected">
            <svg viewBox="0 0 39 39" width="80" height="80" style={{ marginBottom: 16, opacity: 0.15 }}>
              <path fill="#00a884" d="M19.5 0C8.75 0 0 8.75 0 19.5c0 3.44.89 6.67 2.45 9.48L.5 38.5l9.8-2.52C13 37.8 16.14 39 19.5 39 30.25 39 39 30.25 39 19.5 39 8.75 30.25 0 19.5 0z" />
            </svg>
            <h3>WhatsApp Web</h3>
            <p>Select a contact to start messaging<br/>or click <b>+</b> to add a new contact.</p>
          </div>
        )}
      </div>

      {/* ── NEW CONTACT MODAL ────────────────────────────── */}
      {showNewContact && (
        <div className="modal-backdrop">
          <div className="edit-modal" style={{ maxWidth: 400 }}>
            <div className="modal-header">
              <h3>Adaugă Contact Nou</h3>
              <button className="close-btn" onClick={() => setShowNewContact(false)}><X size={20} /></button>
            </div>
            <form className="modal-body" onSubmit={handleCreateContact}>
              <div className="form-group">
                <label>Adaugă un număr sau un nume *</label>
                <input
                  type="text"
                  placeholder="Adaugă un număr sau un nume..."
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  autoFocus
                  required
                />
              </div>
              <div className="form-group">
                <label>Status / Notă (opțional)</label>
                <input
                  type="text"
                  placeholder="ex. Curier / Secție"
                  value={newContactStatus}
                  onChange={(e) => setNewContactStatus(e.target.value)}
                />
              </div>
              <div className="modal-footer" style={{ padding: '14px 0 0 0' }}>
                <button type="button" className="admin-btn secondary" onClick={() => setShowNewContact(false)}>Anulează</button>
                <button type="submit" className="admin-btn primary">Adaugă Contact</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CALL MODAL ───────────────────────────────────── */}
      {activeCallContact && (
        <CallModal
          contact={activeCallContact}
          rule={activeCallRule}
          onClose={() => { setActiveCallContact(null); setActiveCallRule(null); }}
        />
      )}
    </div>
  );
}
