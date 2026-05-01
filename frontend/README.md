# VoiceAuth — Frontend

Clean, minimal voice-based authentication frontend.
Built with vanilla HTML, CSS, and JavaScript. No frameworks. No build tools.

---

## Folder Structure

```
frontend/
├── index.html          Landing page
├── register.html       5-step voice registration
├── login.html          2-step voice login
├── result.html         Result display (success / denied / error)
│
├── css/
│   ├── styles.css      Core design system (variables, typography, buttons)
│   ├── components.css  Page-specific components (waveform, cards, result)
│   └── responsive.css  Mobile & tablet breakpoints
│
├── js/
│   ├── config.js       API base URL — change this for deployment
│   ├── api.js          Backend calls (register, login, health)
│   ├── recorder.js     Microphone recording via MediaRecorder
│   ├── ui.js           Shared UI helpers (toast, waveform, health badge)
│   ├── register.js     5-step voice registration flow
│   ├── login.js        2-step voice login flow
│   └── result.js       Reads localStorage and renders result
│
└── assets/             Icons / SVGs (optional additions)
```

---

## 1. How to Run the Backend

```bash
cd Backend/
pip install -r requirements.txt
python app.py
```

Backend runs at: `http://127.0.0.1:5000`

---

## 2. How to Run the Frontend

**Option A — Python HTTP server:**
```bash
cd frontend/
python -m http.server 5500
```
Open: `http://localhost:5500`

**Option B — VS Code Live Server:**
Right-click `index.html` → Open with Live Server

---

## 3. How to Test Registration

1. Open `http://localhost:5500/register.html`
2. Enter a username and password
3. Click **Record** for each of the 5 voice samples
4. Speak the displayed phrase clearly when recording
5. After 5 samples, click **Register**
6. You'll be redirected to `result.html` showing success or failure

---

## 4. How to Test Login

1. Open `http://localhost:5500/login.html`
2. Enter the same username and password used during registration
3. Click **Record** for both voice samples
4. After 2 samples, click **Sign In**
5. `result.html` will show:
   - **Access Granted** (green) if `authenticated: true`
   - **Access Denied** (red) if `authenticated: false`
   - The voice similarity score is displayed as a ring chart

---

## 5. Changing the API URL for Deployment

Open `js/config.js` and update the `API_BASE_URL`:

```js
const CONFIG = {
  API_BASE_URL: "https://your-deployed-backend.com",  // ← change this
  ...
};
```

That's the only file you need to touch. All API calls read from this config.

---

## Notes

- Audio is recorded as `audio/webm` (browser native via MediaRecorder)
- The backend receives files named `register_sample_1.webm` … `register_sample_5.webm`
- Result data is passed via `localStorage` key `voiceAuthResult` (cleared after reading)
- The health badge in the navbar checks `GET /health` every page load
- Microphone is released immediately after each recording
