import React from 'react';
import { MktNav, MktFooter } from './MktChrome.jsx';
import { Ic } from './icons.jsx';
import { goToCalculator } from '../lib/cta.js';
import { initInteractions } from '../lib/interactions.js';

const { useEffect } = React;

const TIER2_URL = 'https://tier2.sustainablebonds.com';

// Official U.S. government / SEC resources on the accredited investor definition.
const OFFICIAL_LINKS = [
  {
    label: 'SEC — Accredited Investors',
    desc: 'The SEC’s primary explainer of who qualifies and why the standard exists.',
    href: 'https://www.sec.gov/resources-small-businesses/capital-raising-building-blocks/accredited-investors',
  },
  {
    label: 'Investor.gov — Accredited Investor',
    desc: 'Plain-language definition from the SEC’s official investor education site.',
    href: 'https://www.investor.gov/introduction-investing/investing-basics/glossary/accredited-investor',
  },
  {
    label: 'Assessing Accredited Investors under Regulation D',
    desc: 'How issuers are expected to verify accredited status at the time of investment.',
    href: 'https://www.sec.gov/resources-small-businesses/capital-raising-building-blocks/assessing-accredited-investors-under-regulation-d',
  },
  {
    label: 'Rule 501 of Regulation D (17 CFR § 230.501)',
    desc: 'The full legal text of the accredited investor definition on the federal eCFR.',
    href: 'https://www.ecfr.gov/current/title-17/section-230.501',
  },
];

// Ways a natural person can qualify under SEC Rule 501(a).
const CRITERIA = [
  {
    icon: 'trending-up',
    title: 'By Income',
    body: 'Individual income above $200,000 — or $300,000 jointly with a spouse or spousal equivalent — in each of the two most recent years, with a reasonable expectation of the same for the current year.',
  },
  {
    icon: 'wallet',
    title: 'By Net Worth',
    body: 'A net worth exceeding $1,000,000, individually or jointly with a spouse or spousal equivalent — excluding the value of your primary residence.',
  },
  {
    icon: 'file-text',
    title: 'By Professional License',
    body: 'Holding a FINRA Series 7, Series 65, or Series 82 license in good standing. This path qualifies you regardless of income or net worth.',
  },
  {
    icon: 'users',
    title: 'As a Knowledgeable Employee',
    body: 'Certain directors, executive officers, or “knowledgeable employees” of a private fund qualify with respect to that fund’s offerings.',
  },
];

// Why accreditation is worth pursuing.
const REASONS = [
  {
    icon: 'lock',
    title: 'Access Private Markets',
    body: 'Regulation D offerings — including asset-backed bonds like ours — are only available to accredited investors and are not sold on public exchanges.',
  },
  {
    icon: 'dollar',
    title: 'Higher Potential Yields',
    body: 'Private, real-asset-backed fixed income can target 9–15% annual returns — well beyond the 4–5% typical of CDs, money markets, and public bonds.',
  },
  {
    icon: 'layers',
    title: 'Real Diversification',
    body: 'Move beyond the stock-and-mutual-fund menu. Private real estate and impact bonds behave differently from public markets, smoothing portfolio volatility.',
  },
  {
    icon: 'building',
    title: 'Tangible Asset Backing',
    body: 'Accredited status unlocks investments secured by real, cash-flowing affordable housing — collateral you can point to, not abstract corporate paper.',
  },
  {
    icon: 'leaf',
    title: 'Verified Impact Investing',
    body: 'Gain access to third-party-verified impact opportunities that direct your capital toward the U.S. affordable housing shortage at institutional scale.',
  },
  {
    icon: 'bar-chart',
    title: 'Larger, Earlier Allocations',
    body: 'Accredited investors are invited into offerings sooner and can commit meaningful allocations that compound over the life of the bond.',
  },
];

// The realistic path to proving accredited status (no government application exists).
const STEPS = [
  {
    n: '01',
    title: 'Understand the Criteria',
    body: 'Review the SEC standard and identify which path fits you — income, net worth, or a qualifying professional license. There is no minimum age or citizenship requirement.',
  },
  {
    n: '02',
    title: 'Gather Your Documentation',
    body: 'Assemble the evidence: recent tax returns, W-2s or 1099s for income; brokerage, bank, and statement balances plus a credit report for net worth; or your FINRA license record.',
  },
  {
    n: '03',
    title: 'Get Verified',
    body: 'There is no SEC form to file and no federal certificate. Instead, your status is confirmed at the time you invest — often through a written letter from a CPA, attorney, registered broker-dealer, or a third-party verification service.',
  },
  {
    n: '04',
    title: 'Start Investing',
    body: 'Once verified, you can move directly into an available bond tier through our secure investor portal — and put your accredited status to work.',
  },
];

function AccHero() {
  return (
    <section style={{ background: 'var(--bg)' }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '88px 22px 68px', textAlign: 'center' }}>
        <span className="eyebrow-pill" style={{ marginBottom: 28, display: 'inline-block' }}>
          Becoming an Accredited Investor
        </span>
        <h1 style={{
          fontSize: 'clamp(2.2rem, 5.5vw, 3.6rem)',
          lineHeight: 1.06,
          letterSpacing: '-0.03em',
          fontWeight: 800,
          margin: '0 0 26px',
          color: 'var(--fg-1)',
        }}>
          Not Yet Accredited?
          <br />
          <span style={{ color: 'var(--forest-700)' }}>Here’s How to Get There.</span>
        </h1>
        <p className="lead" style={{ maxWidth: '62ch', margin: '0 auto 42px', color: 'var(--fg-2)', lineHeight: 1.65 }}>
          Accredited investor status is your gateway to private, asset-backed opportunities — including Proactive Sustainable Bonds. It’s defined by the U.S. Securities and Exchange Commission, and for many investors it’s more attainable than they expect. Here’s exactly what it means, why it matters, and how to qualify.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-accent btn-lg" onClick={goToCalculator}>
            Talk to Our Team <Ic name="arrow-right" size={18} />
          </button>
          <a className="btn btn-ghost btn-lg" href="https://www.sec.gov/resources-small-businesses/capital-raising-building-blocks/accredited-investors" target="_blank" rel="noopener noreferrer">
            Read the SEC Definition <Ic name="external-link" size={16} />
          </a>
        </div>
      </div>

      {/* Dark clarifying band */}
      <div style={{ background: 'var(--forest-700)', padding: '44px 22px' }}>
        <div style={{
          maxWidth: 1000,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(3,1fr)',
          gap: 24,
          textAlign: 'center',
        }}>
          {[
            ['$200K+', 'Individual income, two years running'],
            ['$1M+', 'Net worth, excluding your home'],
            ['Series 7 / 65 / 82', 'A qualifying license also works'],
          ].map(([n, l]) => (
            <div key={l}>
              <div className="figure" style={{
                fontSize: 'clamp(1.4rem, 3.4vw, 2.2rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: 'var(--lime-300)',
              }}>{n}</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'rgba(234,243,226,.7)', marginTop: 6 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AccWhat() {
  return (
    <section style={{ maxWidth: 1240, margin: '100px auto 0', padding: '0 22px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
        <div>
          <span className="eyebrow">The Definition</span>
          <h2 style={{
            fontSize: 'clamp(1.9rem, 3.5vw, 2.7rem)',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            margin: '16px 0 26px',
            color: 'var(--fg-1)',
          }}>
            What Is an Accredited Investor?
          </h2>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--fg-2)', lineHeight: 1.78, margin: '0 0 20px' }}>
            An accredited investor is a person or entity the SEC permits to invest in certain private securities that aren’t registered with regulators. The standard exists to ensure participants have the financial resilience or expertise to take on the added risk of private offerings.
          </p>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--fg-2)', lineHeight: 1.78, margin: '0 0 20px' }}>
            The criteria are set out in <strong style={{ color: 'var(--fg-1)' }}>Rule 501(a) of Regulation D</strong> under the Securities Act of 1933. A natural person qualifies by meeting <em>any one</em> of the thresholds below — you do not need to satisfy all of them.
          </p>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-3)', lineHeight: 1.7, margin: 0 }}>
            The 2020 amendments expanded the definition to include qualifying professional certifications, opening the door to investors who meet a knowledge-based standard rather than a purely financial one.
          </p>
        </div>

        <div className="glass" style={{
          borderRadius: 'var(--radius-2xl)',
          padding: '36px 40px',
          borderLeft: '4px solid var(--forest-600)',
          boxShadow: 'var(--shadow-lg)',
        }}>
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--forest-700)', margin: '0 0 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Ic name="shield-check" size={20} /> The Common Misconception
          </h3>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-2)', lineHeight: 1.72, margin: '0 0 16px' }}>
            There is <strong style={{ color: 'var(--fg-1)' }}>no government application, exam, or certificate</strong> to “become” accredited. You don’t register with the SEC.
          </p>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-2)', lineHeight: 1.72, margin: '0 0 16px' }}>
            Instead, you simply <strong style={{ color: 'var(--fg-1)' }}>meet the criteria</strong> — and the company you invest with is responsible for <strong style={{ color: 'var(--fg-1)' }}>verifying your status</strong> before accepting your investment.
          </p>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-2)', lineHeight: 1.72, margin: 0 }}>
            That verification is usually a quick review of financial documents or a signed letter from your CPA, attorney, or broker-dealer.
          </p>
        </div>
      </div>
    </section>
  );
}

function AccCriteria() {
  return (
    <section style={{ maxWidth: 1240, margin: '114px auto 0', padding: '0 22px' }}>
      <div style={{ textAlign: 'center', maxWidth: '52rem', margin: '0 auto 56px' }}>
        <span className="eyebrow">Do You Qualify?</span>
        <h2 style={{
          margin: '16px 0 18px',
          fontSize: 'clamp(1.9rem, 3.5vw, 2.7rem)',
          fontWeight: 800,
          letterSpacing: '-0.025em',
          color: 'var(--fg-1)',
          lineHeight: 1.08,
        }}>
          Four Ways to Qualify
        </h2>
        <p className="lead" style={{ margin: 0, maxWidth: '44rem', color: 'var(--fg-2)' }}>
          Meeting <strong>any single one</strong> of these SEC standards makes you an accredited investor.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 22 }}>
        {CRITERIA.map((c) => (
          <div key={c.title} className="glass glass-strong lit" style={{
            borderRadius: 'var(--radius-2xl)',
            padding: '30px 32px',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            gap: 20,
            alignItems: 'flex-start',
          }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: 'color-mix(in srgb, var(--brand) 15%, var(--surface))',
              color: 'var(--forest-600)',
              display: 'grid',
              placeItems: 'center',
              flex: 'none',
            }}>
              <Ic name={c.icon} size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--fg-1)', margin: '0 0 8px', lineHeight: 1.28 }}>{c.title}</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-2)', lineHeight: 1.67, margin: 0 }}>{c.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function AccReasons() {
  return (
    <section style={{ maxWidth: 1240, margin: '114px auto 0', padding: '0 22px' }}>
      <div style={{ textAlign: 'center', maxWidth: '52rem', margin: '0 auto 56px' }}>
        <span className="eyebrow">Why It’s Worth It</span>
        <h2 style={{
          margin: '16px 0 18px',
          fontSize: 'clamp(1.9rem, 3.5vw, 2.7rem)',
          fontWeight: 800,
          letterSpacing: '-0.025em',
          color: 'var(--fg-1)',
          lineHeight: 1.08,
        }}>
          Why Get Accredited?
        </h2>
        <p className="lead" style={{ margin: 0, maxWidth: '46rem', color: 'var(--fg-2)' }}>
          Accreditation opens a category of investments most people never see — where yield, real assets, and measurable impact meet.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22 }}>
        {REASONS.map((r) => (
          <div key={r.title} className="glass glass-strong lit" style={{
            borderRadius: 'var(--radius-2xl)',
            padding: '28px 28px 32px',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: 'color-mix(in srgb, var(--brand) 15%, var(--surface))',
              color: 'var(--forest-600)',
              display: 'grid',
              placeItems: 'center',
              flex: 'none',
            }}>
              <Ic name={r.icon} size={22} />
            </div>
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--fg-1)', margin: 0, lineHeight: 1.28 }}>{r.title}</h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-2)', lineHeight: 1.67, margin: 0 }}>{r.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function AccSteps() {
  return (
    <section style={{ maxWidth: 1240, margin: '114px auto 0', padding: '0 22px' }}>
      <div style={{ textAlign: 'center', maxWidth: '46rem', margin: '0 auto 56px' }}>
        <span className="eyebrow">Getting Started</span>
        <h2 style={{
          margin: '16px 0 0',
          fontSize: 'clamp(1.9rem, 3.5vw, 2.7rem)',
          fontWeight: 800,
          letterSpacing: '-0.025em',
          color: 'var(--fg-1)',
        }}>
          How to Get Accredited
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 880, margin: '0 auto' }}>
        {STEPS.map((s) => (
          <div key={s.n} className="glass glass-strong" style={{
            borderRadius: 'var(--radius-2xl)',
            padding: '28px 40px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 36,
            boxShadow: 'var(--shadow-sm)',
          }}>
            <span style={{
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: 'color-mix(in srgb, var(--brand) 65%, var(--forest-600))',
              lineHeight: 1,
              flex: 'none',
              minWidth: 48,
              paddingTop: 3,
            }}>{s.n}</span>
            <div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--fg-1)', margin: '0 0 10px', lineHeight: 1.3 }}>{s.title}</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-2)', lineHeight: 1.68, margin: 0 }}>{s.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function AccOfficial() {
  return (
    <section style={{ maxWidth: 1240, margin: '114px auto 0', padding: '0 22px' }}>
      <div style={{ textAlign: 'center', maxWidth: '46rem', margin: '0 auto 48px' }}>
        <span className="eyebrow">Official Resources</span>
        <h2 style={{
          margin: '16px 0 12px',
          fontSize: 'clamp(1.7rem, 3.2vw, 2.4rem)',
          fontWeight: 800,
          letterSpacing: '-0.025em',
          color: 'var(--fg-1)',
        }}>
          Straight From the Source
        </h2>
        <p className="lead" style={{ margin: 0, maxWidth: '42rem', color: 'var(--fg-2)' }}>
          Don’t take our word for it. These are the primary U.S. government references on accredited investor status.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 18, maxWidth: 980, margin: '0 auto' }}>
        {OFFICIAL_LINKS.map((l) => (
          <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="glass glass-strong lit" style={{
            borderRadius: 'var(--radius-2xl)',
            padding: '26px 28px',
            boxShadow: 'var(--shadow-sm)',
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <span style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--forest-700)', lineHeight: 1.3 }}>{l.label}</span>
              <span style={{ color: 'var(--fg-3)', flex: 'none' }}><Ic name="arrow-up-right" size={18} /></span>
            </div>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-2)', lineHeight: 1.6 }}>{l.desc}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

function AccCta() {
  return (
    <section style={{ maxWidth: 1240, margin: '114px auto 0', padding: '0 22px 120px' }}>
      <div className="glass glass-strong lit" style={{
        borderRadius: 'var(--radius-2xl)',
        padding: 'clamp(40px, 6vw, 72px)',
        textAlign: 'center',
        boxShadow: 'var(--shadow-lg)',
      }}>
        <h2 style={{
          margin: '0 0 16px',
          fontSize: 'clamp(1.8rem, 3.4vw, 2.6rem)',
          fontWeight: 800,
          letterSpacing: '-0.025em',
          color: 'var(--fg-1)',
        }}>
          Think You Already Qualify?
        </h2>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--fg-2)', maxWidth: '48ch', margin: '0 auto 30px', lineHeight: 1.65 }}>
          If you meet any of the criteria above, you’re ready to invest. Start your verification and choose a bond tier through our secure portal.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a className="btn btn-accent btn-lg" href={TIER2_URL}>
            Start Investing <Ic name="arrow-right" size={18} />
          </a>
          <button className="btn btn-ghost btn-lg" onClick={goToCalculator}>
            Model My Returns First
          </button>
        </div>

        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-3)', maxWidth: '68ch', margin: '38px auto 0', lineHeight: 1.6 }}>
          This page is for general educational purposes only and is not legal, tax, or investment advice. Accredited investor criteria are set by the U.S. Securities and Exchange Commission and may change. Confirm your status with a qualified professional and review the official SEC resources above before investing.
        </p>
      </div>
    </section>
  );
}

export default function AccreditationPage() {
  useEffect(() => { initInteractions(); }, []);
  return (
    <React.Fragment>
      <MktNav />
      <main>
        <AccHero />
        <AccWhat />
        <AccCriteria />
        <AccReasons />
        <AccSteps />
        <AccOfficial />
        <AccCta />
      </main>
      <MktFooter />
    </React.Fragment>
  );
}
