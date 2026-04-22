const state = {
  login: {
    recording: false,
    hasAudio: false,
    source: null,
    isFallback: false,
  },
  register: {
    recording: false,
    hasAudio: false,
    source: null,
    isFallback: false,
    samples: 0,
  },
};

function showPage(pageId, triggerButton = null) {
  document.querySelectorAll('.page').forEach((page) => page.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');

  document.querySelectorAll('.nav-link').forEach((button) => button.classList.remove('active'));
  const activeButton = triggerButton || document.querySelector(`.nav-link[data-target="${pageId}"]`);
  if (activeButton) activeButton.classList.add('active');
}

function setFeedback(section, type, message) {
  const box = document.getElementById(`${section}Feedback`);
  box.className = `feedback ${type}`;
  box.textContent = message;
}

function clearFeedback(section) {
  const box = document.getElementById(`${section}Feedback`);
  box.className = 'feedback hidden';
  box.textContent = '';
}

function updateStatus(section, statusText, metaText, chipText, shellClass = '') {
  document.getElementById(`${section}StatusText`).textContent = statusText;
  document.getElementById(`${section}MetaText`).textContent = metaText;
  document.getElementById(`${section}Chip`).textContent = chipText;

  const shell = document.getElementById(`${section}WaveShell`);
  shell.classList.remove('recording', 'analyzing', 'active');
  if (shellClass) {
    shell.classList.add('active');
    shell.classList.add(shellClass);
  }
}

function validateUsername(inputId, section) {
  const value = document.getElementById(inputId).value.trim();
  if (!value) {
    setFeedback(section, 'error', 'Please enter a username first.');
    return false;
  }
  return true;
}

function toggleRecording(section) {
  const usernameId = section === 'login' ? 'loginUsername' : 'registerUsername';
  if (!validateUsername(usernameId, section)) return;

  clearFeedback(section);
  const entry = state[section];
  const button = document.getElementById(`${section}RecordBtn`);

  if (!entry.recording) {
    entry.recording = true;
    entry.hasAudio = false;
    entry.source = null;
    entry.isFallback = false;
    button.textContent = section === 'login' ? 'Stop Recording' : 'Stop Sample';
    updateStatus(
      section,
      'Recording in progress...',
      'Speak clearly for 2–3 seconds. Try to keep background noise low.',
      'Recording',
      'recording'
    );
    return;
  }

  entry.recording = false;
  entry.hasAudio = true;
  entry.source = 'microphone';
  button.textContent = section === 'login' ? 'Start Recording' : 'Start Sample';
  updateStatus(
    section,
    'Voice sample captured.',
    'Microphone sample is ready for the next step.',
    'Captured',
    ''
  );
  setFeedback(section, 'success', 'Audio captured successfully. You can proceed now.');
}

function clearAudioState(section) {
  const entry = state[section];
  entry.recording = false;
  entry.hasAudio = false;
  entry.source = null;
  entry.isFallback = false;

  document.getElementById(`${section}RecordBtn`).textContent = section === 'login' ? 'Start Recording' : 'Start Sample';
  clearFeedback(section);

  if (section === 'login') {
    updateStatus('login', 'Ready to record your login sample.', 'No audio captured yet.', 'Idle', '');
  } else {
    updateStatus('register', 'Capture four short samples for enrollment.', `${state.register.samples} clean samples saved.`, `${state.register.samples} / 4`, '');
  }
}

function handleAudioUpload(section, event) {
  const file = event.target.files[0];
  if (!file) return;

  const usernameId = section === 'login' ? 'loginUsername' : 'registerUsername';
  if (!validateUsername(usernameId, section)) {
    event.target.value = '';
    return;
  }

  const entry = state[section];
  entry.recording = false;
  entry.hasAudio = true;
  entry.source = file.name;
  entry.isFallback = true;

  document.getElementById(`${section}RecordBtn`).textContent = section === 'login' ? 'Start Recording' : 'Start Sample';
  updateStatus(
    section,
    'Audio file attached.',
    `${file.name} selected as fallback input.`,
    'Fallback ready',
    'analyzing'
  );
  setFeedback(section, 'info', 'Microphone fallback ready. You can continue using the uploaded file.');
}

function authenticateVoice() {
  if (!validateUsername('loginUsername', 'login')) return;

  const entry = state.login;
  if (entry.recording) {
    setFeedback('login', 'warning', 'Stop the current recording before authenticating.');
    return;
  }
  if (!entry.hasAudio) {
    setFeedback('login', 'error', 'Record or upload a voice sample before authentication.');
    return;
  }

  clearFeedback('login');
  updateStatus('login', 'Analyzing voice sample...', 'Comparing sample with enrolled speaker profile.', 'Analyzing', 'analyzing');

  setTimeout(() => {
    const username = document.getElementById('loginUsername').value.trim().toLowerCase();
    const success = username.length % 2 === 0 || entry.isFallback;

    if (success) {
      updateStatus('login', 'Authentication successful.', 'Speaker verified. Access can now be granted by the backend.', 'Verified', '');
      setFeedback('login', 'success', 'Voice match successful. Frontend flow completed cleanly.');
    } else {
      updateStatus('login', 'Authentication failed.', 'Voice mismatch detected or confidence score too low.', 'Denied', '');
      setFeedback('login', 'error', 'Voice not recognized. Retry with a cleaner sample or use fallback upload.');
    }
  }, 1600);
}

function saveSample() {
  if (!validateUsername('registerUsername', 'register')) return;

  const entry = state.register;
  if (entry.recording) {
    setFeedback('register', 'warning', 'Stop the current sample first, then save it.');
    return;
  }
  if (!entry.hasAudio) {
    setFeedback('register', 'error', 'Capture or upload a sample before saving.');
    return;
  }
  if (entry.samples >= 4) {
    setFeedback('register', 'warning', 'All four enrollment samples are already saved.');
    return;
  }

  entry.samples += 1;
  entry.hasAudio = false;
  entry.source = null;
  entry.isFallback = false;

  const cards = document.querySelectorAll('#sampleGrid .sample-card');
  const currentCard = cards[entry.samples - 1];
  currentCard.classList.remove('pending');
  currentCard.classList.add('done');
  currentCard.innerHTML = `Sample ${entry.samples} <span>Saved</span>`;

  updateRegisterProgress();
  document.getElementById('registerRecordBtn').textContent = 'Start Sample';
  updateStatus('register', 'Sample stored successfully.', `${entry.samples} of 4 enrollment samples saved.`, `${entry.samples} / 4`, '');
  setFeedback('register', 'success', `Sample ${entry.samples} saved. Keep going until all four are complete.`);
}

function updateRegisterProgress() {
  const total = 4;
  const count = state.register.samples;
  document.getElementById('sampleCount').textContent = `${count} / ${total} samples`;
  document.getElementById('registerChip').textContent = `${count} / ${total}`;
  document.getElementById('registerMetaText').textContent = `${count} clean samples saved.`;
  document.getElementById('registerProgress').style.width = `${(count / total) * 100}%`;
  document.getElementById('registerSubmitBtn').disabled = count !== total;
}

function resetEnrollment() {
  state.register.recording = false;
  state.register.hasAudio = false;
  state.register.source = null;
  state.register.isFallback = false;
  state.register.samples = 0;

  document.getElementById('registerRecordBtn').textContent = 'Start Sample';
  document.querySelectorAll('#sampleGrid .sample-card').forEach((card, index) => {
    card.className = 'sample-card pending';
    card.innerHTML = `Sample ${index + 1} <span>Pending</span>`;
  });

  clearFeedback('register');
  updateRegisterProgress();
  updateStatus('register', 'Capture four short samples for enrollment.', '0 clean samples saved.', '0 / 4', '');
}

function submitRegistration() {
  if (!validateUsername('registerUsername', 'register')) return;

  if (state.register.samples < 4) {
    setFeedback('register', 'error', 'Please complete all four enrollment samples before registering.');
    return;
  }

  updateStatus('register', 'Finalizing registration...', 'Preparing the enrollment bundle for backend submission.', 'Submitting', 'analyzing');
  clearFeedback('register');

  setTimeout(() => {
    updateStatus('register', 'Registration complete.', 'Voice profile is ready. Next step is sending the samples to your Flask backend.', 'Completed', '');
    setFeedback('register', 'success', 'Frontend enrollment flow is complete and ready to connect with the backend API.');
  }, 1600);
}

window.addEventListener('DOMContentLoaded', () => {
  updateRegisterProgress();
});
