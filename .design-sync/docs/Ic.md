---
category: Primitives
---
The house icon set — inline, stroke-based SVG glyphs at a 1.75px default weight.

`Ic` is the only icon primitive in the system; there is no icon font and no
third-party icon package. It renders a 24x24 `viewBox` svg that inherits
`currentColor`, so it takes the colour of whatever text it sits in.

```jsx
<Ic name="shield-check" size={18} />
<span style={{ color: 'var(--accent)' }}><Ic name="leaf" /></span>
```

Sizing convention on the site: 13–14px inline with small text, 18–20px in
buttons and list bullets, 28–40px as a standalone feature mark. Raise `stroke`
toward 2 only when the glyph is small on a busy background.
