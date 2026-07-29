# zeitvibe

Site for **Zeitvibe Ventures**, a boutique studio for brand, content, and social
strategy. Built for one thing: making things spread.

**Live:** [zeitvibeventures.com](https://zeitvibeventures.com)

## Stack

Static HTML and CSS. No framework, no build step, no dependencies. Fonts are
self-hosted, so the site makes no third-party requests.

## Develop

```bash
python3 -m http.server 8000   # → http://localhost:8000
```

## Deploy

Push to `main`. GitHub Actions publishes the repo root to GitHub Pages.

See [CLAUDE.md](CLAUDE.md) for architecture, conventions, DNS setup, and open TODOs.
