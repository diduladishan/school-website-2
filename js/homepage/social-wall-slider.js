(function () {
  const track = document.getElementById("socialWallTrack");
  if (!track) return;

  // ── 1. item_1.png cards open google.com in a new tab ──────────────────────
  // track.querySelectorAll(".social-wall__card--hero").forEach((card) => {
  //   card.href = "https://www.google.com";
  //   card.target = "_blank";
  //   card.rel = "noopener noreferrer";
  // });

  // ── 2 & 3. Auto-scroll + drag ─────────────────────────────────────────────
  const grid = track.querySelector(".social-wall__grid");
  const SPEED = 60; // px per second
  const DRAG_THRESHOLD = 5; // px

  let offset = 0;
  let halfWidth = 0;
  let lastTime = null;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartOff = 0;
  let wasDrag = false; // ← the key flag

  function getHalfWidth() {
    return grid.scrollWidth / 3;
  }
  function applyOffset() {
    grid.style.transform = `translateX(${-offset}px)`;
  }

  function animate(ts) {
    if (!isDragging) {
      if (lastTime !== null) {
        offset += (SPEED * (ts - lastTime)) / 1000;
        halfWidth = getHalfWidth();
        if (offset >= halfWidth) offset -= halfWidth;
      }
      lastTime = ts;
      applyOffset();
    }
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  // ── Mouse down: start drag ────────────────────────────────────────────────
  track.addEventListener("mousedown", (e) => {
    e.preventDefault(); // stops text-selection during drag
    isDragging = true;
    wasDrag = false; // reset every new press
    dragStartX = e.clientX;
    dragStartOff = offset;
    lastTime = null;
    track.style.cursor = "grabbing";
  });

  // ── Mouse move: scroll the track ──────────────────────────────────────────
  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const delta = dragStartX - e.clientX;

    if (Math.abs(delta) > DRAG_THRESHOLD) {
      wasDrag = true; // user genuinely moved — mark as drag
    }

    offset = dragStartOff + delta;
    halfWidth = getHalfWidth();
    offset = ((offset % halfWidth) + halfWidth) % halfWidth;
    applyOffset();
  });

  // ── Mouse up: end drag, block click if it was a drag ─────────────────────
  window.addEventListener("mouseup", () => {
    if (!isDragging) return;
    isDragging = false;
    lastTime = null;
    track.style.cursor = "grab";

    if (wasDrag) {
      // Add a one-time capture listener that eats the upcoming click
      window.addEventListener(
        "click",
        (e) => {
          e.stopPropagation();
          e.preventDefault();
        },
        { capture: true, once: true },
      );
    }
  });

  track.style.cursor = "grab";
})();
