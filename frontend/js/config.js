// ─────────────────────────────────────────────
//  config.js  –  Central configuration
//  Change API_BASE_URL here for deployment
// ─────────────────────────────────────────────

const CONFIG = {
  API_BASE_URL: "http://127.0.0.1:5000",

  // Recording durations (ms)
  RECORD_DURATION_MS: 4000,

  // Voice prompts
  REGISTER_PROMPTS: [
    "My voice is my password",
    "My voice is my password",
    "My voice is my password",
    "I am verifying my identity",
    "Access should be granted only to me",
  ],

  LOGIN_PROMPTS: [
    "My voice is my password",
    "I am verifying my identity",
  ],
};
