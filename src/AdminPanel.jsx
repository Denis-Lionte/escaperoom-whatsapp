import React, { useState } from 'react';
import {
  ShieldCheck, Settings, Users, MessageSquareCode, Plus, Trash2,
  Save, RotateCcw, Image, PhoneCall, Music, Check, Eye,
  HelpCircle, Download, Upload, LogOut, CheckCheck, Play, X, Edit3
} from 'lucide-react';

export default function AdminPanel({ data, onSaveData, onResetDefaults, onLogout }) {
  const [activeTab, setActiveTab] = useState('contacts'); // 'contacts' | 'rules' | 'preview' | 'settings' | 'guide'
  const [rules, setRules] = useState(data.rules || []);
  const [contacts, setContacts] = useState(data.contacts || []);
  const [settings, setSettings] = useState(data.settings || {});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [editingContact, setEditingContact] = useState(null);
  const [previewContactId, setPreviewContactId] = useState(data.contacts[0]?.id || '');

  const persist = (newRules, newContacts, newSettings) => {
    const payload = { ...data, rules: newRules, contacts: newContacts, settings: newSettings };
    onSaveData(payload);
  };

  const handleSaveAll = () => {
    persist(rules, contacts, settings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2200);
  };

  // ─── Rule helpers ─────────────────────────────────────────────────────────────
  const saveRule = () => {
    if (!editingRule.triggerPhrase.trim()) { alert('A trigger phrase is required.'); return; }
    const exists = rules.some(r => r.id === editingRule.id);
    const updated = exists
      ? rules.map(r => r.id === editingRule.id ? editingRule : r)
      : [...rules, editingRule];
    setRules(updated);
    persist(updated, contacts, settings);
    setEditingRule(null);
  };

  const deleteRule = (id) => {
    if (!window.confirm('Delete this rule?')) return;
    const updated = rules.filter(r => r.id !== id);
    setRules(updated);
    persist(updated, contacts, settings);
  };

  const toggleRule = (id) => {
    const updated = rules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r);
    setRules(updated);
    persist(updated, contacts, settings);
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
    if (!editingContact.name.trim()) { alert('Name is required.'); return; }
    const exists = contacts.some(c => c.id === editingContact.id);
    const updated = exists
      ? contacts.map(c => c.id === editingContact.id ? editingContact : c)
      : [...contacts, editingContact];
    setContacts(updated);
    persist(rules, updated, settings);
    setEditingContact(null);
  };

  const deleteContact = (id) => {
    if (!window.confirm('Delete contact and all its rules?')) return;
    const updatedContacts = contacts.filter(c => c.id !== id);
    const updatedRules = rules.filter(r => r.contactId !== id);
    setContacts(updatedContacts);
    setRules(updatedRules);
    persist(updatedRules, updatedContacts, settings);
  };

  // ─── Export / Import ──────────────────────────────────────────────────────────
  const handleExport = () => {
    const blob = new Blob([JSON.stringify({ settings, contacts, rules }, null, 2)], { type: 'application/json' });
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
        if (parsed.rules && parsed.contacts && parsed.settings) {
          setRules(parsed.rules);
          setContacts(parsed.contacts);
          setSettings(parsed.settings);
          onSaveData(parsed);
          alert('Scenario imported successfully!');
        } else { alert('Invalid file format.'); }
      } catch (err) { alert('Parse error: ' + err.message); }
    };
    reader.readAsText(file);
  };

  // ─── Preview ──────────────────────────────────────────────────────────────────
  const previewContact = contacts.find(c => c.id === previewContactId) || contacts[0];
  const previewRules = rules.filter(r => r.contactId === previewContact?.id);

  const TABS = [
    { id: 'contacts', label: 'Contacts & Auto-Reply', icon: <Users size={17} /> },
    { id: 'rules', label: `All Rules (${rules.length})`, icon: <MessageSquareCode size={17} /> },
    { id: 'preview', label: 'Scenario Preview', icon: <Eye size={17} /> },
    { id: 'settings', label: 'Credentials', icon: <Settings size={17} /> },
    { id: 'guide', label: 'iPad Lockdown', icon: <HelpCircle size={17} /> },
  ];

  return (
    <div className="admin-container">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-title-area">
          <ShieldCheck size={26} className="admin-badge-icon" />
          <div>
            <h2>Game Master Dashboard</h2>
            <p className="admin-sub">Escape Room Trigger Engine & Scenario Editor</p>
          </div>
        </div>
        <div className="admin-action-bar">
          <button className="admin-btn restore-btn" onClick={() => { if (window.confirm('Restore all defaults?')) onResetDefaults(); }}>
            <RotateCcw size={14} /> Restore Defaults
          </button>
          <button className="admin-btn secondary" onClick={handleExport}><Download size={14} /> Export</button>
          <label className="admin-btn secondary upload-btn">
            <Upload size={14} /> Import
            <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
          </label>
          <button className="admin-btn save-btn" onClick={handleSaveAll}>
            {saveSuccess ? <Check size={15} /> : <Save size={15} />}
            {saveSuccess ? 'Saved!' : 'Save All'}
          </button>
          <button className="admin-btn logout-btn" onClick={onLogout}><LogOut size={15} /> Exit</button>
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

        {/* ══ CONTACTS & AUTO-REPLY TAB ════════════════════════════════════════════
            This is the main operational tab: admin sees each contact and whether
            it has auto-reply rules configured. Can add contacts here too.       */}
        {activeTab === 'contacts' && (
          <div>
            <div className="section-toolbar">
              <div className="section-desc">
                <h3>Contacts & Auto-Response Setup</h3>
                <p>
                  Configure which contacts automatically respond when the player texts them a keyword.
                  Contacts without rules will receive messages but never reply.
                </p>
              </div>
              <button className="admin-btn primary" onClick={() => setEditingContact({
                id: `contact_${Date.now()}`, name: '', avatar: '', status: '', lastSeen: 'online', unread: 0, messages: []
              })}>
                <Plus size={15} /> Add Contact
              </button>
            </div>

            <div className="contacts-admin-grid">
              {contacts.map(contact => {
                const contactRules = rules.filter(r => r.contactId === contact.id);
                const hasRules = contactRules.length > 0;

                return (
                  <div key={contact.id} className="contact-admin-card">
                    {/* Contact identity */}
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
                      </div>
                      <div className="contact-card-actions">
                        <button className="icon-btn" onClick={() => setEditingContact(contact)} title="Edit contact"><Edit3 size={15} /></button>
                        <button className="icon-btn danger" onClick={() => deleteContact(contact.id)} title="Delete"><Trash2 size={15} /></button>
                      </div>
                    </div>

                    {/* Auto-reply rules for this contact */}
                    <div className="contact-rules-section">
                      <div className="contact-rules-header">
                        <span className={`auto-reply-badge ${hasRules ? 'active' : 'inactive'}`}>
                          {hasRules ? `✓ Auto-Reply Active (${contactRules.length} rule${contactRules.length > 1 ? 's' : ''})` : '✗ No Auto-Reply'}
                        </span>
                        <button
                          className="admin-btn secondary mini-btn"
                          onClick={() => setEditingRule(newRule(contact.id))}
                        >
                          <Plus size={12} /> Add Rule
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
                                  → {rule.responseType === 'call' ? '📞 Call' : rule.responseType === 'image' ? '📷 Photo' : rule.responseType === 'audio' ? '🎤 Audio' : `💬 "${rule.responseContent?.slice(0, 40)}${rule.responseContent?.length > 40 ? '…' : ''}"`}
                                </span>
                              </div>
                              <div className="rule-row-actions">
                                <button className="icon-btn" onClick={() => setEditingRule(rule)} title="Edit"><Edit3 size={13} /></button>
                                <label className="small-toggle" title="Enable/Disable">
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

              {contacts.length === 0 && (
                <div className="empty-state">
                  <Users size={40} />
                  <h4>No Contacts Yet</h4>
                  <p>Add contacts for the Doctor to message, then configure which ones auto-reply.</p>
                  <button className="admin-btn primary" onClick={() => setEditingContact({ id: `contact_${Date.now()}`, name: '', avatar: '', status: '', lastSeen: 'online', unread: 0, messages: [] })}>
                    Add First Contact
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ ALL RULES TAB ══════════════════════════════════════════════════════ */}
        {activeTab === 'rules' && (
          <div className="rules-section">
            <div className="section-toolbar">
              <div className="section-desc">
                <h3>All Trigger Rules</h3>
                <p>When the player texts a matching keyword to a contact, the contact responds automatically.</p>
              </div>
              <button className="admin-btn primary" onClick={() => setEditingRule(newRule())}>
                <Plus size={15} /> Add Rule
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
                          {rule.responseType === 'text' && <MessageSquareCode size={12} />}
                          {rule.responseType === 'image' && <Image size={12} />}
                          {rule.responseType === 'audio' && <Music size={12} />}
                          {rule.responseType === 'call' && <PhoneCall size={12} />}
                          {rule.responseType.toUpperCase()}
                        </span>
                        <span className="target-contact-pill">Contact: <b>{contact?.name || 'Unknown'}</b></span>
                      </div>
                      <div className="rule-actions">
                        <button className="admin-btn secondary mini-btn" onClick={() => setEditingRule(rule)}>Edit</button>
                        <button className="icon-btn danger" onClick={() => deleteRule(rule.id)}><Trash2 size={14} /></button>
                      </div>
                    </div>

                    <div className="rule-body">
                      <div className="condition-row">
                        <span className="label">If player texts:</span>
                        <code className="phrase-badge">"{rule.triggerPhrase}"</code>
                        <span className="match-tag">({rule.triggerType})</span>
                      </div>
                      <div className="response-row">
                        <span className="label">Response:</span>
                        {rule.responseType === 'text' && <p className="response-preview text-preview">"{rule.responseContent}"</p>}
                        {rule.responseType === 'image' && (
                          <div className="media-preview-box">
                            <img src={rule.responseContent} alt="" onError={(e) => { e.target.style.display = 'none'; }} />
                            {rule.responseCaption && <p className="caption-preview">"{rule.responseCaption}"</p>}
                          </div>
                        )}
                        {rule.responseType === 'audio' && <div className="audio-preview-box"><Music size={14} /> <span>"{rule.responseCaption}"</span></div>}
                        {rule.responseType === 'call' && <div className="call-preview-box"><PhoneCall size={14} /> <span>Call: "{rule.callVoiceLine}"</span></div>}
                      </div>
                      <div className="rule-footer">
                        <span>Delay: {rule.delayMs}ms</span>
                        <label className="toggle-label">
                          <input type="checkbox" checked={rule.enabled !== false} onChange={() => toggleRule(rule.id)} />
                          <span>{rule.enabled !== false ? 'Active' : 'Disabled'}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                );
              })}

              {rules.length === 0 && (
                <div className="empty-state">
                  <MessageSquareCode size={40} />
                  <h4>No Rules Yet</h4>
                  <p>Go to the "Contacts & Auto-Reply" tab to add rules per contact, or click below.</p>
                  <button className="admin-btn primary" onClick={() => setEditingRule(newRule())}>Create First Rule</button>
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
                <h3>Full Scenario Preview</h3>
                <p>How the entire conversation looks if the player triggers every clue in order.</p>
              </div>
              <div className="preview-selector">
                <label>Contact: </label>
                <select value={previewContactId} onChange={(e) => setPreviewContactId(e.target.value)} className="contact-select-dropdown">
                  {contacts.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({rules.filter(r => r.contactId === c.id).length} rules)</option>
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
                  <div className="preview-badge-tag">Simulated Conversation</div>
                </div>

                <div className="preview-messages-flow">
                  {previewContact.messages?.map((msg, i) => (
                    <div key={i} className={`preview-msg-bubble ${msg.sender === 'me' ? 'out' : 'in'}`}>
                      <div className="preview-label-tag">Initial history</div>
                      <p>{msg.content}</p>
                      <span className="preview-time">{msg.timestamp || '11:42 PM'}</span>
                    </div>
                  ))}

                  {previewRules.map((rule, idx) => (
                    <React.Fragment key={rule.id}>
                      <div className="preview-msg-bubble out triggered">
                        <div className="preview-label-tag">Player types trigger #{idx + 1}</div>
                        <p><b>"{rule.triggerPhrase}"</b></p>
                        <span className="preview-time">
                          12:0{idx + 1} AM <CheckCheck size={12} className="read-tick" />
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
                            <div><p className="audio-voice-title">Voice Note</p><small>{rule.responseCaption}</small></div>
                          </div>
                        )}
                        {rule.responseType === 'call' && (
                          <div className="preview-call-banner">
                            <PhoneCall size={18} className="call-ico" />
                            <div><strong>Incoming Call</strong><p><i>"{rule.callVoiceLine}"</i></p></div>
                          </div>
                        )}
                        <span className="preview-time">12:0{idx + 1} AM</span>
                      </div>
                    </React.Fragment>
                  ))}

                  {previewRules.length === 0 && (
                    <div className="no-rules-callout">
                      <p>No rules for this contact yet. Add them in the "Contacts & Auto-Reply" tab.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ SETTINGS TAB ══════════════════════════════════════════════════════ */}
        {activeTab === 'settings' && (
          <div className="settings-section">
            <div className="settings-card">
              <h3>Doctor Account (Player Login)</h3>
              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Username</label>
                  <input type="text" value={settings.doctorUsername || ''} onChange={(e) => setSettings({ ...settings, doctorUsername: e.target.value })} />
                </div>
                <div className="form-group flex-1">
                  <label>Password</label>
                  <input type="text" value={settings.doctorPassword || ''} onChange={(e) => setSettings({ ...settings, doctorPassword: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Doctor Display Name</label>
                <input type="text" value={settings.doctorName || ''} onChange={(e) => setSettings({ ...settings, doctorName: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Doctor Status</label>
                <input type="text" value={settings.doctorStatus || ''} onChange={(e) => setSettings({ ...settings, doctorStatus: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Doctor Avatar URL</label>
                <input type="text" value={settings.doctorAvatar || ''} onChange={(e) => setSettings({ ...settings, doctorAvatar: e.target.value })} />
              </div>
            </div>

            <div className="settings-card">
              <h3>Admin / Game Master Account</h3>
              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Username</label>
                  <input type="text" value={settings.adminUsername || ''} onChange={(e) => setSettings({ ...settings, adminUsername: e.target.value })} />
                </div>
                <div className="form-group flex-1">
                  <label>Password</label>
                  <input type="text" value={settings.adminPassword || ''} onChange={(e) => setSettings({ ...settings, adminPassword: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Room Name</label>
                <input type="text" value={settings.roomName || ''} onChange={(e) => setSettings({ ...settings, roomName: e.target.value })} />
              </div>
            </div>

            <button className="admin-btn save-btn" style={{ marginTop: 8 }} onClick={handleSaveAll}>
              {saveSuccess ? <Check size={15} /> : <Save size={15} />} Save Credentials
            </button>

            <div className="reset-box">
              <button className="admin-btn restore-btn" onClick={() => { if (window.confirm('Restore all defaults?')) onResetDefaults(); }}>
                <RotateCcw size={15} /> Reset Everything to Factory Defaults
              </button>
            </div>
          </div>
        )}

        {/* ══ IPAD GUIDE TAB ════════════════════════════════════════════════════ */}
        {activeTab === 'guide' && (
          <div className="guide-section">
            <div className="guide-card">
              <h3>How to Lock Down an iPad (Kiosk / Guided Access)</h3>
              <ol className="step-list">
                <li><strong>Enable Guided Access:</strong><p>Settings → Accessibility → Guided Access → ON. Set a passcode only Game Masters know.</p></li>
                <li><strong>Add to Home Screen (no browser bar):</strong><p>Open this app's URL in Safari → Share button → "Add to Home Screen".</p></li>
                <li><strong>Launch from Home Screen</strong> — it opens fullscreen, no Safari address bar.</li>
                <li><strong>Activate Kiosk Lock:</strong><p>Triple-click the Power / Top button → tap Start.</p></li>
                <li><strong>To unlock:</strong><p>Triple-click again → enter your passcode → tap End.</p></li>
              </ol>
            </div>
          </div>
        )}
      </div>

      {/* ══ EDIT RULE MODAL ═══════════════════════════════════════════════════════ */}
      {editingRule && (
        <div className="modal-backdrop">
          <div className="edit-modal">
            <div className="modal-header">
              <h3>{rules.some(r => r.id === editingRule.id) ? 'Edit Rule' : 'New Trigger Rule'}</h3>
              <button className="close-btn" onClick={() => setEditingRule(null)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Target Contact (who will auto-respond)</label>
                <select value={editingRule.contactId} onChange={(e) => setEditingRule({ ...editingRule, contactId: e.target.value })}>
                  {contacts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group flex-2">
                  <label>Trigger Keyword / Password</label>
                  <input type="text" placeholder='e.g. "blue cabinet", "inject", "who are you"'
                    value={editingRule.triggerPhrase}
                    onChange={(e) => setEditingRule({ ...editingRule, triggerPhrase: e.target.value })} />
                </div>
                <div className="form-group flex-1">
                  <label>Match Type</label>
                  <select value={editingRule.triggerType} onChange={(e) => setEditingRule({ ...editingRule, triggerType: e.target.value })}>
                    <option value="contains">Contains</option>
                    <option value="exact">Exact Match</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Response Type</label>
                <div className="response-type-selector">
                  {['text', 'image', 'audio', 'call'].map(type => (
                    <button key={type} type="button"
                      className={`type-pick ${editingRule.responseType === type ? 'picked' : ''}`}
                      onClick={() => setEditingRule({ ...editingRule, responseType: type })}>
                      {type === 'text' && <><MessageSquareCode size={16} /> Text</>}
                      {type === 'image' && <><Image size={16} /> Photo</>}
                      {type === 'audio' && <><Music size={16} /> Audio</>}
                      {type === 'call' && <><PhoneCall size={16} /> Call</>}
                    </button>
                  ))}
                </div>
              </div>
              {editingRule.responseType === 'text' && (
                <div className="form-group">
                  <label>Contact's Reply Text</label>
                  <textarea rows={4} placeholder="The contact will send this message automatically..."
                    value={editingRule.responseContent}
                    onChange={(e) => setEditingRule({ ...editingRule, responseContent: e.target.value })} />
                </div>
              )}
              {editingRule.responseType === 'image' && (
                <>
                  <div className="form-group">
                    <label>Image URL</label>
                    <input type="text" placeholder="https://..." value={editingRule.responseContent}
                      onChange={(e) => setEditingRule({ ...editingRule, responseContent: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Caption (optional)</label>
                    <input type="text" value={editingRule.responseCaption || ''}
                      onChange={(e) => setEditingRule({ ...editingRule, responseCaption: e.target.value })} />
                  </div>
                </>
              )}
              {editingRule.responseType === 'audio' && (
                <div className="form-group">
                  <label>Voice Note Caption / Spoken Clue</label>
                  <textarea rows={3} placeholder="The text that will be spoken as an audio clue..."
                    value={editingRule.responseCaption}
                    onChange={(e) => setEditingRule({ ...editingRule, responseCaption: e.target.value })} />
                </div>
              )}
              {editingRule.responseType === 'call' && (
                <>
                  <div className="form-group">
                    <label>Voice Line Spoken During Call</label>
                    <input type="text" placeholder="e.g. Look beneath the floor..."
                      value={editingRule.callVoiceLine || ''}
                      onChange={(e) => setEditingRule({ ...editingRule, callVoiceLine: e.target.value })} />
                    <small className="help-text">The browser synthesizes an eerie whisper voice saying this.</small>
                  </div>
                  <div className="form-group">
                    <label>Call Duration (seconds)</label>
                    <input type="number" min="5" max="60" value={editingRule.callDurationSec || 12}
                      onChange={(e) => setEditingRule({ ...editingRule, callDurationSec: parseInt(e.target.value) || 10 })} />
                  </div>
                </>
              )}
              <div className="form-group">
                <label>Typing Delay before response (ms)</label>
                <input type="number" step="500" min="500" max="10000" value={editingRule.delayMs || 1500}
                  onChange={(e) => setEditingRule({ ...editingRule, delayMs: parseInt(e.target.value) || 1500 })} />
                <small className="help-text">Contact shows "typing..." for this many milliseconds before replying.</small>
              </div>
            </div>
            <div className="modal-footer">
              <button className="admin-btn secondary" onClick={() => setEditingRule(null)}>Cancel</button>
              <button className="admin-btn primary" onClick={saveRule}>Save Rule</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ EDIT CONTACT MODAL ════════════════════════════════════════════════════ */}
      {editingContact && (
        <div className="modal-backdrop">
          <div className="edit-modal" style={{ maxWidth: 480 }}>
            <div className="modal-header">
              <h3>{contacts.some(c => c.id === editingContact.id) ? 'Edit Contact' : 'New Contact'}</h3>
              <button className="close-btn" onClick={() => setEditingContact(null)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Name *</label>
                <input type="text" placeholder="e.g. Head Nurse Elena"
                  value={editingContact.name}
                  onChange={(e) => setEditingContact({ ...editingContact, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Status / About</label>
                <input type="text" placeholder="e.g. On duty in Ward 4"
                  value={editingContact.status}
                  onChange={(e) => setEditingContact({ ...editingContact, status: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Avatar Image URL</label>
                <input type="text" placeholder="https://..."
                  value={editingContact.avatar}
                  onChange={(e) => setEditingContact({ ...editingContact, avatar: e.target.value })} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="admin-btn secondary" onClick={() => setEditingContact(null)}>Cancel</button>
              <button className="admin-btn primary" onClick={saveContact}>Save Contact</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
