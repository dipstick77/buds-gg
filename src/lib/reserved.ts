export const RESERVED_HANDLES = new Set([
  "about",
  "admin",
  "api",
  "auth",
  "c",
  "claim",
  "dashboard",
  "discord",
  "edit",
  "gifts",
  "help",
  "login",
  "logout",
  "official",
  "pricing",
  "privacy",
  "pro",
  "settings",
  "signup",
  "support",
  "terms",
  "u",
  "waitlist",
  "www",
]);

const HANDLE_RE = /^[a-z0-9_-]{3,20}$/;

export function normalizeHandle(raw: string): string {
  return raw.trim().toLowerCase();
}

export function validateHandle(raw: string): { ok: true; handle: string } | { ok: false; error: string } {
  const handle = normalizeHandle(raw);
  if (!HANDLE_RE.test(handle)) {
    return {
      ok: false,
      error: "Handles are 3–20 chars: lowercase letters, numbers, _ or -.",
    };
  }
  if (RESERVED_HANDLES.has(handle)) {
    return { ok: false, error: "That handle is reserved." };
  }
  return { ok: true, handle };
}
