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


// 3D SKILL CARD DECK — follows cursor movement
const deckScene = document.getElementById("deckScene");
const deckStack = document.getElementById("deckStack");

if (deckScene && deckStack) {
  // base rotation so deck looks isometric by default
  let baseX = 20;
  let baseY = -20;

  // current and target rotation — we lerp between them for smoothness
  let currentX = baseX;
  let currentY = baseY;
  let targetX  = baseX;
  let targetY  = baseY;

  // track if mouse is over the scene
  let isHovered = false;

  deckScene.addEventListener("mousemove", (e) => {
    const rect = deckScene.getBoundingClientRect();

    // normalise mouse position to -1 → +1 range within the element
    const nx = (e.clientX - rect.left)  / rect.width  - 0.5;
    const ny = (e.clientY - rect.top)   / rect.height - 0.5;

    // map to rotation degrees — max ±20deg tilt
    targetY = baseY + nx * 40;
    targetX = baseX - ny * 30;
    isHovered = true;
  });

  deckScene.addEventListener("mouseleave", () => {
    // return to base rotation when cursor leaves
    targetX = baseX;
    targetY = baseY;
    isHovered = false;
  });

  // animation loop — lerp current toward target every frame
  // lerp = linear interpolation: move 8% of the remaining distance each frame
  // this creates smooth easing without any library
  function animateDeck() {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;

    deckStack.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg)`;
    requestAnimationFrame(animateDeck);
  }

  animateDeck();
}