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
│   ├── fonts/archivo.woff2     # self-hosted, latin subset, 2 axes, 88KB
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
top to bottom to match the page. Class names are BEM-ish (`.act__name`), flat,
no nesting deeper than one level. Fluid sizing uses `clamp()` rather than
breakpoints; only two media queries exist and they handle genuine layout changes.

### Aesthetic brief

**The format is a photocopied show flyer.** Not a landing page with flyer styling:
the page is built as a stack of full-bleed slabs and hard rules, the way a xeroxed
flyer is built from bands of ink. Client's words: keep the minimal setup, stay away
from "too techy or generic gradient", lean "Brooklyn grunge".

Top to bottom: ink masthead band, paper hero, ink ticker strip, numbered lineup
rows, a taped-down clipping, ink closing slab, colophon. Sections alternate paper
and ink rather than floating in one centred column.

Three standing prohibitions:

> - **No gradients.** No radial glows, no soft light, no colour washes. A drifting
>   multi-colour gradient layer was built early on and deleted for reading exactly
>   like the generic tech look the client rejected. There is now **zero**
>   `*-gradient()` in the stylesheet, and it should stay that way.
> - **No italics.** See Type below.
> - **No slick motion.** Staged fade-ups and long eased transitions read as product
>   marketing. Transitions are `0.1s` to `0.12s linear`, abrupt on purpose.

**Texture.** Two layers, no gradients in either:

- `.dirt` is fixed at `z-index: 50` and sits **on top of the type**, carrying a
  halftone dot screen over film grain at `mix-blend-mode: multiply`. A photocopy
  screens the whole page, ink included. It is static, so reduced-motion has
  nothing to disable.
- Multiply is invisible against near-black, so the ink slabs carry their own
  lighter toner speckle as a `background-image`. **Do not set the `background`
  shorthand on `.masthead`, `.ticker` or `.cta`** or it silently wipes that
  speckle and the slabs go dead flat. This already broke once.

Other grunge devices, all cheap and all deliberate: a red off-register
`text-shadow` on the hero word, as if the second plate missed; lineup rows that
invert to a full ink slab on hover, bleeding past the text via negative margin;
the manifesto rotated `-0.7deg` inside a hard border with its label straddling the
edge like a sticker. Rotation is dropped under 34rem, where it reads as broken
rather than intentional.

**Palette. Light paper, not dark.** This inverted partway through the project: a
xeroxed flyer is ink on stock, and the dark build kept drifting back toward techy.

| Token | Value | Use |
| --- | --- | --- |
| `--paper` | `#e6e2d6` | newsprint base |
| `--ink` | `#14120f` | type and slabs |
| `--red` | `#b82d17` | accent on paper |
| `--red-lift` | `#ff5a3c` | same accent on ink slabs |

`--red-lift` is a legibility tint, **not** a second accent: the base red only
reaches 3.8:1 on near-black, which fails for small text. Every pair in use was
checked against WCAG AA and passes. `--red` was darkened from `#d1361f` and
`--ink-62` raised from 45% opacity specifically to clear 4.5:1. If you change
either, re-check contrast rather than trusting the swatch.

**Type. One family: Archivo, variable on TWO axes.**

`wdth` 62 to 125% and `wght` 400 to 900. The width axis is what makes the flyer
format work: condensed heavy caps are the poster voice, and Archivo supplies them
without a second font file. Set it with `font-stretch`. The hero word runs
`font-stretch: 62%; font-weight: 900`, lineup names 66%, ticker 70%, closing slab
70%, wordmark 78%. Body copy stays default width at weight 500.

Display type is uppercase throughout. Sentence case survives only in body copy and
the clipping.

> **No italics anywhere on this site.** A standing rule, not an oversight.
> Emphasis is weight and colour: a global
> `em { font-style: normal; font-weight: 800; color: var(--red) }` enforces it.
> Do not reintroduce a serif face, an italic face, or `font-style: italic`.

The hero keeps the weight-and-size hierarchy the client approved, restated in flyer
terms: `.hero__lead` is a small tracked uppercase kicker in `--ink-70`, with
`.hero__key` as the condensed poster word beneath it. The client called an earlier
hero too large, so note that condensed type at 62% width occupies far less visual
mass per point size: `--t-hero` maxing at `6.5rem` still reads smaller than the
`6rem` non-condensed version it replaced. Check that before scaling it up.

**Copy. No em dashes.** Also a standing rule. Use periods, commas, colons, or
restructure the sentence. Do not substitute hyphens or en dashes as a workaround.
This applies to visible copy, `<title>`, meta descriptions, and alt text. Code
comments follow it too, for consistency.

**JavaScript.** `main.js` does one thing: stamp the current year in the footer.
It is enhancement only and the page must remain complete without it. An
IntersectionObserver scroll-reveal system used to live here and was deliberately
deleted, along with the `html.js` class and every `data-reveal` attribute, because
staged fade-ups undercut the printed register. Do not add it back without asking.

**Motion.** The ticker is the only thing that moves, and it is a crude linear loop
rather than an effect: two identical runs in a flex track, `translateX(-50%)` over
34s, which travels exactly one run width and loops seamlessly. If you edit the
ticker copy, **change both runs identically** or the loop will visibly jump. The
strip is `aria-hidden` because the same three services are announced properly in
the list below it. `prefers-reduced-motion` stops the animation and cancels all
transitions.

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
3. **Multiple axes must be listed alphabetically** in the css2 API (`wdth,wght`),
   with ranges in matching order. The generator has to capture `font-stretch`
   alongside `font-weight` or the width axis is unusable. Two axes cost real
   bytes: 88KB against 34KB for weight alone.

The `ABORT` guard below catches both by refusing to write the same filename twice.

```bash
cd assets/fonts && python3 - <<'PY'
import re, urllib.request, pathlib, sys
UA={'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 '
                 '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}
url="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&display=swap"
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
