// Napni landing — small, dependency-free enhancements.
(() => {
  "use strict";

  // The one place to change the contact address.
  const CONTACT_EMAIL = "info@napni.si";

  const root = document.documentElement;
  root.classList.remove("no-js");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- contact links ---------- */
  document.querySelectorAll("[data-mail]").forEach((a) => {
    const subject = a.dataset.subject;
    a.href = `mailto:${CONTACT_EMAIL}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;
    if (a.hasAttribute("data-plain")) a.textContent = CONTACT_EMAIL;
  });

  /* ---------- nav ---------- */
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 12);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const burger = nav.querySelector(".nav__burger");
  const menu = document.getElementById("mobile-menu");
  const setMenu = (open) => {
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Zapri meni" : "Odpri meni");
    menu.hidden = !open;
  };
  burger.addEventListener("click", () => setMenu(menu.hidden));
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !menu.hidden) { setMenu(false); burger.focus(); } });

  /* ---------- reveal on scroll ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        entry.target.dispatchEvent(new CustomEvent("revealed"));
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => { el.classList.add("is-in"); setTimeout(() => el.dispatchEvent(new CustomEvent("revealed")), 0); });
  }

  /* ---------- count-up ---------- */
  const countUp = (el) => {
    const target = Number(el.dataset.count);
    if (!target || reduceMotion) return;
    const start = performance.now();
    const dur = 1100;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      el.textContent = String(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) requestAnimationFrame(tick);
    };
    el.textContent = "0";
    requestAnimationFrame(tick);
  };
  document.querySelectorAll(".reveal").forEach((section) => {
    const nums = section.querySelectorAll("[data-count]");
    if (nums.length) section.addEventListener("revealed", () => nums.forEach(countUp), { once: true });
  });

  /* ---------- card spotlight ---------- */
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });

  /* ---------- white-label tuner ---------- */
  const luminance = (hex) => {
    const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const contrast = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  // Same rule as the app: white or near-black, whichever reads better.
  const foregroundOn = (hex) => {
    const bg = luminance(hex);
    return contrast(bg, 1) >= contrast(bg, luminance("#111214")) ? "#ffffff" : "#111214";
  };
  const slug = (s) => s.toLowerCase()
    .replace(/[čć]/g, "c").replace(/š/g, "s").replace(/ž/g, "z").replace(/đ/g, "d")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "").slice(0, 18) || "vasklub";

  const setColor = (hex) => {
    root.style.setProperty("--club", hex);
    root.style.setProperty("--club-fg", foregroundOn(hex));
  };
  const setName = (raw) => {
    const name = raw.trim() || "Vaš klub";
    const host = `${slug(name)}.si`;
    document.querySelectorAll("[data-club-name]").forEach((el) => { el.textContent = name; });
    document.querySelectorAll("[data-club-initial]").forEach((el) => { el.textContent = name.charAt(0).toUpperCase(); });
    document.querySelectorAll("[data-club-domain]").forEach((el) => { el.textContent = `app.${host}`; });
    document.querySelectorAll("[data-club-host]").forEach((el) => { el.textContent = host; });
  };

  const swatches = [...document.querySelectorAll(".swatches button")];
  const customWrap = document.querySelector(".swatch-custom");
  const customInput = document.getElementById("club-color");
  const selectSwatch = (btn) => {
    swatches.forEach((b) => { b.setAttribute("aria-checked", String(b === btn)); b.tabIndex = b === btn ? 0 : -1; });
    customWrap.classList.toggle("is-on", !btn);
  };
  swatches.forEach((btn, i) => {
    btn.tabIndex = btn.getAttribute("aria-checked") === "true" ? 0 : -1;
    btn.addEventListener("click", () => { selectSwatch(btn); setColor(btn.dataset.color); customInput.value = btn.dataset.color; });
    btn.addEventListener("keydown", (e) => {
      const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (!d) return;
      e.preventDefault();
      const next = swatches[(i + d + swatches.length) % swatches.length];
      next.focus(); next.click();
    });
  });
  customInput.addEventListener("input", () => { selectSwatch(null); setColor(customInput.value); });

  const nameInput = document.getElementById("club-name");
  nameInput.addEventListener("input", () => setName(nameInput.value));
  setName(nameInput.value);
  setColor("#2563eb");

  /* ---------- illustrative UPN QR ---------- */
  const qr = document.querySelector(".qr");
  if (qr) {
    const N = 29;
    let seed = 20261010;
    const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
    const inFinder = (x, y) => [[0, 0], [N - 7, 0], [0, N - 7]].some(([fx, fy]) => x >= fx - 1 && x <= fx + 7 && y >= fy - 1 && y <= fy + 7);
    let d = "";
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (!inFinder(x, y) && rnd() > 0.52) d += `M${x} ${y}h1v1h-1z`;
    const finder = ([fx, fy]) => `M${fx} ${fy}h7v7h-7z M${fx + 1} ${fy + 1}v5h5v-5z M${fx + 2} ${fy + 2}h3v3h-3z`;
    const finders = [[0, 0], [N - 7, 0], [0, N - 7]].map(finder).join(" ");
    qr.innerHTML = `<path d="${d}" fill="#111214"/><path d="${finders}" fill="#111214" fill-rule="evenodd"/>`;
  }

  /* ---------- go-live checklist ---------- */
  const golive = document.querySelector(".golive");
  if (golive) {
    const items = [...golive.querySelectorAll("li")];
    const count = document.getElementById("golive-count");
    const btn = document.getElementById("golive-btn");
    const run = () => {
      items.forEach((li, i) => setTimeout(() => {
        li.classList.add("done");
        count.textContent = String(i + 1);
        if (i === items.length - 1) btn.disabled = false;
      }, reduceMotion ? 0 : 350 + i * 420));
    };
    golive.addEventListener("revealed", run, { once: true });
    btn.addEventListener("click", () => {
      btn.classList.add("is-live");
      btn.textContent = "✓ Klub je v živo";
      btn.disabled = true;
    });
  }

  /* ---------- year ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
