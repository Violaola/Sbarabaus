# Brand guidelines — Panebarco

## Typography

### H1

- font-family: **Nunito**
- font-weight: **900**
- font-style: **Black**
- font-size: **150px**
- line-height: **150px**

### Body

- font-family: **Sofia Sans Semi Condensed**
- font-weight: **700**
- font-style: **Bold**
- font-size: **26px**

### CTA

- font-family: **Sofia Sans**
- font-weight: **600**
- font-style: **SemiBold**
- font-size: **18px**
- text-transform: **uppercase**

---

## Color palette

### Primary CTA

- **#009FE3**

### CTA hover

- **#F3AB28**

---

## UI usage notes (pratiche)

- **Gerarchia**: H1 enorme e “poster-like” (Nunito 900) + body bold (Sofia Sans Semi Condensed 700) = look deciso. Mantieni molto respiro (spaziature) per evitare effetto “muro”.
- **CTA**: sempre uppercase, sempre leggibile (contrasto alto). Hover solo cambio colore (no 5 effetti insieme).
- **Responsive**: su mobile l’H1 da 150px va scalato con una `clamp()` (es. 56–150px) per non esplodere il layout.
- **Framework**: usa l'ultima versione di bootstrap e in generale applica una logica bootsprap first
- **Responsive**: progetta i layoute in ottica resaponsive addativo