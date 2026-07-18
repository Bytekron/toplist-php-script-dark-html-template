(function () {
  "use strict";

  const SITE = window.SITE || {
    name: "TopList",
    year: new Date().getFullYear(),
    homeTitle: "The best websites, ranked",
    homeSubtitle: "",
  };
  const CATEGORIES = window.CATEGORIES || [];
  const ENTRIES = window.ENTRIES || [];

  const STORAGE_SAVED = "saved-sites";
  const STORAGE_THEME = "toplist-theme";
  const HOME_LIMIT = 5;

  const icons = {
    search:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 14.5A8.5 8.5 0 0 1 9.5 3 7 7 0 1 0 21 14.5z"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5l2.9 5.88 6.5.95-4.7 4.58 1.11 6.47L12 17.77l-5.81 3.06 1.11-6.47-4.7-4.58 6.5-.95L12 2.5z"/></svg>',
    starOutline:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3 2.7 5.5 6 .9-4.4 4.3 1 6.1L12 16.9 6.7 19.8l1-6.1L3.4 9.4l6-.9L12 3z"/></svg>',
    review:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M8 7h8M8 11h6"/></svg>',
    bookmark:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>',
    close:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    external:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14 21 3"/></svg>',
    chevronLeft:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>',
    chevronRight:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>',
    arrowRight:
      '<svg viewBox="0 0 18 10" fill="currentColor" aria-hidden="true"><path d="M17.752 4.448 13.246.228a.876.876 0 0 0-1.18 0 .747.747 0 0 0 0 1.106l3.082 2.885H.834c-.46 0-.834.35-.834.78 0 .433.374.783.834.783h14.314l-3.082 2.884a.747.747 0 0 0 0 1.105c.163.153.377.23.59.23a.861.861 0 0 0 .59-.23l4.506-4.219a.746.746 0 0 0 0-1.104z"/></svg>',
  };

  /* ---------- helpers ---------- */

  function escapeHtml(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function entryExternalUrl(entry) {
    const affiliate = (entry.affiliateUrl || "").trim();
    if (affiliate) return affiliate;
    return entry.url || "#";
  }

  function entryHostname(entry) {
    try {
      return new URL(entry.url).hostname.replace(/^www\./, "");
    } catch {
      return entry.name;
    }
  }

  function faviconUrl(entry) {
    try {
      const host = new URL(entry.url).hostname;
      return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=64`;
    } catch {
      return "";
    }
  }

  function categoryById(id) {
    return CATEGORIES.find((c) => c.id === id) || null;
  }

  function categoryBySlug(slug) {
    return CATEGORIES.find((c) => c.slug === slug) || null;
  }

  function entryById(id) {
    return ENTRIES.find((e) => e.id === Number(id)) || null;
  }

  function entryBySlug(slug) {
    return ENTRIES.find((e) => e.slug === slug) || null;
  }

  function entriesForCategory(categoryId, limit) {
    const list = ENTRIES.filter((e) => e.categoryId === categoryId).sort(
      (a, b) => a.sortOrder - b.sortOrder
    );
    return typeof limit === "number" ? list.slice(0, limit) : list;
  }

  function entryRank(entry) {
    const siblings = entriesForCategory(entry.categoryId);
    const idx = siblings.findIndex((e) => e.id === entry.id);
    return idx >= 0 ? idx + 1 : 1;
  }

  function truncate(str, max) {
    const s = String(str || "");
    if (s.length <= max) return s;
    return s.slice(0, max - 1).trimEnd() + "…";
  }

  function badgesHtml(entry) {
    const parts = [];
    if (entry.isFeatured) parts.push('<span class="badge badge--featured">Featured</span>');
    if (entry.isNew) parts.push('<span class="badge badge--new">New</span>');
    if (entry.isAi) parts.push('<span class="badge badge--ai">AI</span>');
    return parts.join("");
  }

  /* ---------- saved sites ---------- */

  function getSavedIds() {
    try {
      const raw = localStorage.getItem(STORAGE_SAVED);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.map(Number) : [];
    } catch {
      return [];
    }
  }

  function setSavedIds(ids) {
    localStorage.setItem(STORAGE_SAVED, JSON.stringify(ids));
    updateSavedCount();
    document.querySelectorAll("[data-save-id]").forEach((btn) => {
      const id = Number(btn.getAttribute("data-save-id"));
      const saved = ids.includes(id);
      btn.classList.toggle("is-saved", saved);
      btn.setAttribute("aria-pressed", saved ? "true" : "false");
      btn.setAttribute("aria-label", saved ? "Remove from saved" : "Save for later");
      if (btn.classList.contains("btn")) {
        btn.innerHTML = `${saved ? icons.star : icons.starOutline} ${saved ? "Saved" : "Save for later"}`;
      } else {
        btn.innerHTML = saved ? icons.star : icons.starOutline;
      }
    });
  }

  function isSaved(id) {
    return getSavedIds().includes(Number(id));
  }

  function toggleSaved(id) {
    const ids = getSavedIds();
    const num = Number(id);
    const next = ids.includes(num) ? ids.filter((x) => x !== num) : [...ids, num];
    setSavedIds(next);
    return next.includes(num);
  }

  function updateSavedCount() {
    const el = document.querySelector("[data-saved-count]");
    if (!el) return;
    const n = getSavedIds().length;
    el.textContent = String(n);
    el.hidden = n === 0;
  }

  /* ---------- theme ---------- */

  function getTheme() {
    const stored = localStorage.getItem(STORAGE_THEME);
    if (stored === "dark" || stored === "light") return stored;
    return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme === "dark" ? "dark" : "light");
    localStorage.setItem(STORAGE_THEME, theme);
    const btn = document.querySelector("[data-theme-toggle]");
    if (btn) {
      btn.innerHTML = theme === "dark" ? icons.sun : icons.moon;
      btn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    }
  }

  function toggleTheme() {
    applyTheme(getTheme() === "dark" ? "light" : "dark");
  }

  /* ---------- chrome ---------- */

  function renderHeader() {
    const root = document.getElementById("site-header");
    if (!root) return;

    root.innerHTML = `
      <header class="site-header">
        <div class="wrap site-header__inner">
          <a class="logo" href="index.html">${escapeHtml(SITE.name)}<span>.</span></a>
          <div class="header-actions">
            <button type="button" class="search-trigger" data-search-open>
              ${icons.search}
              <span>Search</span>
              <kbd>${/Mac|iPhone|iPad|iPod/.test(navigator.userAgent) ? "⌘K" : "Ctrl K"}</kbd>
            </button>
            <button type="button" class="icon-btn search-trigger-mobile" data-search-open aria-label="Search">
              ${icons.search}
            </button>
            <button type="button" class="icon-btn icon-btn--saved" data-drawer-open aria-label="Saved sites">
              ${icons.bookmark}
              <span class="saved-count" data-saved-count hidden>0</span>
            </button>
            <button type="button" class="icon-btn" data-theme-toggle aria-label="Toggle theme">
              ${icons.moon}
            </button>
          </div>
        </div>
      </header>
    `;
  }

  function renderFooter() {
    const root = document.getElementById("site-footer");
    if (!root) return;

    root.innerHTML = `
      <footer class="site-footer">
        <div class="wrap site-footer__inner">
          <div class="site-footer__brand">${escapeHtml(SITE.name)}</div>
          <p class="site-footer__copy">© ${SITE.year} ${escapeHtml(SITE.name)}. Static template demo.</p>
        </div>
      </footer>
    `;
  }

  function renderOverlays() {
    const root = document.getElementById("site-overlays");
    if (!root) return;

    root.innerHTML = `
      <div class="overlay" data-overlay hidden></div>
      <div class="search-modal" data-search-modal role="dialog" aria-modal="true" aria-label="Search sites" hidden>
        <div class="search-modal__input-wrap">
          ${icons.search}
          <input type="search" data-search-input placeholder="Search sites…" autocomplete="off">
        </div>
        <div class="search-results" data-search-results></div>
      </div>
      <aside class="drawer" data-drawer aria-label="Saved sites" hidden>
        <div class="drawer__header">
          <h2>Saved sites</h2>
          <button type="button" class="icon-btn" data-drawer-close aria-label="Close drawer">${icons.close}</button>
        </div>
        <div class="drawer__body" data-drawer-body></div>
      </aside>
    `;
  }

  /* ---------- site row ---------- */

  function siteRowHtml(entry, category) {
    const saved = isSaved(entry.id);
    const accent = category ? category.accent : undefined;
    const style = accent ? ` style="--cat-accent:${escapeHtml(accent)}"` : "";
    const reviewHref = `review.html?slug=${encodeURIComponent(entry.slug)}`;

    return `
      <li class="site-row"${style}>
        <div class="site-row__main">
          <img class="site-row__favicon" src="${escapeHtml(faviconUrl(entry))}" alt="" width="28" height="28" loading="lazy">
          <div class="site-row__text">
            <a class="site-row__name" href="${reviewHref}">
              ${escapeHtml(entry.name)}
              ${badgesHtml(entry)}
            </a>
            ${
              entry.description
                ? `<p class="site-row__desc">${escapeHtml(truncate(entry.description, 95))}</p>`
                : ""
            }
          </div>
        </div>
        <div class="site-row__actions">
          <a class="row-action" href="${escapeHtml(entryExternalUrl(entry))}" target="_blank" rel="noopener noreferrer" aria-label="Visit site" title="Visit">
            ${icons.external}
          </a>
          <button type="button" class="row-action${saved ? " is-saved" : ""}" data-save-id="${entry.id}" aria-pressed="${saved}" aria-label="${saved ? "Remove from saved" : "Save for later"}">
            ${saved ? icons.star : icons.starOutline}
          </button>
        </div>
      </li>
    `;
  }

  /* ---------- home ---------- */

  function renderHomeHeroVisual() {
    const root = document.getElementById("home-hero-visual");
    if (!root) return;

    const featured = ENTRIES.filter((e) => e.isFeatured && e.thumb);
    const pool = featured.length >= 8 ? featured : ENTRIES.filter((e) => e.thumb);
    const tiles = pool.slice(0, 8);

    root.innerHTML = tiles
      .map(
        (e, i) =>
          `<img src="${escapeHtml(e.thumb)}" alt="" width="400" height="225" loading="${i < 6 ? "eager" : "lazy"}">`
      )
      .join("");
  }

  function renderHome() {
    const brand = document.getElementById("home-brand");
    const title = document.getElementById("home-title");
    const sub = document.getElementById("home-subtitle");
    const grid = document.getElementById("category-grid");
    if (!grid) return;

    if (brand) brand.innerHTML = `${escapeHtml(SITE.name)}<span>.</span>`;
    if (title) title.textContent = SITE.homeTitle;
    if (sub) sub.textContent = SITE.homeSubtitle;
    document.title = `${SITE.name} — ${SITE.homeTitle}`;
    renderHomeHeroVisual();

    const cats = [...CATEGORIES].sort((a, b) => a.sortOrder - b.sortOrder);

    grid.innerHTML = cats
      .map((cat) => {
        const all = entriesForCategory(cat.id);
        const shown = all.slice(0, HOME_LIMIT);
        return `
          <article class="category-block" style="--cat-accent:${escapeHtml(cat.accent)}">
            <header class="category-block__header">
              <h2 class="category-block__title">
                <span class="category-block__emoji" aria-hidden="true">${escapeHtml(cat.emoji)}</span>
                <a href="category.html?slug=${encodeURIComponent(cat.slug)}">${escapeHtml(cat.name)}</a>
              </h2>
              ${
                cat.description
                  ? `<details class="category-block__about">
                      <summary>About ${escapeHtml(cat.name)}</summary>
                      <p>${escapeHtml(cat.description)}</p>
                    </details>`
                  : ""
              }
            </header>
            <ul class="category-block__list">
              ${shown.map((e) => siteRowHtml(e, cat)).join("")}
            </ul>
            <footer class="category-block__footer">
              <a class="see-all" href="category.html?slug=${encodeURIComponent(cat.slug)}">
                See all ${all.length} sites →
              </a>
            </footer>
          </article>
        `;
      })
      .join("");
  }

  /* ---------- shared page pieces ---------- */

  function breadcrumbHtml(items) {
    return `
      <nav class="breadcrumb wrap" aria-label="Breadcrumb">
        ${items
          .map((item, i) => {
            const sep = i ? `<span aria-hidden="true">/</span>` : "";
            if (item.href) {
              return `${sep}<a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`;
            }
            return `${sep}<span>${escapeHtml(item.label)}</span>`;
          })
          .join("")}
      </nav>
    `;
  }

  function saveBtnHtml(entry, extraClass) {
    const saved = isSaved(entry.id);
    return `
      <button type="button" class="row-action${saved ? " is-saved" : ""}${extraClass ? ` ${extraClass}` : ""}" data-save-id="${entry.id}" aria-pressed="${saved}" aria-label="${saved ? "Remove from saved" : "Save for later"}">
        ${saved ? icons.star : icons.starOutline}
      </button>
    `;
  }

  function thumbCardHtml(entry, category, rank, variant) {
    const reviewHref = `review.html?slug=${encodeURIComponent(entry.slug)}`;
    const accent = category ? category.accent : undefined;
    const style = accent ? ` style="--cat-accent:${escapeHtml(accent)}"` : "";

    return `
      <article class="url-card" data-variant="${escapeHtml(variant || "category")}"${style}>
        <div class="url-card__media">
          ${typeof rank === "number" ? `<span class="url-card__rank">${rank}</span>` : ""}
          <a class="url-card__title" href="${reviewHref}">
            <span>${escapeHtml(entry.name)}</span>
            <img src="${escapeHtml(faviconUrl(entry))}" alt="" width="16" height="16" loading="lazy">
          </a>
          <a class="url-card__thumb" href="${reviewHref}">
            <img src="${escapeHtml(entry.thumb)}" alt="" width="800" height="450" loading="lazy">
          </a>
          <div class="url-card__hover">
            <a class="thumb-card__btn" href="${escapeHtml(entryExternalUrl(entry))}" target="_blank" rel="noopener noreferrer">Visit</a>
            <a class="thumb-card__btn thumb-card__btn--ghost" href="${reviewHref}">Review</a>
          </div>
          ${saveBtnHtml(entry, "url-card__save")}
        </div>
        ${
          variant !== "related" && entry.description
            ? `<p class="url-card__desc">${escapeHtml(truncate(entry.description, 110))}</p>`
            : ""
        }
      </article>
    `;
  }

  function categoryTopCardsHtml(excludeCategoryId) {
    const cats = [...CATEGORIES]
      .filter((c) => c.id !== excludeCategoryId)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .slice(0, 3);

    if (!cats.length) return "";

    return `
      <section class="top-cards wrap" aria-label="More categories">
        ${cats
          .map((cat) => {
            const entries = entriesForCategory(cat.id, 4);
            const total = entriesForCategory(cat.id).length;
            return `
              <a class="top-card" href="category.html?slug=${encodeURIComponent(cat.slug)}" style="--cat-accent:${escapeHtml(cat.accent)}">
                <div class="top-card__header">
                  <span class="top-card__emoji" aria-hidden="true">${escapeHtml(cat.emoji)}</span>
                  <span class="top-card__title">${escapeHtml(cat.name)}</span>
                  ${icons.arrowRight}
                </div>
                <ul class="top-card__list">
                  ${entries
                    .map(
                      (e) => `
                        <li>
                          <img src="${escapeHtml(e.thumb)}" alt="" width="64" height="36" loading="lazy">
                          <span>${escapeHtml(e.name)}</span>
                        </li>
                      `
                    )
                    .join("")}
                </ul>
                <div class="top-card__count">${total}+</div>
              </a>
            `;
          })
          .join("")}
      </section>
    `;
  }

  function bottomBlockHtml() {
    const block = SITE.bottomBlock;
    if (!block || block.enabled === false) return "";

    return `
      <section class="promo-block wrap">
        <div class="promo-block__inner">
          <div class="promo-block__copy">
            <h2>${escapeHtml(block.title || "Explore more")}</h2>
            ${block.text ? `<p>${escapeHtml(block.text)}</p>` : ""}
            <a class="btn btn--primary btn--inline" href="${escapeHtml(block.ctaHref || "index.html")}">${escapeHtml(block.ctaLabel || "Browse")}</a>
          </div>
          ${
            block.image
              ? `<a class="promo-block__media" href="${escapeHtml(block.ctaHref || "index.html")}" tabindex="-1" aria-hidden="true">
                  <img src="${escapeHtml(block.image)}" alt="" width="1200" height="360" loading="lazy">
                </a>`
              : ""
          }
        </div>
      </section>
    `;
  }

  function bottomToolbarHtml(opts) {
    const { href, count, title, emoji } = opts;
    return `
      <div class="bottom-toolbar">
        <a class="bottom-toolbar__main" href="${escapeHtml(href)}">
          <span class="bottom-toolbar__icon" aria-hidden="true">${escapeHtml(emoji || "★")}</span>
          <span class="bottom-toolbar__copy">
            <span class="bottom-toolbar__count">${count}+</span>
            <span class="bottom-toolbar__title">${escapeHtml(title)}</span>
          </span>
        </a>
        <button type="button" class="bottom-toolbar__top" data-scroll-top aria-label="Back to top">↑</button>
      </div>
    `;
  }

  function ratingBarHtml(rating) {
    const value = Number(rating || 0);
    const full = Math.floor(value);
    const stars = Array.from({ length: 5 }, (_, i) => {
      const filled = i < full || (i === full && value - full >= 0.5);
      return `<span class="rating-bar__star${filled ? " is-on" : ""}">${icons.star}</span>`;
    }).join("");

    return `
      <div class="rating-bar" aria-label="User rating ${value.toFixed(1)} out of 5">
        <div class="rating-bar__stars">${stars}</div>
        <div class="rating-bar__text">User Rating <strong>${value.toFixed(1)}</strong>/5</div>
      </div>
    `;
  }

  function prosConsHtml(entry) {
    const pros = entry.pros || [];
    const cons = entry.cons || [];
    if (!pros.length && !cons.length) return "";

    return `
      <div class="pros-cons">
        <div class="pros-cons__col pros-cons__col--pros">
          <h3>Pros</h3>
          <ul>${pros.map((p) => `<li>${escapeHtml(p)}</li>`).join("") || "<li>None listed</li>"}</ul>
        </div>
        <div class="pros-cons__col pros-cons__col--cons">
          <h3>Cons</h3>
          <ul>${cons.map((c) => `<li>${escapeHtml(c)}</li>`).join("") || "<li>No notable cons</li>"}</ul>
        </div>
      </div>
    `;
  }

  function moreLikeRowHtml(category, entries, currentId) {
    const others = entries.filter((e) => e.id !== currentId).slice(0, 8);
    if (!others.length) return "";

    return `
      <div class="more-like">
        <span class="more-like__label">More like this</span>
        <div class="more-like__favicons">
          ${others
            .map(
              (e) => `
                <a href="review.html?slug=${encodeURIComponent(e.slug)}" title="${escapeHtml(e.name)}">
                  <img src="${escapeHtml(faviconUrl(e))}" alt="" width="22" height="22" loading="lazy">
                </a>
              `
            )
            .join("")}
        </div>
      </div>
    `;
  }

  /* ---------- category page ---------- */

  function renderCategoryPage() {
    const root = document.getElementById("category-page");
    if (!root) return;

    const params = new URLSearchParams(location.search);
    const slug = params.get("slug");
    const cat = slug ? categoryBySlug(slug) : null;

    if (!cat) {
      root.innerHTML = emptyStateHtml("Category not found", "That list doesn’t exist in this demo.");
      document.title = `Not found — ${SITE.name}`;
      return;
    }

    const entries = entriesForCategory(cat.id);
    const intro = cat.introText || `About ${cat.name}`;
    document.title = `Best ${cat.name} — ${SITE.name}`;
    document.body.style.setProperty("--page-accent", cat.accent || "");

    root.innerHTML = `
      <div class="page-shell" style="--cat-accent:${escapeHtml(cat.accent)}">
        ${breadcrumbHtml([
          { label: "Home", href: "index.html" },
          { label: cat.name },
        ])}

        <header class="cat-header wrap">
          <div class="cat-header__title-row">
            <span class="cat-header__emoji" aria-hidden="true">${escapeHtml(cat.emoji)}</span>
            <h1 class="cat-header__title">Best ${escapeHtml(cat.name)}</h1>
          </div>
          <p class="cat-header__disclaimer">
            <strong>Editorial Disclaimer:</strong>
            ${escapeHtml(SITE.editorialDisclaimer || "")}
          </p>
        </header>

        <div class="cat-layout wrap">
          <aside class="cat-sidebar" aria-label="Sites in ${escapeHtml(cat.name)}">
            <div class="cat-sidebar__sticky">
              <ul class="cat-sidebar__list">
                ${entries
                  .map(
                    (entry) => `
                      <li class="cat-sidebar__item">
                        <a class="cat-sidebar__link" href="review.html?slug=${encodeURIComponent(entry.slug)}">
                          <img src="${escapeHtml(faviconUrl(entry))}" alt="" width="18" height="18" loading="lazy">
                          <span>${escapeHtml(entry.name)}</span>
                        </a>
                        ${saveBtnHtml(entry, "cat-sidebar__save")}
                      </li>
                    `
                  )
                  .join("")}
              </ul>
            </div>
          </aside>

          <div class="cat-main">
            ${
              cat.description
                ? `<details class="cat-desc">
                    <summary>${escapeHtml(intro)}</summary>
                    <p>${escapeHtml(cat.description)}</p>
                  </details>`
                : ""
            }

            <div class="url-card-grid" id="related-sites">
              ${entries.map((entry, i) => thumbCardHtml(entry, cat, i + 1, "category")).join("")}
            </div>
          </div>
        </div>

        ${categoryTopCardsHtml(cat.id)}
        ${bottomBlockHtml()}
        ${bottomToolbarHtml({
          href: "index.html",
          count: ENTRIES.length,
          title: SITE.name,
          emoji: "★",
        })}
      </div>
    `;
  }

  /* ---------- review page ---------- */

  function adjacentEntries(entry) {
    const siblings = entriesForCategory(entry.categoryId);
    const idx = siblings.findIndex((e) => e.id === entry.id);
    return {
      prev: idx > 0 ? siblings[idx - 1] : null,
      next: idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : null,
      siblings,
      index: idx,
    };
  }

  function carouselHtml(entry, category, siblings, rank) {
    const total = siblings.length;
    const { prev, next } = adjacentEntries(entry);

    return `
      <div class="review-carousel" data-carousel>
        <div class="review-carousel__stage">
          <div class="favicon-bar">
            <img src="${escapeHtml(faviconUrl(entry))}" alt="" width="16" height="16">
            <a href="${escapeHtml(entryExternalUrl(entry))}" target="_blank" rel="noopener noreferrer">${escapeHtml(entryHostname(entry))}</a>
          </div>
          <a class="review-carousel__thumb" href="${escapeHtml(entryExternalUrl(entry))}" target="_blank" rel="noopener noreferrer">
            <img src="${escapeHtml(entry.thumb)}" alt="" width="800" height="450">
            <span class="review-carousel__open">
              <img src="${escapeHtml(faviconUrl(entry))}" alt="" width="18" height="18">
              Open <strong>${escapeHtml(entry.name)}</strong>
              ${icons.external}
            </span>
          </a>
          ${
            prev
              ? `<a class="review-carousel__nav review-carousel__nav--prev" href="review.html?slug=${encodeURIComponent(prev.slug)}" aria-label="Previous site">${icons.chevronLeft}</a>`
              : `<span class="review-carousel__nav review-carousel__nav--prev is-disabled" aria-hidden="true">${icons.chevronLeft}</span>`
          }
          ${
            next
              ? `<a class="review-carousel__nav review-carousel__nav--next" href="review.html?slug=${encodeURIComponent(next.slug)}" aria-label="Next site">${icons.chevronRight}</a>`
              : `<span class="review-carousel__nav review-carousel__nav--next is-disabled" aria-hidden="true">${icons.chevronRight}</span>`
          }
          <div class="review-carousel__pager">${rank} / ${total}</div>
        </div>
        <p class="review-carousel__disclaimer">Editorial listing for ${escapeHtml(entry.name)}. Rankings may include affiliate relationships.</p>
        <div class="review-carousel__strip" aria-label="Sites in this category">
          ${siblings
            .map(
              (s, i) => `
                <a class="review-carousel__dot${s.id === entry.id ? " is-active" : ""}" href="review.html?slug=${encodeURIComponent(s.slug)}" title="${escapeHtml(s.name)}">
                  <img src="${escapeHtml(s.thumb)}" alt="" width="120" height="68" loading="lazy">
                  <span>#${i + 1}</span>
                </a>
              `
            )
            .join("")}
        </div>
      </div>
    `;
  }

  function renderReviewPage() {
    const root = document.getElementById("review-page");
    if (!root) return;

    const params = new URLSearchParams(location.search);
    const entry =
      (params.get("id") && entryById(params.get("id"))) ||
      (params.get("slug") && entryBySlug(params.get("slug"))) ||
      null;

    if (!entry) {
      root.innerHTML = emptyStateHtml("Review not found", "That site isn’t in this demo dataset.");
      document.title = `Not found — ${SITE.name}`;
      return;
    }

    const cat = categoryById(entry.categoryId);
    const rank = entryRank(entry);
    const saved = isSaved(entry.id);
    const siblings = entriesForCategory(entry.categoryId);
    const related = siblings.filter((e) => e.id !== entry.id);
    const catCount = siblings.length;

    document.title = `${entry.name} review — ${SITE.name}`;
    if (cat) document.body.style.setProperty("--page-accent", cat.accent || "");

    root.innerHTML = `
      <div class="page-shell"${cat ? ` style="--cat-accent:${escapeHtml(cat.accent)}"` : ""}>
        ${breadcrumbHtml([
          { label: "Home", href: "index.html" },
          cat
            ? { label: cat.name, href: `category.html?slug=${encodeURIComponent(cat.slug)}` }
            : { label: "Category" },
          { label: entry.name },
        ])}

        <article class="review-shell wrap" id="site-description">
          <div class="review-hero">
            <section class="review-hero__media" aria-label="Site preview">
              ${carouselHtml(entry, cat, siblings, rank)}
            </section>

            <div class="review-hero__panel">
              <div class="review-hero__head">
                <div class="review-hero__intro">
                  <div class="review-rank${rank === 1 ? " is-first" : ""}">#${rank}</div>
                  <h1 class="review-title">
                    <span>${escapeHtml(entry.name)}</span>
                    <span class="review-kicker">Review</span>
                  </h1>
                </div>
                <a class="review-visit" href="${escapeHtml(entryExternalUrl(entry))}" target="_blank" rel="noopener noreferrer">
                  <img src="${escapeHtml(faviconUrl(entry))}" alt="" width="20" height="20">
                  <span>
                    <span class="review-visit__label">Visit website</span>
                    <span class="review-visit__domain">${escapeHtml(entryHostname(entry))}</span>
                  </span>
                  ${icons.external}
                </a>
              </div>

              <div class="review-hero__details">
                ${ratingBarHtml(entry.rating)}
                ${badgesHtml(entry)}
                ${prosConsHtml(entry)}
              </div>

              <div class="review-hero__actions">
                <button type="button" class="btn btn--secondary${saved ? " is-saved" : ""}" data-save-id="${entry.id}" aria-pressed="${saved}" aria-label="${saved ? "Remove from saved" : "Save for later"}">
                  ${saved ? icons.star : icons.starOutline}
                  ${saved ? "Saved" : "Save for later"}
                </button>
              </div>
            </div>
          </div>

          <div class="review-meta-row">
            ${
              cat
                ? `<a class="category-pill" href="category.html?slug=${encodeURIComponent(cat.slug)}" style="--cat-accent:${escapeHtml(cat.accent)}">
                    <span aria-hidden="true">${escapeHtml(cat.emoji)}</span>
                    <span>${escapeHtml(cat.name)} (${catCount})</span>
                  </a>`
                : ""
            }
            ${moreLikeRowHtml(cat, siblings, entry.id)}
          </div>

          <div class="review-body">
            ${entry.description ? `<p class="review-lead">${escapeHtml(entry.description)}</p>` : ""}
            <p>${escapeHtml(entry.reviewContent)}</p>
          </div>

          <footer class="review-footer">
            <a class="btn btn--ghost btn--inline" href="index.html">← All websites</a>
            ${
              cat
                ? `<a class="btn btn--primary btn--inline" href="category.html?slug=${encodeURIComponent(cat.slug)}">+${catCount} ${escapeHtml(cat.name)}</a>`
                : ""
            }
          </footer>
        </article>

        ${
          related.length
            ? `
              <section class="related-block wrap" id="related-sites">
                <header class="related-block__header">
                  <h2>
                    <span aria-hidden="true">${escapeHtml(cat ? cat.emoji : "")}</span>
                    ${catCount}+ ${escapeHtml(cat ? cat.name : "sites")} like ${escapeHtml(entry.name)}
                  </h2>
                  ${
                    cat
                      ? `<a class="btn btn--ghost btn--inline" href="category.html?slug=${encodeURIComponent(cat.slug)}">View all</a>`
                      : ""
                  }
                </header>
                <div class="url-card-grid">
                  ${related.map((r) => thumbCardHtml(r, cat, null, "related")).join("")}
                </div>
              </section>
            `
            : ""
        }

        ${categoryTopCardsHtml(cat ? cat.id : null)}
        ${bottomBlockHtml()}
        ${bottomToolbarHtml({
          href: cat ? `category.html?slug=${encodeURIComponent(cat.slug)}` : "index.html",
          count: catCount,
          title: cat ? cat.name : SITE.name,
          emoji: cat ? cat.emoji : "★",
        })}
      </div>
    `;
  }

  function emptyStateHtml(title, message) {
    return `
      <div class="empty-state wrap">
        <h1>${escapeHtml(title)}</h1>
        <p>${escapeHtml(message)}</p>
        <a class="btn btn--primary btn--inline" href="index.html">Back to home</a>
      </div>
    `;
  }

  /* ---------- search ---------- */

  function openSearch() {
    const overlay = document.querySelector("[data-overlay]");
    const modal = document.querySelector("[data-search-modal]");
    const input = document.querySelector("[data-search-input]");
    if (!overlay || !modal) return;

    closeDrawer(true);
    overlay.hidden = false;
    modal.hidden = false;
    requestAnimationFrame(() => {
      overlay.classList.add("is-open");
      modal.classList.add("is-open");
    });
    document.body.classList.add("is-locked");
    if (input) {
      input.value = "";
      renderSearchResults("");
      setTimeout(() => input.focus(), 50);
    }
  }

  function closeSearch() {
    const overlay = document.querySelector("[data-overlay]");
    const modal = document.querySelector("[data-search-modal]");
    if (!overlay || !modal) return;

    overlay.classList.remove("is-open");
    modal.classList.remove("is-open");
    document.body.classList.remove("is-locked");
    setTimeout(() => {
      if (!document.querySelector(".drawer.is-open")) {
        overlay.hidden = true;
      }
      modal.hidden = true;
    }, 250);
  }

  function renderSearchResults(query) {
    const root = document.querySelector("[data-search-results]");
    if (!root) return;

    const q = query.trim().toLowerCase();
    if (!q) {
      root.innerHTML = `<p class="search-empty">Type to search ${ENTRIES.length} sites</p>`;
      return;
    }

    const hits = ENTRIES.filter((e) => {
      const cat = categoryById(e.categoryId);
      const hay = [e.name, e.description, e.slug, cat ? cat.name : ""].join(" ").toLowerCase();
      return hay.includes(q);
    }).slice(0, 12);

    if (!hits.length) {
      root.innerHTML = `<p class="search-empty">No matches for “${escapeHtml(query)}”</p>`;
      return;
    }

    root.innerHTML = hits
      .map((e) => {
        const cat = categoryById(e.categoryId);
        return `
          <a class="search-result" href="review.html?slug=${encodeURIComponent(e.slug)}">
            <img src="${escapeHtml(faviconUrl(e))}" alt="" width="28" height="28">
            <div class="search-result__meta">
              <div class="search-result__name">${escapeHtml(e.name)}</div>
              <div class="search-result__cat">${escapeHtml(cat ? cat.name : "")}</div>
            </div>
          </a>
        `;
      })
      .join("");
  }

  /* ---------- drawer ---------- */

  function openDrawer() {
    const overlay = document.querySelector("[data-overlay]");
    const drawer = document.querySelector("[data-drawer]");
    if (!overlay || !drawer) return;

    closeSearch();
    overlay.hidden = false;
    drawer.hidden = false;
    renderDrawerBody();
    requestAnimationFrame(() => {
      overlay.classList.add("is-open");
      drawer.classList.add("is-open");
    });
    document.body.classList.add("is-locked");
  }

  function closeDrawer(skipOverlayHide) {
    const overlay = document.querySelector("[data-overlay]");
    const drawer = document.querySelector("[data-drawer]");
    if (!drawer) return;

    drawer.classList.remove("is-open");
    if (!skipOverlayHide && overlay) overlay.classList.remove("is-open");
    document.body.classList.remove("is-locked");
    setTimeout(() => {
      drawer.hidden = true;
      if (!skipOverlayHide && overlay && !document.querySelector(".search-modal.is-open")) {
        overlay.hidden = true;
      }
    }, 350);
  }

  function renderDrawerBody() {
    const body = document.querySelector("[data-drawer-body]");
    if (!body) return;

    const ids = getSavedIds();
    const items = ids.map((id) => entryById(id)).filter(Boolean);

    if (!items.length) {
      body.innerHTML = `<p class="drawer-empty">No saved sites yet. Tap the star on any listing to save it here.</p>`;
      return;
    }

    body.innerHTML = items
      .map((e) => {
        const cat = categoryById(e.categoryId);
        return `
          <div class="drawer-item">
            <a class="drawer-item__link" href="review.html?slug=${encodeURIComponent(e.slug)}">
              <img src="${escapeHtml(faviconUrl(e))}" alt="" width="28" height="28">
              <div class="drawer-item__info">
                <div class="drawer-item__name">${escapeHtml(e.name)}</div>
                <div class="drawer-item__cat">${escapeHtml(cat ? cat.name : "")}</div>
              </div>
            </a>
            <button type="button" class="row-action is-saved" data-save-id="${e.id}" aria-label="Remove from saved">
              ${icons.star}
            </button>
          </div>
        `;
      })
      .join("");
  }

  /* ---------- events ---------- */

  function bindEvents() {
    document.addEventListener("click", (e) => {
      const themeBtn = e.target.closest("[data-theme-toggle]");
      if (themeBtn) {
        toggleTheme();
        return;
      }

      const searchOpen = e.target.closest("[data-search-open]");
      if (searchOpen) {
        openSearch();
        return;
      }

      const drawerOpen = e.target.closest("[data-drawer-open]");
      if (drawerOpen) {
        openDrawer();
        return;
      }

      const drawerClose = e.target.closest("[data-drawer-close]");
      if (drawerClose) {
        closeDrawer();
        return;
      }

      const saveBtn = e.target.closest("[data-save-id]");
      if (saveBtn) {
        e.preventDefault();
        toggleSaved(saveBtn.getAttribute("data-save-id"));
        if (document.querySelector(".drawer.is-open")) renderDrawerBody();
        return;
      }

      if (e.target.matches("[data-overlay]")) {
        closeSearch();
        closeDrawer();
      }

      if (e.target.closest("[data-scroll-top]")) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });

    document.addEventListener("input", (e) => {
      if (e.target.matches("[data-search-input]")) {
        renderSearchResults(e.target.value);
      }
    });

    document.addEventListener("keydown", (e) => {
      const isMod = e.metaKey || e.ctrlKey;
      if (isMod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (document.querySelector(".search-modal.is-open")) closeSearch();
        else openSearch();
        return;
      }
      if (e.key === "Escape") {
        closeSearch();
        closeDrawer();
      }
    });
  }

  /* ---------- boot ---------- */

  function init() {
    renderHeader();
    renderFooter();
    renderOverlays();
    applyTheme(getTheme());
    updateSavedCount();
    bindEvents();

    const page = document.body.getAttribute("data-page");
    if (page === "home") renderHome();
    else if (page === "category") renderCategoryPage();
    else if (page === "review") renderReviewPage();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
