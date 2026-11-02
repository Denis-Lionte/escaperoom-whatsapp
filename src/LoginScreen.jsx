import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, ArrowRight, AlertCircle, RotateCcw, Check } from 'lucide-react';

export default function LoginScreen({ settings, onDoctorLogin, onAdminLogin, onResetDefaults }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const u = username.trim();
    const p = password.trim();

    const doctorUser = (settings.doctorUsername || 'Sterian');
    const doctorPass = (settings.doctorPassword || 'anokim24');
    const adminUser  = (settings.adminUsername  || 'Admin');
    const adminPass  = (settings.adminPassword  || 'Admin123');

    if (u === doctorUser && p === doctorPass) {
      onDoctorLogin();
      return;
    }

    if (u === adminUser && p === adminPass) {
      onAdminLogin();
      return;
    }

    setError('Incorrect username or password.');
    setPassword('');
  };

  const handleReset = () => {
    if (window.confirm('Restore everything to the default scenario? This resets all contacts, triggers, and credentials.')) {
      onResetDefaults();
      setResetSuccess(true);
      setUsername('');
      setPassword('');
      setError('');
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  return (
    <div className="login-container">
      {/* Top bar */}
      <div className="login-top-bar">
        <div className="login-brand">
          <svg viewBox="0 0 39 39" width="32" height="32">
            <path fill="#00a884" d="M19.5 0C8.75 0 0 8.75 0 19.5c0 3.44.89 6.67 2.45 9.48L.5 38.5l9.8-2.52C13 37.8 16.14 39 19.5 39 30.25 39 39 30.25 39 19.5 39 8.75 30.25 0 19.5 0z"/>
            <path fill="#fff" d="M19.5 35.8c-2.97 0-5.88-.8-8.43-2.31l-.6-.36-5.82 1.5 1.55-5.67-.4-.63C4.22 25.8 3.3 22.7 3.3 19.5 3.3 10.57 10.57 3.3 19.5 3.3c4.33 0 8.4 1.69 11.46 4.75A16.12 16.12 0 0 1 35.7 19.5c0 8.93-7.27 16.3-16.2 16.3zm8.93-12.21c-.49-.25-2.9-1.43-3.35-1.59-.45-.17-.78-.25-1.11.25-.33.49-1.28 1.59-1.57 1.92-.29.33-.58.37-1.07.12-.49-.25-2.08-.77-3.96-2.45-1.46-1.3-2.45-2.91-2.74-3.4-.29-.49-.03-.76.22-1 .22-.22.49-.57.74-.86.25-.29.33-.49.5-.82.16-.33.08-.62-.04-.86-.12-.25-1.11-2.67-1.52-3.66-.4-.96-.81-.83-1.11-.84h-.95c-.33 0-.86.12-1.31.62-.45.49-1.73 1.69-1.73 4.12s1.77 4.78 2.02 5.11c.25.33 3.48 5.31 8.43 7.45 1.18.51 2.1.81 2.82 1.04 1.18.38 2.26.32 3.11.2 1.05-.16 2.9-1.18 3.31-2.32.41-1.15.41-2.13.29-2.34-.12-.21-.45-.33-.94-.58z"/>
          </svg>
          <span className="brand-text">WHATSAPP WEB — INTRANET WORKSTATION</span>
        </div>
        <button type="button" className="restore-defaults-btn" onClick={handleReset}>
          {resetSuccess ? <Check size={14} /> : <RotateCcw size={14} />}
          <span>{resetSuccess ? 'Restored!' : 'Restore Defaults'}</span>
        </button>
      </div>

      {/* Card */}
      <div className="login-card-wrapper">
        <div className="login-card">
          {/* Identity header */}
          <div className="login-identity-header">
            <img
              src={settings.doctorAvatar}
              alt="Staff"
              className="doctor-avatar"
              onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=Staff&background=1f2c34&color=25d366'; }}
            />
            <h3>{settings.roomName || 'Insane Asylum — Ward 9'}</h3>
            <p className="status-quote">Secure Staff Workstation · Authorised Personnel Only</p>
          </div>

          <form className="login-body" onSubmit={handleSubmit}>
            {error && (
              <div className="error-badge">
                <AlertCircle size={15} />
                <span>{error}</span>
              </div>
            )}

            {/* Username */}
            <div className="input-group">
              <label>Username</label>
              <div className="input-with-icon">
                <User size={16} className="input-icon" />
                <input
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  onChange={(e) => { setUsername(e.target.value); setError(''); }}
                  autoFocus
                  required
                />
              </div>
            </div>

            {/* Password with show/hide toggle */}
            <div className="input-group">
              <label>Password</label>
              <div className="input-with-icon">
                <Lock size={16} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  autoComplete="current-password"
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  required
                />
                <button
                  type="button"
                  className="show-password-btn"
                  onClick={() => setShowPassword(v => !v)}
                  tabIndex={-1}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="login-submit-btn">
              <span>Sign In</span>
              <ArrowRight size={17} />
            </button>
          </form>

          <div className="login-footer">
            <span className="sanatorium-name">{settings.roomName || 'St. Jude Psychiatric Sanatorium'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
