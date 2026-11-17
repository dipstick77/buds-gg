/**
 * Allow only http(s) absolute URLs for outbound links (profile Open CTAs, etc.).
 * Rejects javascript:, data:, and other schemes.
 */
export function sanitizeExternalUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return null;
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return null;
  }

  // Block obvious credential phishing in user-supplied links
  if (parsed.username || parsed.password) {
    return null;
  }

  return parsed.toString();
}
