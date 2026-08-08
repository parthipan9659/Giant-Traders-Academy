# Giant Traders Academy — Website

A clean, multi-file static site. No build tools, no frameworks — plain HTML/CSS/JS, so it deploys instantly on Cloudflare Pages and is easy to edit by hand.

## Folder structure

```
giant-traders-academy/
├── index.html                    ← Homepage (Index Options program)
├── forex.html                    ← Forex course page + weekly performance
├── css/
│   └── style.css                 ← All styling, shared by both pages
├── js/
│   ├── main.js                   ← Mobile menu toggle (shared)
│   └── forex-performance.js      ← Reads data/forex-performance.json and renders
│                                    the table, stats, and equity chart on forex.html
├── data/
│   └── forex-performance.json    ← ★ Edit this weekly to post new forex results
├── assets/
│   ├── logo-icon.png             ← Transparent-background logo (used site-wide)
│   ├── logo-full.png             ← Full lockup version (spare, not used yet)
│   └── logo-icon-white-bg.png    ← Original white-background version (spare)
└── README.md
```

## Posting your weekly forex performance (no coding needed)

Open `data/forex-performance.json`. It's a simple list — each week/pair is one entry:

```json
{
  "week": "Week 2 · Aug 11–15, 2026",
  "pair": "XAUUSD",
  "trades": 5,
  "wins": 4,
  "return_pct": 5.4,
  "note": "Clean breakout trades, one stop-loss on CPI day."
}
```

To post a new week: **copy one of the existing entries, paste it at the end of the list (add a comma after the previous entry's `}`), and update the numbers.** Save, commit, push. The table, the stat cards, and the equity curve chart on `forex.html` all update automatically — nothing else needs to change.

Field guide:
- `week` — any label you want, shown as-is (e.g. `"Week 3 · Aug 18–22, 2026"`)
- `pair` — `XAUUSD`, `NASDAQ`, or `EURUSD` (or any label)
- `trades` — number of trades taken that week for that pair
- `wins` — how many were winners (used to calculate win rate)
- `return_pct` — the week's return as a plain number, positive or negative (e.g. `6.2` or `-1.4`)
- `note` — a short one-line comment, shown in the table

## 1. Push this to GitHub

```bash
cd giant-traders-academy
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

Or use GitHub Desktop, or drag the whole folder into github.com's "Add file → Upload files" if you don't want to use the command line.

## 2. Connect it to Cloudflare Pages

1. Cloudflare dashboard → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
2. Authorize Cloudflare, pick this repository.
3. Build settings:
   - **Framework preset:** None
   - **Build command:** *(leave empty)*
   - **Build output directory:** `/`
4. **Save and Deploy.** You'll get a `*.pages.dev` URL within a minute or two.

## 3. Point gianttradersacademy.in at it

1. In the Pages project → **Custom domains** → **Set up a custom domain**.
2. Enter `gianttradersacademy.in` (and `www.` if used).
3. If your domain's DNS is already on Cloudflare, records are added automatically. If registered elsewhere, Cloudflare shows you the DNS record to add at your registrar.
4. Wait for DNS to propagate — the live site then replaces whatever's currently on gianttradersacademy.in.

## Future edits

Any push to `main` auto-redeploys on Cloudflare Pages — including the weekly `data/forex-performance.json` update, so posting results is just: edit the file → commit → push.

## Notes

- The hero background videos are pulled live from Pexels (a candlestick/trading-themed clip on the homepage, a numbers/data clip on the forex page) — no video file is stored in this repo.
- Index Options price (₹30,000) is hardcoded in `index.html` — search for `₹30,000` to update it.
- Forex course currently shows "Message us for pricing" / "WhatsApp for Pricing" — once you set a fixed price, search `forex.html` for `Message Us` and `Pricing shared directly on WhatsApp` to swap in a number.
- Both pages share one stylesheet (`css/style.css`), so a design change only needs to happen once.
