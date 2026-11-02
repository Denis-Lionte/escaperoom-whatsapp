export const INITIAL_DATA = {
  settings: {
    // Doctor Credentials (Player Login)
    doctorUsername: "Sterian",
    doctorPassword: "anokim24",
    doctorName: "Dr. Sterian",
    doctorStatus: "Senior Neuropathologist & Lead Experimenter (Room 402)",
    doctorAvatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80",

    // Admin Credentials (Game Master Login)
    adminUsername: "Admin",
    adminPassword: "Admin123",

    roomName: "Insane Asylum - Ward 9",
    autoTypingDelayMs: 1800,
  },
  contacts: [
    {
      id: "morgue",
      name: "Igor - Morgue Attendant",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      status: "Down in the cooler. Do not knock.",
      lastSeen: "online",
      unread: 1,
      messages: [
        {
          id: "m1",
          sender: "them",
          type: "text",
          content: "Doctor, specimen #49 has begun twitching again. Should I inject the blue stabilizer?",
          timestamp: "11:42 PM",
          status: "read",
        }
      ]
    },
    {
      id: "director",
      name: "Director Vance (Board of Health)",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      status: "Inspection tomorrow morning. Everything MUST be cleared.",
      lastSeen: "last seen today at 23:15",
      unread: 0,
      messages: [
        {
          id: "m2",
          sender: "them",
          type: "text",
          content: "If the ministry finds out what is happening in the sub-basement, we are all facing prison. Terminate the project immediately.",
          timestamp: "10:14 PM",
          status: "read",
        },
        {
          id: "m3",
          sender: "me",
          type: "text",
          content: "Science cannot be halted by bureaucratic cowards.",
          timestamp: "10:16 PM",
          status: "read",
        }
      ]
    },
    {
      id: "nurse_elena",
      name: "Head Nurse Elena",
      avatar: "https://images.unsplash.com/photo-1594824813629-79f884bf059e?w=150&auto=format&fit=crop&q=80",
      status: "Administering nightly sedation rounds",
      lastSeen: "online",
      unread: 1,
      messages: [
        {
          id: "m4",
          sender: "them",
          type: "text",
          content: "Doctor, where did you leave the key to the restraint closet? Patient in Bed 7 is breaking free!",
          timestamp: "11:50 PM",
          status: "read",
        }
      ]
    },
    {
      id: "cryptic_patient",
      name: "Subject 0 (Unknown)",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      status: "I CAN SEE YOU THROUGH THE WALLS",
      lastSeen: "typing...",
      unread: 0,
      messages: [
        {
          id: "m5",
          sender: "them",
          type: "text",
          content: "Tick tock, doctor. The shadows hunger.",
          timestamp: "11:58 PM",
          status: "read",
        }
      ]
    }
  ],
  rules: [
    {
      id: "rule_1",
      contactId: "nurse_elena",
      triggerType: "contains", // "contains" or "exact"
      triggerPhrase: "blue cabinet",
      responseType: "image", // "text", "image", "audio", "call"
      responseContent: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&auto=format&fit=crop&q=80",
      responseCaption: "Found it! Here is the photo of the drawer label. The keypad code scratched on it is [ 7 3 9 1 ]. Hurry!",
      delayMs: 2500,
      enabled: true
    },
    {
      id: "rule_2",
      contactId: "morgue",
      triggerType: "contains",
      triggerPhrase: "inject",
      responseType: "text",
      responseContent: "Understood Doctor. I administered 50cc of Formaldehyde B. Specimen stopped screaming. The cipher wheel under his autopsy table is set to 'DELTA-4'.",
      responseCaption: "",
      delayMs: 2000,
      enabled: true
    },
    {
      id: "rule_3",
      contactId: "cryptic_patient",
      triggerType: "contains",
      triggerPhrase: "who are you",
      responseType: "call",
      responseContent: "EERIE_STATIC",
      callAudioUrl: "",
      callDurationSec: 12,
      callVoiceLine: "Whispering: 'Look behind the painting... look behind the painting...'",
      responseCaption: "",
      delayMs: 1500,
      enabled: true
    },
    {
      id: "rule_4",
      contactId: "nurse_elena",
      triggerType: "contains",
      triggerPhrase: "antidote",
      responseType: "audio",
      responseContent: "AUDIO_VOICE_NOTE",
      responseCaption: "Voice note from Elena (0:14): 'Listen carefully! Mix flask 3 with flask 9, then pull the red lever!'",
      delayMs: 3000,
      enabled: true
    }
  ]
};
