import React, { useState, useEffect } from 'react';
import { MktNav } from './MktChrome.jsx';
import { InvestModal } from './Sections.jsx';
import { initInteractions } from '../lib/interactions.js';

// Top chrome for Digest pages: the real marketing nav + invest modal.
export default function DigestNav() {
  const [invest, setInvest] = useState(false);
  useEffect(() => { initInteractions(); }, []);
  return (
    <React.Fragment>
      <MktNav onInvest={() => setInvest(true)} />
      <InvestModal open={invest} onClose={() => setInvest(false)} />
    </React.Fragment>
  );
}
