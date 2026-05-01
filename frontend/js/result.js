// // ─────────────────────────────────────────────
// //  result.js  –  Reads & displays auth result
// // ─────────────────────────────────────────────

// document.addEventListener("DOMContentLoaded", () => {
//   const raw = localStorage.getItem("voiceAuthResult");

//   if (!raw) {
//     renderError("No result data found. Please try again.");
//     return;
//   }

//   let data;
//   try {
//     data = JSON.parse(raw);
//   } catch {
//     renderError("Malformed result data.");
//     return;
//   }

//   // Clear stored result after reading
//   localStorage.removeItem("voiceAuthResult");

//   render(data);
// });

// function render(data) {
//   const icon    = document.getElementById("result-icon");
//   const title   = document.getElementById("result-title");
//   const sub     = document.getElementById("result-subtitle");
//   const meta    = document.getElementById("result-meta");
//   const card    = document.getElementById("result-card");

//   const { type, status, username, score, authenticated, message } = data;

//   // ── Determine visual state ─────────────────────
//   let iconSVG, titleText, subtitleText, colorClass;

//   if (type === "register") {
//     if (status === "success") {
//       iconSVG     = svgCheck();
//       titleText   = "Registration Successful";
//       subtitleText = message || "Your voice profile has been created.";
//       colorClass  = "state-success";
//     } else {
//       iconSVG     = svgX();
//       titleText   = "Registration Failed";
//       subtitleText = message || "Something went wrong. Please try again.";
//       colorClass  = "state-denied";
//     }
//   } else if (type === "login") {
//     if (status === "granted") {
//       iconSVG     = svgCheck();
//       titleText   = "Access Granted";
//       subtitleText = "Voice identity verified successfully.";
//       colorClass  = "state-success";
//     } else if (status === "denied") {
//       iconSVG     = svgX();
//       titleText   = "Access Denied";
//       subtitleText = "Voice identity could not be verified.";
//       colorClass  = "state-denied";
//     } else {
//       iconSVG     = svgWarn();
//       titleText   = "Authentication Error";
//       subtitleText = message || "An unexpected error occurred.";
//       colorClass  = "state-error";
//     }
//   } else {
//     iconSVG     = svgWarn();
//     titleText   = "Unknown Result";
//     subtitleText = "Unable to determine result state.";
//     colorClass  = "state-error";
//   }

//   // Apply
//   card.classList.add(colorClass);
//   icon.innerHTML    = iconSVG;
//   title.textContent = titleText;
//   sub.textContent   = subtitleText;

//   // ── Meta details ───────────────────────────────
//   const rows = [];

//   if (username) {
//     rows.push({ label: "Username", value: username });
//   }

//   if (typeof score === "number") {
//     const pct = (score * 100).toFixed(1);
//     rows.push({ label: "Voice Score", value: `${pct}%` });

//     // Animate the score ring
//     if (typeof window.animateScoreRing === "function") {
//       window.animateScoreRing(score, status === "denied");
//     }
//   }

//   if (typeof authenticated === "boolean") {
//     rows.push({
//       label: "Authenticated",
//       value: authenticated ? "Yes" : "No",
//       highlight: authenticated ? "positive" : "negative",
//     });
//   }

//   if (type) {
//     rows.push({ label: "Action", value: type.charAt(0).toUpperCase() + type.slice(1) });
//   }

//   meta.innerHTML = rows.map(row => `
//     <div class="meta-row">
//       <span class="meta-label">${row.label}</span>
//       <span class="meta-value ${row.highlight ? 'highlight-' + row.highlight : ''}">${row.value}</span>
//     </div>
//   `).join("");
// }

// function renderError(msg) {
//   const card = document.getElementById("result-card");
//   const icon = document.getElementById("result-icon");
//   const title = document.getElementById("result-title");
//   const sub = document.getElementById("result-subtitle");

//   card.classList.add("state-error");
//   icon.innerHTML = svgWarn();
//   title.textContent = "Something went wrong";
//   sub.textContent = msg;
// }

// // ── Inline SVGs ────────────────────────────────
// function svgCheck() {
//   return `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <circle cx="24" cy="24" r="22" stroke="currentColor" stroke-width="2.5"/>
//     <path d="M14 24.5l7 7 13-14" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
//   </svg>`;
// }

// function svgX() {
//   return `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <circle cx="24" cy="24" r="22" stroke="currentColor" stroke-width="2.5"/>
//     <path d="M16 16l16 16M32 16L16 32" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/>
//   </svg>`;
// }

// function svgWarn() {
//   return `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <circle cx="24" cy="24" r="22" stroke="currentColor" stroke-width="2.5"/>
//     <path d="M24 14v13" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/>
//     <circle cx="24" cy="33" r="1.5" fill="currentColor"/>
//   </svg>`;
// }


function render(data) {
  const icon  = document.getElementById("result-icon");
  const title = document.getElementById("result-title");
  const sub   = document.getElementById("result-subtitle");
  const meta  = document.getElementById("result-meta");
  const card  = document.getElementById("result-card");

  const { type, status, username, score, authenticated, message } = data;

  let iconSVG, titleText, subtitleText;

  if (type === "login") {
    if (status === "granted") {
      card.classList.add("state-success");
      titleText = "Access Granted";
      subtitleText = "Voice identity verified.";
      iconSVG = '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="22" stroke="currentColor" stroke-width="2.5"/><path d="M14 24.5l7 7 13-14" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    } else if (status === "denied") {
      card.classList.add("state-denied");
      titleText = "Access Denied";
      subtitleText = "Voice could not be verified.";
      iconSVG = '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="22" stroke="currentColor" stroke-width="2.5"/><path d="M16 16l16 16M32 16L16 32" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/></svg>';
    } else {
      card.classList.add("state-error");
      titleText = "Error";
      subtitleText = message || "Something went wrong.";
      iconSVG = '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="22" stroke="currentColor" stroke-width="2.5"/><path d="M24 14v13" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/><circle cx="24" cy="33" r="1.5" fill="currentColor"/></svg>';
    }
  } else {
    if (status === "success") {
      card.classList.add("state-success");
      titleText = "Registration Successful";
      subtitleText = message || "Voice profile created.";
      iconSVG = '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="22" stroke="currentColor" stroke-width="2.5"/><path d="M14 24.5l7 7 13-14" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    } else {
      card.classList.add("state-denied");
      titleText = "Registration Failed";
      subtitleText = message || "Please try again.";
      iconSVG = '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="22" stroke="currentColor" stroke-width="2.5"/><path d="M16 16l16 16M32 16L16 32" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/></svg>';
    }
  }

  icon.innerHTML  = iconSVG;
  title.textContent = titleText;
  sub.textContent   = subtitleText;

  const rows = [];
  if (username) rows.push({ label: "Username", value: username });
  if (typeof score === "number") rows.push({ label: "Voice Score", value: (score * 100).toFixed(1) + "%" });
  if (typeof authenticated === "boolean") rows.push({ label: "Authenticated", value: authenticated ? "Yes" : "No", highlight: authenticated ? "positive" : "negative" });

  meta.innerHTML = rows.map(r => `
    <div class="meta-row">
      <span class="meta-label">${r.label}</span>
      <span class="meta-value ${r.highlight ? 'highlight-' + r.highlight : ''}">${r.value}</span>
    </div>
  `).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  const raw = localStorage.getItem("voiceAuthResult");
  console.log("RAW:", raw);
  if (!raw) {
    document.getElementById("result-title").textContent = "No result found";
    document.getElementById("result-subtitle").textContent = "Please try again.";
    return;
  }
  localStorage.removeItem("voiceAuthResult");
  render(JSON.parse(raw));
});