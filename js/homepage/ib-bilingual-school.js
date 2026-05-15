// IB bilingual school JS
(function () {
  "use strict";

  const section = document.getElementById("ib-bilingual-school");
  const leaf = document.getElementById("ibBlueLeaf");
  const text = document.getElementById("ibText");
  const ibInteractive = Boolean(section && leaf && text);

  let scrolled = false;
  let lastScrollY = window.scrollY;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

/** Document Y of the top of artwork.png (same line the hero snap targets). */
function artworkImgDocTop() {
  if (!section) return 0;
  const img = document.querySelector(".ib-bilingual-school-artwork-base img");
  if (!img) return section.offsetTop;
  const rect = img.getBoundingClientRect();
  return window.scrollY + rect.top;
}

/** True when scroll position matches the hero→IB landing */
function isAtLandingScroll() {
  const landing = artworkImgDocTop();
  const y = window.scrollY;
  const slackBelow = 24;
  const slackAbove = 12;
  return y >= landing - slackAbove && y <= landing + slackBelow;
}

function revealLeafAnimation() {
  if (!ibInteractive) return;
  positionLeafUnderText();
  leaf.classList.add("ib-bilingual-school-leaf-scrolled");
  text.classList.add("ib-bilingual-school-text-up");
  scrolled = true;
}

function hideLeafAnimation() {
  if (!ibInteractive) return;
  leaf.classList.remove("ib-bilingual-school-leaf-scrolled");
  text.classList.remove("ib-bilingual-school-text-up");
  scrolled = false;
}

function positionLeafUnderText() {
  if (!ibInteractive) return;
  const sectionRect = section.getBoundingClientRect();
  const textRect = text.getBoundingClientRect();
  const leafRect = leaf.getBoundingClientRect();

  const targetLeft =
    textRect.left -
    sectionRect.left +
    textRect.width / 2 -
    leafRect.width / 2 +
    50;

  const targetTop =
    textRect.bottom - sectionRect.top - leafRect.height / 2 - 80;

  const leftPct = (targetLeft / sectionRect.width) * 100;
  const topPct = (targetTop / sectionRect.height) * 100;

  leaf.style.setProperty("--leaf-scrolled-left", leftPct + "%");
  leaf.style.setProperty("--leaf-scrolled-top", topPct + "%");
}

/** Auto-trigger leaf when arriving at IB section via snap */
if (ibInteractive) {
  window.addEventListener("ib-section-arrived", function () {
    if (!scrolled) revealLeafAnimation();
  });
}

/** Scroll handling */
function onScroll() {
  const y = window.scrollY;

  if (ibInteractive) {
    const landing = artworkImgDocTop();
    const scrollingDown = y > lastScrollY;
    const scrollingUp = y < lastScrollY;

    if (reduceMotion) {
      const rect = section.getBoundingClientRect();
      const viewH = window.innerHeight;
      const triggerPoint = viewH * 0.7;
      const sectionMiddle = rect.top + rect.height * 0.3;
      const allowLeaf = window.scrollY >= landing + 40;

      if (sectionMiddle < triggerPoint && !scrolled && allowLeaf) {
        revealLeafAnimation();
      } else if ((sectionMiddle >= triggerPoint || !allowLeaf) && scrolled) {
        hideLeafAnimation();
      }
    } else {
      if (scrolled && y < landing - 48) {
        hideLeafAnimation();
      }

      if (!scrolled && isAtLandingScroll() && scrollingDown) {
        revealLeafAnimation();
      }

      if (scrolled && isAtLandingScroll() && scrollingUp) {
        hideLeafAnimation();
      }
    }

    lastScrollY = y;
  }

  syncTopArtworkOpacity();
}

/** ===== MERGED INLINE SCRIPT ===== */
const topArtwork = document.querySelector(".js-top-artwork");

function syncTopArtworkOpacity() {
  if (!topArtwork) return;
  topArtwork.style.opacity = window.scrollY > 0 ? "0.5" : "0";
}

if (topArtwork) {
  topArtwork.style.transition = "opacity 1000ms ease";
}

if (ibInteractive || topArtwork) {
  window.addEventListener("scroll", onScroll, { passive: true });
}

if (ibInteractive) {
  window.addEventListener("resize", () => {
    hideLeafAnimation();
  });
}

  syncTopArtworkOpacity();

  if (ibInteractive) {
    onScroll();
  }
})();

// Campus reveal JS (merged for bundle-safety)
(function () {
  'use strict';

  function q(root, sel) {
    return root ? root.querySelector(sel) : null;
  }

  const section = document.getElementById('campus-reveal');
  if (!section) return;

  const imageWrapper = document.getElementById('cr-image-wrapper');
  const fullbleedUI = document.getElementById('cr-fullbleed-ui');
  const carouselBg = document.getElementById('cr-carousel-bg');
  const sectionPhotoBg = document.getElementById('cr-section-photo-bg');
  const secondCard = document.getElementById('cr-second-card');

  const carouselShell = q(section, '.what-make-us-unique__section');
  const heading = q(carouselShell, '.what-make-us-unique__heading');
  const controls = q(carouselShell, '.what-make-us-unique__controls');
  const viewport = q(carouselShell, '#wmuViewport');
  if (!imageWrapper || !fullbleedUI || !carouselBg || !sectionPhotoBg || !secondCard || !carouselShell || !heading || !controls || !viewport) {
    return;
  }

  function setPhase(phase) {
    section.dataset.crPhase = phase;
    carouselShell.dataset.crPhase = phase;
  }

  function setCarouselInteractive(enabled) {
    carouselShell.classList.toggle('cr-carousel-interactive', enabled);
  }

  const MASK_PNG = 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI4NTAiIHZpZXdCb3g9IjAgMCAxNDQwIDg1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzFfMykiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNiwgMCkiPgo8cGF0aCBkPSJNNzc1LjE5OSAzNzAuODQ1Qzc2MS4xNDggMzgwLjQzOCA3NTkuMTggMzk1LjAyNyA3NTguMDE1IDQwOS42MjNDNzU0Ljg1NiA0NDkuMjM2IDc1Ny44NjQgNDg4Ljk3IDc1Ni4yNTggNTI4LjU5MkM3NTUuMzMzIDU1MS4zOTYgNzQ4LjA5NiA1NzIuNTU5IDczMS4xODMgNTg5LjE3NkM3MjYuMjMxIDU5NC4wNDEgNzIwLjU3MSA1OTcuOTMgNzE0LjIzIDYwMC45MDZDNzAzLjUxNyA2MDUuOTM1IDY5Ni40NjkgNjA1LjQ0NyA2OTAuMDY1IDU5OC44MThDNjgzLjAwNiA1OTEuNTEyIDY4MS41ODUgNTgwLjE1OSA2ODYuNzMxIDU3MS4wMTFDNjg4Ljk2NCA1NjcuMDQxIDY5MS41ODUgNTYzLjQ0IDY5Ni4xNzMgNTYxLjY5OEM3MDQuNzY3IDU1OC40MzQgNzA4Ljk4IDU1MS40NDkgNzExLjM1NCA1NDMuMDU5QzcxMy43NiA1MzQuNTU4IDcxNS40MzcgNTI1Ljk3NyA3MTUuNDA1IDUxNy4wNDhDNzE1LjI5IDQ4NC41MDcgNzE1LjI0MyA0NTEuOTY1IDcxNS40MzQgNDE5LjQyNUM3MTUuNDk4IDQwOC41ODEgNzE0LjI2MSAzOTcuODgyIDcxMC42NzggMzg3LjgyQzcwNC4yNzcgMzY5Ljg0OSA2OTIuNDk0IDM2NC41MTQgNjcxLjAwNyAzNjcuMjU4QzY1MS4yNTEgMzY5Ljc4MSA2NDUuMjc1IDM4My44NTEgNjQzLjM2OSA0MDMuNDY3QzYzOS43NTUgNDQwLjY0MyA2NDIuMDk4IDQ3Ny45OTQgNjQxLjk4OSA1MTUuMjY1QzY0MS45NjEgNTI1LjA2MiA2NDMuMDE2IDUzNS4wMzIgNjQ2Ljg3OSA1NDQuNjE4QzY1MC4yMjQgNTUyLjkyMSA2NTUuNDQzIDU1OC41MjQgNjYzLjEwMiA1NjIuNTU1QzY3Mi40NDUgNTY3LjQ3MiA2NzYuNzE3IDU4My43MDYgNjcxLjUxNSA1OTMuNjYyQzY2Ni4zNjIgNjAzLjUyMyA2NTUuNzAxIDYwNi4zODYgNjQ0LjM2NiA2MDAuODY1QzYxOC4zMDggNTg4LjE3MyA2MDYuNDM0IDU2NS40NjcgNjAyLjE5NiA1MzguMzg5QzU5Ni4yNTYgNTAwLjQyOCA1OTkuMjE1IDQ2Mi4wNjUgNTk5LjUxIDQyMy45MDFDNTk5LjY2OSA0MDMuMzczIDYwMS40ODUgMzgyLjY1MiA2MTEuMTY3IDM2My40NDhDNjIxLjcwOCAzNDIuNTQgNjM3Ljk5NiAzMjkuNzQ4IDY2MC43MjQgMzI1LjYwNUM2ODcuODQ1IDMyMC42NjIgNzEyLjg0IDMyNS4wOTUgNzMzLjcyOCAzNDQuNjg0QzczNC41NzQgMzQ1LjQ3OCA3MzUuNjQ0IDM0Ni4wMzMgNzM3LjIxNCAzNDcuMTE2Qzc0My41NjcgMzQxIDc0OS43NjMgMzM0LjYyNCA3NTguMDY3IDMzMS4yMjhDNzg2LjM0MyAzMTkuNjY1IDgxNC4xOTcgMzE5Ljk4NSA4MzkuODYxIDMzNy4zMTlDODU3LjQ3NiAzNDkuMjE3IDg2Ni40MTYgMzY3LjgzMyA4NjkuNjgxIDM4OC40NTFDODc2LjMzNyA0MzAuNDg0IDg3MS41MDYgNDcyLjg5NiA4NzIuNTYgNTE1LjEyOEM4NzMuMDQgNTM0LjMyNSA4NjkuNDgzIDU1Mi45MDEgODYwLjExOCA1NzAuMTdDODUxLjQzMyA1ODYuMTg0IDgzOS4yNDUgNTk3LjgxMyA4MjEuODI2IDYwMy40NjdDODAzLjQzNyA2MDkuNDM2IDc4NC45ODMgNjEwLjQwNyA3NjYuNTEyIDYwMy41M0M3NTIuNzU3IDU5OC40MDggNzQ3LjUyIDU3Ny45NTEgNzU3LjI5OCA1NjYuOTEzQzc2Mi44NTEgNTYwLjY0NCA3NjkuNzUzIDU1OS4zMTEgNzc3LjQ0NyA1NjIuMDg1Qzc4NS45MTQgNTY1LjEzOCA3OTQuNDM4IDU2Ni4yOTcgODAzLjM2NCA1NjQuMzVDODIwLjEwMSA1NjAuNjk5IDgyNS42MDUgNTQ4LjA2MiA4MjguNjU3IDUzMy4zMDFDODMwLjI2NSA1MjUuNTIzIDgzMC4zOSA1MTcuNjU1IDgzMC4xMDMgNTA5Ljc4OUM4MjkuMTI0IDQ4My4wMTYgODMyLjQ4IDQ1Ni4zMTMgODMxLjQ1MSA0MjkuNTYzQzgzMS4wMDQgNDE3Ljk0IDgzMC41MDYgNDA2LjEyMiA4MjguMDc1IDM5NC44MTNDODIyLjU3OCAzNjkuMjQ2IDc5OS42NTggMzU5LjA2NCA3NzUuMTk5IDM3MC44NDVaIiBmaWxsPSJ3aGl0ZSIvPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzFfMyI+CjxyZWN0IHdpZHRoPSIxNDQwIiBoZWlnaHQ9Ijg1MCIgZmlsbD0id2hpdGUiLz4KPC9jbGlwUGF0aD4KPC9kZWZzPgo8L3N2Zz4K")';

  function enableMask() {
    imageWrapper.style.webkitMaskImage = MASK_PNG;
    imageWrapper.style.maskImage = MASK_PNG;
  }

  function disableMask() {
    imageWrapper.style.webkitMaskImage = 'none';
    imageWrapper.style.maskImage = 'none';
  }

  function getCardRectInsideSection() {
    const sectionRect = section.getBoundingClientRect();
    const activeCard =
      q(carouselShell, '.what-make-us-unique__card.is-active') ||
      q(carouselShell, '.what-make-us-unique__card');
    if (!activeCard) {
      return {
        left: Math.round(sectionRect.width * 0.15),
        top: 160,
        width: Math.round(sectionRect.width * 0.7),
        height: Math.round(sectionRect.width <= 768 ? sectionRect.width * 0.7 * (100 / 67) : sectionRect.width * 0.35),
      };
    }
    const cardRect = activeCard.getBoundingClientRect();
    return {
      left: Math.round(cardRect.left - sectionRect.left),
      top: Math.round(cardRect.top - sectionRect.top),
      width: Math.round(cardRect.width),
      height: Math.round(cardRect.height),
    };
  }

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function applyReducedMotionState() {
    disableMask();
    gsap.set(sectionPhotoBg, { opacity: 1 });
    gsap.set(carouselBg, { opacity: 1 });
    gsap.set(fullbleedUI, { opacity: 0 });
    gsap.set(imageWrapper, {
      opacity: 0,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      clearProps: 'borderRadius,boxShadow',
    });
    gsap.set(secondCard, { opacity: 0, x: '100%' });
    gsap.set(carouselShell, { opacity: 1, y: 0 });
    gsap.set(heading, { opacity: 1, y: 0 });
    gsap.set(controls, { opacity: 1, y: 0 });
    setPhase('interactive');
    setCarouselInteractive(true);
    if (typeof window.wmuResetToFirst === 'function') {
      window.wmuResetToFirst();
    }
  }

  try {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    window.crScrollLocked = false;
    let revealAutoTween = null;
    let revealSnapFired = false;
    let revealDelayTimer = null;

    const REVEAL_AUTO_DELAY = 0.2;
    const REVEAL_ANIM_DURATION = 3;

    function cancelScheduledReveal() {
      if (revealDelayTimer) {
        clearTimeout(revealDelayTimer);
        revealDelayTimer = null;
      }
    }

    function isRevealAutoPending() {
      return revealDelayTimer !== null;
    }

    function releaseRevealScrollLock(skipTweenKill) {
      window.crScrollLocked = false;
      if (!skipTweenKill && revealAutoTween) {
        const active = revealAutoTween;
        revealAutoTween = null;
        active.kill();
      }
    }

    function finishRevealScrollMotion() {
      revealAutoTween = null;
      revealSnapFired = false;
      releaseRevealScrollLock(true);
    }

    function startRevealAutoScroll(targetY, duration) {
      if (revealSnapFired) return false;
      cancelScheduledReveal();
      revealSnapFired = true;
      window.crScrollLocked = true;

      if (revealAutoTween) revealAutoTween.kill();

      revealAutoTween = gsap.to(window, {
        scrollTo: { y: targetY, autoKill: true },
        duration: duration || REVEAL_ANIM_DURATION,
        ease: 'power2.inOut',
        onComplete: finishRevealScrollMotion,
        onInterrupt: finishRevealScrollMotion,
      });
      return true;
    }

    window.crPlayFullReveal = function () {
      const st = ScrollTrigger.getById('campus-reveal-pin');
      if (!st || revealSnapFired || window.crScrollLocked) return false;
      return startRevealAutoScroll(st.end, REVEAL_ANIM_DURATION);
    };

    window.crScheduleAutoReveal = function () {
      cancelScheduledReveal();
      const st = ScrollTrigger.getById('campus-reveal-pin');
      if (!st || revealSnapFired || window.crScrollLocked) return;

      window.crRevealWaiting = true;
      revealDelayTimer = window.setTimeout(function () {
        revealDelayTimer = null;
        window.crRevealWaiting = false;
        const y = window.scrollY;
        if (y < st.start - 24 || y > st.start + 36) return;
        if (st.progress > 0.04) return;
        window.crPlayFullReveal();
      }, REVEAL_AUTO_DELAY * 1000);
    };

    window.crCancelScheduledReveal = function () {
      window.crRevealWaiting = false;
      cancelScheduledReveal();
    };

    window.crResetRevealToStart = function () {
      const st = ScrollTrigger.getById('campus-reveal-pin');
      if (!st || revealSnapFired || window.crScrollLocked) return false;
      cancelScheduledReveal();
      return startRevealAutoScroll(st.start, REVEAL_ANIM_DURATION);
    };

    ScrollTrigger.config({
      ignoreMobileResize: true,
    });

    const isMobile = window.innerWidth <= 768;
    const isTallTablet = !isMobile && window.innerWidth >= 800 && window.innerWidth <= 1100 && window.innerHeight >= 1100;
    const maskProxy = { size: isMobile ? 115 : (isTallTablet ? 78 : 44) };

    function applyMaskSize(pct) {
      imageWrapper.style.webkitMaskSize = pct + '%';
      imageWrapper.style.maskSize = pct + '%';
    }

    enableMask();
    applyMaskSize(maskProxy.size);

    gsap.set(sectionPhotoBg, { opacity: 0 });
    gsap.set(carouselBg, { opacity: 0 });
    gsap.set(fullbleedUI, { opacity: 0 });
    gsap.set(carouselShell, { opacity: 0, y: 12 });
    gsap.set(heading, { opacity: 0, y: 18 });
    gsap.set(controls, { opacity: 0, y: 18 });
    gsap.set(secondCard, { opacity: 0, x: '100%' });

    setPhase('masked');
    setCarouselInteractive(false);

    if (prefersReduced) {
      applyReducedMotionState();
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=340%',
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        fastScrollEnd: true,
        invalidateOnRefresh: true,
        id: 'campus-reveal-pin',
        onEnter() {
          // Stop autoplay and snap to slide 1 the moment the reveal section pins
          if (typeof window.wmuStopAutoplay === 'function') {
            window.wmuStopAutoplay();
          }
        },
        onUpdate(self) {
          if (self.progress < 0.46) enableMask();
          else disableMask();

          // Fallback: mid-reveal only (entry waits for crScheduleAutoReveal)
          if (
            !window.crScrollLocked &&
            !revealSnapFired &&
            !isRevealAutoPending()
          ) {
            if (self.direction === 1 && self.progress >= 0.08 && self.progress < 0.92) {
              startRevealAutoScroll(self.end, REVEAL_ANIM_DURATION);
            } else if (self.direction === -1 && self.progress <= 0.92 && self.progress > 0.08) {
              startRevealAutoScroll(self.start, REVEAL_ANIM_DURATION);
            }
          }

          if (self.progress < 0.36) {
            setPhase('masked');
            setCarouselInteractive(false);
          } else if (self.progress < 0.76) {
            setPhase('fullbleed');
            setCarouselInteractive(false);
          } else if (self.progress < 0.96) {
            setPhase('card');
            setCarouselInteractive(false);
          } else {
            // Only reset carousel when transitioning INTO interactive phase
            if (section.dataset.crPhase !== 'interactive') {
              setPhase('interactive');
              setCarouselInteractive(true);
              if (typeof window.wmuResetToFirst === 'function') {
                window.wmuResetToFirst();
              }
            }
          }
        },
        onLeave() {
          revealSnapFired = false; // Reset for next time user enters this section
          releaseRevealScrollLock(false);
          setPhase('interactive');
          setCarouselInteractive(true);
          if (typeof window.wmuResetToFirst === 'function') {
            window.wmuResetToFirst();
          }
        },
        onEnterBack() {
          revealSnapFired = false; // Reset so reverse snap can fire
          releaseRevealScrollLock(false);
          setCarouselInteractive(false);
          // Stop autoplay and snap back to slide 1 when scrolling back into the reveal
          if (typeof window.wmuStopAutoplay === 'function') {
            window.wmuStopAutoplay();
          }
        },
        onLeaveBack() {
          revealSnapFired = false;
          cancelScheduledReveal();
          releaseRevealScrollLock(false);
          setPhase('masked');
          setCarouselInteractive(false);
        },
      },
    });

    tl.to(sectionPhotoBg, { opacity: 1, duration: 22, ease: 'none' }, 10);

    tl.to(maskProxy, {
      size: 1320,
      ease: 'none',
      duration: 42,
      onUpdate() {
        applyMaskSize(maskProxy.size);
      },
    }, 0);

    tl.to(fullbleedUI, { opacity: 1, duration: 12, ease: 'power1.inOut' }, 28);
    tl.to(carouselBg, { opacity: 1, duration: 18, ease: 'power1.inOut' }, 42);
    tl.to(fullbleedUI, { opacity: 0, duration: 12, ease: 'power1.inOut' }, 48);

    tl.to(imageWrapper, {
      left: function () { return getCardRectInsideSection().left; },
      top: function () { return getCardRectInsideSection().top; },
      width: function () { return getCardRectInsideSection().width; },
      height: function () { return getCardRectInsideSection().height; },
      borderRadius: '14px',
      boxShadow: '0 16px 60px rgba(0,0,0,0.8)',
      ease: 'power2.inOut',
      duration: 40,
    }, 48);

    tl.to(secondCard, { opacity: 0.5, x: '0%', duration: 30, ease: 'power2.out' }, 62);
    tl.to(heading, { opacity: 1, y: 0, duration: 28, ease: 'power2.out' }, 82);
    tl.to(controls, { opacity: 1, y: 0, duration: 24, ease: 'power2.out' }, 92);

    tl.to(carouselShell, { opacity: 1, y: 0, duration: 30, ease: 'power2.out' }, 106);
    tl.to(secondCard, { opacity: 0, duration: 14, ease: 'power2.out' }, 120);
    tl.to(imageWrapper, { opacity: 0, duration: 14, ease: 'power2.out' }, 124);

    ScrollTrigger.addEventListener('refreshInit', function () {
      setCarouselInteractive(false);
    });

    window.addEventListener('touchcancel', function () {
      revealSnapFired = false;
      releaseRevealScrollLock(false);
    }, { passive: true });
  } catch (err) {
    console.warn('Campus reveal animation failed to initialize:', err);
    if (typeof gsap !== 'undefined') {
      applyReducedMotionState();
    }
  }
})();