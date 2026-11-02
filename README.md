# WhatsApp Web Escape Room Interface (Crazy Doctor Theme)

Realistic WhatsApp Web interface for escape room tablets (especially iPads locked down in kiosk mode).

## 🚀 Live Access
- **Local:** [http://localhost:5173/](http://localhost:5173/)
- **iPad on local Wi-Fi:** `http://192.168.0.100:5173/`

---

## 🔑 Login Accounts (Username & Password)

| Role | Username | Password | Purpose |
|---|---|---|---|
| **Doctor Account** (Player) | `dr.moreau` | `insane402` | Player correspondence workstation |
| **Admin Account** (Game Master) | `admin` | `gamemaster99` | Rule creation, live simulation, scenario editing |

*(Both usernames and passwords can be changed inside Admin Dashboard > Credentials tab).*

---

## 🔄 Restore to Defaults
- A prominent **"Restore Defaults"** button is on both the **Login screen** and inside the **Admin header**.
- Clicking it immediately resets all contacts, triggers, passwords, and clues back to the original crazy doctor scenario.

---

## 🛡️ Security Isolation
- When logged into the Doctor Account, **all Admin links and buttons are completely removed**.
- Players cannot access, view, or enter the Admin section from within the chat.
- Only users with the Admin username & password can enter the Admin dashboard.

---

## 👁️ Full Scenario Preview (Admin Side)
- Under the **"Full Scenario Preview"** tab in Admin, you can select any contact to preview the entire conversation:
  - Initial message history.
  - Every player trigger prompt simulated in sequence.
  - Every contact response (text, photo clue, voice note with waveform, or simulated incoming call banner).

---

## ⚡ Faster & Easier Admin Editing
- **Instant Save:** Modifying or adding rules automatically applies immediately.
- **One-click Active/Disabled Toggles:** Turn individual triggers on/off without deleting them.
- **Quick Edit:** Dedicated modal with clear dropdowns, match types (`contains` or `exact`), delay controls, and preset test values.
