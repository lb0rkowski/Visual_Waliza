<<<<<<< HEAD
# CASEOUT STUDIO — Website

Strona internetowa studia nagraniowego Caseout Studio.
Next.js 14 (App Router) + TypeScript + Tailwind CSS.

---

## Szybki start

```bash
# 1. Zainstaluj zależności
npm install

# 2. Uruchom dev server
npm run dev
```

Otwórz **http://localhost:3000** w przeglądarce.

---

## Struktura

```
app/
├── page.tsx           ← Strona główna (Home)
├── layout.tsx         ← Root layout + providers
├── globals.css        ← Tailwind + custom efekty
├── oferta/page.tsx    ← Usługi + pakiety
├── portfolio/page.tsx ← Realizacje
├── cennik/page.tsx    ← Cennik
├── kontakt/page.tsx   ← Formularz kontaktowy
├── rezerwacje/page.tsx← System rezerwacji
└── vault-x9k2m/page.tsx ← Admin panel (ukryty)

components/
├── ui.tsx             ← GlowBtn, RevealDiv, Particles, Marquee...
├── nav.tsx            ← Nawigacja
├── footer.tsx         ← Stopka
├── client-shell.tsx   ← Wrapper z overlays
└── service-card.tsx   ← Karta usługi

lib/
├── data.ts            ← Dane, typy TypeScript
└── store.tsx          ← Context API (bookings state)
```

---

## Admin Panel

- URL: `/vault-x9k2m` (brak linku w UI)
- Hasło: `caseout2025`
- Dostęp: kliknij niewidoczny 15×15px kwadrat w prawym dolnym rogu strony

---

## Logo

Umieść logo w `public/logo.svg` (lub `logo.png`).
Najlepsze formaty:
1. **SVG** — wektorowy, idealny do animacji i glow
2. **PNG** — minimum 1024×1024px, przezroczyste tło

Podmień placeholder `CS` w `app/page.tsx` na:
```tsx
import Image from "next/image";
<Image src="/logo.svg" alt="Caseout Studio" width={80} height={80} />
```

---

## Kolejne etapy

- [x] Etap 1: Prototyp React
- [x] Etap 2: Projekt Next.js + routing
- [ ] Etap 3: Supabase — baza rezerwacji
- [ ] Etap 4: Admin CRUD z bazą
- [ ] Etap 5: Formularz kontaktowy (email)
- [ ] Etap 6: SEO + Open Graph + metadata
- [ ] Etap 7: Deploy na Vercel
=======
# Visual_Waliza
>>>>>>> c0a42c1933927ef65a2205e5617499237b48c19d
