# CV → Dashboard (Behavioural & Clinical Health)

Candidates upload a CV (PDF, DOCX or TXT) and get an animated portfolio dashboard in a calm
psychology-practice style: cream paper, muted sage, serif headings, a desk by a sunny window with the
motto written on the laptop, and a morning sun rising in the window.

Everything runs in the browser. The CV is read client-side and never sent to a server.

**Live site:** https://pragyamita-debug.github.io/Behavioral-Clinical-Health/ (after Pages is switched on — see below)

## How it works

0. **Example first** — the page opens on the full design filled with neutral placeholder text
   (`src/data/placeholder.ts`: “Your Name”, “Your Role”, “Project One”…). The avatar menu (top right)
   opens the upload screen.
1. **Upload** — drag a CV onto the drop zone, or try the bundled sample (`src/data/sample-cv.txt`, a fictional behavioural psychologist).
2. **Read** — PDF text comes from pdf.js, Word files from mammoth; both load only when needed.
3. **Parse** — `src/lib/parseResume.ts` splits the text into sections (Profile, Experience, Education,
   Skills, Projects, Achievements, Certifications, Goals, Motto, Interests…) and works out years of
   experience from the date ranges, counting overlapping jobs once. A `Type: Research Project` line under
   a project becomes the card's subtitle.
4. **Review** — the candidate checks what was found and fixes anything before the dashboard is built.
5. **Dashboard** — saved to `localStorage`; the avatar menu can upload another CV, edit, download or go back to the example.

## What the dashboard shows

| Part | Built from |
| --- | --- |
| Top bar | sprig-and-sun mark, name and field, a working search (Enter jumps to and highlights the first match), a bell with the goals, avatar menu |
| Sidebar | section links with a live highlight, the motto |
| Banner | field, name, role, tagline, three interests; the motto handwritten on the laptop |
| Stat cards | years of experience, highest degree, projects, key skills — counting / decoding |
| About · Current focus · Quick links | summary; current role and goals; CV download and shortcuts |
| Experience | timeline of roles; the lit card walks from role to role, the years count up |
| Projects | photo cards in a carousel with arrows (and swipe on phones) |
| Skills & tools | icon tiles beside the books-on-the-sill photo |
| Education · Achievements | degrees as badges; achievements and certifications |
| Contact | the main goal as the headline, email / phone / city / LinkedIn |

## Animations

| Effect | Where | How |
| --- | --- | --- |
| Counting numbers | stat cards, experience years | `useCountUp` — rAF + ease-out-expo, starts when in view; the “+” lands when the count finishes |
| Decoding text | degree | `useScramble` |
| Moving, lit borders | stat, experience, project and skill cards | conic gradient on `@property --angle`, masked to a thin ring, plus a blurred halo (`GlowCard`) |
| Hover | every card, link and icon | pointer spotlight + slight tilt, lift, photo zoom, icons turn sage |
| Rising sun | banner window | the sun climbs into place, rays fade in and turn; a shaft of light sweeps the desk |
| Handwriting | laptop screen, skills photo | words are written in one after another |

All motion respects `prefers-reduced-motion`.

## Getting started

```bash
npm install
npm run dev          # local dev server
npm test             # parser tests (vitest)
npm run build        # static build in dist/
npm run build:single # one self-contained index.html in dist-single/
```

## Publish on GitHub Pages

1. **Settings → Pages → Build and deployment → Source:** choose **GitHub Actions**.
2. **Actions → Deploy to GitHub Pages → Run workflow** (it also runs on every push to `main`).

## Writing a CV that parses well

- Clear headings: **Experience**, **Education**, **Skills**, **Projects**, **Achievements**, **Certifications**.
- Dates on the role line or the line after it: `Jan 2023 – Present`, `03/2021 - 06/2023`, `2019 - 2022`.
- Optional extras: **Goals** (`Goal: …`, `Next Step: …`), **Motto** (written on the laptop), **Interests** (banner icons).
- Text-based PDFs only — scanned images have no text to read.

## Project structure

```
src/
  App.tsx                 example → upload → reading → review → dashboard
  data/placeholder.ts     the general example profile shown before any upload
  data/sample-cv.txt      fictional sample CV
  lib/                    extractText, parseResume (+ tests), dates, storage, types
  hooks/                  useCountUp, useScramble, useInView, usePointerGlow, useScrollSpy
  components/
    Chrome.tsx            top bar (search, bell, avatar menu) + sidebar
    Hero.tsx              photo banner + stat cards
    Sections.tsx          about row, experience, projects, skills, education, achievements, contact, footer
    UploadScreen.tsx, ReviewDialog.tsx
    GlowCard.tsx          the moving-border card
  assets/photos/          banner, four project photos, books photo
  styles/global.css       colour tokens, type, buttons
```

The photos in `src/assets/photos/` were cut from the design mock-up (printed text removed) and enlarged 4×
with an EDSR super-resolution network plus a light sharpen. Swap in higher-resolution photos with the same
file names for the sharpest page.
