# Sufi Sanctuary Map

Create Sufi Map: a calm, minimal sanctuary-like web application mapping Sufi dargahs, maqams, zawiyas, and gatherings in Kerala.

## Design System: "Sahn" (Sanctuary Courtyard)
- Aesthetic: Tranquil, stone courtyard, minimal, clear in bright outdoor Kerala daylight.
- Colors:
  - Background (Canvas): #FAF9F4
  - Card/Surface: #FFFFFF
  - Foreground (Ink): #121512
  - Muted Foreground: #5D675F
  - Primary (Sanctuary Green): #1F5C3A (hover: #17482D, text: #FFFFFF)
  - Border: #E4E2D8
  - Accent/Parchment: #F4F3EB
- Radius: Strictly 14px (rounded-[14px]) across buttons, cards, dialogs, sheets, badges.
- Typography:
  - Headings: Soft serif ("Playfair Display", Georgia, serif)
  - Body: Clean sans-serif ("Inter", system-ui, sans-serif)
  - Arabic: Sacred script ("Amiri", serif) with leading-relaxed
- Transitions & Animations:
  - Smooth subtle interactions: duration-250 ease-out
  - Button hover: active:scale-[0.98] transition-all duration-200 shadow-sm hover:shadow-md
  - Card lift: transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(18,21,18,0.06)]
  - Quote crossfade: transition-opacity duration-700 ease-in-out

## Core UI Components
1. Interactive Map Home: Split-screen desktop (420px docked left sidebar with listings/search/filters + full-bleed map on right). Mobile thumb-zone bottom sheet.
2. Sanctuary Pin Markers: 40px rounded emerald pins with kind badges (Maqam, Zawiya, Dargah, Gathering).
3. Rotating Quote Banner: Arabic sacred quotes (Quran 16:125, Hadith, Ibn Ata'illah Hikam) in Amiri font with English translations and hover-pause.
4. Contributor Submission Modal: Multi-step forms with mandatory source attribution, living Sufi consent toggles, and coordinate picker.
5. Badges Progress: Everyday humble steward badges (Musafir, Misbah, Hadiyya, Rafeeq, Nazir).
6. Multi-language toggle (EN, ML, AR) with full RTL support.

Ensure clean, modular code with shadcn/ui components, responsive layout, and zero dead styles.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/fe2cf5d9-005b-4a8e-96a0-c02b4a4afc06).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
