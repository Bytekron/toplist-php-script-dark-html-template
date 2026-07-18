# TopList Template — Static HTML CSS JS Front End for ToplistScript


<img width="1905" height="950" alt="image" src="https://github.com/user-attachments/assets/314529ac-7380-4aa5-ad35-c499ca7c34b2" />

**TopList Template** is a modern **static HTML, CSS, and JavaScript template** built for **ToplistScript** ([toplistscript.com](https://toplistscript.com)) style websites. Use it as a lightweight **toplist website template**, **best websites directory theme**, or front-end mockup before wiring a full **PHP MySQL toplist CMS**.

If you sell, build, or customize **toplist scripts**, **website ranking lists**, **affiliate directory sites**, or **“best of” review portals**, this template gives you a clean, keyword-ready structure that matches the core public pages of a ToplistScript-style product.

---

## Perfect for ToplistScript-style sites

This template is designed around the classic **toplist script** page flow:

| Page | Purpose |
|------|---------|
| **Homepage** | Category blocks with ranked site lists (“see all N sites”) |
| **Category page** | Sticky sidebar + ranked thumbnail cards + cross-category cards |
| **Review page** | Screenshot carousel, visit CTA, rating, pros/cons, related sites |

Ideal for niches such as:

- Best websites list / top websites directory  
- Free tools & software rankings  
- AI tools directory / AI image generators list  
- Productivity apps ranking  
- Learning resources / free courses list  
- Developer resources directory  
- Crypto wallets comparison list  
- Affiliate marketing toplists and outbound review sites  

---

## Key features

### Front-end structure (ToplistScript-aligned)

- **Homepage category grid** — scrollable entry rows, badges, review links, save-for-later  
- **Category listing page** — sticky site sidebar, ranked URL thumb cards, Visit / Review actions  
- **Entry / review page** — favicon bar, screenshot hero, prev/next carousel strip, user rating, pros & cons  
- **Related sites** — “sites like …” thumb grid under each review  
- **Category top cards** — cross-promote other ranked lists  
- **Bottom promo block** — configurable CTA banner (CMS-style sample data)  
- **Sticky bottom toolbar** — quick jump back to home or category  

### UX & engagement

- **Live site search** (Ctrl/⌘ + K command palette)  
- **Save for later** drawer with `localStorage`  
- **Light / dark theme** toggle  
- **Affiliate-ready outbound links** (`affiliateUrl` falls back to `url`)  
- **Editorial disclaimer** on category pages  
- Responsive layout for desktop and mobile  

### Developer-friendly static stack

- Pure **HTML + CSS + JS** — no build step, no framework required  
- Sample data in `js/data.js` with **CMS-aligned field names** for easy ToplistScript / API mapping later  
- Works on **Apache / Nginx / XAMPP / any static host**  
- Easy to rebrand: site name, titles, categories, entries, accents, promo block  

---

## Quick start

1. Copy the folder into your web root (e.g. `htdocs/toplist_template1`).  
2. Open in a browser:

   - Home: `index.html`  
   - Category: `category.html?slug=free-learning`  
   - Review: `review.html?slug=khan-academy`  

3. Edit sample content in `js/data.js`.  
4. Customize look & feel in `css/styles.css`.  

No npm install. No compiler. Just HTML, CSS, and JavaScript.

---

## File structure

```text
toplist_template1/
├── index.html          # Homepage — ranked category lists
├── category.html       # Category page — sidebar + thumb cards
├── review.html         # Review / entry page — carousel + pros/cons
├── css/
│   └── styles.css      # Theme, layout, light/dark mode
├── js/
│   ├── data.js         # SITE, CATEGORIES, ENTRIES (CMS-shaped sample data)
│   └── app.js          # Rendering, search, saves, theme, page logic
└── README.md
```

---

## Data model (ready for a toplist CMS)

Field names are intentionally close to a **toplist script / ToplistScript CMS** so you can later replace static JSON with API responses.

### `SITE`

Site name, tagline, home title/subtitle, year, editorial disclaimer, bottom promo block.

### `CATEGORIES`

`id`, `name`, `slug`, `description`, `introText`, `accent`, `emoji`, `sortOrder`

### `ENTRIES` (sites / reviews)

`id`, `categoryId`, `name`, `slug`, `url`, `affiliateUrl`, `description`, `reviewContent`, `rating`, `pros`, `cons`, `thumb`, `sortOrder`, flags: `isNew`, `isFeatured`, `isAi`

Outbound visit buttons prefer **`affiliateUrl`** when set — standard pattern for **affiliate toplist websites**.

---

## Customization tips for ToplistScript templates

1. **Rebrand** — change `SITE.name`, titles, and meta descriptions in HTML + `data.js`.  
2. **Add niches** — create new categories and ranked entries in `ENTRIES`.  
3. **Accent colors** — per-category `accent` drives list and card highlights.  
4. **SEO copy** — update `<title>` and `meta description` on each HTML shell; review pages set `document.title` dynamically.  
5. **Wire to ToplistScript** — swap `window.CATEGORIES` / `window.ENTRIES` for JSON from your PHP toplist CMS or `/json/` endpoints.  

---

## Who this template is for

- Buyers and developers of **ToplistScript** and similar **toplist scripts**  
- Agencies building **best websites list** or **review directory** niches  
- Marketers launching **affiliate directory** or **tools ranking** sites  
- Designers prototyping a **toplist website theme** without PHP  
- Anyone who needs a clean **static toplist front end** before CMS integration  

---

## Keywords

ToplistScript template · toplist script HTML template · best websites list template · website directory theme · ranked sites template · affiliate toplist template · review directory HTML CSS JS · category list sidebar · website review carousel · save for later drawer · dark mode directory theme · static toplist CMS front end · top websites ranking template · tools directory template · AI tools list template

---

## Related product

Looking for the full PHP + MySQL CMS with admin, analytics, popups, and install wizard?

**[ToplistScript](https://toplistscript.com)** — the Top List Script for building and monetizing ranked website directories.

---

## License note

This folder is a **static front-end template / demo**. Use it as a design and structure reference for ToplistScript-powered sites or as a standalone HTML directory starter. Respect third-party brand names and sample URLs in `data.js` — replace them with your own listings before production.




