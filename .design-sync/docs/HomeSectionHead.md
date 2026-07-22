---
category: Sections
---
The home-page section heading: same anatomy as `SectionHead` but centred by default and able to render its title in the editorial serif.

```jsx
<HomeSectionHead eyebrow="Why investors choose us" title="Investment return comparison" serif />
<HomeSectionHead eyebrow="Portfolio" title="What we own" sub="Twenty-seven communities." align="left" />
```

`serif` switches the title to Newsreader in `--forest-700` at weight 600 —
the house treatment for marketing sections. Without it you get the UI sans in
`--fg-1` at weight 700.
