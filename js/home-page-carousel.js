(() => {
  const track = document.getElementById("wmuTrack");
  const viewport = document.getElementById("wmuViewport");
  const dotsEl = document.getElementById("wmuDots");
  const prevBtn = document.getElementById("wmuPrev");
  const nextBtn = document.getElementById("wmuNext");

  if (!track || !viewport || !dotsEl || !prevBtn || !nextBtn) return;

  /* ----------------------------------
     INITIAL SETUP
  ---------------------------------- */

  const originalCards = Array.from(
    track.querySelectorAll(".what-make-us-unique__card"),
  );

  const total = originalCards.length;
  if (total === 0) return;

  // Clone first & last for infinite effect
  const firstClone = originalCards[0].cloneNode(true);
  const lastClone = originalCards[total - 1].cloneNode(true);

  track.appendChild(firstClone);
  track.insertBefore(lastClone, originalCards[0]);

  const cards = Array.from(
    track.querySelectorAll(".what-make-us-unique__card"),
  );

  let current = 1; // start on first REAL slide
  let autoplayInterval = null;
  let startX = 0;
  let isDragging = false;
  let dragOffsetX = 0;
  let baseOffsetX = 0;

  function getGap() {
    const styles = getComputedStyle(track);
    return parseInt(styles.gap) || 0;
  }

  function getCardWidth() {
    return cards[0].offsetWidth;
  }

  function getBaseOffset(index) {
    const gap = getGap();
    const cardWidth = getCardWidth();
    const viewportWidth = viewport.offsetWidth;
    const centerOffset = (viewportWidth - cardWidth) / 2;
    return index * (cardWidth + gap) - centerOffset;
  }

  function updatePosition(animate = true) {
    const offset = getBaseOffset(current);

    track.style.transition = animate
      ? "transform 0.55s cubic-bezier(0.65, 0, 0.35, 1)"
      : "none";

    track.style.transform = `translateX(-${offset}px)`;
  }

  /* ----------------------------------
     BUILD DOTS
  ---------------------------------- */

  originalCards.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "what-make-us-unique__dot";
    dot.setAttribute("aria-label", `Slide ${i + 1}`);
    dot.addEventListener("click", () => goTo(i + 1));
    dotsEl.appendChild(dot);
  });

  const dots = Array.from(dotsEl.querySelectorAll(".what-make-us-unique__dot"));

  function updateActive() {
    cards.forEach((card) => card.classList.remove("is-active"));
    dots.forEach((dot) => dot.classList.remove("is-active"));

    cards[current].classList.add("is-active");

    let realIndex = current - 1;
    if (realIndex < 0) realIndex = total - 1;
    if (realIndex >= total) realIndex = 0;

    dots[realIndex].classList.add("is-active");
  }

  /* ----------------------------------
     GO TO SLIDE
  ---------------------------------- */

  function goTo(index) {
    current = index;
    updatePosition(true);
    updateActive();
  }

  /* ----------------------------------
     HANDLE INFINITE RESET
  ---------------------------------- */

  track.addEventListener("transitionend", () => {
    if (current === 0) {
      current = total;
      updatePosition(false);
    }

    if (current === total + 1) {
      current = 1;
      updatePosition(false);
    }

    updateActive();
  });

  /* ----------------------------------
     BUTTON EVENTS
  ---------------------------------- */

  prevBtn.addEventListener("click", () => goTo(current - 1));
  nextBtn.addEventListener("click", () => goTo(current + 1));

  /* In-card arrow clicks */
  // track.addEventListener("click", (e) => {
  //   const arrowBtn = e.target.closest(".what-make-us-unique__card-arrow");
  //   if (arrowBtn) goTo(current + 1);
  // });

  /* ----------------------------------
     LIVE DRAG / SWIPE
  ---------------------------------- */

  // Prevent click firing after a drag
  let wasDragging = false;

  function onDragStart(clientX) {
    isDragging = true;
    wasDragging = false;
    startX = clientX;
    baseOffsetX = getBaseOffset(current);
    dragOffsetX = 0;

    // Disable transition so track follows finger instantly
    track.style.transition = 'none';
    stopAutoplay();
  }

  function onDragMove(clientX) {
    if (!isDragging) return;

    dragOffsetX = clientX - startX;

    // Add resistance at the edges (first and last real slide)
    const isAtStart = current === 1 && dragOffsetX > 0;
    const isAtEnd = current === total && dragOffsetX < 0;
    if (isAtStart || isAtEnd) {
      dragOffsetX = dragOffsetX * 0.3; // rubber-band resistance
    }

    if (Math.abs(dragOffsetX) > 5) {
      wasDragging = true;
    }

    track.style.transform = `translateX(${-(baseOffsetX - dragOffsetX)}px)`;
  }

  function onDragEnd(clientX) {
    if (!isDragging) return;
    isDragging = false;

    const dx = clientX - startX;
    const cardWidth = getCardWidth();
    const threshold = cardWidth * 0.2; // 20% of card width to trigger slide change

    if (Math.abs(dx) > threshold) {
      dx < 0 ? goTo(current + 1) : goTo(current - 1);
    } else {
      // Snap back to current slide
      goTo(current);
    }

    startAutoplay();
  }

  /* ── Pointer events (covers mouse + touch + stylus) ── */
/* ── Pointer events ── */
  track.addEventListener("pointerdown", (e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    
    // Don't capture yet, just record the start
    onDragStart(e.clientX);
  });

 track.addEventListener("pointermove", (e) => {
    if (!isDragging) return;

    const currentX = e.clientX;
    const diff = Math.abs(currentX - startX);

    // Only capture and start moving if the movement is significant
    if (diff > 5) {
      track.setPointerCapture(e.pointerId);
      onDragMove(currentX);
    }
  });

  track.addEventListener("pointerup", (e) => {
    onDragEnd(e.clientX);
  });

  track.addEventListener("pointercancel", () => {
    if (!isDragging) return;
    isDragging = false;
    goTo(current); // snap back
    startAutoplay();
  });

  // Prevent click on cards after a drag
  track.addEventListener("click", (e) => {
    if (wasDragging) {
      e.stopPropagation();
      e.preventDefault();
      wasDragging = false;
    }
  }, true);

  // Prevent browser default image drag
  track.addEventListener("dragstart", (e) => e.preventDefault());

  /* ----------------------------------
     AUTOPLAY
  ---------------------------------- */

  function startAutoplay() {
    stopAutoplay();
    autoplayInterval = setInterval(() => {
      goTo(current + 1);
    }, 5000);
  }

  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }

  track.addEventListener("mouseenter", stopAutoplay);
  track.addEventListener("mouseleave", () => {
    if (!isDragging) startAutoplay();
  });

  document.addEventListener("visibilitychange", () => {
    document.hidden ? stopAutoplay() : startAutoplay();
  });

  /* ----------------------------------
     RESIZE SUPPORT
  ---------------------------------- */

  window.addEventListener("resize", () => {
    updatePosition(false);
  });

  /* ----------------------------------
     INIT
  ---------------------------------- */

  updatePosition(false);
  updateActive();
  startAutoplay();

  /* ----------------------------------
     GLOBAL HELPERS — called by campus reveal
     so the carousel is frozen on slide 1
     during the entire zoom animation, then
     snapped back cleanly when it lands
  ---------------------------------- */

  // Stop autoplay and snap to slide 1 (called as soon as reveal section enters)
  window.wmuStopAutoplay = function () {
    stopAutoplay();
    current = 1;
    updatePosition(false);
    updateActive();
  };

  // Reset to slide 1 and restart autoplay (called when reveal animation completes)
  window.wmuResetToFirst = function () {
    stopAutoplay();
    current = 1;
    updatePosition(false);
    updateActive();
    startAutoplay();
  };
})();