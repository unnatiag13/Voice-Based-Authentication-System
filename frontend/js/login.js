// ─────────────────────────────────────────────
//  login.js  –  2-step voice login flow
// ─────────────────────────────────────────────

(function () {
  const TOTAL = 2;
  const prompts = CONFIG.LOGIN_PROMPTS;
  const audioBlobs = [];
  let currentStep = 0;
  let isRecording = false;

  // DOM refs
  const promptText  = document.getElementById("prompt-text");
  const stepCounter = document.getElementById("step-counter");
  const recordBtn   = document.getElementById("record-btn");
  const submitBtn   = document.getElementById("submit-btn");
  const statusMsg   = document.getElementById("status-msg");
  const timerBar    = document.getElementById("timer-bar");
  const stepsTrack  = document.getElementById("steps-track");

  // ── Init ──────────────────────────────────────
  function init() {
    UI.initHealthBadge();
    renderStepDots();
    updateUI();

    recordBtn.addEventListener("click", handleRecord);
    submitBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        handleSubmit();
      });
  }

  // ── Step dots ─────────────────────────────────
  function renderStepDots() {
    if (!stepsTrack) return;
    stepsTrack.innerHTML = "";
    for (let i = 0; i < TOTAL; i++) {
      const dot = document.createElement("div");
      dot.className = "step-dot";
      dot.id = `dot-${i}`;
      stepsTrack.appendChild(dot);
    }
  }

  function updateStepDots() {
    for (let i = 0; i < TOTAL; i++) {
      const dot = document.getElementById(`dot-${i}`);
      if (!dot) continue;
      dot.className = "step-dot";
      if (i < audioBlobs.length) dot.classList.add("done");
      else if (i === currentStep) dot.classList.add("active");
    }
  }

  // ── Update UI ─────────────────────────────────
  function updateUI() {
    const done = audioBlobs.length;

    promptText.textContent  = done < TOTAL ? prompts[currentStep] : "Voice samples ready ✓";
    stepCounter.textContent = `${done} / ${TOTAL}`;
    submitBtn.disabled      = done < TOTAL;

    updateStepDots();

    if (done > 0 && done < TOTAL) {
      setStatus(`Sample ${done} saved. ${TOTAL - done} more needed.`, "success");
    } else if (done === TOTAL) {
      setStatus("Voice captured. Click Login to verify.", "success");
    } else {
      setStatus("Press Record and speak the phrase clearly.", "neutral");
    }
  }

  function setStatus(msg, type = "neutral") {
    if (!statusMsg) return;
    statusMsg.textContent = msg;
    statusMsg.className   = `status-msg status-${type}`;
  }

  // ── Recording handler ─────────────────────────
  async function handleRecord() {
    if (isRecording || audioBlobs.length >= TOTAL) return;

    isRecording = true;
    recordBtn.disabled = true;
    recordBtn.textContent = "Recording…";
    UI.startWaveform("waveform");
    setStatus("Speak the phrase now…", "recording");

    timerBar.style.transition = "none";
    timerBar.style.width = "0%";
    requestAnimationFrame(() => {
      timerBar.style.transition = `width ${CONFIG.RECORD_DURATION_MS}ms linear`;
      timerBar.style.width = "100%";
    });

    try {
      const blob = await Recorder.recordAudio(CONFIG.RECORD_DURATION_MS);
      audioBlobs.push(blob);
      currentStep = audioBlobs.length < TOTAL ? audioBlobs.length : TOTAL - 1;
      updateUI();
    } catch (err) {
      setStatus(err.message, "error");
      UI.showToast(err.message, "error");
    } finally {
      isRecording = false;
      recordBtn.disabled = audioBlobs.length >= TOTAL;
      recordBtn.textContent = audioBlobs.length >= TOTAL ? "Done" : "Record";
      UI.stopWaveform("waveform");

      timerBar.style.transition = "none";
      timerBar.style.width = "0%";
    }
  }

  // ── Submit handler ────────────────────────────
async function handleSubmit() {
  console.log("handleSubmit fired");
  
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  console.log("username:", username);
  console.log("password:", password);
  console.log("audioBlobs length:", audioBlobs.length);

  if (!username) { UI.showToast("Enter your username.", "error"); return; }
  if (!password) { UI.showToast("Enter your password.", "error"); return; }
  if (audioBlobs.length < TOTAL) { UI.showToast("Record both voice samples.", "error"); return; }

  UI.setButtonLoading(submitBtn, "Verifying voice identity…");
  recordBtn.disabled = true;

  try {
  console.log("Calling API.loginUser...");

  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);
  audioBlobs.forEach((blob, i) => {
    formData.append("audio", blob, `login_sample_${i + 1}.webm`);
  });

  const response = await fetch("http://127.0.0.1:5000/login", {
    method: "POST",
    body: formData,
  });

  console.log("Response status:", response.status);

  const result = await response.json();
  console.log("Result:", result);

  localStorage.setItem("voiceAuthResult", JSON.stringify({
    type: "login",
    status: result.authenticated ? "granted" : "denied",
    username,
    score: result.score,
    authenticated: result.authenticated,
  }));

  console.log("localStorage set, redirecting...");
  window.location.replace("result.html");

} catch (err) {
  console.error("FULL ERROR:", err);
  localStorage.setItem("voiceAuthResult", JSON.stringify({
    type: "login", status: "error", username, message: err.message,
  }));
  window.location.replace("result.html");
}
}

  // ── Boot ──────────────────────────────────────
  document.addEventListener("DOMContentLoaded", init);
})();
