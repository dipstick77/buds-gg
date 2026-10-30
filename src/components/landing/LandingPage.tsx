import Link from "next/link";
import { TemporaryContext } from "@/components/ui/TemporaryContext";

export function LandingPage({ examples }: { examples: string[] }) {
  return (
    <div className="app-shell">
      <header className="app-titlebar">
        <div className="app-titlebar__left">
          <span className="brand-mark">
            buds<span className="brand-accent">.gg</span>
          </span>
        </div>
        <div className="app-titlebar__right">
          <Link href="/login" className="nav-link">
            Log in
          </Link>
          <Link href="/login" className="cta-btn cta-btn--primary cta-btn--sm">
            Claim handle
          </Link>
        </div>
      </header>

      <div className="landing-layout">
        <section className="landing-pane">
          <p className="landing-kicker motion-rise">Gamer linkhub</p>
          <p className="brand-hero motion-rise delay-1">
            buds<span className="brand-accent">.gg</span>
          </p>
          <h1 className="landing-headline motion-rise delay-1">
            Your gaming card for your buds.
          </h1>
          <p className="landing-sub motion-rise delay-2">
            One short URL with every platform ID and a Copy / Open add-friend CTA —
            built for duo and LFG players.
          </p>
          <div className="landing-cta motion-rise delay-2">
            <Link href="/login" className="cta-btn cta-btn--primary cta-btn--lg">
              Claim your handle
            </Link>
            {examples[0] ? (
              <Link
                href={`/${examples[0]}`}
                className="cta-btn cta-btn--ghost cta-btn--lg"
              >
                Open /{examples[0]}
              </Link>
            ) : null}
          </div>

          <div className="landing-examples motion-rise delay-3">
            <h2 className="section-label">Example buds</h2>
            <p className="landing-examples-sub">
              Seeded demos — no login required.
            </p>
            <ul className="example-list">
              {examples.map((handle) => (
                <li key={handle}>
                  <Link href={`/${handle}`} className="example-link">
                    /{handle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="landing-context motion-rise delay-3">
            <TemporaryContext title="Roadmap stubs (visible on purpose)">
              <ul>
                <li>Steam inventory / skin gallery — Coming later</li>
                <li>Live Discord presence — Coming later (ToS / privacy)</li>
                <li>Pro themes &amp; analytics — Coming later</li>
              </ul>
            </TemporaryContext>
          </div>
        </section>

        <aside className="landing-preview-pane" aria-hidden>
          <div className="app-window">
            <div className="app-window__bar">
              <span className="app-window__dots">
                <i />
                <i />
                <i />
              </span>
              buds.gg/you
            </div>
            <div className="app-window__body">
              <div className="mock-profile">
                <div className="mock-profile__banner" />
                <div className="mock-profile__head">
                  <div className="mock-profile__avatar">Y</div>
                  <div className="mock-profile__meta">
                    <div className="mock-profile__name">you</div>
                    <div className="mock-profile__handle">buds.gg/you</div>
                  </div>
                </div>
                <div className="mock-profile__rows">
                  <div className="mock-row">
                    <span className="mock-row__label">Discord</span>
                    <span className="mock-row__action">Copy</span>
                  </div>
                  <div className="mock-row">
                    <span className="mock-row__label">Steam</span>
                    <span className="mock-row__action mock-row__action--ghost">
                      Open
                    </span>
                  </div>
                </div>
                <div className="mock-games">Valorant · DRG · SF6</div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
