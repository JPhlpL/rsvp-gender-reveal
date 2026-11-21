/**
 * Small "remember for this browser session" flags that never throw.
 * Some browsers and in-app WebViews block sessionStorage (accessing it throws) or refuse
 * to save (quota / private mode); the flag then lives in memory for this page load.
 */
const remembered = new Set<string>();

export function readSessionFlag(key: string): boolean {
  if (remembered.has(key)) return true;
  try {
    return window.sessionStorage.getItem(key) === "true";
  } catch {
    return false;
  }
}

export function writeSessionFlag(key: string): void {
  remembered.add(key);
  try {
    window.sessionStorage.setItem(key, "true");
  } catch {
    // Storage blocked or full: the in-memory flag is enough for this page load.
  }
}
