/* =====================================================
   NORGATES — PAGE BEHAVIOUR
   Reads everything from content.js (the SITE object).
   Nothing here needs editing to change text or images.
   ===================================================== */

/* how many copies of the platform strip are rendered, and how fast it drifts (px/second) */
const MARQUEE_COPIES = 6;
const MARQUEE_SPEED = 14;

/* how far you scroll per side-scroller slide, in viewport heights — smaller means quicker */
const STORY_STEP_VH = 60;

/* artists rail: endless in both directions */
const ARTIST_COPIES = 7; // copies of the artist list rendered in the track
const CARD_GAP = 12; // space between artist cards (px)
const STEP_MS = 650; // how long one animated scroll takes

const SET = SITE.artists.length;
const START_POS = Math.floor(ARTIST_COPIES / 2) * SET;
const LOWER = 1;
const UPPER = ARTIST_COPIES * SET - 8;
const STORY_STEPS = 1 + SITE.features.length;


/* ---------- helpers: an image, or a placeholder box while it is empty/missing ---------- */
function placeholderBox(className, label, title) {
  const box = document.createElement("div");
  box.className = "placeholder " + className;
  box.textContent = label;
  if (title) box.title = title;
  return box;
}

function media(src, alt, className, label, title) {
  if (!src) return placeholderBox(className, label, title);
  const img = document.createElement("img");
  img.className = className;
  img.src = src;
  img.alt = alt;
  img.loading = "lazy";
  img.onerror = () => img.replaceWith(placeholderBox(className, label, title));
  return img;
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

/* ---------- top bar + buttons: point them at the links in content.js ---------- */
const applyAttrs = { href: SITE.applyLink, target: "_blank", rel: "noopener" };
function link(id, attrs) {
  const a = document.getElementById(id);
  if (!a || !attrs.href) return;
  a.href = attrs.href;
  a.target = attrs.target;
  a.rel = attrs.rel;
}
link("applyTop", applyAttrs);
link("applyHero", applyAttrs);
link("applyCta", applyAttrs);
const loginAttrs = { href: SITE.loginLink, target: "_blank", rel: "noopener" };
link("loginTop", loginAttrs);
link("loginCta", loginAttrs);

/* ---------- artists: arrows that scroll forever, both ways ---------- */
const rail = document.getElementById("artists");
const track = document.getElementById("artistTrack");

for (let copyIndex = 0; copyIndex < ARTIST_COPIES; copyIndex++) {
  const copy = el("div", "copy");
  if (copyIndex > 0) copy.setAttribute("aria-hidden", "true");
  SITE.artists.forEach((artist) => {
    const card = el("article", "artist");
    card.appendChild(media(artist.image, artist.name, "cover", "IMAGE"));
    card.appendChild(el("p", null, artist.name));
    copy.appendChild(card);
  });
  track.appendChild(copy);
}

let pos = START_POS;
let anim = false;
let step = 0;
let safetyTimer = 0;

const wrap = (p) => {
  let q = p;
  while (q > UPPER) q -= SET;
  while (q < LOWER) q += SET;
  return q;
};

function render() {
  track.style.transition = anim
    ? `transform ${STEP_MS}ms cubic-bezier(.22,1,.36,1)`
    : "none";
  track.style.transform = `translate3d(${-(pos * step + step / 2)}px,0,0)`;
}

function move(dir) {
  const next = pos + dir;
  if (next > UPPER || next < LOWER) {
    /* hop one copy back (invisible), then animate from there */
    const base = next > UPPER ? pos - SET : pos + SET;
    anim = false;
    pos = base;
    render();
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        anim = true;
        pos = base + dir;
        render();
      })
    );
    return;
  }
  anim = true;
  pos = next;
  render();

  /* safety net: if the position ever drifts out of the band, shift it back silently */
  clearTimeout(safetyTimer);
  safetyTimer = window.setTimeout(() => {
    const wrapped = wrap(pos);
    if (wrapped === pos) return;
    anim = false;
    pos = wrapped;
    render();
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        anim = true;
        render();
      })
    );
  }, STEP_MS + 60);
}

function measureStep() {
  const card = rail.querySelector(".artist");
  if (card) {
    step = card.offsetWidth + CARD_GAP;
    render();
  }
}
measureStep();
new ResizeObserver(measureStep).observe(rail);

document.getElementById("artistPrev").addEventListener("click", () => move(-1));
document.getElementById("artistNext").addEventListener("click", () => move(1));

/* ---------- platforms: keep the strip looping forever at a steady speed ---------- */
const marquee = document.getElementById("marquee");

for (let i = 0; i < MARQUEE_COPIES; i++) {
  const group = el("div", "group");
  if (i > 0) group.setAttribute("aria-hidden", "true");
  SITE.platforms.forEach((platform) => {
    group.appendChild(media(platform.image, platform.name, "logo", "LOGO", platform.name));
    group.appendChild(el("span", "star", "✦"));
  });
  marquee.appendChild(group);
}

function tuneMarquee() {
  const half = marquee.scrollWidth / 2;
  if (half > 0) marquee.style.animationDuration = `${Math.round(half / MARQUEE_SPEED)}s`;
}
tuneMarquee();
new ResizeObserver(tuneMarquee).observe(marquee);
window.addEventListener("load", tuneMarquee);

/* ---------- side scroller: which slide is showing ---------- */
const story = document.getElementById("story");
const storyVisual = document.getElementById("storyVisual");
const storyText = document.getElementById("storyText");
const storyBar = document.getElementById("storyBar");

story.style.height = `${STORY_STEPS * STORY_STEP_VH}vh`;

/* one slide per "Why Norgates" point, plus one progress segment each */
const progressAnchor = document.getElementById("storyProgress");
SITE.features.forEach((feature) => {
  const visual = el("div", "story-pane");
  visual.appendChild(media(feature.image, feature.title, "story-img", "IMAGE"));
  storyVisual.appendChild(visual);

  const text = el("div", "story-pane");
  text.appendChild(el("h2", null, feature.title));
  text.appendChild(el("p", "muted", feature.text));
  storyText.insertBefore(text, progressAnchor);
});

for (let i = 0; i < STORY_STEPS; i++) storyBar.appendChild(el("span"));

let active = -1;
function setActive(index) {
  if (index === active) return;
  active = index;
  storyVisual
    .querySelectorAll(".story-pane")
    .forEach((pane, i) => pane.classList.toggle("active", i === index));
  storyText
    .querySelectorAll(".story-pane")
    .forEach((pane, i) => pane.classList.toggle("active", i === index));
  storyBar.querySelectorAll("span").forEach((seg, i) => {
    seg.classList.toggle("done", i < index);
    seg.classList.toggle("on", i === index);
  });
}

function onStoryScroll() {
  const rect = story.getBoundingClientRect();
  const range = story.offsetHeight - window.innerHeight;
  if (range <= 0) return setActive(0);
  const t = Math.min(Math.max(-rect.top / range, 0), 0.9999);
  setActive(Math.floor(t * STORY_STEPS));
}
window.addEventListener("scroll", onStoryScroll, { passive: true });
window.addEventListener("resize", onStoryScroll);
onStoryScroll();

/* ---------- video block ---------- */
const video = document.getElementById("video");
const frame = SITE.videoLink ? el("a", "video-frame") : el("div", "video-frame");
if (SITE.videoLink) {
  frame.href = SITE.videoLink;
  frame.target = "_blank";
  frame.rel = "noopener";
  frame.setAttribute("aria-label", "Play video");
}
frame.appendChild(media(SITE.videoImage, "Norgates video", "video-img", "VIDEO"));
const play = el("span", "video-play");
play.setAttribute("aria-hidden", "true");
play.innerHTML =
  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
frame.appendChild(play);
video.appendChild(frame);

/* ---------- footer: links and social buttons ---------- */
const footerLinks = document.getElementById("footerLinks");
SITE.footerLinks.forEach((item) => {
  const li = el("li");
  const a = el("a", null, item.text);
  a.href = item.link;
  li.appendChild(a);
  footerLinks.appendChild(li);
});

const SOCIAL_ICONS = {
  instagram:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
  email:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>',
  discord:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.3 4.4A19.8 19.8 0 0 0 15.4 2.9l-.6 1.2a18.3 18.3 0 0 0-5.5 0l-.6-1.2A19.7 19.7 0 0 0 3.7 4.4C.5 9-.3 13.6.1 18a19.9 19.9 0 0 0 6 3l1.3-2a13 13 0 0 1-1.9-.9l.4-.3c3.9 1.8 8.2 1.8 12 0l.4.3a12.3 12.3 0 0 1-1.9.9l1.3 2a19.8 19.8 0 0 0 6-3c.5-5.2-.8-9.7-3.5-13.7ZM8 15.3c-1.2 0-2.2-1.1-2.2-2.4s1-2.4 2.2-2.4 2.2 1.1 2.2 2.4-1 2.4-2.2 2.4Zm8 0c-1.2 0-2.2-1.1-2.2-2.4s1-2.4 2.2-2.4 2.2 1.1 2.2 2.4-1 2.4-2.2 2.4Z"/></svg>',
};

const socials = document.getElementById("socials");
Object.entries(SITE.socials)
  .filter(([, href]) => href)
  .forEach(([key, href]) => {
    const a = el("a");
    a.href = href;
    a.setAttribute("aria-label", key);
    a.target = "_blank";
    a.rel = "noopener";
    a.innerHTML = SOCIAL_ICONS[key] || key;
    socials.appendChild(a);
  });

/* ---------- scroll reveal ---------- */
if (
  "IntersectionObserver" in window
) {
  const targets = document.querySelectorAll("main > section:not(.story), footer");
  targets.forEach((node) => node.classList.add("reveal"));
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      }),
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  targets.forEach((node) => io.observe(node));
}


/* ---------- "scroll down" cue: fades out once you start scrolling ---------- */
function toggleScrolled() {
  document.documentElement.classList.toggle("scrolled", window.scrollY > 120);
}
toggleScrolled();
window.addEventListener("scroll", toggleScrolled, { passive: true });

/* ---------- always open at the very top, and keep the arrow from leaving #story in the URL ---------- */
if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}
if (window.location.hash) {
  window.history.replaceState(
    null,
    "",
    window.location.pathname + window.location.search
  );
  window.scrollTo(0, 0);
}

(function () {
  const cue = document.querySelector(".scroll-cue");
  if (!cue) return;
  cue.addEventListener("click", (event) => {
    event.preventDefault();
    const story = document.getElementById("story");
    if (story) story.scrollIntoView({ behavior: "smooth", block: "start" });
  });
})();
