import React from 'react';
import { Ic } from './icons.jsx';
import { team } from '../data/team.js';

function Social({ member }) {
  return (
    <div className="team-social">
      {member.linkedin && (
        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} on LinkedIn`}><Ic name="linkedin" size={18} /></a>
      )}
      {member.email && (
        <a href={`mailto:${member.email}`} aria-label={`Email ${member.name}`}><Ic name="mail" size={18} /></a>
      )}
    </div>
  );
}

// Render a bio paragraph, linking the phrase "published author" to the store.
function BioParagraph({ text, store }) {
  if (store && text.includes('published author')) {
    const [a, b] = text.split('published author');
    return <p>{a}<a className="bio-link" href={store} target="_blank" rel="noopener noreferrer">published author</a>{b}</p>;
  }
  return <p>{text}</p>;
}

function BioBooks({ books, store }) {
  return (
    <div className="bio-books">
      <span className="data-label">Author of</span>
      <div className="bio-books-row">
        {books.map((b) => (
          <a className="bio-book" key={b.title} href={b.url} target="_blank" rel="noopener noreferrer" title={b.title}>
            <img src={b.image} alt={`Cover of ${b.title}`} loading="lazy" />
            <span className="bio-book-title">{b.title}</span>
            {b.note && <span className="bio-book-note">{b.note}</span>}
          </a>
        ))}
      </div>
      {store && <a className="bio-books-all" href={store} target="_blank" rel="noopener noreferrer">All books on Amazon <Ic name="external-link" size={13} /></a>}
    </div>
  );
}

const PRINCIPLES = [
  ['home', 'What we build', 'Naturally Occurring Affordable Housing — manufactured-home communities, multifamily, and single-room occupancy — for people underserved by traditional capital.'],
  ['bar-chart', 'How we measure', 'Aligned to the ICMA Social Bond Principles and the Operating Principles for Impact Management: impact that’s intentional, material, measured, and managed.'],
  ['shield-check', 'How it’s verified', 'Independently checked by Impact Evaluation Lab, BlueMark, and Morningstar Sustainalytics — and a signatory to the UN Principles for Responsible Investment.'],
];

export default function AboutTeam() {
  return (
    <React.Fragment>
      <section className="about-hero">
        <span className="eyebrow">About us</span>
        <h1>Capital with a conscience — and an address.</h1>
        <p className="lead">Proactive Sustainable Bonds is a third-party, impact-verified, real-estate-backed platform built to scale affordable housing across America — turning everyday investment into homes people can actually live in.</p>
      </section>

      <section className="about-principles">
        {PRINCIPLES.map(([ic, t, d]) => (
          <div className="principle glass lit" key={t}>
            <div className="principle-ic"><Ic name={ic} size={22} /></div>
            <h3>{t}</h3>
            <p>{d}</p>
          </div>
        ))}
      </section>

      <section className="team-section">
        <div className="team-head">
          <span className="eyebrow">Leadership</span>
          <h2 className="editorial">Meet the team</h2>
          <p className="lead">Deep real-estate and capital-markets experience, pointed squarely at housing impact.</p>
        </div>

        {team.map((m, i) => (
          <article className={'team-row rise' + (i % 2 ? ' reverse' : '')} key={m.name}>
            <div className="team-photo">
              {m.image && <img src={m.image} alt={m.name} loading="lazy" />}
            </div>
            <div className="team-bio">
              <h3 className="editorial">{m.name}</h3>
              <div className="team-role">{m.role}</div>
              {m.bio.split('\n\n').map((p, j) => <BioParagraph key={j} text={p} store={m.authorStore} />)}
              {m.books && m.books.length > 0 && <BioBooks books={m.books} store={m.authorStore} />}
              <Social member={m} />
            </div>
          </article>
        ))}
      </section>

      <style>{`
        .about-hero { max-width: 880px; margin: 0 auto; padding: 56px 22px 0; text-align: center; }
        .about-hero h1 { margin: 14px 0 0; font-size: var(--text-4xl); letter-spacing: -0.025em; line-height: 1.05; }
        .about-hero .lead { margin: 20px auto 0; max-width: 60ch; }
        .about-principles { max-width: 1180px; margin: 48px auto 0; padding: 0 22px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .principle { border-radius: var(--radius-2xl); padding: 28px; }
        .principle-ic { width: 46px; height: 46px; border-radius: 13px; display: grid; place-items: center; background: var(--lime-100); color: var(--forest-600); margin-bottom: 16px; }
        [data-theme="dark"] .principle-ic { background: color-mix(in srgb, var(--brand) 16%, transparent); color: var(--lime-300); }
        .principle h3 { margin: 0 0 8px; font-size: var(--text-lg); font-weight: 600; color: var(--fg-1); }
        .principle p { margin: 0; color: var(--fg-2); font-size: var(--text-sm); line-height: 1.6; }

        .team-section { max-width: 1120px; margin: 100px auto 0; padding: 0 22px; }
        .team-head { text-align: center; max-width: 56ch; margin: 0 auto 64px; }
        .team-head h2 { margin: 14px 0 0; color: var(--forest-700); font-weight: 600; letter-spacing: -0.02em; }
        [data-theme="dark"] .team-head h2 { color: var(--lime-300); }
        .team-head .lead { margin: 14px auto 0; }

        .team-row { display: grid; grid-template-columns: 360px minmax(0, 1fr); gap: 56px; align-items: center; margin: 0 0 64px; }
        .team-row.reverse { grid-template-columns: minmax(0, 1fr) 360px; }
        .team-row.reverse .team-photo { grid-column: 2; grid-row: 1; }
        .team-row.reverse .team-bio { grid-column: 1; grid-row: 1; }
        .team-photo { position: relative; height: 420px; display: flex; align-items: flex-end; justify-content: center; }
        .team-photo::before { content: ''; position: absolute; left: 50%; bottom: 5%; transform: translateX(-50%); width: 90%; height: 80%; border-radius: 50%; background: radial-gradient(circle at 50% 55%, color-mix(in srgb, var(--brand) 24%, transparent), transparent 66%); filter: blur(38px); z-index: 0; }
        .team-photo img { position: relative; z-index: 1; height: 100%; max-width: 100%; width: auto; object-fit: contain; object-position: bottom center; filter: drop-shadow(0 16px 26px rgba(13, 40, 25, 0.22)); }
        .team-bio h3 { margin: 0; font-size: var(--text-3xl); color: var(--forest-700); font-weight: 600; letter-spacing: -0.015em; }
        [data-theme="dark"] .team-bio h3 { color: var(--lime-300); }
        .team-role { margin: 6px 0 18px; color: var(--brand); font-weight: 600; font-size: var(--text-sm); letter-spacing: 0.02em; text-transform: uppercase; }
        .team-bio p { margin: 0 0 14px; color: var(--fg-2); font-size: var(--text-base); line-height: 1.72; max-width: 60ch; }
        .team-social { display: flex; gap: 10px; margin-top: 22px; }
        .team-social a { width: 42px; height: 42px; border-radius: 50%; display: grid; place-items: center; border: 1px solid var(--border); color: var(--fg-2); background: var(--surface); transition: all var(--dur-base) var(--ease-out); }
        .team-social a:hover { background: var(--brand); border-color: var(--brand); color: #fff; transform: translateY(-2px); }

        .bio-link { color: var(--brand); font-weight: 600; text-decoration: none; border-bottom: 1px solid color-mix(in srgb, var(--brand) 40%, transparent); }
        .bio-link:hover { border-bottom-color: var(--brand); }

        .bio-books { margin-top: 24px; }
        .bio-books > .data-label { display: block; margin-bottom: 11px; }
        .bio-books-row { display: flex; gap: 16px; flex-wrap: wrap; }
        .bio-book { width: 84px; text-decoration: none; color: inherit; }
        .bio-book img { width: 84px; aspect-ratio: 2 / 3; object-fit: cover; border-radius: 7px; box-shadow: var(--shadow-md); display: block; transition: transform 0.3s var(--ease-out, ease), box-shadow 0.3s var(--ease-out, ease); }
        .bio-book:hover img { transform: translateY(-3px); box-shadow: var(--shadow-lg); }
        .bio-book-title { display: block; margin-top: 7px; font-size: 11px; line-height: 1.3; color: var(--fg-3); }
        .bio-book-note { display: block; margin-top: 2px; font-size: 10px; font-weight: 600; color: var(--brand); }
        .bio-books-all { display: inline-flex; align-items: center; gap: 5px; margin-top: 14px; color: var(--brand); font-weight: 600; font-size: var(--text-xs); text-decoration: none; }
        .bio-books-all:hover { text-decoration: underline; }

        @media (max-width: 860px) {
          .about-principles { grid-template-columns: 1fr; }
          .team-row, .team-row.reverse { grid-template-columns: 1fr; gap: 16px; margin-bottom: 56px; }
          .team-row.reverse .team-photo, .team-row.reverse .team-bio { grid-column: 1; grid-row: auto; }
          .team-photo { height: 340px; }
          .team-bio { text-align: center; }
          .team-bio p { margin-left: auto; margin-right: auto; }
          .team-social { justify-content: center; }
          .bio-books-row { justify-content: center; }
        }
      `}</style>
    </React.Fragment>
  );
}
