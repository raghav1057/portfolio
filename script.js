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


// 3D SKILL CARD DECK — Linear-style fanning with cursor
(function() {
  const scene = document.getElementById("deckScene");
  const stack = document.getElementById("deckStack");
  if (!scene || !stack) return;

  const cards = Array.from(stack.querySelectorAll(".skill-card"));
  const N = cards.length;

  // base isometric rotation of the whole stack
  const BASE_RX = 14;
  const BASE_RY = -20;
  const BASE_RZ = 2;

  // how far cards spread along each axis as cursor moves
  const SPREAD_Z  = 22;   // depth spread between cards (px)
  const SPREAD_X  = 9;    // vertical offset between cards (px)
  const TILT_MAX  = 18;   // max tilt of whole stack (deg)

  let curX = BASE_RX, curY = BASE_RY;
  let tgtX = BASE_RX, tgtY = BASE_RY;
  // fan progress: 0 = collapsed stack, 1 = fully fanned
  let fanProgress = 0;
  let tgtFan = 0;
  let isInside = false;

  // set initial collapsed positions
  function setCardTransforms(fan, nx, ny) {
    cards.forEach((card, i) => {
      // reverse index so top card (i=0) is front
      const rev = N - 1 - i;

      // base stacked offset — cards sit slightly behind each other
      const baseZ = rev * -14;
      const baseY = rev * 8;

      // fanned offset — cursor position fans cards out in Z and Y
      // nx/ny are -0.5 to +0.5 normalised cursor position
      const fanZ  = rev * SPREAD_Z  * fan;
      const fanY  = rev * SPREAD_X  * fan * (ny + 0.3);
      const fanRY = rev * 3.5       * fan * nx;

      const z = baseZ - fanZ;
      const y = baseY - fanY;

      card.style.transform = `translateY(${y}px) translateZ(${z}px) rotateY(${fanRY}deg)`;
    });
  }

  // start with collapsed stack
  setCardTransforms(0, 0, 0);

  let mouseNX = 0, mouseNY = 0;

  scene.addEventListener("mouseenter", () => {
    tgtFan = 1;
    isInside = true;
  });

  scene.addEventListener("mouseleave", () => {
    tgtFan = 0;
    tgtX = BASE_RX;
    tgtY = BASE_RY;
    isInside = false;
  });

  scene.addEventListener("mousemove", (e) => {
    const r = scene.getBoundingClientRect();
    mouseNX = (e.clientX - r.left)  / r.width  - 0.5;   // -0.5 to +0.5
    mouseNY = (e.clientY - r.top)   / r.height - 0.5;

    // tilt whole stack based on cursor
    tgtY = BASE_RY + mouseNX * TILT_MAX * 2;
    tgtX = BASE_RX - mouseNY * TILT_MAX;
  });

  function lerp(a, b, t) { return a + (b - a) * t; }

  function animate() {
    // smoothly chase targets
    curX       = lerp(curX,       tgtX,   0.07);
    curY       = lerp(curY,       tgtY,   0.07);
    fanProgress = lerp(fanProgress, tgtFan, 0.06);

    // apply whole-stack rotation
    stack.style.transform =
      `rotateX(${curX}deg) rotateY(${curY}deg) rotateZ(${BASE_RZ}deg)`;

    // apply per-card fanning
    setCardTransforms(fanProgress, mouseNX, mouseNY);

    requestAnimationFrame(animate);
  }

  animate();
})();