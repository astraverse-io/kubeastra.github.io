# Social preview card (og:image)

Source for `/og-image.png`, the 1200×630 card shown when kubeastra.io is shared
on HN, LinkedIn, X, Slack, etc. This folder starts with `_`, so GitHub Pages
(Jekyll) does not publish it.

Regenerate after editing `card.html`. It needs Playwright (KubeAstra's
`scripts/demo-recorder` has it) and a local Chrome. Use absolute paths:

    cd <KubeAstra>/scripts/demo-recorder
    cp <site>/_og/render.mjs ./_og_render.mjs
    node _og_render.mjs <site>/_og/card.html <site>/og-image.png
    rm _og_render.mjs

`render.mjs` exits non-zero if IBM Plex did not load or anything overflows the
frame, so a fallback-font render can't slip through.

Keep counts and version numbers OUT of the image: the weekly website check
(KubeAstra `check-websites.yml`) reads the HTML, but it cannot read a PNG, so a
number in here would go stale silently.
