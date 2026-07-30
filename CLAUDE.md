# Zeitvibe Ventures site

Marketing site for Zeitvibe Ventures, a boutique studio doing brand, content, and
social strategy. Positioning line: *built for one thing, making things spread.*

- **Repo:** `github.com/Soundgeist/zeitvibe`
- **Live:** https://zeitvibeventures.com (custom domain via `CNAME`)
- **Staging URL:** https://soundgeist.github.io/zeitvibe/ works before DNS resolves
- **Reference competitor:** https://chaoticgoodprojects.org. Match its simplicity,
  beat its aesthetic. It is a Squarespace one-pager: wordmark, three service links,
  contact anchor, Instagram link, one manifesto paragraph. That is the whole site.

## Stack

**Static HTML and CSS. No framework, no build step, no dependencies.**

This is a deliberate choice, not a shortcut. The site is a handful of pages of
mostly type; a bundler would add failure modes and buy nothing. Deploy is a
`git push`. Do not introduce React, Tailwind, Astro, or a package manager without
a concrete reason. If the site grows past roughly 5 pages and starts repeating
markup, revisit then.

```
.
├── index.html                  # the entire site today
├── assets/
│   ├── css/
│   │   ├── fonts.css           # GENERATED, @font-face only. See Fonts below.
│   │   └── styles.css          # all styling, token-driven
│   ├── js/main.js              # progressive enhancement only
│   ├── fonts/eb-garamond.woff2 # self-hosted, latin subset, 43KB
│   └── img/favicon.svg
├── CNAME                       # zeitvibeventures.com, do not delete
├── .nojekyll                   # skip Jekyll, serve files verbatim
└── .github/workflows/deploy.yml
```

## Deployment

GitHub Actions to Pages, on every push to `main`. The workflow uploads the repo
root as the artifact. **There is no build**, so what is committed is what ships.

Pages must be set to **Source: GitHub Actions** (not "Deploy from a branch") in
repo Settings, Pages. If deploys mysteriously stop applying, check that first.

`.nojekyll` matters: without it Pages runs Jekyll, which strips files and
directories beginning with `_` or `.`.

### Custom domain

`CNAME` is committed so the domain survives every deploy. Because the artifact is
the repo root, a `CNAME` set only through the web UI would be **overwritten** on
the next push, so keep it in the repo.

DNS records needed at the registrar for the apex domain:

| Type  | Name | Value |
| ----- | ---- | --------------- |
| A     | `@`  | `185.199.108.153` |
| A     | `@`  | `185.199.109.153` |
| A     | `@`  | `185.199.110.153` |
| A     | `@`  | `185.199.111.153` |
| CNAME | `www`| `soundgeist.github.io.` |

Then enable **Enforce HTTPS** in Settings, Pages once the cert provisions
(usually minutes, occasionally up to 24h).

## Conventions

**CSS.** Everything flows from the custom properties in `:root`: palette, type
scale, rhythm. Change a token, not a call site. Sections are ordered in the file
top to bottom to match the page. Class names are BEM-ish (`.mark__name`), flat,
no nesting deeper than one level. Fluid sizing uses `clamp()` rather than
breakpoints; only two media queries exist, one for the single-column collapse and
one for reduced motion.

### Aesthetic brief

**Plain type on paper.** The client's reference is https://chaoticgoodprojects.org
and the instruction was "simpler". The design is restraint: two asymmetric columns
of type, top aligned, with the lower half of the page left empty on purpose. That
emptiness is the composition, not an unfinished section.

Page in full: a stacked wordmark lockup top left, then a grid holding an uppercase
statement, a short paragraph in the right column, two links, and a copyright line.
That is the entire site.

The build passed through two rejected directions before this one, both worth
knowing so they are not revisited:

1. A dark page with a drifting multi-colour gradient and glow. Rejected as "too
   techy or generic gradient".
2. A photocopied flyer: newsprint paper, riso red, condensed poster caps,
   halftone and grain texture, ink slabs, a scrolling ticker, a rotated clipping.
   Rejected as too much. "No no, simpler."

Standing prohibitions, each one from explicit client feedback:

> - **No colour.** The palette is monochrome. There is no accent token, and adding
>   one would break the register.
> - **No texture.** No grain, no halftone, no noise layers.
> - **No rules, borders, or slabs.** Nothing is boxed, outlined, or inverted.
> - **No gradients.** Zero `*-gradient()` in the stylesheet.
> - **No italics.** No italic face is even loaded. See Type.
> - **No motion.** No `@keyframes`, no `animation`. The only transition left is the
>   skip link sliding into view.
> - **No em dashes.** See Copy.

When something looks flat, the fix is size, weight, or whitespace. Never a
texture, a rule, or a colour.

**Palette.** Two values and one tint.

| Token | Value | Use |
| --- | --- | --- |
| `--paper` | `#eeeeec` | page, a warm off-white |
| `--ink` | `#14140f` | all type |
| `--ink-60` | 60% ink | the copyright line only |

Contrast is measured, not eyeballed. `--ink-60` sits at 4.61:1, just over AA, so do
not lighten it. Links underline on hover rather than dimming, because an opacity
fade fell to 3.93:1 at the small end of the fluid link size.

**Type. One family: EB Garamond, variable 400 to 600, roman only.**

An old-style serif, the closest free match to the reference. Note the history: an
earlier build used Instrument Serif italic for emphasis and the client asked for it
to be removed entirely in favour of sans. The reference then turned out to be
wholly serif, and the client confirmed serif wins. **Italics did not come back
with it.**

> **No italics anywhere on this site.** A standing rule across three separate
> instructions. The italic face is not even downloaded, so `<em>` renders roman at
> weight 600 via a global reset. Do not add `font-style: italic` or fetch an
> italic face.

Hierarchy is size alone. The statement is uppercase at `--t-statement`, the links
sit at `--t-link`, body copy at `--t-about`, the copyright smallest. Everything is
weight 400 or 500; nothing is bold.

**Layout.** `.grid` places four flat children explicitly by row and column rather
than wrapping them in column divs. That is deliberate: the source order
(statement, paragraph, links, copyright) is already the correct single-column
reading order, so the 48rem breakpoint only has to drop the explicit placement.
Nothing is hidden or reordered at any width. Keep that property if you add
anything.

**Copy. No em dashes.** A standing rule. Use periods, commas, colons, or
restructure. Do not substitute hyphens or en dashes as a workaround. Applies to
visible copy, `<title>`, meta descriptions, alt text, and code comments.

**The site names no services.** A numbered "What we do" lineup and a services
ticker both existed and were cut at the client's request. The reference has a
services list in its left column and the client was asked directly whether to
reinstate one; the answer was no. The paragraph is the only place the offer
appears. Do not add a services list back unprompted.

**JavaScript.** `main.js` does one thing: stamp the current year in the footer. It
is enhancement only and the page must be complete without it. An
IntersectionObserver scroll-reveal system used to live here and was deleted, along
with the `html.js` class and every `data-reveal` attribute. Do not add it back.

**Accessibility.** Skip link, visible `:focus-visible` rings, semantic headings in
order, decorative layers hidden from screen readers. Keep it that way.

## Fonts

`assets/css/fonts.css` is generated, not hand-edited. The font is self-hosted so
the site makes zero third-party requests. To change families or weights, re-run
the generator below. It fetches from the Google Fonts API, keeps only the
**latin** subset, and rewrites `fonts.css`.

Two traps, both of which produced real bugs here:

1. **Send a complete User-Agent string.** A truncated version (`Chrome/120`)
   makes Google serve **static instances** instead of the variable font. You get
   one `@font-face` per weight, all silently overwriting the same output file.
2. **Request variable fonts with a range** (`wght@400..900`), never discrete
   values (`wght@400;600`), for the same reason.
3. **Multiple axes must be listed alphabetically** if you ever need more than
   one (`wdth,wght`), with ranges in matching order, and the generator has to
   capture `font-stretch` alongside `font-weight`. EB Garamond only exposes
   `wght`, so this does not currently apply.

The `ABORT` guard below catches both by refusing to write the same filename twice.

```bash
cd assets/fonts && python3 - <<'PY'
import re, urllib.request, pathlib, sys
UA={'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 '
                 '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}
url="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400..600&display=swap"
css=urllib.request.urlopen(urllib.request.Request(url,headers=UA)).read().decode()
out,seen=[],{}
for blk in re.findall(r'@font-face\s*\{(.*?)\}',css,re.S):
    g=lambda p:(re.search(p,blk,re.S) or [None,None])[1]
    ur=g(r'unicode-range:\s*([^;]+);')
    if not ur or not ur.strip().startswith('U+0000-00FF'): continue
    fam=g(r"font-family:\s*'([^']+)'"); style=g(r'font-style:\s*([^;]+);').strip()
    wt=g(r'font-weight:\s*([^;]+);').strip()
    st=(g(r'font-stretch:\s*([^;]+);') or '').strip() or None
    fn=fam.lower().replace(' ','-')+('-italic' if style=='italic' else '')+'.woff2'
    if fn in seen: sys.exit("ABORT: %s written twice (%s then %s). Static instances; check UA." % (fn,seen[fn],wt))
    seen[fn]=wt
    pathlib.Path(fn).write_bytes(urllib.request.urlopen(urllib.request.Request(g(r'url\((https://[^)]+\.woff2)\)'),headers=UA)).read())
    d=["  font-family: '%s';"%fam,"  font-style: %s;"%style,"  font-weight: %s;"%wt]
    if st: d.append("  font-stretch: %s;"%st)
    d+=["  font-display: swap;","  src: url('../fonts/%s') format('woff2');"%fn]
    out.append("@font-face {\n"+"\n".join(d)+"\n}")
pathlib.Path('../css/fonts.css').write_text("/* Generated. See CLAUDE.md, Fonts. */\n\n"+"\n\n".join(out)+"\n")
print("%d face(s) written" % len(out))
PY
```

Any font added here also needs a `<link rel="preload">` in `index.html` if it
renders above the fold.

## Local development

No tooling required. Open `index.html` directly, or for correct absolute paths:

```bash
python3 -m http.server 8000   # http://localhost:8000
```

## Open TODOs before launch

1. **Contact email.** Currently `hello@zeitvibeventures.com`; search
   `CONTACT_EMAIL`. Unverified.
2. **`assets/img/og.png`** (1200x630), then uncomment the `og:image` and
   `twitter:card` tags in `<head>`.
3. **Register `zeitvibeventures.com`.** As of 2026-07-29 `whois` reported it
   unregistered. DNS cannot be pointed until it is purchased.

Instagram links to `https://www.instagram.com/the_soundgeist/` in the top nav and
the footer. The `?hl=en` locale param is deliberately omitted so the page renders
in each visitor's own language.
