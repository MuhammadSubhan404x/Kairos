# Kairos

> *καιρός* — The ancient Greek word for the right moment. Not just time passing. The opportune instant where action makes a difference.

**Kairos finds yours.**

🌐 **Live:** [kairos-iq.netlify.app](https://kairos-iq.netlify.app) &nbsp;|&nbsp; 💻 **Repo:** [github.com/MuhammadSubhan404x/Kairos](https://github.com/MuhammadSubhan404x/Kairos)

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?style=flat-square&logo=openai)
![Netlify](https://img.shields.io/badge/Deployed-Netlify-00C7B7?style=flat-square&logo=netlify)

---

## What is Kairos?

Every week, students receive dozens of emails — scholarships, internships, fellowships, research positions. Most get buried. Deadlines pass. The moments are lost.

Kairos reads your inbox, scores every opportunity against your profile, and tells you exactly what to act on — right now.

---

## How It Works

| Step | What Happens |
|------|-------------|
| 1 | Connect Gmail or paste emails manually |
| 2 | Fill your profile — degree, skills, CGPA |
| 3 | GPT-4o-mini extracts deadlines, eligibility, links |
| 4 | Scoring engine ranks everything deterministically |
| 5 | Get a prioritized list with cover letter in one click |

### Scoring Formula

```
Score = Fit × 0.45 + Urgency × 0.30 + Completeness × 0.15 + Prestige × 0.10
```

No LLM guesswork. Same inputs always produce the same output.

---

## Features

- **Gmail Integration** — Connect your inbox directly, no copy-pasting
- **AI Extraction** — GPT-4o-mini pulls every deadline, requirement, and link
- **Deterministic Scoring** — 4-factor TypeScript engine, fully explainable
- **Urgency Alerts** — Warns you when deadlines are within 3 days
- **Cover Letter Generator** — One-click draft tailored to you and the opportunity
- **PDF Upload** — Drop a PDF of forwarded emails, text extracted automatically
- **Persistent Storage** — Results and profile saved locally across sessions
- **Mobile Responsive** — Works on any screen size

---

## Scoring Engine

| Factor | Weight | Logic |
|--------|--------|-------|
| Fit | 45% | Skills overlap, CGPA, type preference, location, financial need |
| Urgency | 30% | ≤3 days → 100 · 4–7 → 80 · 8–14 → 60 · >60 → 10 |
| Completeness | 15% | −15 per missing field (deadline, link, eligibility, docs) |
| Prestige | 10% | Fulbright/MIT → 90 · HEC/Google → 70 · default → 50 |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 App Router |
| Language | TypeScript |
| AI Model | OpenAI GPT-4o-mini |
| Auth | NextAuth.js + Google OAuth |
| Scoring | Custom deterministic engine |
| Styling | Tailwind CSS + glass morphism |
| Deployment | Netlify |

---

## Run Locally

```bash
# Clone
git clone https://github.com/MuhammadSubhan404x/Kairos.git
cd Kairos

# Install
npm install

# Add your OpenAI key
echo "OPENAI_API_KEY=sk-your-key-here" > .env.local

# Start
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | OpenAI API key |
| `GOOGLE_CLIENT_ID` | Gmail only | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Gmail only | Google OAuth client secret |
| `NEXTAUTH_SECRET` | Gmail only | Random secret string |
| `NEXTAUTH_URL` | Gmail only | Your deployed URL |

---

Built by [Muhammad Subhan](https://github.com/MuhammadSubhan404x)
