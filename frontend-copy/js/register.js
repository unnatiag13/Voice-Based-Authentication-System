// ─────────────────────────────────────────────
//  register.js  –  5-step voice registration flow
// ─────────────────────────────────────────────

(function () {
  const TOTAL = 5;
  const prompts = CONFIG.REGISTER_PROMPTS;
  const audioBlobs = [];
  let currentStep = 0;
  let isRecording = false;

  // DOM refs
  const promptText     = document.getElementById("prompt-text");
  const stepCounter    = document.getElementById("step-counter");
  const recordBtn      = document.getElementById("record-btn");
  const submitBtn      = document.getElementById("submit-btn");
  const waveform       = document.getElementById("waveform");
  const statusMsg      = document.getElementById("status-msg");
  const timerBar       = document.getElementById("timer-bar");
  const stepsTrack     = document.getElementById("steps-track");

  // ── Init ──────────────────────────────────────
  function init() {
    UI.initHealthBadge();
    renderStepDots();
    updateUI();

    recordBtn.addEventListener("click", handleRecord);
    submitBtn.addEventListener("click", handleSubmit);
  }

  // ── Step dot indicators ───────────────────────
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

  // ── Update UI state ───────────────────────────
  function updateUI() {
    const done = audioBlobs.length;

    promptText.textContent  = done < TOTAL ? prompts[currentStep] : "All samples recorded ✓";
    stepCounter.textContent = `${done} / ${TOTAL}`;
    submitBtn.disabled      = done < TOTAL;

    updateStepDots();

    // Reset status message after update
    if (done > 0 && done < TOTAL) {
      setStatus(`Sample ${done} saved. ${TOTAL - done} remaining.`, "success");
    } else if (done === TOTAL) {
      setStatus("All samples captured. Click Register to continue.", "success");
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

    // Animate timer bar
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

      // Reset timer bar
      timerBar.style.transition = "none";
      timerBar.style.width = "0%";
    }
  }

  // ── Submit handler ────────────────────────────
  async function handleSubmit() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (!username) { UI.showToast("Enter a username.", "error"); return; }
    if (!password) { UI.showToast("Enter a password.", "error"); return; }
    if (audioBlobs.length < TOTAL) { UI.showToast("Record all 5 samples first.", "error"); return; }

    UI.setButtonLoading(submitBtn, "Generating voice profile…");
    recordBtn.disabled = true;

    try {
      const result = await API.registerUser(username, password, audioBlobs);
      UI.goToResult({
        type: "register",
        status: "success",
        username,
        message: result.message || "User registered successfully.",
      });
    } catch (err) {
      // Backend offline vs. API error
      const isNetErr = err instanceof TypeError;
      UI.goToResult({
        type: "register",
        status: "failed",
        username,
        message: isNetErr
          ? "Could not reach the backend server."
          : err.message,
      });
    }
  }

  // ── Boot ──────────────────────────────────────
  document.addEventListener("DOMContentLoaded", init);
})();
