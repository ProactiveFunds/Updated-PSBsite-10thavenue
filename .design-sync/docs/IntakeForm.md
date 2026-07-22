---
category: Investing
---
The lead intake form — "Tell us about your goals."

The site's single contact/lead capture surface. It posts to Tenth Avenue
through a hidden iframe, so it submits without navigating away. Give the
wrapping section `id="get-started"`, which is what the nav's "Contact us" link
targets.

```jsx
<section id="get-started">
  <IntakeForm />
</section>
```

Fields and the submit endpoint are baked in — it takes no props.
