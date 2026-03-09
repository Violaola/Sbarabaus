# Sbarabaus

Sito Astro per Panebarco.

## HeroStyHome (src/components/HeroStyHome.astro)
Props principali:
- `videoSrc`: mp4 di sfondo. Se definito (anche stringa vuota) il video ha priorità.
- `imageSrc`: immagine di sfondo usata solo se non c’è un video valido.
- `show` (default `true`): mostra/nasconde l’intero blocco.
- `showSlider`, `showTitle`, `showSubtitle`, `showCta` (tutti default `true`): abilita le singole parti.
- `className`, `containerClass`, `heroClass`, `id`, `title`, `subtitle`, `ctaLabel`, `ctaHref`: testo e classi.

Comportamento media:
- `videoSrc` definito ➜ mostra il video (fallback di default: `/images/1021768637.mp4`).
- `videoSrc={false}` o `videoSrc={null}` ➜ salta il video.
- Immagine mostrata quando non c’è video: prende `imageSrc`, altrimenti il fallback `/images/hero-dettaglio-fallback.jpg`.

Snippet d’uso:
```astro
<!-- Video di default -->
<HeroStyHome id="studio" className="hero-wrap" />

<!-- Video personalizzato -->
<HeroStyHome videoSrc="/media/hero.mp4" showSlider={false} />

<!-- Solo immagine -->
<HeroStyHome videoSrc={false} imageSrc="/images/hero-static.jpg" showSlider={false} />
```
