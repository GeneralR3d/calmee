export function readStorage(key: string, session = false): unknown {
  try { return JSON.parse((session ? sessionStorage : localStorage).getItem(key) || 'null'); }
  catch { return null; }
}
export function writeStorage(key: string, value: unknown, session = false) {
  try { (session ? sessionStorage : localStorage).setItem(key, JSON.stringify(value)); }
  catch { /* Shopping still works in memory if browser storage is unavailable. */ }
}
