import React from 'react';
import 'leaflet/dist/leaflet.css';

const { useRef, useEffect } = React;

// State centroids [lat, lng] — bubbles are placed here (data is state-level).
const STATE_CENTERS = {
  AL: [32.36, -86.28], AK: [63.2, -150.49], AZ: [34.17, -111.93], AR: [34.75, -92.13],
  CA: [36.78, -119.42], CO: [39.55, -105.78], CT: [41.6, -73.09], DE: [38.91, -75.53],
  FL: [27.99, -81.76], GA: [32.65, -83.4], HI: [20.3, -156.5], ID: [44.24, -114.48],
  IL: [40.0, -89.2], IN: [39.85, -86.26], IA: [42.01, -93.21], KS: [38.53, -96.73],
  KY: [37.67, -84.67], LA: [31.17, -91.87], ME: [45.2, -69.0], MD: [39.06, -76.8],
  MA: [42.23, -71.8], MI: [44.0, -85.4], MN: [46.2, -94.3], MS: [32.74, -89.68],
  MO: [38.46, -92.29], MT: [46.92, -110.45], NE: [41.5, -99.8], NV: [39.3, -116.9],
  NH: [43.7, -71.56], NJ: [40.06, -74.52], NM: [34.4, -106.1], NY: [42.9, -75.5],
  NC: [35.55, -79.4], ND: [47.53, -99.78], OH: [40.3, -82.79], OK: [35.57, -97.5],
  OR: [44.0, -120.5], PA: [40.99, -77.6], RI: [41.68, -71.51], SC: [33.86, -80.95],
  SD: [44.4, -100.2], TN: [35.86, -86.35], TX: [31.4, -99.3], UT: [39.3, -111.67],
  VT: [44.05, -72.71], VA: [37.77, -78.6], WA: [47.4, -120.45], WV: [38.6, -80.7],
  WI: [44.6, -89.9], WY: [43.0, -107.55],
};

const TILE = {
  light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  dark: 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
};
const theme = () => (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme')) || 'light';

function bubble(count, selected) {
  const size = Math.min(56, Math.max(32, 24 + count * 4));
  return `<div class="psb-pin${selected ? ' psb-pin-on' : ''}" style="width:${size}px;height:${size}px">${count}</div>`;
}

export default function PortfolioMap({ counts, selected, onSelect }) {
  const elRef = useRef(null);
  const mapRef = useRef(null);
  const tileRef = useRef(null);
  const layerRef = useRef(null);
  const LRef = useRef(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  // Init once (client-only via dynamic import → SSR-safe).
  useEffect(() => {
    let cancelled = false;
    import('leaflet').then((mod) => {
      if (cancelled || !elRef.current) return;
      const L = mod.default || mod;
      LRef.current = L;
      const map = L.map(elRef.current, {
        center: [38.5, -96], zoom: 4, minZoom: 3, maxZoom: 8,
        scrollWheelZoom: false, zoomControl: true, attributionControl: true,
      });
      mapRef.current = map;
      tileRef.current = L.tileLayer(TILE[theme()], {
        attribution: '&copy; OpenStreetMap &copy; CARTO', subdomains: 'abcd', detectRetina: true,
      }).addTo(map);
      layerRef.current = L.layerGroup().addTo(map);
      renderMarkers();
      setTimeout(() => {
        map.invalidateSize();
        const pts = Object.keys(counts || {}).map((s) => STATE_CENTERS[s]).filter(Boolean);
        if (pts.length) { try { map.fitBounds(L.latLngBounds(pts), { padding: [36, 36], maxZoom: 6 }); } catch (e) {} }
      }, 80);

      // Swap tiles when the site theme toggles.
      const obs = new MutationObserver(() => {
        if (tileRef.current) tileRef.current.setUrl(TILE[theme()]);
      });
      obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
      mapRef.current._psbObs = obs;
    });
    return () => {
      cancelled = true;
      if (mapRef.current) { mapRef.current._psbObs && mapRef.current._psbObs.disconnect(); mapRef.current.remove(); mapRef.current = null; }
    };
  }, []);

  function renderMarkers() {
    const L = LRef.current;
    if (!L || !layerRef.current) return;
    layerRef.current.clearLayers();
    Object.entries(counts || {}).forEach(([st, n]) => {
      const c = STATE_CENTERS[st];
      if (!c || !n) return;
      const sel = selected === st;
      const size = Math.min(56, Math.max(32, 24 + n * 4));
      const icon = L.divIcon({ html: bubble(n, sel), className: 'psb-pin-wrap', iconSize: [size, size], iconAnchor: [size / 2, size / 2] });
      L.marker(c, { icon, riseOnHover: true, title: `${st} · ${n} asset${n > 1 ? 's' : ''}` })
        .on('click', () => onSelectRef.current && onSelectRef.current(st))
        .addTo(layerRef.current);
    });
  }

  // Re-draw markers when data or selection changes.
  useEffect(() => { renderMarkers(); }, [counts, selected]);

  return <div ref={elRef} className="psb-map" />;
}
