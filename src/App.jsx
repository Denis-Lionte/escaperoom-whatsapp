import React, { useState, useEffect } from 'react';
import { INITIAL_DATA } from './defaultData';
import LoginScreen from './LoginScreen';
import WhatsAppWeb from './WhatsAppWeb';
import AdminPanel from './AdminPanel';
import './App.css';

const STORAGE_KEY = 'escaperoom_wa_data_v6'; // bumped to activate custom secret triggers system

export default function App() {
  const [session, setSession] = useState('login'); // 'login' | 'doctor' | 'admin'
  const [appData, setAppData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Error loading saved escaperoom data", e);
    }
    return INITIAL_DATA;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
    } catch (e) {
      console.warn("Error saving to localStorage", e);
    }
  }, [appData]);

  // Handle messages update during play
  const handleUpdateMessages = (updatedContacts) => {
    setAppData(prev => ({
      ...prev,
      contacts: updatedContacts
    }));
  };

  // Handle Admin saving updated rules / settings
  const handleSaveData = (newData) => {
    setAppData(newData);
  };

  // Reset to factory defaults
  const handleResetDefaults = () => {
    setAppData(INITIAL_DATA);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="escaperoom-root">
      {session === 'login' && (
        <LoginScreen
          settings={appData.settings}
          onDoctorLogin={() => setSession('doctor')}
          onAdminLogin={() => setSession('admin')}
          onResetDefaults={handleResetDefaults}
        />
      )}

      {session === 'doctor' && (
        <WhatsAppWeb
          data={appData}
          onUpdateMessages={handleUpdateMessages}
          onLogout={() => setSession('login')}
        />
      )}

      {session === 'admin' && (
        <AdminPanel
          data={appData}
          onSaveData={handleSaveData}
          onResetDefaults={handleResetDefaults}
          onLogout={() => setSession('login')}
        />
      )}
    </div>
  );
}
