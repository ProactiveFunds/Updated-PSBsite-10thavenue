import React, { useState, useEffect } from 'react';
import { MktNav, MktFooter } from './MktChrome.jsx';
import { Hero } from './Hero.jsx';
import { HomeCalculator } from './HomeCalculator.jsx';
import { Partners, BeforeAfter, ReturnComparison, SocialProof, Opportunities2, IntakeForm } from './HomeSections.jsx';
import { InvestModal } from './Sections.jsx';
import Testimonials from './Testimonials.jsx';
import { IraCta } from './IraPage.jsx';
import { initInteractions } from '../lib/interactions.js';

export default function App() {
  const [invest, setInvest] = useState(false);
  const open = () => setInvest(true);
  useEffect(() => { initInteractions(); }, []);
  return (
    <React.Fragment>
      <MktNav onInvest={open} />
      <main>
        <Hero onInvest={open} />
        <IraCta />
        <HomeCalculator onStart={open} />
        <Partners />
        <Testimonials />
        <BeforeAfter />
        <ReturnComparison onInvest={open} />
        <SocialProof />
        <Opportunities2 />
        <IntakeForm />
        <MktFooter />
      </main>
      <InvestModal open={invest} onClose={() => setInvest(false)} />
    </React.Fragment>
  );
}
