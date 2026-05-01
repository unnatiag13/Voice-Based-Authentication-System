// ─────────────────────────────────────────────
//  recorder.js  –  Microphone recording utility
// ─────────────────────────────────────────────

const Recorder = (() => {
  /**
   * Records audio from the user's microphone.
   * @param {number} durationMs  – recording duration in ms (default: 4000)
   * @param {function} onTick    – called every 100ms with { elapsed, total }
   * @returns {Promise<Blob>}    – audio blob (audio/webm)
   */
  async function recordAudio(durationMs = CONFIG.RECORD_DURATION_MS, onTick = null) {
    // Request microphone access
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    } catch (err) {
      throw new Error("Microphone access denied. Please allow microphone permissions and try again.");
    }

    return new Promise((resolve, reject) => {
      const chunks = [];
      const mediaRecorder = new MediaRecorder(stream, { mimeType: preferredMimeType() });

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        // Stop all tracks to release the mic
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(chunks, { type: mediaRecorder.mimeType });
        resolve(blob);
      };

      mediaRecorder.onerror = (e) => {
        stream.getTracks().forEach((track) => track.stop());
        reject(new Error("Recording error: " + e.error?.message));
      };

      mediaRecorder.start(100); // collect data every 100ms

      // Tick callback for progress bar
      let elapsed = 0;
      const tickInterval = setInterval(() => {
        elapsed += 100;
        if (onTick) onTick({ elapsed, total: durationMs });
        if (elapsed >= durationMs) clearInterval(tickInterval);
      }, 100);

      // Auto-stop after duration
      setTimeout(() => {
        if (mediaRecorder.state !== "inactive") mediaRecorder.stop();
      }, durationMs);
    });
  }

  /**
   * Pick best supported MIME type for recording.
   */
  function preferredMimeType() {
    const types = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/ogg;codecs=opus",
      "audio/ogg",
    ];
    for (const t of types) {
      if (MediaRecorder.isTypeSupported(t)) return t;
    }
    return "";
  }

  return { recordAudio };
})();
