import React from 'react';
import { MktNav, MktFooter } from './MktChrome.jsx';
import { Ic } from './icons.jsx';
import { initInteractions } from '../lib/interactions.js';

const { useEffect } = React;

// Issuer logos live in /public/img; shown inside a white chip so they read in
// both light and dark themes.
const ISSUERS = {
  morningstar: { name: 'Morningstar Sustainalytics', logo: '/img/sustainalytics.png' },
  bluemark: { name: 'BlueMark', logo: '/img/partners/bluemark.png' },
  iel: { name: 'Impact Evaluation Lab', logo: '/img/partners/impact-evaluation-labs.png' },
  pri: { name: 'PRI', logo: '/img/pri.png' },
  proactive: { name: 'Proactive', logo: '/img/logo.png' },
};

// Each document was studied and named from its contents. `file` resolves to
// /public/verified/<file> and downloads with that clean name.
const SECTIONS = [
  {
    key: 'morningstar',
    eyebrow: 'Morningstar Sustainalytics',
    title: 'Rated by Morningstar Sustainalytics',
    sub: 'A leading global authority on ESG research and sustainable finance — its independent opinion and impact reporting on our framework.',
    docs: [
      {
        issuer: 'morningstar', title: 'Morningstar Sustainalytics — Second-Party Opinion',
        meta: 'Sustainable Finance Framework · 2024', file: 'morningstar-sustainalytics-second-party-opinion.pdf', pages: '10 pages', size: '1.2 MB',
        desc: 'Sustainalytics’ independent Second-Party Opinion finds the Proactive Realty Income Fund II Sustainable Finance Framework credible, impactful, and aligned with the Sustainability Bond Guidelines 2021, Green Bond Principles 2021, and Social Bond Principles 2023.',
        featured: true,
      },
      {
        issuer: 'morningstar', title: 'Morningstar Sustainalytics — Impact Report',
        meta: 'The Proactive Realty Group', file: 'morningstar-sustainalytics-impact-report-2025.pdf', pages: '7 pages', size: '1.4 MB',
        desc: 'Morningstar Sustainalytics’ impact report on The Proactive Realty Group — an independent view of how our affordable-housing portfolio maps to recognized sustainable-finance and impact standards.',
      },
    ],
  },
  {
    key: 'reports',
    eyebrow: 'Investor impact reports',
    title: 'The receipts, year by year',
    sub: 'Annual impact and performance reporting since inception.',
    docs: [
      { issuer: 'proactive', title: 'Investor Impact Report — May 2025', meta: 'Proactive Realty Group', file: 'investor-impact-report-may-2025.pdf', pages: '12 pages', size: '1.8 MB', desc: 'Mid-year update across the national portfolio: acquisitions, occupancy, resident savings, and impact metrics.' },
      { issuer: 'proactive', title: 'Investor Impact Report — 2024', meta: 'Proactive Realty Group', file: 'investor-impact-report-2024.pdf', pages: '10 pages', size: '2.5 MB', desc: 'Year-end 2024 results, including the FountainVue manufactured-home-park acquisition and a 30% resident rent-savings benchmark.' },
      { issuer: 'proactive', title: 'Investor Impact Report — 2023', meta: 'Proactive Realty Group', file: 'investor-impact-report-2023.pdf', pages: '9 pages', size: '2.5 MB', desc: 'Year-end 2023 metrics and SDG-aligned outcomes across the affordable-housing portfolio.' },
      { issuer: 'proactive', title: 'Investor Impact Report — 2021–2022', meta: 'Proactive Realty Group', file: 'investor-impact-report-2021-2022.pdf', pages: '13 pages', size: '3.6 MB', desc: 'Two-year update on housing access, jobs created, and SDG contributions, including the SOCAP2022 feature.' },
      { issuer: 'proactive', title: 'Investor Impact Report — 2019–2020', meta: 'Proactive Realty Group', file: 'investor-impact-report-2019-2020.pdf', pages: '7 pages', size: '1.6 MB', desc: 'Our first investor update, from the firm’s August 2019 founding through year-end 2020.' },
      { issuer: 'proactive', title: 'Hammonds Estates — Founding Report (2018)', meta: 'Proactive Realty Group', file: 'hammonds-estates-impact-report-2018.pdf', pages: '2 pages', size: '2.5 MB', desc: 'Where it began: Dr. Van’s first acquisition — a distressed 187-space mobile-home park in Orangeburg, SC — and the origin of the Proactive model.' },
    ],
  },
  {
    key: 'framework',
    eyebrow: 'Framework & methodology',
    title: 'How we measure impact',
    sub: 'The methodology behind every number we report.',
    docs: [
      {
        issuer: 'proactive', title: 'Impact Measurement & Management (IMM) Framework',
        meta: 'Proactive Sustainable Bonds', file: 'impact-measurement-management-framework.pdf', pages: '46 pages', size: '9.9 MB',
        desc: 'Our complete framework for measuring, managing, and reporting impact across the portfolio — the foundation our third-party assessments are built on.',
      },
    ],
  },
  {
    key: 'verifications',
    eyebrow: 'Independent verification & ratings',
    title: 'Assessed by third parties',
    sub: 'Our impact and governance are evaluated by independent specialists — not graded by ourselves.',
    docs: [
      {
        issuer: 'bluemark', title: 'BlueMark — Independent Verifier Statement',
        meta: 'Fund ID · August 2025', file: 'bluemark-independent-verifier-statement-2025.pdf', pages: '2 pages', size: '147 KB',
        desc: 'BlueMark’s independent verification of Proactive Sustainable Bonds™’ alignment with impact-investing and ESG best practices, under its Fund Impact Diagnostic (Fund ID) methodology.',
        featured: true,
      },
      {
        issuer: 'bluemark', title: 'BlueMark — Fund ID Compact Assessment (Platinum)',
        meta: 'May 2025', file: 'bluemark-fund-id-compact-assessment-platinum-2025.pdf', pages: '1 page', size: '342 KB',
        desc: 'Pillar-by-pillar scoring of Impact Strategy, Governance, Management and Reporting — an estimated overall Platinum rating based on Proactive’s submitted information.',
      },
      {
        issuer: 'iel', title: 'Impact Authenticity Score (IAS) — Performance Report',
        meta: 'Impact Evaluation Lab · June 2025', file: 'impact-authenticity-score-iel-2025.pdf', pages: '13 pages', size: '549 KB',
        desc: 'A third-party evaluation of the integrity of Proactive’s impact across affordable housing, equity & inclusion, underserved populations, and community development.',
        featured: true,
      },
      {
        issuer: 'pri', title: 'PRI — Signatory Confirmation',
        meta: 'Principles for Responsible Investment · October 2025', file: 'pri-signatory-confirmation-2025.pdf', pages: '3 pages', size: '213 KB',
        desc: 'Confirmation of Proactive Sustainable Bonds as an Investment Manager signatory to the UN-supported Principles for Responsible Investment.',
      },
    ],
  },
];

function DocCard({ d }) {
  const iss = ISSUERS[d.issuer];
  return (
    <article className={`vf-card${d.featured ? ' vf-card-feat' : ''}`}>
      <div className="vf-card-top">
        <span className="vf-logo"><img src={iss.logo} alt={iss.name} /></span>
        {d.featured && <span className="vf-badge"><Ic name="shield-check" size={12} /> Independently verified</span>}
      </div>
      <h3 className="vf-title">{d.title}</h3>
      <div className="vf-issuer">{d.meta}</div>
      <p className="vf-desc">{d.desc}</p>
      <div className="vf-card-foot">
        <a className="btn btn-accent btn-sm vf-dl" href={`/verified/${d.file}`} download>
          <Ic name="download" size={16} /> Download
        </a>
        <span className="vf-file">PDF · {d.pages} · {d.size}</span>
      </div>
    </article>
  );
}

export default function VerifiedPage() {
  useEffect(() => { initInteractions(); }, []);
  return (
    <React.Fragment>
      <MktNav />
      <main>
        <section className="vf-hero">
          <span className="eyebrow" style={{ color: 'var(--brand)' }}>ProActively Verified™</span>
          <h1 className="editorial">Independent proof, not just promises.</h1>
          <p className="lead">
            Impact is easy to claim and hard to prove. So we don’t grade ourselves. Proactive’s impact, governance, and reporting are
            independently assessed by <strong>Morningstar Sustainalytics</strong>, <strong>BlueMark</strong>, the
            <strong> Impact Evaluation Lab</strong>, and the UN-supported <strong>Principles for Responsible Investment</strong>.
            Every certification and report is yours to download below.
          </p>
          <div className="vf-trust">
            <span className="vf-trust-label">Verified by</span>
            <span className="vf-logo vf-logo-lg"><img src={ISSUERS.morningstar.logo} alt="Morningstar Sustainalytics" /></span>
            <span className="vf-logo vf-logo-lg"><img src={ISSUERS.pri.logo} alt="Principles for Responsible Investment" /></span>
            <span className="vf-logo vf-logo-lg"><img src={ISSUERS.iel.logo} alt="Impact Evaluation Lab" /></span>
            <span className="vf-logo vf-logo-lg"><img src={ISSUERS.bluemark.logo} alt="BlueMark" /></span>
          </div>
        </section>

        {SECTIONS.map((s) => (
          <section className="vf-section" key={s.key} id={s.key}>
            <div className="vf-section-head">
              <span className="eyebrow">{s.eyebrow}</span>
              <h2 className="editorial">{s.title}</h2>
              <p className="vf-section-sub">{s.sub}</p>
            </div>
            <div className="vf-grid">
              {s.docs.map((d) => <DocCard d={d} key={d.file} />)}
            </div>
          </section>
        ))}

        <section className="vf-quote-wrap">
          <figure className="vf-quote glass lit">
            <Ic name="check-circle" size={28} style={{ color: 'var(--brand)' }} />
            <blockquote>
              “The IAS Score is more than a report. It is a roadmap that builds accountability and drives meaningful, sustainable
              change in how we operate.”
            </blockquote>
            <figcaption>
              Proactive Sustainable Bonds™, on the Impact Authenticity Scoring process
              <a href="/verified/impact-evaluation-lab-testimonial.pdf" download>Read the full testimonial (PDF) <Ic name="arrow-right" size={14} /></a>
            </figcaption>
          </figure>
        </section>

        <p className="vf-disclaimer">
          Third-party ratings and scores reflect each issuer’s own methodology and the information available as of the dates shown;
          BlueMark’s Fund ID Compact rating is an estimate based on self-disclosed information. Past performance and prior impact do
          not guarantee future results. Nothing on this page is an offer to sell or a solicitation to buy any security; any offering
          is made only to verified accredited investors through the fund’s private placement memorandum.
        </p>
      </main>
      <MktFooter />

      <style>{`
        .vf-hero { max-width: 880px; margin: 40px auto 0; padding: 0 22px; text-align: center; }
        .vf-hero h1 { margin: 16px 0 0; font-size: var(--text-4xl); letter-spacing: -0.025em; line-height: 1.05; color: var(--forest-700); }
        [data-theme="dark"] .vf-hero h1 { color: var(--lime-300); }
        .vf-hero .lead { margin: 20px auto 0; max-width: 64ch; }
        .vf-hero .lead strong { color: var(--fg-1); font-weight: 600; }
        .vf-trust { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 16px; margin-top: 34px; }
        .vf-trust-label { font-size: var(--text-2xs); letter-spacing: 0.14em; text-transform: uppercase; color: var(--fg-3); font-weight: 600; }
        .vf-logo { display: grid; place-items: center; background: #fff; border-radius: 10px; padding: 8px 12px; box-shadow: var(--shadow-sm); }
        .vf-logo img { display: block; height: 26px; width: auto; object-fit: contain; }
        .vf-logo-lg { padding: 12px 20px; }
        .vf-logo-lg img { height: auto; max-height: 42px; width: auto; max-width: min(360px, 72vw); }

        .vf-section { max-width: 1180px; margin: 72px auto 0; padding: 0 22px; }
        .vf-section-head { max-width: 60ch; }
        .vf-section-head h2 { margin: 12px 0 0; font-size: var(--text-3xl); letter-spacing: -0.02em; color: var(--forest-700); }
        [data-theme="dark"] .vf-section-head h2 { color: var(--lime-300); }
        .vf-section-sub { margin: 10px 0 0; color: var(--fg-2); font-size: var(--text-base); line-height: 1.55; }
        .vf-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; margin-top: 26px; }

        .vf-card { display: flex; flex-direction: column; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-xl); padding: 24px 24px 20px; transition: border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out); }
        .vf-card:hover { border-color: color-mix(in srgb, var(--accent) 45%, var(--border)); box-shadow: var(--shadow-md); transform: translateY(-2px); }
        .vf-card-feat { border-color: color-mix(in srgb, var(--accent) 40%, var(--border)); background: color-mix(in srgb, var(--brand) 4%, var(--surface)); }
        .vf-card-top { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 16px; }
        .vf-badge { display: inline-flex; align-items: center; gap: 5px; font-size: 10px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--forest-600); background: var(--lime-100); border-radius: 999px; padding: 4px 9px; }
        [data-theme="dark"] .vf-badge { color: var(--lime-300); background: color-mix(in srgb, var(--brand) 22%, transparent); }
        .vf-title { font-size: var(--text-lg); font-weight: 600; color: var(--fg-1); margin: 0; letter-spacing: -0.01em; line-height: 1.25; }
        .vf-issuer { font-size: var(--text-xs); color: var(--fg-3); margin-top: 6px; font-weight: 500; }
        .vf-desc { font-size: var(--text-sm); color: var(--fg-2); line-height: 1.55; margin: 12px 0 18px; flex: 1; }
        .vf-card-foot { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
        .vf-dl { text-decoration: none; }
        .vf-file { font-family: var(--font-mono); font-size: var(--text-2xs); color: var(--fg-3); white-space: nowrap; }

        .vf-quote-wrap { max-width: 920px; margin: 80px auto 0; padding: 0 22px; }
        .vf-quote { border-radius: var(--radius-2xl); padding: 40px 44px; text-align: center; }
        .vf-quote blockquote { margin: 16px auto 0; max-width: 56ch; font-family: var(--font-serif); font-size: var(--text-2xl); line-height: 1.4; color: var(--fg-1); letter-spacing: -0.01em; }
        .vf-quote figcaption { margin-top: 20px; font-size: var(--text-sm); color: var(--fg-2); display: flex; flex-direction: column; gap: 6px; align-items: center; }
        .vf-quote figcaption a { color: var(--brand); font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 5px; }
        .vf-quote figcaption a:hover { text-decoration: underline; }

        .vf-disclaimer { max-width: 80ch; margin: 56px auto 0; padding: 0 22px; text-align: center; font-size: var(--text-xs); color: var(--fg-3); line-height: 1.6; }

        @media (max-width: 760px) {
          .vf-grid { grid-template-columns: 1fr; }
          .vf-hero h1 { font-size: var(--text-3xl); }
          .vf-quote { padding: 32px 24px; }
          .vf-quote blockquote { font-size: var(--text-xl); }
        }
      `}</style>
    </React.Fragment>
  );
}
