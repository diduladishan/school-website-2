// Our curriculum JS
(function () {
  "use strict";

  const section = document.getElementById("our-curriculum");
  const leaves = [
    document.getElementById("leaf-red"),
    document.getElementById("leaf-yellow"),
    document.getElementById("leaf-blue"),
    document.getElementById("leaf-purple"),
  ];

  const STAGGER = [0, 0.12, 0.22, 0.32];
  leaves.forEach((leaf, i) => {
    leaf.style.transitionDelay = `${STAGGER[i]}s`;
  });

  let currentPhase = 1;

  function setPhase(phase) {
    if (phase === currentPhase) return;
    currentPhase = phase;
    leaves.forEach((leaf) => {
      leaf.classList.remove("phase-2", "phase-3");
      if (phase === 2) leaf.classList.add("phase-2");
      if (phase === 3) leaf.classList.add("phase-3");
    });
  }

  function onScroll() {
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;
    const PHASE2_THRESHOLD = vh * 0.35;
    const PHASE3_THRESHOLD = vh * -0.15;

    if (rect.top <= PHASE3_THRESHOLD) {
      setPhase(3);
    } else if (rect.top <= PHASE2_THRESHOLD) {
      setPhase(2);
    } else {
      setPhase(1);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
