// design-sync bundle entry — the reusable component surface of the PSB site.
//
// Why this file exists: proactive-astro is an Astro site, not a published
// component package, so there is no dist/ entry to bundle. Without an explicit
// entry the converter synthesizes one from every .jsx under src/, which drags
// in leaflet (PortfolioMap) and the full assets dataset (AssetsExplorer), and
// silently drops default-only exports anyway (`export *` skips defaults).
//
// So we name the surface here: every export below is a NAMED export of a real
// site component, and this list is exactly what lands on window.PSB.
// Page-level components (App, Q3SpecialPage, VerifiedPage, IraPage,
// ProcessPage, AccreditationPage, AboutTeam, AssetsExplorer, PortfolioMap,
// Testimonials, DigestNav) are deliberately excluded — they are whole pages or
// data/leaflet-bound, not building blocks.
//
// Keep in sync with componentSrcMap in .design-sync/config.json.

export { Hero, ImpactBand, Photo } from '../src/components/Hero.jsx';
export {
  Partners,
  BeforeAfter,
  ReturnComparison,
  SocialProof,
  Opportunities2,
  IntakeForm,
  HomeSectionHead,
} from '../src/components/HomeSections.jsx';
export { MktNav, MktFooter, ThemeToggle } from '../src/components/MktChrome.jsx';
export {
  SectionHead,
  Opportunities,
  Process,
  Testimonial,
  Insights,
  InvestModal,
} from '../src/components/Sections.jsx';
export { HomeCalculator } from '../src/components/HomeCalculator.jsx';
export { Ic } from '../src/components/icons.jsx';
