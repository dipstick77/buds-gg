"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TemporaryContext } from "@/components/ui/TemporaryContext";

export function LoginForm({
  discordReady,
  discordQuery,
}: {
  discordReady: boolean;
  discordQuery: string | null;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("you@example.com");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function devLogin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/dev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      router.push("/edit");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-shell">
      <main className="login-panel">
        <Link href="/" className="brand-mark">
          buds<span className="brand-accent">.gg</span>
        </Link>
        <h1 className="login-title">Claim your gaming card</h1>
        <p className="login-sub">
          Discord OAuth is preferred for duo / LFG players. Until Discord app
          secrets are configured, use the dev login path below.
        </p>

        {discordReady ? (
          <Link
            href="/api/auth/discord"
            className="cta-btn cta-btn--primary cta-btn--lg cta-btn--block"
          >
            Continue with Discord
          </Link>
        ) : (
          <TemporaryContext title="Discord OAuth not configured">
            <p>
              Set <code>DISCORD_CLIENT_ID</code>, <code>DISCORD_CLIENT_SECRET</code>,
              and <code>DISCORD_REDIRECT_URI</code> (see <code>.env.example</code>)
              to finish Discord auth. Create an app at the Discord Developer Portal
              with redirect{" "}
              <code>http://localhost:3000/api/auth/discord/callback</code>.
            </p>
          </TemporaryContext>
        )}

        {discordQuery === "missing" ? (
          <p className="form-error">Discord env vars are missing.</p>
        ) : null}
        {discordQuery === "denied" ? (
          <p className="form-error">Discord login was cancelled.</p>
        ) : null}

        <form className="login-form" onSubmit={devLogin}>
          <p className="section-label">Dev / magic-link stand-in</p>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <button
            type="submit"
            className="cta-btn cta-btn--ghost cta-btn--lg cta-btn--block"
            disabled={busy}
          >
            {busy ? "Signing in…" : "Continue with email (dev)"}
          </button>
        </form>

        {error ? <p className="form-error">{error}</p> : null}

        <p className="login-demos">
          Or peek seeded demos:{" "}
          <Link href="/maya">/maya</Link>, <Link href="/kai">/kai</Link>,{" "}
          <Link href="/nova">/nova</Link>
        </p>
      </main>
    </div>
  );
}
