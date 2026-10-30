import Link from "next/link";
import { TemporaryContext } from "@/components/ui/TemporaryContext";

export function LandingPage({ examples }: { examples: string[] }) {
  return (
    <div className="landing">
      <div className="landing-atmosphere" aria-hidden>
        <div className="landing-orb landing-orb--a" />
        <div className="landing-orb landing-orb--b" />
        <div className="landing-grid" />
      </div>

      <header className="landing-nav">
        <span className="brand-mark">buds.gg</span>
        <div className="landing-nav-actions">
          <Link href="/login" className="nav-link">
            Log in
          </Link>
          <Link href="/login" className="cta-btn cta-btn--primary cta-btn--sm">
            Claim handle
          </Link>
        </div>
      </header>

      <section className="landing-hero">
        <p className="brand-hero motion-rise">buds.gg</p>
        <h1 className="landing-headline motion-rise delay-1">
          Your gaming card for your buds.
        </h1>
        <p className="landing-sub motion-rise delay-2">
          One short URL with every platform ID and a Copy / Open add-friend CTA —
          built for duo and LFG players.
        </p>
        <div className="landing-cta motion-rise delay-3">
          <Link href="/login" className="cta-btn cta-btn--primary cta-btn--lg">
            Claim your handle
          </Link>
          {examples[0] ? (
            <Link href={`/${examples[0]}`} className="cta-btn cta-btn--ghost cta-btn--lg">
              See /{examples[0]}
            </Link>
          ) : null}
        </div>
        <div className="landing-visual motion-float" aria-hidden>
          <div className="mock-card">
            <div className="mock-card__brand">buds.gg/you</div>
            <div className="mock-card__row">
              <span>Discord</span>
              <span className="mock-pill">Copy</span>
            </div>
            <div className="mock-card__row">
              <span>Steam</span>
              <span className="mock-pill mock-pill--alt">Open</span>
            </div>
            <div className="mock-card__games">Valorant · DRG · SF6</div>
          </div>
        </div>
      </section>

      <section className="landing-examples">
        <h2 className="section-label">Example buds</h2>
        <p className="landing-examples-sub">
          Seeded demo profiles — no login required.
        </p>
        <ul className="example-list">
          {examples.map((handle) => (
            <li key={handle}>
              <Link href={`/${handle}`} className="example-link">
                buds.gg/{handle}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="landing-context">
        <TemporaryContext title="Roadmap stubs (visible on purpose)">
          <ul>
            <li>Steam inventory / skin gallery — Coming later</li>
            <li>Live Discord presence — Coming later (ToS / privacy)</li>
            <li>Pro themes &amp; analytics — Coming later</li>
          </ul>
        </TemporaryContext>
      </section>
    </div>
  );
}
