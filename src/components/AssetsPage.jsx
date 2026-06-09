import React, { useState, useEffect } from 'react';
import { MktNav, MktFooter } from './MktChrome.jsx';
import { InvestModal } from './Sections.jsx';
import AssetsExplorer from './AssetsExplorer.jsx';
import { initInteractions } from '../lib/interactions.js';

export default function AssetsPage() {
  const [invest, setInvest] = useState(false);
  useEffect(() => { initInteractions(); }, []);
  return (
    <React.Fragment>
      <MktNav onInvest={() => setInvest(true)} />
      <main>
        <AssetsExplorer />
      </main>
      <MktFooter />
      <InvestModal open={invest} onClose={() => setInvest(false)} />
    </React.Fragment>
  );
}
