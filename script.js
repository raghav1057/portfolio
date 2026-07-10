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


// 3D SKILL CARD DECK
(function() {
  const scene = document.getElementById("deckScene");
  const stack = document.getElementById("deckStack");
  if (!scene || !stack) return;

  const cards = Array.from(stack.querySelectorAll(".skill-card"));
  const N = cards.length;

  // set z-index so first card is always on top visually
  cards.forEach((card, i) => {
    card.style.zIndex = N - i;
  });

  const BASE_RX = 22;
  const BASE_RY = -28;
  const BASE_RZ = 3;

  let curRX = BASE_RX, curRY = BASE_RY;
  let tgtRX = BASE_RX, tgtRY = BASE_RY;
  let fan = 0, tgtFan = 0;
  let nx = 0, ny = 0;

  function applyCards(fan, nx, ny) {
    cards.forEach((card, i) => {
      // i=0 is front/top card, i=N-1 is back
      const depth  = i * (-16 - fan * 18);         // cards push back as fan opens
      const offsetY = i * (6 + fan * 14);           // cards spread downward
      const offsetX = i * fan * nx * 20;            // spread left/right with cursor
      const cardRY  = i * fan * nx * -4;            // each card rotates slightly

      card.style.transform =
        `translateX(${offsetX}px) translateY(${offsetY}px) translateZ(${depth}px) rotateY(${cardRY}deg)`;
    });
  }

  applyCards(0, 0, 0);

  scene.addEventListener("mouseenter", () => { tgtFan = 1; });
  scene.addEventListener("mouseleave", () => {
    tgtFan = 0;
    tgtRX = BASE_RX;
    tgtRY = BASE_RY;
    nx = 0; ny = 0;
  });

  scene.addEventListener("mousemove", (e) => {
    const r = scene.getBoundingClientRect();
    nx = (e.clientX - r.left)  / r.width  - 0.5;
    ny = (e.clientY - r.top)   / r.height - 0.5;
    tgtRY = BASE_RY + nx * 30;
    tgtRX = BASE_RX - ny * 20;
  });

  function lerp(a, b, t) { return a + (b - a) * t; }

  function tick() {
    curRX = lerp(curRX, tgtRX, 0.08);
    curRY = lerp(curRY, tgtRY, 0.08);
    fan   = lerp(fan,   tgtFan, 0.07);

    stack.style.transform =
      `rotateX(${curRX}deg) rotateY(${curRY}deg) rotateZ(${BASE_RZ}deg)`;

    applyCards(fan, nx, ny);
    requestAnimationFrame(tick);
  }

  tick();
})();