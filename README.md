# 🤖 ML Job Radar

> Live ML, AI & Data Science jobs from 100+ top tech companies. Refreshes every 30 minutes. Entry-level & junior positions only (0–3 years experience).

---

## ✨ Features

- **100+ companies** scraped: Google, Meta, OpenAI, Anthropic, Nvidia, Tesla, and more
- **Auto-refresh every 30 minutes** via Vercel Cron Jobs
- **Smart filtering**: Search by role, company, remote-only
- **Entry-level only**: Senior/Staff/Principal roles automatically excluded
- **Real-time stats**: Total jobs, companies, remote count
- **Beautiful dark UI** with live countdown to next refresh

---

## 🚀 Deploy to Vercel in 5 Steps

### Step 1 — Push to GitHub

```bash
cd ml-job-tracker
git init
git add .
git commit -m "Initial commit"
gh repo create ml-job-radar --public --push
```

Or manually create a repo on github.com and push.

### Step 2 — Create a Vercel KV Database

1. Go to [vercel.com](https://vercel.com) → Log in
2. Click **Storage** in the top nav
3. Click **Create Database** → Choose **KV (Redis)**
4. Name it `ml-jobs-kv` → Create
5. Go to the KV dashboard → **Settings** tab → copy these env vars:
   - `KV_URL`
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`

### Step 3 — Deploy on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repo
3. In **Environment Variables**, add:
   ```
   KV_URL=...
   KV_REST_API_URL=...
   KV_REST_API_TOKEN=...
   KV_REST_API_READ_ONLY_TOKEN=...
   CRON_SECRET=your-random-secret-here
   ```
   (Generate CRON_SECRET with: `openssl rand -hex 32`)
4. Click **Deploy** 🚀

### Step 4 — Trigger First Scrape

After deploy, manually trigger the first scrape:

```bash
curl -X GET https://your-app.vercel.app/api/cron/scrape \
  -H "Authorization: Bearer your-random-secret-here"
```

### Step 5 — Cron is Automatic!

Vercel will automatically call `/api/cron/scrape` every 30 minutes.
Check it in: Vercel Dashboard → Your Project → **Cron Jobs** tab.

---

## 🏃 Run Locally

```bash
npm install
# Create .env.local with your KV credentials (or skip for demo/mock mode)
npm run dev
```

Visit http://localhost:3000

> **No KV credentials?** The app runs in **Demo Mode** with mock data — great for testing the UI.

---

## 🏗 Architecture

```
ml-job-tracker/
├── lib/
│   ├── companies.js     # 100+ companies with careers URLs
│   └── scraper.js       # Multi-ATS scraper (Greenhouse, Lever, etc.)
├── pages/
│   ├── index.js         # Frontend dashboard
│   └── api/
│       ├── jobs.js      # Jobs API with search & filter
│       ├── stats.js     # Stats API
│       └── cron/
│           └── scrape.js  # Cron endpoint (called every 30min)
└── vercel.json          # Cron schedule config
```

### ATS Systems Supported
| ATS | Companies |
|-----|-----------|
| Greenhouse | OpenAI, Anthropic, Netflix, Uber, Airbnb, Stripe, +50 more |
| Lever | Mistral, Palantir, Plaid, +10 more |
| Workable | Hugging Face |
| Google Jobs API | Google, DeepMind |
| Meta Graph API | Meta |
| Amazon Jobs API | Amazon |
| Microsoft Careers API | Microsoft |
| HTML scraper (fallback) | Tesla, ByteDance, IBM, +others |

---

## 📊 Companies Tracked (100+)

**Big Tech**: Google, Meta, Microsoft, Amazon, Apple  
**AI-First**: OpenAI, Anthropic, DeepMind, Cohere, Mistral, Hugging Face, Scale AI, xAI  
**Cloud/Data**: Nvidia, Databricks, Snowflake, Palantir, Cloudera  
**Consumer**: Netflix, Spotify, Uber, Airbnb, Lyft, DoorDash  
**Fintech**: Stripe, Coinbase, Robinhood, Plaid, Chime  
**Enterprise**: Salesforce, Workday, ServiceNow, Twilio  
**Autonomous**: Waymo, Tesla, Cruise, Figure AI, Boston Dynamics  
**Dev Tools**: GitHub, GitLab, Datadog, Vercel, HashiCorp  
...and 50 more!

---

## 🛠 Customization

### Add a company
Edit `lib/companies.js`:
```js
{ 
  name: "Acme Corp", 
  slug: "acme-corp",           // Greenhouse/Lever slug
  careersUrl: "https://...",
  logo: "🏢",
  useApi: "greenhouse"         // or "lever", "workable", "custom"
}
```

### Change refresh rate
Edit `vercel.json`:
```json
{ "schedule": "*/15 * * * *" }  // every 15 minutes
```

### Add more keywords
Edit `JOB_KEYWORDS` in `lib/companies.js`.

---

## ⚠️ Notes

- Some companies (Tesla, ByteDance, IBM) use proprietary ATS — the generic HTML scraper is used as fallback
- Vercel Cron Jobs require a **Pro plan** for schedules faster than daily on free tier; the 30-min schedule requires **Vercel Pro** (~$20/mo) or use a free external cron service like [cron-job.org](https://cron-job.org) to hit `/api/cron/scrape`
- Entry-level filter works on title keywords; may occasionally miss/include edge cases

---

## 📄 License

MIT
