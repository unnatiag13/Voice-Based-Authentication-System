// ─────────────────────────────────────────────
//  ui.js  –  Shared UI utilities
// ─────────────────────────────────────────────

const UI = (() => {
  // ── Health badge ─────────────────────────────
  async function initHealthBadge() {
    const badge = document.getElementById("health-badge");
    if (!badge) return;

    badge.textContent = "Checking…";
    badge.className = "health-badge checking";

    const ok = await API.checkHealth();
    if (ok) {
      badge.textContent = "● Backend connected";
      badge.className = "health-badge connected";
    } else {
      badge.textContent = "● Backend offline";
      badge.className = "health-badge offline";
    }
  }

  // ── Toast notifications ───────────────────────
  function showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("toast-show"));

    setTimeout(() => {
      toast.classList.remove("toast-show");
      toast.addEventListener("transitionend", () => toast.remove());
    }, 3500);
  }

  // ── Waveform animation ────────────────────────
  function startWaveform(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.classList.add("recording-active");
  }

  function stopWaveform(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.classList.remove("recording-active");
  }

  // ── Progress bar ──────────────────────────────
  function updateProgressBar(fillId, percent) {
    const fill = document.getElementById(fillId);
    if (fill) fill.style.width = `${Math.min(100, percent)}%`;
  }

  // ── Button state helpers ──────────────────────
  function setButtonLoading(btn, loadingText) {
    btn.disabled = true;
    btn.dataset.originalText = btn.textContent;
    btn.textContent = loadingText;
    btn.classList.add("loading");
  }

  function resetButton(btn) {
    btn.disabled = false;
    btn.textContent = btn.dataset.originalText || btn.textContent;
    btn.classList.remove("loading");
  }

  // ── Navigate to result page ───────────────────
function goToResult(data) {
  try {
    localStorage.setItem("voiceAuthResult", JSON.stringify(data));
  } catch(e) {
    console.error("localStorage failed:", e);
  }
  console.log("Redirecting now...", data);
  window.location.replace("result.html");  // use replace() not href
}

  return {
    initHealthBadge,
    showToast,
    startWaveform,
    stopWaveform,
    updateProgressBar,
    setButtonLoading,
    resetButton,
    goToResult,
  };
})();
