(function () {
  const hero = document.querySelector(".hero");
  const ibSection = document.getElementById("ib-bilingual-school");
  const leaf = document.getElementById("ibBlueLeaf");
  if (!hero || !ibSection) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const canUseGsapScroll =
    typeof window.gsap !== "undefined" &&
    typeof window.ScrollToPlugin !== "undefined";

  if (canUseGsapScroll) {
    window.gsap.registerPlugin(window.ScrollToPlugin);
  }

  const SNAP_DURATION = 1.8;
  const SNAP_EASE = "power3.inOut";

  function endOfHero() {
    return hero.offsetTop + hero.offsetHeight;
  }

  /** Document scroll Y so the viewport top meets the top of artwork.png */
  function scrollYAtArtworkPngStart() {
    const img = document.querySelector(".ib-bilingual-school-artwork-base img");
    if (!img) return ibSection.offsetTop;
    const rect = img.getBoundingClientRect();
    return window.scrollY + rect.top;
  }

  /** Same band as ib-bilingual-school.js `isAtLandingScroll` */
  function isAtIbLanding() {
    const goal = scrollYAtArtworkPngStart();
    const y = window.scrollY;
    return y >= goal - 12 && y <= goal + 24;
  }

  function scrollYAtMLogoStart() {
    if (typeof window.ScrollTrigger !== "undefined") {
      const st = window.ScrollTrigger.getById("campus-reveal-pin");
      if (st && typeof st.start === "number") return st.start;
    }
    const mLogo = document.getElementById("campus-reveal");
    if (!mLogo) return scrollYAtArtworkPngStart() + 1000;
    return mLogo.offsetTop;
  }

  function isAtMLogo() {
    const goal = scrollYAtMLogoStart();
    const y = window.scrollY;
    return y >= goal - 12 && y <= goal + 24;
  }

  let lockScroll = false;
  /** @type {null | "to-ib-from-top" | "to-ib-from-bottom" | "to-mlogo" | "to-hero"} */
  let lockMode = null;
  let activeSnapTween = null;
  function isCampusRevealLocked() {
    return !!window.crScrollLocked;
  }

  function unlockSnap() {
    activeSnapTween = null;
    lockScroll = false;
    lockMode = null;
  }

  function clearLockSoon() {
    window.setTimeout(
      function () {
        unlockSnap();
      },
      Math.max(3200, SNAP_DURATION * 1000 + 1200),
    );
  }

  /**
   * Hero ↔ IB landing scroll. GSAP + ScrollToPlugin when available; native smooth as fallback.
   */
  function animateWindowScrollTo(targetY, mode) {
    if (isCampusRevealLocked()) return;

    if (activeSnapTween) {
      activeSnapTween.kill();
      activeSnapTween = null;
    }

    lockScroll = true;
    lockMode = mode;
    clearLockSoon();

    if (reduceMotion) {
      window.scrollTo({ top: targetY, behavior: "auto" });
      if (mode === "to-ib-from-top") {
        window.dispatchEvent(new CustomEvent("ib-section-arrived"));
      }
      unlockSnap();
      return;
    }

    if (canUseGsapScroll) {
      activeSnapTween = window.gsap.to(window, {
        duration: SNAP_DURATION,
        scrollTo: {
          y: targetY,
          autoKill: true,
        },
        ease: SNAP_EASE,
        overwrite: false,
        onComplete: function () {
          unlockSnap();
          if (mode === "to-ib-from-top") {
            window.dispatchEvent(new CustomEvent("ib-section-arrived"));
          }
        },
        onInterrupt: function () {
          unlockSnap();
        },
      });
    } else {
      window.scrollTo({
        top: targetY,
        behavior: "smooth",
      });
      if (mode === "to-ib-from-top") {
        window.setTimeout(function () {
          window.dispatchEvent(new CustomEvent("ib-section-arrived"));
        }, SNAP_DURATION * 1000);
      }
    }
  }

  // ─── Scroll listener (clears lock when target reached) ───────────────────────

  window.addEventListener(
    "scroll",
    function () {
      if (!lockScroll) return;
      if (lockMode === "to-ib" || lockMode === "to-ib-from-top") {
        if (window.scrollY >= scrollYAtArtworkPngStart() - 3) {
          if (lockMode === "to-ib-from-top") {
            window.dispatchEvent(new CustomEvent("ib-section-arrived"));
          }
          unlockSnap();
        }
      }
      if (
        lockMode === "to-ib-from-bottom" &&
        window.scrollY <= scrollYAtArtworkPngStart() + 3
      ) {
        unlockSnap();
      }
      if (
        lockMode === "to-mlogo" &&
        window.scrollY >= scrollYAtMLogoStart() - 3
      ) {
        unlockSnap();
      }
      if (lockMode === "to-hero" && window.scrollY <= 2) {
        unlockSnap();
      }
    },
    { passive: true },
  );

  // ─── Wheel (desktop) ─────────────────────────────────────────────────────────

  window.addEventListener(
    "wheel",
    function (e) {
      if (reduceMotion) return;
      if (isCampusRevealLocked()) return;

      const y = window.scrollY;
      const pastHero = y >= endOfHero() - 2;

      if (lockScroll) {
        if (lockMode === "to-ib" || lockMode === "to-ib-from-top") {
          const goal = scrollYAtArtworkPngStart();
          if (e.deltaY > 0 && y < goal - 3) e.preventDefault();
        } else if (lockMode === "to-ib-from-bottom") {
          const goal = scrollYAtArtworkPngStart();
          if (e.deltaY < 0 && y > goal + 3) e.preventDefault();
        } else if (lockMode === "to-hero") {
          if (e.deltaY > 0 && y > 2) e.preventDefault();
        } else if (lockMode === "to-mlogo") {
          const goal = scrollYAtMLogoStart();
          if (e.deltaY > 0 && y < goal - 3) e.preventDefault();
        }
        return;
      }

      /* Scroll down from hero → IB landing */
      if (e.deltaY > 0 && !pastHero) {
        e.preventDefault();
        animateWindowScrollTo(scrollYAtArtworkPngStart(), "to-ib-from-top");
        return;
      }

      /* Scroll down from IB landing → M Logo */
      const ibScrolled = document.querySelector(
        ".ib-bilingual-school-leaf-scrolled",
      );
      if (e.deltaY > 0 && isAtIbLanding() && ibScrolled) {
        e.preventDefault();
        animateWindowScrollTo(scrollYAtMLogoStart(), "to-mlogo");
        return;
      }

      /* Scroll up from M Logo → IB landing */
      if (e.deltaY < 0 && isAtMLogo()) {
        e.preventDefault();
        animateWindowScrollTo(scrollYAtArtworkPngStart(), "to-ib-from-bottom");
        return;
      }

      /* Scroll up from IB landing → hero */
      if (e.deltaY < 0 && pastHero && isAtIbLanding()) {
        e.preventDefault();
        animateWindowScrollTo(0, "to-hero");
        return;
      }
    },
    { passive: false },
  );

  const SWIPE_THRESHOLD = 10; // Detect intent early, before browser scrolls

let touchStartY = 0;
let touchStartX = 0;
let touchTriggered = false;
let touchIntentLocked = false; // true = we own this gesture

window.addEventListener(
  "touchstart",
  function (e) {
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
    touchTriggered = false;
    touchIntentLocked = false;
  },
  { passive: true }, // touchstart can stay passive
);

window.addEventListener(
  "touchmove",
  function (e) {
    if (reduceMotion) return;
    if (isCampusRevealLocked()) return;

    const currentY = e.touches[0].clientY;
    const currentX = e.touches[0].clientX;
    const deltaY = touchStartY - currentY;
    const deltaX = touchStartX - currentX;

    // Ignore horizontal swipes
    if (Math.abs(deltaX) > Math.abs(deltaY)) return;

    // Once we've decided to own this gesture, keep blocking native scroll
    if (touchIntentLocked) {
      e.preventDefault();
      return;
    }

    // Not enough movement yet
    if (Math.abs(deltaY) < SWIPE_THRESHOLD) return;

    if (lockScroll) {
      // Already animating — block native scroll for the rest of this gesture
      touchIntentLocked = true;
      e.preventDefault();
      return;
    }

    if (touchTriggered) return;

    const y = window.scrollY;
    const pastHero = y >= endOfHero() - 2;

    const ibScrolled = document.querySelector(
      ".ib-bilingual-school-leaf-scrolled",
    );

    let handled = false;

    /* Swipe up (finger moves up = scroll down) → IB landing */
    if (deltaY > 0 && !pastHero) {
      animateWindowScrollTo(scrollYAtArtworkPngStart(), "to-ib-from-top");
      handled = true;
    }
    /* Swipe up → M logo */
    else if (deltaY > 0 && isAtIbLanding() && ibScrolled) {
      animateWindowScrollTo(scrollYAtMLogoStart(), "to-mlogo");
      handled = true;
    }
    /* Swipe down (finger moves down = scroll up) → IB landing */
    else if (deltaY < 0 && isAtMLogo()) {
      animateWindowScrollTo(scrollYAtArtworkPngStart(), "to-ib-from-bottom");
      handled = true;
    }
    /* Swipe down → Hero */
    else if (deltaY < 0 && pastHero && isAtIbLanding()) {
      animateWindowScrollTo(0, "to-hero");
      handled = true;
    }

    if (handled) {
      touchTriggered = true;
      touchIntentLocked = true;
      e.preventDefault(); // Block native scroll immediately
    }
  },
  { passive: false }, // MUST be false to allow preventDefault
);

window.addEventListener(
  "touchend",
  function () {
    touchIntentLocked = false;
    touchTriggered = false;
  },
  { passive: true },
);
})();