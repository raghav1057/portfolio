// TYPEWRITER EFFECT
const phrases = [
  "building things. sometimes they even work.",
  "Googling first, panicking second.",
  "making APIs do the heavy lifting.",
  "learning in public, cringing in private.",
  "powered by curiosity and bad wifi."
];

const el = document.getElementById("typewriter-text");

let phraseIndex = 0;
let charIndex   = 0;
let isDeleting  = false;

function typewriter() {
  const currentPhrase = phrases[phraseIndex];

  if (!isDeleting) {
    el.textContent = currentPhrase.slice(0, charIndex + 1);
    charIndex++;

    if (charIndex === currentPhrase.length) {
      isDeleting = true;
      setTimeout(typewriter, 1800);
      return;
    }
  } else {
    el.textContent = currentPhrase.slice(0, charIndex - 1);
    charIndex--;

    if (charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(typewriter, 400);
      return;
    }
  }

  const speed = isDeleting ? 40 : 70;
  setTimeout(typewriter, speed);
}

setTimeout(typewriter, 600);


// SCROLL ANIMATIONS
// fires when elements enter the viewport, adds 'visible' class
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll("section, article").forEach((el) => {
  observer.observe(el);
});