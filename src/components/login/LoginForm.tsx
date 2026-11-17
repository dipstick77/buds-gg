"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TemporaryContext } from "@/components/ui/TemporaryContext";

export function LoginForm({
  discordReady,
  discordQuery,
  devEmailEnabled,
}: {
  discordReady: boolean;
  discordQuery: string | null;
  devEmailEnabled: boolean;
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
        <h1 className="login-title">Sign in to buds.gg</h1>
        <p className="login-sub">
          Discover groups and claim a player handle. Discord OAuth is preferred
          when configured.
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
              to finish Discord auth.
            </p>
          </TemporaryContext>
        )}

        {discordQuery === "missing" ? (
          <p className="form-error">Discord env vars are missing.</p>
        ) : null}
        {discordQuery === "denied" ? (
          <p className="form-error">Discord login was cancelled.</p>
        ) : null}
        {discordQuery === "state" ? (
          <p className="form-error">Discord login failed CSRF check. Try again.</p>
        ) : null}

        {devEmailEnabled ? (
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
        ) : (
          <TemporaryContext title="Dev email login disabled here">
            <p>
              Hosted builds require <code>AUTH_DEV_ALLOWLIST</code> or Discord OAuth.
              Browse Discover without signing in.
            </p>
          </TemporaryContext>
        )}

        {error ? <p className="form-error">{error}</p> : null}

        <p className="login-demos">
          Peek seeded demos: <Link href="/maya">/maya</Link>,{" "}
          <Link href="/kai">/kai</Link>, <Link href="/nova">/nova</Link> ·{" "}
          <Link href="/">Discover</Link>
        </p>
      </main>
    </div>
  );
}
