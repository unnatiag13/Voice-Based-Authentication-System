// ─────────────────────────────────────────────
//  api.js  –  Backend communication layer
// ─────────────────────────────────────────────

const API = (() => {
  /**
   * Register a new user with voice samples.
   * @param {string} username
   * @param {string} password
   * @param {Blob[]} audioBlobs – 5 audio blobs
   */
  async function registerUser(username, password, audioBlobs) {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    audioBlobs.forEach((blob, i) => {
      formData.append("audio", blob, `register_sample_${i + 1}.webm`);
    });

    const response = await fetch(`${CONFIG.API_BASE_URL}/register`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Registration failed.");
    return data;
  }

  /**
   * Authenticate a user with voice samples.
   * @param {string} username
   * @param {string} password
   * @param {Blob[]} audioBlobs – 2 audio blobs
   */
 async function loginUser(username, password, audioBlobs) {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);

  audioBlobs.forEach((blob, i) => {
    formData.append("audio", blob, `login_sample_${i + 1}.webm`);
  });

  // Remove the try/catch — let login.js handle errors
  const response = await fetch(`${CONFIG.API_BASE_URL}/login`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  // Return regardless of status — don't throw
  return data;
}

  /**
   * Health check – returns true if backend is reachable.
   */
  async function checkHealth() {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/health`, {
        method: "GET",
        signal: AbortSignal.timeout(3000),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  return { registerUser, loginUser, checkHealth };
})();
