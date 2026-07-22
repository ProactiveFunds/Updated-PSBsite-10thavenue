---
category: Chrome
---
The site's sticky top navigation: brand lockup, section links, theme toggle and an "Invest now" CTA.

Frosted glass over whatever scrolls beneath it. Collapses to a hamburger and a
full-width panel below the tablet breakpoint (rules live in `responsive.css`).

```jsx
<MktNav onInvest={openInvestFlow} />
<main>{/* page */}</main>
<MktFooter />
```

Anchor links scroll within the page and fall back to `/#id` when the target is
not on the current route.
