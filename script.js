// TYPEWRITER EFFECT
const phrases = [
  "building things. sometimes they even work.",
  "Googling first, panicking second.",
  "making APIs do the heavy lifting.",
  "learning in public, cringing in private.",
  "powered by curiosity and bad wifi."
];

const el = document.getElementById("typewriter-text");
let phraseIndex = 0, charIndex = 0, isDeleting = false;

function typewriter() {
  const current = phrases[phraseIndex];
  el.textContent = isDeleting
    ? current.slice(0, charIndex - 1)
    : current.slice(0, charIndex + 1);

  isDeleting ? charIndex-- : charIndex++;

  if (!isDeleting && charIndex === current.length) {
    isDeleting = true;
    setTimeout(typewriter, 1800);
    return;
  }
  if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    setTimeout(typewriter, 400);
    return;
  }
  setTimeout(typewriter, isDeleting ? 40 : 70);
}

setTimeout(typewriter, 600);


// SCROLL ANIMATIONS — slower threshold so animation is visible
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.08 });

document.querySelectorAll("section, article, .project-row").forEach((el) => {
  scrollObserver.observe(el);
});


// ACTIVE NAV INDICATOR
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a");

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      navLinks.forEach((l) => l.classList.remove("active"));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add("active");
    }
  });
}, { threshold: 0.4 });

sections.forEach((s) => navObserver.observe(s));


// BACK TO TOP
const backToTop = document.getElementById("back-to-top");

window.addEventListener("scroll", () => {
  backToTop.classList.toggle("visible", window.scrollY > 400);
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});


// COPY EMAIL
const emailLink = document.getElementById("email-link");

emailLink.addEventListener("click", (e) => {
  e.preventDefault();
  navigator.clipboard.writeText("raghavpantwork@gmail.com").then(() => {
    const original = emailLink.textContent;
    emailLink.textContent = "copied!";
    emailLink.style.color = "var(--green)";
    setTimeout(() => {
      emailLink.textContent = original;
      emailLink.style.color = "";
    }, 2000);
  });
});


// TAB EASTER EGG
const originalTitle = document.title;
document.addEventListener("visibilitychange", () => {
  document.title = document.hidden ? "come back... 👀" : originalTitle;
});


// 3D SKILL CARD DECK — Linear style, cursor pulls active card out
(function() {
  const scene = document.getElementById("deckScene");
  const stack = document.getElementById("deckStack");
  if (!scene || !stack) return;

  const cards = Array.from(stack.querySelectorAll(".skill-card"));
  const N = cards.length;

  // z-index so card 0 renders on top
  cards.forEach((card, i) => { card.style.zIndex = N - i; });

  // gap between stacked cards (px in Z axis)
  const STACK_GAP = 10;
  // how far active card pulls out toward viewer
  const PULL_Z    = 55;
  const PULL_Y    = -18;

  // which card index is active (-1 = none)
  let activeIndex    = -1;
  let curActive      = -1; // smooth float version
  let isInside       = false;

  // set all cards to their base stacked positions
  function setPositions(active) {
    cards.forEach((card, i) => {
      const baseZ = -i * STACK_GAP;

      if (Math.abs(i - active) < 0.5) {
        // this card is the active one — pull it out
        const t = 1 - Math.abs(i - active) * 2;
        const pullZ = baseZ + PULL_Z * t;
        const pullY = PULL_Y * t;
        card.style.transform = `translateZ(${pullZ}px) translateY(${pullY}px)`;
        card.classList.add("is-active");
      } else {
        card.style.transform = `translateZ(${baseZ}px) translateY(0px)`;
        card.classList.remove("is-active");
      }
    });
  }

  setPositions(-1);

  scene.addEventListener("mouseenter", () => {
    isInside = true;
    activeIndex = 0; // start with first card
  });

  scene.addEventListener("mouseleave", () => {
    isInside = false;
    activeIndex = -1;
  });

  scene.addEventListener("mousemove", (e) => {
    const r = scene.getBoundingClientRect();
    // map cursor X across the scene to card index 0 → N-1
    const nx = (e.clientX - r.left) / r.width;
    activeIndex = Math.min(Math.floor(nx * N), N - 1);
  });

  function lerp(a, b, t) { return a + (b - a) * t; }

  function tick() {
    const target = isInside ? activeIndex : -1;
    curActive = lerp(curActive, target, 0.12);
    setPositions(curActive);
    requestAnimationFrame(tick);
  }

  tick();
})();