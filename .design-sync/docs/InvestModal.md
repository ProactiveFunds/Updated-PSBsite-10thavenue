---
category: Investing
---
The invest dialog — a centred glass panel over a dimmed backdrop.

A controlled overlay: you own the open state. Renders nothing when `open` is
false.

```jsx
const [open, setOpen] = React.useState(false);
<>
  <button className="btn btn-primary" onClick={() => setOpen(true)}>Invest now</button>
  <InvestModal open={open} onClose={() => setOpen(false)} />
</>
```

Closes on backdrop click, the close button, and Escape.
