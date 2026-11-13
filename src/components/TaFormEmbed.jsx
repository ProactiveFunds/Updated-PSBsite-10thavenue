import React from 'react';
import { TA_ORIGIN, taEmbedBase, taEmbedSrc, taEmbedHeight } from '../lib/taEmbed.js';
// TaFormEmbed.jsx — a Tenth Avenue form, embedded as Tenth Avenue's own iframe.
// The fields, the SMS consent wording and the thank-you state all come from the
// form as configured in Tenth Avenue, so edits made there show up here with no
// site change. Its colours, font and logo are set in Tenth Avenue too: the
// site's CSS cannot reach inside the iframe.
const { useState, useEffect, useRef } = React;

export function TaFormEmbed({ formKey, title = 'Form', initialHeight = 720, style }) {
  const frame = useRef(null);
  const base = taEmbedBase(formKey);
  const [src, setSrc] = useState(base);
  const [height, setHeight] = useState(initialHeight);

  useEffect(() => {
    let referrer = '';
    try { if (window.self === window.top) referrer = document.referrer; } catch { /* framed cross-origin */ }
    const next = taEmbedSrc(formKey, { search: window.location.search, hostname: window.location.hostname, referrer });
    // Only swap the src when there is something to add, so most visitors load the form once.
    if (next !== base) setSrc(next);

    const onMessage = (e) => {
      if (e.origin !== TA_ORIGIN || !frame.current || e.source !== frame.current.contentWindow) return;
      const h = taEmbedHeight(e.data);
      if (h) setHeight(h);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [formKey, base]);

  return (
    <iframe
      ref={frame}
      src={src}
      title={title}
      loading="lazy"
      style={{ width: '100%', height, border: 0, display: 'block', colorScheme: 'light', ...style }}
    />
  );
}
