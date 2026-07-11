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


// 3D SKILL CARD DECK — Linear style
// Cards stacked flat. Scroll progress through the skills section controls
// how many cards slide up. Scrolling down through the section progressively
// lifts each card; scrolling back up restacks them.
(function() {
  const scene = document.getElementById("deckScene");
  const stack = document.getElementById("deckStack");
  const section = document.getElementById("skills");
  if (!scene || !stack || !section) return;

  const cards = Array.from(stack.querySelectorAll(".skill-card"));
  const N = cards.length;

  // spacing between cards in the stack (Z axis)
  const GAP = 9;
  // how far each card slides up when revealed (Y axis in 3D space)
  const LIFT = 90;

  // smooth reveal counter — 0 means all stacked, N means all lifted
  let reveal = 0;
  let targetReveal = 0;

  function place(reveal) {
    cards.forEach((card, i) => {
      // i=0 is the TOP card (Python), i=N-1 is bottom
      const stackZ = i * -GAP; // base stack depth — card 0 is front/top

      // how much this card has been lifted
      // card i lifts when reveal > (N-1-i)
      const liftAmount = Math.max(0, Math.min(1, reveal - i));
      const liftY = -liftAmount * LIFT;

      card.style.transform = `translateZ(${stackZ}px) translateY(${liftY}px)`;
      card.style.zIndex = N - i;

      card.classList.toggle("is-top", i === 0 && reveal < 0.5 || liftAmount > 0 && liftAmount < 1);
    });
  }

  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }

  // Compute how far the user has scrolled through the skills section:
  // 0 = section just entering the bottom of the viewport,
  // 1 = section has fully passed the top of the viewport.
  function updateTargetFromScroll() {
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const total = rect.height + vh;
    const scrolled = vh - rect.top;
    const progress = clamp(scrolled / total, 0, 1);
    targetReveal = progress * (N - 1);
  }

  window.addEventListener("scroll", updateTargetFromScroll, { passive: true });
  window.addEventListener("resize", updateTargetFromScroll);

  updateTargetFromScroll();
  place(reveal);

  function tick() {
    reveal = lerp(reveal, targetReveal, 0.1);
    place(reveal);
    requestAnimationFrame(tick);
  }

  tick();
})();