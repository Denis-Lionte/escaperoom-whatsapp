import React, { useState } from 'react';
import {
  ShieldCheck, Settings, Users, MessageSquareCode, Plus, Trash2,
  Save, RotateCcw, Image, PhoneCall, Music, Check, Eye,
  HelpCircle, Download, Upload, LogOut, CheckCheck, Play, X, Edit3,
  Truck, MessageSquare, CornerDownRight
} from 'lucide-react';

export default function AdminPanel({ data, onSaveData, onResetDefaults, onLogout }) {
  const [activeTab, setActiveTab] = useState('contacts'); // 'contacts' | 'rules' | 'secret_triggers' | 'preview' | 'settings' | 'guide'
  const [rules, setRules] = useState(data.rules || []);
  const [contacts, setContacts] = useState(data.contacts || []);
  const [settings, setSettings] = useState(data.settings || {});
  const [secretTriggers, setSecretTriggers] = useState(data.secretTriggers || []);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [editingRule, setEditingRule] = useState(null);
  const [editingContact, setEditingContact] = useState(null);
  const [editingSecretTrigger, setEditingSecretTrigger] = useState(null);
  const [previewContactId, setPreviewContactId] = useState(data.contacts[0]?.id || '');

  const persist = (newRules, newContacts, newSettings, newSecretTriggers) => {
    const payload = { 
      ...data, 
      rules: newRules, 
      contacts: newContacts, 
      settings: newSettings,
      secretTriggers: newSecretTriggers !== undefined ? newSecretTriggers : secretTriggers
    };
    onSaveData(payload);
  };

  const handleSaveAll = () => {
    persist(rules, contacts, settings, secretTriggers);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2200);
  };

  // ─── Rule helpers ─────────────────────────────────────────────────────────────
  const saveRule = () => {
    if (!editingRule.triggerPhrase.trim()) { alert('Trebuie să specificați un cuvânt cheie de declanșare.'); return; }
    const exists = rules.some(r => r.id === editingRule.id);
    const updated = exists
      ? rules.map(r => r.id === editingRule.id ? editingRule : r)
      : [...rules, editingRule];
    setRules(updated);
    persist(updated, contacts, settings, secretTriggers);
    setEditingRule(null);
  };

  const deleteRule = (id) => {
    if (!window.confirm('Ștergeți această regulă?')) return;
    const updated = rules.filter(r => r.id !== id);
    setRules(updated);
    persist(updated, contacts, settings, secretTriggers);
  };

  const toggleRule = (id) => {
    const updated = rules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r);
    setRules(updated);
    persist(updated, contacts, settings, secretTriggers);
  };

  const newRule = (contactId = '') => ({
    id: `rule_${Date.now()}`,
    contactId: contactId || contacts[0]?.id || '',
    triggerType: 'contains',
    triggerPhrase: '',
    responseType: 'text',
    responseContent: '',
    responseCaption: '',
    callVoiceLine: '',
    callDurationSec: 10,
    delayMs: 1500,
    enabled: true,
  });

  // ─── Contact helpers ──────────────────────────────────────────────────────────
  const saveContact = () => {
    if (!editingContact.name.trim()) { alert('Numele contactului este obligatoriu.'); return; }
    const exists = contacts.some(c => c.id === editingContact.id);
    const updated = exists
      ? contacts.map(c => c.id === editingContact.id ? editingContact : c)
      : [...contacts, editingContact];
    setContacts(updated);
    persist(rules, updated, settings, secretTriggers);
    setEditingContact(null);
  };

  const deleteContact = (id) => {
    if (!window.confirm('Ștergeți acest contact și toate regulile lui de răspuns?')) return;
    const updatedContacts = contacts.filter(c => c.id !== id);
    const updatedRules = rules.filter(r => r.contactId !== id);
    setContacts(updatedContacts);
    setRules(updatedRules);
    persist(updatedRules, updatedContacts, settings, secretTriggers);
  };

  // ─── Edit Contact Initial Messages ───────────────────────────────────────────
  const updateContactMessage = (msgIndex, field, value) => {
    const updatedMsgs = [...(editingContact.messages || [])];
    updatedMsgs[msgIndex] = { ...updatedMsgs[msgIndex], [field]: value };
    setEditingContact({ ...editingContact, messages: updatedMsgs });
  };

  const addContactMessage = () => {
    const newMsg = {
      id: `m_${Date.now()}`,
      sender: 'them',
      type: 'text',
      content: 'Mesaj nou...',
      timestamp: '21:00',
      status: 'read'
    };
    setEditingContact({ ...editingContact, messages: [...(editingContact.messages || []), newMsg] });
  };

  const deleteContactMessage = (msgIndex) => {
    const updatedMsgs = editingContact.messages.filter((_, idx) => idx !== msgIndex);
    setEditingContact({ ...editingContact, messages: updatedMsgs });
  };

  // ─── Secret Trigger Helpers (ex: Curier / numere adăugate) ────────────────────
  const saveSecretTrigger = () => {
    if (!editingSecretTrigger.phoneNumber.trim()) { alert('Numărul de telefon este obligatoriu.'); return; }
    const exists = secretTriggers.some(st => st.id === editingSecretTrigger.id);
    const updated = exists
      ? secretTriggers.map(st => st.id === editingSecretTrigger.id ? editingSecretTrigger : st)
      : [...secretTriggers, editingSecretTrigger];
    setSecretTriggers(updated);
    persist(rules, contacts, settings, updated);
    setEditingSecretTrigger(null);
  };

  const deleteSecretTrigger = (id) => {
    if (!window.confirm('Ștergeți această regulă pentru număr necunoscut?')) return;
    const updated = secretTriggers.filter(st => st.id !== id);
    setSecretTriggers(updated);
    persist(rules, contacts, settings, updated);
  };

  const toggleSecretTrigger = (id) => {
    const updated = secretTriggers.map(st => st.id === id ? { ...st, enabled: !st.enabled } : st);
    setSecretTriggers(updated);
    persist(rules, contacts, settings, updated);
  };

  // ─── Export / Import ──────────────────────────────────────────────────────────
  const handleExport = () => {
    const blob = new Blob([JSON.stringify({ settings, contacts, rules, secretTriggers }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'escaperoom_scenario.json';
    a.click();
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (parsed.contacts && parsed.settings) {
          setRules(parsed.rules || []);
          setContacts(parsed.contacts || []);
          setSettings(parsed.settings || {});
          setSecretTriggers(parsed.secretTriggers || []);
          onSaveData(parsed);
          alert('Scenariu importat cu succes!');
        } else { alert('Format de fișier invalid.'); }
      } catch (err) { alert('Eroare la import: ' + err.message); }
    };
    reader.readAsText(file);
  };

  // ─── Preview ──────────────────────────────────────────────────────────────────
  const previewContact = contacts.find(c => c.id === previewContactId) || contacts[0];
  const previewRules = rules.filter(r => r.contactId === previewContact?.id);

  const TABS = [
    { id: 'contacts', label: 'Contacte & Mesaje', icon: <Users size={17} /> },
    { id: 'rules', label: `Reguli Declanșare (${rules.length})`, icon: <MessageSquareCode size={17} /> },
    { id: 'secret_triggers', label: `Numere Secrete / Curier (${secretTriggers.length})`, icon: <Truck size={17} /> },
    { id: 'preview', label: 'Previzualizare Scenariu', icon: <Eye size={17} /> },
    { id: 'settings', label: 'Autentificare & Cameră', icon: <Settings size={17} /> },
    { id: 'guide', label: 'Ghid Blocare iPad', icon: <HelpCircle size={17} /> },
  ];

  return (
    <div className="admin-container">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-title-area">
          <ShieldCheck size={26} className="admin-badge-icon" />
          <div>
            <h2>Panou Control Game Master</h2>
            <p className="admin-sub">Editor Scenariu, Istoric Mesaje, Reguli Răspuns & Numere Secrete</p>
          </div>
        </div>
        <div className="admin-action-bar">
          <button className="admin-btn restore-btn" onClick={() => { if (window.confirm('Restabiliți scenariul din fabrică?')) onResetDefaults(); }}>
            <RotateCcw size={14} /> Reset Setări
          </button>
          <button className="admin-btn secondary" onClick={handleExport}><Download size={14} /> Export</button>
          <label className="admin-btn secondary upload-btn">
            <Upload size={14} /> Import
            <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
          </label>
          <button className="admin-btn save-btn" onClick={handleSaveAll}>
            {saveSuccess ? <Check size={15} /> : <Save size={15} />}
            {saveSuccess ? 'Salvat!' : 'Salvează Tot'}
          </button>
          <button className="admin-btn logout-btn" onClick={onLogout}><LogOut size={15} /> Ieșire</button>
        </div>
      </header>

      {/* Tabs */}
      <nav className="admin-subtabs">
        {TABS.map(t => (
          <button key={t.id} className={`subtab-btn ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
            {t.icon} <span>{t.label}</span>
          </button>
        ))}
      </nav>

      <div className="admin-content-area">

        {/* ══ CONTACTS & EDIT MESSAGES TAB ════════════════════════════════════════ */}
        {activeTab === 'contacts' && (
          <div>
            <div className="section-toolbar">
              <div className="section-desc">
                <h3>Contacte & Conversații Inițiale</h3>
                <p>
                  Aici poți edita <b>orice mesaj</b> din istoricul contactelor, adăuga mesaje noi sau schimba regulile de răspuns.
                </p>
              </div>
              <button className="admin-btn primary" onClick={() => setEditingContact({
                id: `contact_${Date.now()}`, name: '', avatar: '', status: '', lastSeen: 'online', unread: 0, messages: []
              })}>
                <Plus size={15} /> Adaugă Contact
              </button>
            </div>

            <div className="contacts-admin-grid">
              {contacts.map(contact => {
                const contactRules = rules.filter(r => r.contactId === contact.id);
                const hasRules = contactRules.length > 0;

                return (
                  <div key={contact.id} className="contact-admin-card">
                    <div className="contact-card-header">
                      <img
                        src={contact.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}&background=2a3942&color=25d366`}
                        alt={contact.name}
                        className="contact-card-avatar"
                        onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}&background=2a3942&color=25d366`; }}
                      />
                      <div className="contact-card-meta">
                        <h4>{contact.name}</h4>
                        <p>{contact.status}</p>
                        <small style={{ color: 'var(--wa-text-secondary)' }}>
                          {contact.messages?.length || 0} mesaje în istoric
                        </small>
                      </div>
                      <div className="contact-card-actions">
                        <button className="admin-btn secondary mini-btn" onClick={() => setEditingContact(contact)} title="Editează contact & mesaje">
                          <Edit3 size={14} /> Editează Mesaje
                        </button>
                        <button className="icon-btn danger" onClick={() => deleteContact(contact.id)} title="Șterge contact"><Trash2 size={15} /></button>
                      </div>
                    </div>

                    {/* Previzualizare mesaje inițiale */}
                    <div style={{ padding: '8px 18px', background: 'rgba(0,0,0,0.15)', borderBottom: '1px solid var(--wa-border)' }}>
                      <span style={{ fontSize: 11, color: '#ffd279', textTransform: 'uppercase', fontWeight: 600 }}>Istoric conversație:</span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4, maxHeight: 80, overflowY: 'auto' }}>
                        {contact.messages?.slice(0, 3).map((m, i) => (
                          <div key={i} style={{ fontSize: 12, color: 'var(--wa-text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            <b>{m.sender === 'me' ? 'Dr. Sterian' : contact.name.split(' ')[0]}:</b> "{m.content}"
                          </div>
                        ))}
                        {(contact.messages?.length || 0) > 3 && (
                          <span style={{ fontSize: 11, color: 'var(--wa-text-muted)' }}>+ încă {(contact.messages.length - 3)} mesaje...</span>
                        )}
                      </div>
                    </div>

                    {/* Auto-reply rules */}
                    <div className="contact-rules-section">
                      <div className="contact-rules-header">
                        <span className={`auto-reply-badge ${hasRules ? 'active' : 'inactive'}`}>
                          {hasRules ? `✓ Răspuns Automat (${contactRules.length} reguli)` : '✗ Fără răspuns automat'}
                        </span>
                        <button
                          className="admin-btn secondary mini-btn"
                          onClick={() => setEditingRule(newRule(contact.id))}
                        >
                          <Plus size={12} /> Adaugă Regulă Răspuns
                        </button>
                      </div>

                      {contactRules.length > 0 && (
                        <div className="contact-rules-list">
                          {contactRules.map(rule => (
                            <div key={rule.id} className={`contact-rule-row ${!rule.enabled ? 'rule-disabled' : ''}`}>
                              <span className={`rule-type-dot type-${rule.responseType}`}></span>
                              <div className="rule-row-info">
                                <span className="rule-trigger-label">"{rule.triggerPhrase}"</span>
                                <span className="rule-response-label">
                                  → {rule.responseType === 'call' ? '📞 Apel fals' : rule.responseType === 'image' ? '📷 Poză indiciu' : rule.responseType === 'audio' ? '🎤 Notă vocală' : `💬 "${rule.responseContent?.slice(0, 40)}..."`}
                                </span>
                              </div>
                              <div className="rule-row-actions">
                                <button className="icon-btn" onClick={() => setEditingRule(rule)} title="Edit"><Edit3 size={13} /></button>
                                <label className="small-toggle" title="Activ / Dezactivat">
                                  <input type="checkbox" checked={rule.enabled !== false} onChange={() => toggleRule(rule.id)} />
                                </label>
                                <button className="icon-btn danger" onClick={() => deleteRule(rule.id)} title="Delete"><Trash2 size={13} /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══ ALL RULES TAB ══════════════════════════════════════════════════════ */}
        {activeTab === 'rules' && (
          <div className="rules-section">
            <div className="section-toolbar">
              <div className="section-desc">
                <h3>Toate Regulile de Răspuns</h3>
                <p>Când jucătorul trimite un cuvânt cheie unui contact, acesta răspunde automat cu text, imagine, audio sau apel.</p>
              </div>
              <button className="admin-btn primary" onClick={() => setEditingRule(newRule())}>
                <Plus size={15} /> Adaugă Regulă
              </button>
            </div>

            <div className="rules-grid">
              {rules.map(rule => {
                const contact = contacts.find(c => c.id === rule.contactId);
                return (
                  <div key={rule.id} className={`rule-card ${!rule.enabled ? 'disabled-card' : ''}`}>
                    <div className="rule-header">
                      <div className="rule-badge-group">
                        <span className={`response-type-pill type-${rule.responseType}`}>
                          {rule.responseType.toUpperCase()}
                        </span>
                        <span className="target-contact-pill">Contact: <b>{contact?.name || 'Necunoscut'}</b></span>
                      </div>
                      <div className="rule-actions">
                        <button className="admin-btn secondary mini-btn" onClick={() => setEditingRule(rule)}>Edit</button>
                        <button className="icon-btn danger" onClick={() => deleteRule(rule.id)}><Trash2 size={14} /></button>
                      </div>
                    </div>

                    <div className="rule-body">
                      <div className="condition-row">
                        <span className="label">Dacă jucătorul scrie:</span>
                        <code className="phrase-badge">"{rule.triggerPhrase}"</code>
                        <span className="match-tag">({rule.triggerType})</span>
                      </div>
                      <div className="response-row">
                        <span className="label">Răspuns:</span>
                        {rule.responseType === 'text' && <p className="response-preview text-preview">"{rule.responseContent}"</p>}
                        {rule.responseType === 'image' && (
                          <div className="media-preview-box">
                            <img src={rule.responseContent} alt="" onError={(e) => { e.target.style.display = 'none'; }} />
                            {rule.responseCaption && <p className="caption-preview">"{rule.responseCaption}"</p>}
                          </div>
                        )}
                        {rule.responseType === 'audio' && <div className="audio-preview-box"><Music size={14} /> <span>"{rule.responseCaption}"</span></div>}
                        {rule.responseType === 'call' && <div className="call-preview-box"><PhoneCall size={14} /> <span>Apel: "{rule.callVoiceLine}"</span></div>}
                      </div>
                      <div className="rule-footer">
                        <span>Întârziere tastare: {rule.delayMs}ms</span>
                        <label className="toggle-label">
                          <input type="checkbox" checked={rule.enabled !== false} onChange={() => toggleRule(rule.id)} />
                          <span>{rule.enabled !== false ? 'Activ' : 'Dezactivat'}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══ SECRET TRIGGERS (CURIER / NUMERE ADĂUGATE) TAB ═════════════════════ */}
        {activeTab === 'secret_triggers' && (
          <div className="secret-triggers-section">
            <div className="section-toolbar">
              <div className="section-desc">
                <h3>Reguli pentru Numere Secrete / Curier</h3>
                <p>
                  Contacte care <b>NU apar în lista inițială</b>. Dacă jucătorul apasă pe <b>+</b> și introduce numărul specificat, 
                  contactul se adaugă automat și răspunde la primul mesaj trimis!
                </p>
              </div>
              <button className="admin-btn primary" onClick={() => setEditingSecretTrigger({
                id: `sec_${Date.now()}`,
                phoneNumber: '',
                contactName: 'Curier Nou',
                contactStatus: 'Livrări',
                contactAvatar: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=150&auto=format&fit=crop&q=80',
                triggerType: 'any_first_message',
                responseMessage: 'Mesaj de răspuns...',
                delayMs: 1500,
                enabled: true
              })}>
                <Plus size={15} /> Adaugă Regulă Număr Secret
              </button>
            </div>

            <div className="rules-grid">
              {secretTriggers.map(st => (
                <div key={st.id} className={`rule-card ${!st.enabled ? 'disabled-card' : ''}`}>
                  <div className="rule-header">
                    <div className="rule-badge-group">
                      <span className="response-type-pill type-call">NUMĂR SECRET</span>
                      <span className="target-contact-pill">Număr: <b style={{ color: '#ffd279' }}>{st.phoneNumber}</b></span>
                    </div>
                    <div className="rule-actions">
                      <button className="admin-btn secondary mini-btn" onClick={() => setEditingSecretTrigger(st)}>Edit</button>
                      <button className="icon-btn danger" onClick={() => deleteSecretTrigger(st.id)}><Trash2 size={14} /></button>
                    </div>
                  </div>

                  <div className="rule-body">
                    <div className="condition-row">
                      <span className="label">Nume contact generat:</span>
                      <b>{st.contactName}</b>
                    </div>
                    <div className="condition-row">
                      <span className="label">Declanșare:</span>
                      <span>La primul mesaj trimis de jucător</span>
                    </div>
                    <div className="response-row">
                      <span className="label">Mesaj răspuns trimis înapoi:</span>
                      <p className="response-preview text-preview">"{st.responseMessage}"</p>
                    </div>
                    <div className="rule-footer">
                      <span>Întârziere: {st.delayMs}ms</span>
                      <label className="toggle-label">
                        <input type="checkbox" checked={st.enabled !== false} onChange={() => toggleSecretTrigger(st.id)} />
                        <span>{st.enabled !== false ? 'Activ' : 'Dezactivat'}</span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}

              {secretTriggers.length === 0 && (
                <div className="empty-state">
                  <Truck size={40} />
                  <h4>Nicio regulă de număr secret configurată</h4>
                  <p>Adaugă numere precum cel al Curierului pentru ca jucătorii să poată descoperi indicii suplimentare.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ PREVIEW TAB ════════════════════════════════════════════════════════ */}
        {activeTab === 'preview' && (
          <div className="preview-section">
            <div className="section-toolbar">
              <div className="section-desc">
                <h3>Previzualizare Scenariu Complet</h3>
                <p>Vezi conversația cap-coadă cu toate mesajele și indiciile declanșate.</p>
              </div>
              <div className="preview-selector">
                <label>Contact: </label>
                <select value={previewContactId} onChange={(e) => setPreviewContactId(e.target.value)} className="contact-select-dropdown">
                  {contacts.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({rules.filter(r => r.contactId === c.id).length} reguli)</option>
                  ))}
                </select>
              </div>
            </div>

            {previewContact && (
              <div className="scenario-preview-canvas">
                <div className="preview-phone-header">
                  <img src={previewContact.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(previewContact.name)}&background=2a3942&color=25d366`} alt="" className="preview-header-avatar" />
                  <div>
                    <h4>{previewContact.name}</h4>
                    <span className="preview-online-status">{previewContact.status}</span>
                  </div>
                  <div className="preview-badge-tag">Simulare Conversație</div>
                </div>

                <div className="preview-messages-flow">
                  {previewContact.messages?.map((msg, i) => (
                    <div key={i} className={`preview-msg-bubble ${msg.sender === 'me' ? 'out' : 'in'}`}>
                      <div className="preview-label-tag">{msg.sender === 'me' ? 'Dr. Sterian' : previewContact.name} (Istoric)</div>
                      <p>{msg.content}</p>
                      <span className="preview-time">{msg.timestamp || '21:00'}</span>
                    </div>
                  ))}

                  {previewRules.map((rule, idx) => (
                    <React.Fragment key={rule.id}>
                      <div className="preview-msg-bubble out triggered">
                        <div className="preview-label-tag">Jucătorul scrie indiciul #{idx + 1}</div>
                        <p><b>"{rule.triggerPhrase}"</b></p>
                        <span className="preview-time">
                          22:0{idx + 1} <CheckCheck size={12} className="read-tick" />
                        </span>
                      </div>
                      <div className="preview-msg-bubble in response">
                        <div className="preview-label-tag">{previewContact.name} ({rule.responseType})</div>
                        {rule.responseType === 'text' && <p>{rule.responseContent}</p>}
                        {rule.responseType === 'image' && (
                          <div className="preview-image-clue">
                            <img src={rule.responseContent} alt="" onError={(e) => { e.target.style.display = 'none'; }} />
                            {rule.responseCaption && <p className="caption">{rule.responseCaption}</p>}
                          </div>
                        )}
                        {rule.responseType === 'audio' && (
                          <div className="preview-audio-bubble">
                            <div className="preview-play-icon"><Play size={13} /></div>
                            <div><p className="audio-voice-title">Mesaj Vocal</p><small>{rule.responseCaption}</small></div>
                          </div>
                        )}
                        {rule.responseType === 'call' && (
                          <div className="preview-call-banner">
                            <PhoneCall size={18} className="call-ico" />
                            <div><strong>Apel Primit</strong><p><i>"{rule.callVoiceLine}"</i></p></div>
                          </div>
                        )}
                        <span className="preview-time">22:0{idx + 1}</span>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ SETTINGS TAB ══════════════════════════════════════════════════════ */}
        {activeTab === 'settings' && (
          <div className="settings-section">
            <div className="settings-card">
              <h3>Cont Doctor (Autentificare Jucător)</h3>
              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Utilizator</label>
                  <input type="text" value={settings.doctorUsername || ''} onChange={(e) => setSettings({ ...settings, doctorUsername: e.target.value })} />
                </div>
                <div className="form-group flex-1">
                  <label>Parolă</label>
                  <input type="text" value={settings.doctorPassword || ''} onChange={(e) => setSettings({ ...settings, doctorPassword: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Nume Afișat Doctor</label>
                <input type="text" value={settings.doctorName || ''} onChange={(e) => setSettings({ ...settings, doctorName: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Status Doctor</label>
                <input type="text" value={settings.doctorStatus || ''} onChange={(e) => setSettings({ ...settings, doctorStatus: e.target.value })} />
              </div>
            </div>

            <div className="settings-card">
              <h3>Cont Admin / Game Master</h3>
              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Utilizator Admin</label>
                  <input type="text" value={settings.adminUsername || ''} onChange={(e) => setSettings({ ...settings, adminUsername: e.target.value })} />
                </div>
                <div className="form-group flex-1">
                  <label>Parolă Admin</label>
                  <input type="text" value={settings.adminPassword || ''} onChange={(e) => setSettings({ ...settings, adminPassword: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Nume Cameră / Sanatoriu</label>
                <input type="text" value={settings.roomName || ''} onChange={(e) => setSettings({ ...settings, roomName: e.target.value })} />
              </div>
            </div>

            <button className="admin-btn save-btn" onClick={handleSaveAll}>
              {saveSuccess ? <Check size={15} /> : <Save size={15} />} Salvează Credențiale
            </button>
          </div>
        )}

        {/* ══ GUIDE TAB ═════════════════════════════════════════════════════════ */}
        {activeTab === 'guide' && (
          <div className="guide-section">
            <div className="guide-card">
              <h3>Ghid Blocare iPad (Kiosk Mode / Guided Access)</h3>
              <ol className="step-list">
                <li><strong>Activare Acces Ghidat:</strong><p>Setări → Accesibilitate → Acces ghidat → ACTIVAT. Setează un cod secret pe care îl știi doar tu.</p></li>
                <li><strong>Adăugare pe Ecranul Principal:</strong><p>Deschide link-ul aplicației în Safari pe iPad → apasă butonul Partajare (Share) → „Adăugare la ecranul principal”.</p></li>
                <li><strong>Pornire Ecran Complet:</strong><p>Deschide aplicația de pe ecran — se va deschide fără bara de adrese Safari.</p></li>
                <li><strong>Blocare:</strong><p>Apasă de 3 ori rapid pe butonul de pornire (Power) al iPad-ului și atinge „Start”.</p></li>
              </ol>
            </div>
          </div>
        )}
      </div>

      {/* ══ MODAL EDITARE REGULĂ RĂSPUNS ════════════════════════════════════════ */}
      {editingRule && (
        <div className="modal-backdrop">
          <div className="edit-modal">
            <div className="modal-header">
              <h3>{rules.some(r => r.id === editingRule.id) ? 'Editare Regulă' : 'Regulă Răspuns Nouă'}</h3>
              <button className="close-btn" onClick={() => setEditingRule(null)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Contact care răspunde</label>
                <select value={editingRule.contactId} onChange={(e) => setEditingRule({ ...editingRule, contactId: e.target.value })}>
                  {contacts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group flex-2">
                  <label>Cuvânt cheie declanșator</label>
                  <input type="text" placeholder='ex. "dulap", "antidot", "toxina"'
                    value={editingRule.triggerPhrase}
                    onChange={(e) => setEditingRule({ ...editingRule, triggerPhrase: e.target.value })} />
                </div>
                <div className="form-group flex-1">
                  <label>Tip potrivire</label>
                  <select value={editingRule.triggerType} onChange={(e) => setEditingRule({ ...editingRule, triggerType: e.target.value })}>
                    <option value="contains">Conține textul</option>
                    <option value="exact">Potrivire exactă</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Tip răspuns</label>
                <div className="response-type-selector">
                  {['text', 'image', 'audio', 'call'].map(type => (
                    <button key={type} type="button"
                      className={`type-pick ${editingRule.responseType === type ? 'picked' : ''}`}
                      onClick={() => setEditingRule({ ...editingRule, responseType: type })}>
                      {type === 'text' && <><MessageSquareCode size={16} /> Text</>}
                      {type === 'image' && <><Image size={16} /> Poză</>}
                      {type === 'audio' && <><Music size={16} /> Audio</>}
                      {type === 'call' && <><PhoneCall size={16} /> Apel</>}
                    </button>
                  ))}
                </div>
              </div>
              {editingRule.responseType === 'text' && (
                <div className="form-group">
                  <label>Textul cu care răspunde contactul</label>
                  <textarea rows={4} placeholder="Scrieți textul răspunsului..."
                    value={editingRule.responseContent}
                    onChange={(e) => setEditingRule({ ...editingRule, responseContent: e.target.value })} />
                </div>
              )}
              {editingRule.responseType === 'image' && (
                <>
                  <div className="form-group">
                    <label>Link direct poză indiciu (URL)</label>
                    <input type="text" placeholder="https://..." value={editingRule.responseContent}
                      onChange={(e) => setEditingRule({ ...editingRule, responseContent: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Descriere poză (caption)</label>
                    <input type="text" value={editingRule.responseCaption || ''}
                      onChange={(e) => setEditingRule({ ...editingRule, responseCaption: e.target.value })} />
                  </div>
                </>
              )}
              {editingRule.responseType === 'audio' && (
                <div className="form-group">
                  <label>Text rostit sau descriere notă vocală</label>
                  <textarea rows={3} placeholder="Textul care va fi sintetizat vocal..."
                    value={editingRule.responseCaption}
                    onChange={(e) => setEditingRule({ ...editingRule, responseCaption: e.target.value })} />
                </div>
              )}
              {editingRule.responseType === 'call' && (
                <>
                  <div className="form-group">
                    <label>Replica șoptită în timpul apelului</label>
                    <input type="text" placeholder="ex. Privește sub podea..."
                      value={editingRule.callVoiceLine || ''}
                      onChange={(e) => setEditingRule({ ...editingRule, callVoiceLine: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Durată apel (secunde)</label>
                    <input type="number" min="5" max="60" value={editingRule.callDurationSec || 12}
                      onChange={(e) => setEditingRule({ ...editingRule, callDurationSec: parseInt(e.target.value) || 10 })} />
                  </div>
                </>
              )}
              <div className="form-group">
                <label>Întârziere înainte de răspuns (milisecunde)</label>
                <input type="number" step="500" min="500" max="10000" value={editingRule.delayMs || 1500}
                  onChange={(e) => setEditingRule({ ...editingRule, delayMs: parseInt(e.target.value) || 1500 })} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="admin-btn secondary" onClick={() => setEditingRule(null)}>Anulează</button>
              <button className="admin-btn primary" onClick={saveRule}>Salvează Regula</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ MODAL EDITARE REGULĂ NUMĂR SECRET / CURIER ══════════════════════════ */}
      {editingSecretTrigger && (
        <div className="modal-backdrop">
          <div className="edit-modal">
            <div className="modal-header">
              <h3>{secretTriggers.some(st => st.id === editingSecretTrigger.id) ? 'Editare Număr Secret' : 'Adăugare Număr Secret'}</h3>
              <button className="close-btn" onClick={() => setEditingSecretTrigger(null)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Număr de Telefon (pe care jucătorul îl va tasta la +) *</label>
                <input 
                  type="text" 
                  placeholder="ex. 0752593149"
                  value={editingSecretTrigger.phoneNumber}
                  onChange={(e) => setEditingSecretTrigger({ ...editingSecretTrigger, phoneNumber: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label>Nume Contact (cum va apărea salvat)</label>
                <input 
                  type="text" 
                  placeholder="ex. Curier Urgent (0752593149)"
                  value={editingSecretTrigger.contactName}
                  onChange={(e) => setEditingSecretTrigger({ ...editingSecretTrigger, contactName: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label>Status Contact</label>
                <input 
                  type="text" 
                  placeholder="ex. Livrări rapide sanatoriu"
                  value={editingSecretTrigger.contactStatus}
                  onChange={(e) => setEditingSecretTrigger({ ...editingSecretTrigger, contactStatus: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label>Mesajul trimis înapoi jucătorului la primul contact *</label>
                <textarea 
                  rows={4}
                  placeholder="Scrieți mesajul pe care îl va trimite automat când jucătorul îi scrie..."
                  value={editingSecretTrigger.responseMessage}
                  onChange={(e) => setEditingSecretTrigger({ ...editingSecretTrigger, responseMessage: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label>Întârziere tastare (milisecunde)</label>
                <input 
                  type="number" 
                  step="500"
                  value={editingSecretTrigger.delayMs || 1500}
                  onChange={(e) => setEditingSecretTrigger({ ...editingSecretTrigger, delayMs: parseInt(e.target.value) || 1500 })} 
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="admin-btn secondary" onClick={() => setEditingSecretTrigger(null)}>Anulează</button>
              <button className="admin-btn primary" onClick={saveSecretTrigger}>Salvează Regula Secretă</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ MODAL EDITARE CONTACT & ISTORIC MESAJE ══════════════════════════════ */}
      {editingContact && (
        <div className="modal-backdrop">
          <div className="edit-modal" style={{ maxWidth: 640 }}>
            <div className="modal-header">
              <h3>{contacts.some(c => c.id === editingContact.id) ? `Editare Contact: ${editingContact.name}` : 'Contact Nou'}</h3>
              <button className="close-btn" onClick={() => setEditingContact(null)}><X size={18} /></button>
            </div>
            <div className="modal-body" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Nume Contact *</label>
                  <input type="text" placeholder="ex. Farmacist Bogdan"
                    value={editingContact.name}
                    onChange={(e) => setEditingContact({ ...editingContact, name: e.target.value })} />
                </div>
                <div className="form-group flex-1">
                  <label>Status / Funcție</label>
                  <input type="text" placeholder="ex. La inventar"
                    value={editingContact.status}
                    onChange={(e) => setEditingContact({ ...editingContact, status: e.target.value })} />
                </div>
              </div>

              {/* Editare mesaje din istoric */}
              <div style={{ marginTop: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <label style={{ fontWeight: 600, color: 'var(--wa-green-light)', fontSize: 13 }}>
                    Mesaje din Istoricul Conversației ({editingContact.messages?.length || 0}):
                  </label>
                  <button type="button" className="admin-btn secondary mini-btn" onClick={addContactMessage}>
                    <Plus size={13} /> Adaugă Mesaj în Istoric
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {(editingContact.messages || []).map((msg, idx) => (
                    <div key={idx} style={{ 
                      background: msg.sender === 'me' ? 'rgba(0, 92, 75, 0.25)' : 'rgba(32, 44, 51, 0.7)',
                      border: '1px solid var(--wa-border)',
                      borderRadius: 8,
                      padding: 10
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: msg.sender === 'me' ? 'var(--wa-green-light)' : '#64b5f6' }}>
                            {msg.sender === 'me' ? 'Dr. Sterian (Eu)' : editingContact.name || 'Contact'}
                          </span>
                          <select 
                            value={msg.sender} 
                            onChange={(e) => updateContactMessage(idx, 'sender', e.target.value)}
                            style={{ padding: '2px 6px', fontSize: 11, background: '#111b21', color: 'white', border: '1px solid var(--wa-border)', borderRadius: 4 }}
                          >
                            <option value="them">Trimis de Contact</option>
                            <option value="me">Trimis de Doctor (Eu)</option>
                          </select>
                        </div>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <input 
                            type="text" 
                            value={msg.timestamp || '21:00'} 
                            onChange={(e) => updateContactMessage(idx, 'timestamp', e.target.value)}
                            style={{ width: 60, padding: '2px 4px', fontSize: 11, textAlign: 'center' }} 
                            title="Oră mesaj"
                          />
                          <button type="button" className="icon-btn danger" onClick={() => deleteContactMessage(idx)} title="Șterge mesaj">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                      <textarea 
                        rows={2}
                        value={msg.content}
                        onChange={(e) => updateContactMessage(idx, 'content', e.target.value)}
                        style={{ width: '100%', fontSize: 13, background: '#111b21', color: 'white', borderRadius: 4, padding: 6 }}
                      />
                    </div>
                  ))}

                  {(editingContact.messages?.length || 0) === 0 && (
                    <p style={{ fontSize: 12, color: 'var(--wa-text-muted)', fontStyle: 'italic' }}>
                      Niciun mesaj în istoric. Apasă pe „Adaugă Mesaj în Istoric” pentru a crea dialoguri preexistente.
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="admin-btn secondary" onClick={() => setEditingContact(null)}>Anulează</button>
              <button className="admin-btn primary" onClick={saveContact}>Salvează Modificările</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
