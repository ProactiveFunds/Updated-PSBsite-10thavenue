---
category: Investing
---
The interactive returns calculator — the conversion centrepiece of the site.

An amount slider and term/status selectors drive a live projection of interest
and total return. Every "Invest now" CTA in the system funnels here, so give it
`id="calculator"` on the page (the shared CTA helper scrolls to that id).

```jsx
<section id="calculator">
  <HomeCalculator onStart={openInvestFlow} />
</section>
```

Range is $20,000 to $10,000,000. `onStart` fires from the CTA below the
projection.
