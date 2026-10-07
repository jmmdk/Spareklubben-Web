# Spareklubben

Landingsside for [spareklubben.app](https://spareklubben.app) – ren HTML/CSS/JS uden build-trin.

## Struktur

```
site/                     # alt, der publiceres
  index.html              # forsiden
  privatlivspolitik.html
  404.html
  styles.css · main.js
  fonts/                  # Figtree (selvhostet, OFL)
  img/app-feed.webp       # telefon-mockup i hero
  img/og.png              # delingsbillede 1200×630
  assets/                 # favicon / apple-touch-icon
  CNAME · robots.txt · sitemap.xml
.github/workflows/pages.yml   # deployer site/ til GitHub Pages ved push til main
                              # designspecifikation ligger i jmmdk/Spareklubben (design_handoff_website/)
```

## Kør lokalt

```
python3 -m http.server 8000 --directory site
```

Åbn http://localhost:8000.

## Venteliste

Begge formularer poster til Formspree (`https://formspree.io/f/maeqebwp`) med felterne
`email` og `source` (`hero` | `bottom`). Endpointet står i `action` på de to `<form>`-elementer i `site/index.html`.

## Tip-billeder

Tip-kortene viser et mønstret felt i kategoriens farve. Tilføj rigtige fotos ved at lægge
WebP-filer (~660 px brede) i `site/img/tips/` og sætte `img: '/img/tips/<id>.webp'` på tippet i `TIPS` i `site/main.js`.
Husk kreditering i footeren.
