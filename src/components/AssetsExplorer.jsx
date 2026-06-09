import React from 'react';
import { Ic } from './icons.jsx';
import { assets as ALL, SDG_LABELS, FUNDS, STATUSES } from '../data/assets.js';
import PortfolioMap from './PortfolioMap.jsx';

const { useState, useMemo } = React;

const money = (n) => (n == null ? '—' : '$' + Number(n).toLocaleString());
const moneyShort = (n) => {
  if (n == null) return '—';
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(n % 1e6 ? 1 : 0) + 'M';
  if (n >= 1e3) return '$' + Math.round(n / 1e3) + 'K';
  return '$' + n;
};
const STATUS_TONE = {
  'Acquired': { bg: 'color-mix(in srgb, var(--brand) 16%, transparent)', fg: 'var(--brand)' },
  'In Contract': { bg: 'color-mix(in srgb, #d9a441 20%, transparent)', fg: '#a9772a' },
  'In Review': { bg: 'var(--surface-2)', fg: 'var(--fg-2)' },
  'Sold': { bg: 'var(--surface-2)', fg: 'var(--fg-3)' },
};

function Bar({ pct }) {
  return (
    <span style={{ display: 'inline-block', width: 54, height: 6, borderRadius: 4, background: 'var(--surface-2)', overflow: 'hidden', verticalAlign: 'middle' }}>
      <span style={{ display: 'block', height: '100%', width: (pct || 0) + '%', background: 'var(--brand)' }} />
    </span>
  );
}

export default function AssetsExplorer() {
  const [q, setQ] = useState('');
  const [fund, setFund] = useState('all');
  const [status, setStatus] = useState('all');
  const [stateF, setStateF] = useState('all');
  const [sort, setSort] = useState({ key: 'year', dir: 'desc' });
  const [view, setView] = useState('table');
  const [open, setOpen] = useState(null);

  // Filters minus the state filter — drives both the map shading and the table.
  const preState = useMemo(() => ALL.filter((a) => {
    if (fund !== 'all' && a.fund !== fund) return false;
    if (status !== 'all' && a.status !== status) return false;
    if (q) {
      const hay = `${a.name} ${a.city} ${a.state}`.toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  }), [q, fund, status]);

  const stateCounts = useMemo(() => {
    const m = {};
    preState.forEach((a) => { if (a.state) m[a.state] = (m[a.state] || 0) + 1; });
    return m;
  }, [preState]);
  const maxCount = Math.max(1, ...Object.values(stateCounts));

  const rows = useMemo(() => {
    const list = preState.filter((a) => stateF === 'all' || a.state === stateF);
    const dir = sort.dir === 'asc' ? 1 : -1;
    const val = (a) => ({
      name: a.name || '', fund: a.fund || '', status: a.status || '',
      units: a.units || 0, occupancy: a.occupancyRate || 0,
      year: a.yearAcquired || 0, value: a.estimatedValue || 0,
    }[sort.key]);
    return [...list].sort((a, b) => {
      const x = val(a), y = val(b);
      if (typeof x === 'string') return x.localeCompare(y) * dir;
      return (x - y) * dir;
    });
  }, [preState, stateF, sort]);

  const kpis = useMemo(() => {
    const states = new Set(rows.map((r) => r.state).filter(Boolean));
    const units = rows.reduce((s, r) => s + (r.units || 0), 0);
    const occ = rows.filter((r) => r.occupancyRate != null);
    const avgOcc = occ.length ? Math.round(occ.reduce((s, r) => s + r.occupancyRate, 0) / occ.length) : null;
    return { count: rows.length, states: states.size, units, avgOcc };
  }, [rows]);

  const availableStates = useMemo(() => [...new Set(ALL.map((a) => a.state).filter(Boolean))].sort(), []);
  const sortBy = (key) => setSort((s) => ({ key, dir: s.key === key && s.dir === 'desc' ? 'asc' : 'desc' }));
  const Arrow = ({ k }) => sort.key === k ? <Ic name={sort.dir === 'asc' ? 'arrow-up' : 'arrow-down'} size={12} style={{ marginLeft: 4, verticalAlign: 'middle' }} /> : null;

  const byYear = useMemo(() => {
    const m = {};
    rows.forEach((r) => { const y = r.yearAcquired || 'Undated'; (m[y] = m[y] || []).push(r); });
    return Object.entries(m).sort((a, b) => (b[0] === 'Undated' ? -1 : a[0] === 'Undated' ? 1 : b[0] - a[0]));
  }, [rows]);

  const StatusPill = ({ s }) => {
    const t = STATUS_TONE[s] || STATUS_TONE['In Review'];
    return <span className="asset-pill" style={{ background: t.bg, color: t.fg }}>{s || '—'}</span>;
  };

  const Detail = ({ a }) => {
    const facts = [
      ['Fund', a.fund || '—'], ['Acquired', a.purchaseDate || a.yearAcquired || '—'],
      ['Avg rent', a.avgRent ? money(a.avgRent) + '/mo' : '—'], ['Est. value', money(a.estimatedValue)],
    ];
    return (
      <div className="asset-detail">
        <div className="asset-detail-grid">
          <div>
            <div className="data-label">Occupancy</div>
            {a.occupancyRate != null ? (
              <div style={{ marginTop: 6 }}>
                <span className="figure" style={{ fontSize: 'var(--text-xl)', fontWeight: 600 }}>{a.occupancyRate}%</span>
                <div style={{ marginTop: 6 }}><Bar pct={a.occupancyRate} /></div>
                {a.units != null && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-3)', marginTop: 6 }}>{a.occupiedUnits ?? '—'} of {a.units} units occupied</div>}
              </div>
            ) : <div style={{ color: 'var(--fg-3)', marginTop: 6 }}>—</div>}
          </div>
          {facts.map(([l, v]) => (
            <div key={l}><div className="data-label">{l}</div><div className="figure" style={{ marginTop: 6, fontWeight: 500 }}>{v}</div></div>
          ))}
        </div>
        {a.investmentThesis && (<div className="asset-thesis"><div className="data-label">Investment thesis</div><p>{a.investmentThesis}</p></div>)}
        {a.impactThesis && (<div className="asset-thesis"><div className="data-label">Impact thesis</div><p>{a.impactThesis}</p></div>)}
        {a.sdgs && a.sdgs.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div className="data-label" style={{ marginBottom: 8 }}>UN Sustainable Development Goals</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {a.sdgs.map((n) => <span key={n} className="asset-sdg"><Ic name="leaf" size={13} /> SDG {n} · {SDG_LABELS[n] || ''}</span>)}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <section style={{ maxWidth: 1240, margin: '0 auto', padding: '40px 22px 0' }}>
      {/* Header + KPIs */}
      <div style={{ marginBottom: 28 }}>
        <span className="eyebrow">Portfolio</span>
        <h1 style={{ margin: '12px 0 0', fontSize: 'var(--text-4xl)', letterSpacing: '-0.025em', lineHeight: 1.05 }}>The portfolio, in detail.</h1>
        <p className="lead" style={{ maxWidth: '52ch', margin: '14px 0 0', fontSize: 'var(--text-base)' }}>Every community we hold — filter, compare, and open any asset to see occupancy, thesis, and impact without leaving the page.</p>
        <div className="asset-kpis">
          {[['Assets', kpis.count], ['States', kpis.states], ['Total units', kpis.units || '—'], ['Avg occupancy', kpis.avgOcc != null ? kpis.avgOcc + '%' : '—']].map(([l, v]) => (
            <div key={l} className="asset-kpi"><div className="figure" style={{ fontSize: 'var(--text-2xl)', fontWeight: 600 }}>{v}</div><div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-3)', marginTop: 2 }}>{l}</div></div>
          ))}
        </div>
      </div>

      {/* Filter bar */}
      <div className="asset-filters">
        <div className="asset-search">
          <Ic name="search" size={16} style={{ color: 'var(--fg-3)' }} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, city, or state…" />
        </div>
        <select value={fund} onChange={(e) => setFund(e.target.value)}><option value="all">All funds</option>{FUNDS.map((f) => <option key={f} value={f}>{f}</option>)}</select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">All statuses</option>{STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</select>
        <select value={stateF} onChange={(e) => setStateF(e.target.value)}><option value="all">All states</option>{availableStates.map((s) => <option key={s} value={s}>{s}</option>)}</select>
        <div className="asset-views">
          <button className={view === 'table' ? 'on' : ''} onClick={() => setView('table')}><Ic name="layers" size={15} /> Table</button>
          <button className={view === 'timeline' ? 'on' : ''} onClick={() => setView('timeline')}><Ic name="calendar" size={15} /> Timeline</button>
        </div>
      </div>

      <div className="asset-layout">
        {/* Interactive map */}
        <div className="asset-map glass" aria-label="Portfolio by state">
          <div className="data-label" style={{ marginBottom: 12 }}>By state {stateF !== 'all' && <button className="asset-clear" onClick={() => setStateF('all')}>Clear ×</button>}</div>
          <PortfolioMap counts={stateCounts} selected={stateF} onSelect={(st) => setStateF((s) => (s === st ? 'all' : st))} />
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-3)', marginTop: 10 }}>Click a marker to filter · zoom with the +/− controls</div>
        </div>

        {/* Table or Timeline */}
        <div className="asset-main glass">
          {view === 'table' ? (
            <table className="asset-table">
              <thead>
                <tr>
                  <th onClick={() => sortBy('name')} className="sortable">Asset <Arrow k="name" /></th>
                  <th onClick={() => sortBy('fund')} className="sortable">Fund <Arrow k="fund" /></th>
                  <th onClick={() => sortBy('status')} className="sortable">Status <Arrow k="status" /></th>
                  <th onClick={() => sortBy('units')} className="sortable num">Units <Arrow k="units" /></th>
                  <th onClick={() => sortBy('occupancy')} className="sortable">Occupancy <Arrow k="occupancy" /></th>
                  <th onClick={() => sortBy('year')} className="sortable num">Acquired <Arrow k="year" /></th>
                  <th aria-label="expand"></th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && <tr><td colSpan="7" style={{ textAlign: 'center', color: 'var(--fg-3)', padding: 40 }}>No assets match these filters.</td></tr>}
                {rows.map((a) => {
                  const isOpen = open === a.id;
                  return (
                    <React.Fragment key={a.id}>
                      <tr className={'asset-row' + (isOpen ? ' open' : '')} onClick={() => setOpen(isOpen ? null : a.id)}>
                        <td data-label="Asset">
                          <div className="asset-name">{a.name}</div>
                          <div className="asset-loc">{a.city}{a.city && a.state ? ', ' : ''}{a.state}</div>
                        </td>
                        <td data-label="Fund" className="asset-fund">{a.fund ? a.fund.replace(', LLC', '') : '—'}</td>
                        <td data-label="Status"><StatusPill s={a.status} /></td>
                        <td data-label="Units" className="figure num">{a.units ?? '—'}</td>
                        <td data-label="Occupancy">{a.occupancyRate != null ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><span className="figure">{a.occupancyRate}%</span><Bar pct={a.occupancyRate} /></span> : <span style={{ color: 'var(--fg-3)' }}>—</span>}</td>
                        <td data-label="Acquired" className="figure num">{a.yearAcquired ?? '—'}</td>
                        <td className="asset-chev"><Ic name={isOpen ? 'chevron-down' : 'chevron-right'} size={18} style={{ color: 'var(--fg-3)' }} /></td>
                      </tr>
                      {isOpen && <tr className="asset-detail-row"><td colSpan="7"><Detail a={a} /></td></tr>}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="asset-timeline">
              {byYear.map(([year, items]) => (
                <div key={year} className="asset-tl-year">
                  <div className="asset-tl-label"><span className="figure">{year}</span><span>{items.length} asset{items.length > 1 ? 's' : ''}</span></div>
                  <div className="asset-tl-items">
                    {items.map((a) => (
                      <button key={a.id} className="asset-tl-item" onClick={() => { setView('table'); setOpen(a.id); }}>
                        <span className="asset-name">{a.name}</span>
                        <span className="asset-loc">{a.city}{a.city && a.state ? ', ' : ''}{a.state}</span>
                        <StatusPill s={a.status} />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .asset-kpis { display: flex; gap: 38px; margin-top: 28px; flex-wrap: wrap; }
        .asset-filters { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; margin-bottom: 22px; }
        .asset-search { display: flex; align-items: center; gap: 8px; flex: 1; min-width: 220px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 0 14px; }
        .asset-search input { border: none; outline: none; background: transparent; font: inherit; font-size: var(--text-sm); color: var(--fg-1); padding: 11px 0; width: 100%; }
        .asset-filters select { font: inherit; font-size: var(--text-sm); color: var(--fg-1); background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 11px 12px; cursor: pointer; }
        .asset-views { display: inline-flex; background: var(--surface-2); border-radius: var(--radius-md); padding: 3px; gap: 3px; }
        .asset-views button { display: inline-flex; align-items: center; gap: 6px; font: inherit; font-size: var(--text-sm); font-weight: 500; border: none; background: transparent; color: var(--fg-2); padding: 8px 14px; border-radius: calc(var(--radius-md) - 3px); cursor: pointer; }
        .asset-views button.on { background: var(--surface); color: var(--fg-1); box-shadow: var(--shadow-sm); }
        .asset-layout { display: grid; grid-template-columns: 340px 1fr; gap: 20px; align-items: start; }
        .asset-map { border-radius: var(--radius-2xl); padding: 22px; position: sticky; top: 90px; }
        .psb-map { height: 380px; width: 100%; border-radius: var(--radius-md); overflow: hidden; }
        .psb-map .leaflet-container { height: 100%; width: 100%; background: var(--surface-2); font: inherit; }
        .leaflet-control-zoom a { color: var(--fg-1) !important; background: var(--surface) !important; border-color: var(--border) !important; }
        .psb-pin-wrap { background: none !important; border: none !important; }
        .psb-pin { display: flex; align-items: center; justify-content: center; border-radius: 50%; color: #fff; font-weight: 700; font-family: var(--font-mono); font-size: 13px; background: var(--brand); border: 2px solid #fff; box-shadow: 0 5px 16px rgba(13, 40, 25, 0.35); cursor: pointer; transition: transform 0.15s var(--ease-out, ease); }
        .psb-pin:hover { transform: scale(1.09); }
        .psb-pin-on { background: var(--forest-700); border-color: var(--lime-300); box-shadow: 0 0 0 5px color-mix(in srgb, var(--brand) 28%, transparent), 0 5px 16px rgba(13, 40, 25, 0.4); }
        .asset-clear { font: inherit; font-size: var(--text-2xs); border: none; background: transparent; color: var(--brand); cursor: pointer; margin-left: 8px; }
        .asset-main { border-radius: var(--radius-2xl); overflow: hidden; }
        .asset-table { width: 100%; border-collapse: collapse; }
        .asset-table th { text-align: left; font-size: var(--text-2xs); letter-spacing: 0.08em; text-transform: uppercase; color: var(--fg-3); font-weight: 600; padding: 16px 14px; border-bottom: 1px solid var(--border); white-space: nowrap; }
        .asset-table th.sortable { cursor: pointer; user-select: none; }
        .asset-table th.sortable:hover { color: var(--fg-1); }
        .asset-table th.num, .asset-table td.num { text-align: right; }
        .asset-table td { padding: 15px 14px; border-bottom: 1px solid var(--border); font-size: var(--text-sm); vertical-align: middle; }
        .asset-row { cursor: pointer; transition: background var(--dur-base) var(--ease-out); }
        .asset-row:hover { background: var(--surface-2); }
        .asset-row.open { background: var(--surface-2); }
        .asset-name { font-weight: 600; color: var(--fg-1); }
        .asset-loc { font-size: var(--text-xs); color: var(--fg-3); margin-top: 2px; }
        .asset-fund { color: var(--fg-2); font-size: var(--text-xs); }
        .asset-pill { display: inline-block; font-size: var(--text-2xs); font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; padding: 4px 10px; border-radius: 999px; white-space: nowrap; }
        .asset-chev { width: 30px; text-align: right; }
        .asset-detail-row td { padding: 0; background: var(--surface-2); border-bottom: 1px solid var(--border); }
        .asset-detail { padding: 24px; }
        .asset-detail-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 22px; }
        .asset-thesis { margin-top: 18px; max-width: 70ch; }
        .asset-thesis p { margin: 6px 0 0; color: var(--fg-2); font-size: var(--text-sm); line-height: 1.6; }
        .asset-sdg { display: inline-flex; align-items: center; gap: 6px; font-size: var(--text-xs); font-weight: 500; color: var(--forest-700); background: var(--lime-100); border-radius: 999px; padding: 5px 11px; }
        [data-theme="dark"] .asset-sdg { color: var(--lime-300); background: color-mix(in srgb, var(--brand) 16%, transparent); }
        .asset-timeline { padding: 12px 22px 22px; }
        .asset-tl-year { display: grid; grid-template-columns: 120px 1fr; gap: 20px; padding: 20px 0; border-bottom: 1px solid var(--border); }
        .asset-tl-year:last-child { border-bottom: none; }
        .asset-tl-label { font-size: var(--text-2xs); text-transform: uppercase; letter-spacing: 0.08em; color: var(--fg-3); display: flex; flex-direction: column; gap: 4px; }
        .asset-tl-label .figure { font-size: var(--text-2xl); color: var(--fg-1); letter-spacing: 0; }
        .asset-tl-items { display: flex; flex-direction: column; gap: 8px; }
        .asset-tl-item { display: flex; align-items: center; gap: 14px; text-align: left; background: var(--surface-2); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 12px 16px; font: inherit; cursor: pointer; }
        .asset-tl-item:hover { border-color: var(--brand); }
        .asset-tl-item .asset-loc { margin: 0; flex: 1; }
        @media (max-width: 900px) {
          .asset-layout { grid-template-columns: 1fr; }
          .asset-map { position: static; }
        }
        @media (max-width: 680px) {
          .asset-kpis { gap: 24px; }
          .asset-filters select, .asset-search { width: 100%; flex: 1 1 100%; }
          .asset-views { width: 100%; }
          .asset-views button { flex: 1; justify-content: center; }
          .asset-table thead { display: none; }
          .asset-table, .asset-table tbody, .asset-table tr { display: block; width: 100%; }
          .asset-row { padding: 8px 4px; border-bottom: 1px solid var(--border); position: relative; }
          .asset-table td { display: grid; grid-template-columns: auto 1fr; gap: 14px; align-items: baseline; padding: 6px 16px; border: none; text-align: right; box-sizing: border-box; }
          .asset-table td::before { content: attr(data-label); color: var(--fg-3); font-size: var(--text-2xs); text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600; text-align: left; }
          .asset-table td[data-label="Asset"] { display: block; text-align: left; }
          .asset-table td[data-label="Asset"]::before { display: none; }
          .asset-chev { position: absolute; top: 14px; right: 14px; width: auto; }
          .asset-chev::before { display: none; }
          .asset-detail-row td { display: block; text-align: left; padding: 0; }
          .asset-detail-row td::before { display: none; }
          .asset-detail { text-align: left; }
          .asset-detail-grid { grid-template-columns: 1fr 1fr; }
          .asset-tl-year { grid-template-columns: 1fr; gap: 10px; }
        }
      `}</style>
    </section>
  );
}
