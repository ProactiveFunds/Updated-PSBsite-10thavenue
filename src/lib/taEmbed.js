// Tenth Avenue form embeds.
//
// Tenth Avenue's embed code is an <iframe> plus an inline <script> that finds the
// iframe through document.currentScript. A React island cannot use that, so the
// script's logic is ported here and wired up by components/TaFormEmbed.jsx. If
// Tenth Avenue changes its embed snippet, update this file to match.

export const TA_ORIGIN = 'https://tenthavenue.io';

// UTM tags and ad click IDs that the snippet copies from the page URL into the
// iframe, so Tenth Avenue can attribute the lead.
export const TA_TRACKING_PARAMS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
  'fbclid', 'gclid', 'gbraid', 'wbraid', 'li_fat_id', 'ttclid', 'msclkid', 'twclid', 'igshid',
];

// Hosts whose subdomains belong to different owners (site builders, hosting).
// A referral between two subdomains of one of these still counts as coming
// from another site.
const SHARED_HOSTS = ' google.com wix.com wixsite.com editorx.io squarespace.com webflow.io '
  + 'wordpress.com blogspot.com github.io myshopify.com shopify.com netlify.app vercel.app '
  + 'weebly.com godaddysites.com square.site carrd.co notion.site framer.website ';

const bare = (host) => String(host || '').replace(/^www\./, '').toLowerCase();
const isShared = (host) => SHARED_HOSTS.includes(` ${host} `);
// True when `a` is `b` or a subdomain of `b`.
const within = (a, b) => `.${a}`.endsWith(`.${b}`);

export function taEmbedBase(formKey) {
  return `${TA_ORIGIN}/f/${encodeURIComponent(formKey)}?embed=1`;
}

/**
 * The iframe src for a Tenth Avenue form. It carries the page's tracking params
 * and, when the visitor arrived from another site, that site's host as `ta_via`.
 * Pass referrer '' when the page is itself framed: the snippet only reads the
 * referrer at the top level.
 */
export function taEmbedSrc(formKey, { search = '', hostname = '', referrer = '' } = {}) {
  const url = new URL(taEmbedBase(formKey));
  const query = new URLSearchParams(search);
  for (const key of TA_TRACKING_PARAMS) {
    const value = query.get(key);
    if (value) url.searchParams.set(key, value.slice(0, 500));
  }

  const host = bare(hostname);
  let from = '';
  try { from = bare(new URL(referrer).hostname); } catch { /* no referrer */ }
  if (/^(?=.*[a-z])[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(from) && from !== host
    && (!within(from, host) || isShared(host))
    && (!within(host, from) || isShared(from))) {
    url.searchParams.set('ta_via', from);
  }
  return url.href;
}

/** The height a Tenth Avenue resize message asks for, or null if it is not one. */
export function taEmbedHeight(data) {
  if (!data || data.type !== 'ta-form-height') return null;
  const height = Number(data.height);
  return height > 0 && height < 20000 ? Math.ceil(height) : null;
}
