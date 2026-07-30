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
│   ├── fonts/archivo.woff2     # self-hosted, latin subset, variable 400-900
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
top to bottom to match the page. Class names are BEM-ish (`.pillar__name`), flat,
no nesting deeper than one level. Fluid sizing uses `clamp()` rather than
breakpoints; only two media queries exist and they handle genuine layout changes.

### Aesthetic brief

**Minimal like the competitor, but printed rather than digital.** Think screen-printed
show flyer or xeroxed zine, not SaaS landing page. Client's words: keep the minimal
setup, stay away from "too techy or generic gradient", lean "Brooklyn grunge".

Three standing prohibitions follow from that:

> - **No gradients.** No radial glows, no soft light, no colour washes. A drifting
>   multi-colour gradient layer was built and then removed for reading exactly like
>   the generic tech look the client rejected. The only `linear-gradient` in the
>   stylesheet paints a *solid* two-pixel underline bar, which is a CSS technique,
>   not a visual gradient.
> - **No italics.** See Type below.
> - **No slick motion.** Staged fade-ups and long eased transitions read as product
>   marketing. Transitions are `0.15s linear`, and there is no scroll animation.

Texture comes from grain and hard rules only. The single `.grain` layer (coarse SVG
turbulence, `mix-blend-mode: overlay`) is static, so nothing there needs a
reduced-motion escape hatch.

**Palette.** Warm off-black `--ink` (#0d0c0a), paper `--bone` (#eae5da), and one
riso red `--accent` (#e2452c). The warmth is deliberate: cool blue-blacks and acid
greens read techy, which is the thing to avoid. The accent is load-bearing precisely
because it is rare: hover states, one emphasised phrase, the period after "spread".
Resist adding a second accent.

**Type. One family: Archivo, variable, 400 to 900.**

An industrial grotesque built for print. The wide weight axis is the point:
headlines run at 800 to 900 for poster heft, body sits at 400 to 500. Pillar names
and all small labels are uppercase with open tracking, like flyer copy.

> **No italics anywhere on this site.** This is a standing design rule, not an
> oversight. Hierarchy and emphasis come from **weight, size, and colour only**.
> A global `em { font-style: normal; font-weight: 700 }` rule enforces it, so
> `<em>` keeps its semantics without the slant. Do not reintroduce a serif face,
> an italic face, or `font-style: italic`.

The hero demonstrates the pattern that replaced the old serif-italic treatment:
`.hero__lead` sets the framing line small, at weight 500, in `--muted`;
`.hero__key` lands the payoff word at full scale and weight 900. Roughly a 2:1
size ratio plus a weight and colour step. Reuse that logic for new large type.

**Copy. No em dashes.** Also a standing rule. Use periods, commas, colons, or
restructure the sentence. Do not substitute hyphens or en dashes as a workaround.
This applies to visible copy, `<title>`, meta descriptions, and alt text. Code
comments follow it too, for consistency.

**JavaScript.** `main.js` does one thing: stamp the current year in the footer.
It is enhancement only and the page must remain complete without it. An
IntersectionObserver scroll-reveal system used to live here and was deliberately
deleted, along with the `html.js` class and every `data-reveal` attribute, because
staged fade-ups undercut the printed register. Do not add it back without asking.

**Motion.** Almost nothing moves. Hover transitions are `0.15s linear`, chosen to
feel abrupt rather than eased. No keyframe animations remain. The
`prefers-reduced-motion` block therefore only has to disable smooth anchor
scrolling and blanket-cancel transitions.

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

The `ABORT` guard below catches both by refusing to write the same filename twice.

```bash
cd assets/fonts && python3 - <<'PY'
import re, urllib.request, pathlib, sys
UA={'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 '
                 '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}
url="https://fonts.googleapis.com/css2?family=Archivo:wght@400..900&display=swap"
css=urllib.request.urlopen(urllib.request.Request(url,headers=UA)).read().decode()
out,seen=[],{}
for b in re.findall(r'@font-face\s*\{(.*?)\}',css,re.S):
    g=lambda p:(re.search(p,b,re.S) or [None,None])[1]
    ur=g(r'unicode-range:\s*([^;]+);')
    if not ur or not ur.strip().startswith('U+0000-00FF'): continue
    fam,style,wt=g(r"font-family:\s*'([^']+)'"),g(r'font-style:\s*([^;]+);').strip(),g(r'font-weight:\s*([^;]+);').strip()
    fn=fam.lower().replace(' ','-')+('-italic' if style=='italic' else '')+'.woff2'
    if fn in seen:
        sys.exit(f"ABORT: {fn} already written for weight {seen[fn]}, now {wt}. "
                 "Google served static instances. Check the UA string.")
    seen[fn]=wt
    data=urllib.request.urlopen(urllib.request.Request(g(r'url\((https://[^)]+\.woff2)\)'),headers=UA)).read()
    pathlib.Path(fn).write_bytes(data)
    out.append(f"@font-face {{\n  font-family: '{fam}';\n  font-style: {style};\n  font-weight: {wt};\n  font-display: swap;\n  src: url('../fonts/{fn}') format('woff2');\n}}")
pathlib.Path('../css/fonts.css').write_text("/* Generated. See CLAUDE.md, Fonts. */\n\n"+"\n\n".join(out)+"\n")
print(f"{len(out)} face(s) written")
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
