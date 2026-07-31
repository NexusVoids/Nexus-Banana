// 10-minute rotating "owner" update code.
// The current code is shown at the bottom of the Jams section and verified
// by the UpdateCodePanel. Both sides call getCurrentUpdateCode() so they
// always match. The base/seed code is 77865423.

const BASE_CODE = '77865423';
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes

function getCurrentWindow() {
  return Math.floor(Date.now() / WINDOW_MS);
}

// Deterministic PRNG (mulberry32) seeded from the time window.
function seededRand(seed) {
  let t = seed + 0x6D2B79F5;
  return () => {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function getCurrentUpdateCode() {
  const window = getCurrentWindow();
  const rand = seededRand(window + 1);
  // Start from the base code and mutate each digit deterministically
  // so the code always relates to 77865423 but rotates every 10 minutes.
  const base = BASE_CODE.split('');
  let code = '';
  for (let i = 0; i < 8; i++) {
    const shift = Math.floor(rand() * 10);
    code += ((parseInt(base[i], 10) + shift) % 10).toString();
  }
  return code;
}

export function getResetTimestamp() {
  return (getCurrentWindow() + 1) * WINDOW_MS;
}

export function getMsUntilReset() {
  return getResetTimestamp() - Date.now();
}

export function formatCountdown(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function verifyUpdateCode(input) {
  if (!input) return false;
  return input.trim().replace(/\s/g, '') === getCurrentUpdateCode();
}

export { BASE_CODE, WINDOW_MS };