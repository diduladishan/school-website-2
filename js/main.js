// Bind to window.jQuery so this file works even if another script replaced global `$`
// (e.g. jQuery.noConflict()). Slick and the code below expect `$` to be jQuery.
var $ = window.jQuery;
if (!$ || typeof $.fn === "undefined" || typeof $.fn.ready !== "function") {
  throw new Error(
    "main.js requires jQuery: load jquery before main.js (window.jQuery missing or invalid).",
  );
}

// About our team JS & CTA button animation JS
$(document).ready(function() {

  // Button Animation for multiple buttons
  const buttons = document.querySelectorAll(".cta-button-wrapper");

  buttons.forEach((btn) => {
    const path = btn.querySelector(".cta-outline");
    const bgPath = btn.querySelector(".button-path-bg");

    if (!path || typeof path.getTotalLength !== "function") return;

    const length = path.getTotalLength();

    path.style.strokeDasharray = String(length);
    path.style.strokeDashoffset = "0"; // visible by default

    if (bgPath) {
      bgPath.style.transformBox = "fill-box";
      bgPath.style.transformOrigin = "center";
      bgPath.style.transition = "transform 600ms ease";
      bgPath.style.transform = "rotate(0deg)";
    }

    function replay() {
      // reset animation
      path.style.animation = "none";

      // instantly hide
      path.style.strokeDashoffset = String(length);

      // force reflow
      void path.getBoundingClientRect();

      // start drawing
      path.style.animation =
        "draw 2.0s cubic-bezier(0.33, 0.5, 0.2, 1) forwards";
    }

    btn.addEventListener("pointerenter", () => {
      replay();
      if (bgPath) bgPath.style.transform = "rotate(8deg)";
    });

    btn.addEventListener("pointerleave", () => {
      if (bgPath) bgPath.style.transform = "rotate(0deg)";
    });
  });

var testimonialSlider = $('#testimonial_wrap');

testimonialSlider.slick({
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2000,
  infinite: true,
  arrows: true,
  fade: false,
  speed: 400,
  dots: true,
  appendDots: $('.testimonial_dots2'),
  prevArrow: $('.testimonial_prev2'),
  nextArrow: $('.testimonial_next2'),
  customPaging: function(slider, i) {
    return '<button type="button" class="custom-dot"></button>';
  },
  responsive: [{
    breakpoint: 768,
    settings: {
      dots: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true
    }
  }]
});

  const tabs = document.querySelectorAll(".our_team_tab_section .admission-pill-nav__btn");
    const contents = document.querySelectorAll(".tab_content");

    tabs.forEach(tab => {
      tab.addEventListener("click", function () {
        tabs.forEach(btn => btn.classList.remove("active_tab"));
        contents.forEach(content => content.classList.remove("tab_active"));
        this.classList.add("active_tab");
        const tabId = this.getAttribute("data-tab");
        document.getElementById(tabId).classList.add("tab_active");
      });
    });

  if ($(window).width() < 768) {
    var our_team_mobile_slider = $('#our_team_mobile_slider');
    our_team_mobile_slider.slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2000,
      infinite: true,
      arrows: true,
      fade: false,
      speed: 400,
      dots: true,
      appendDots: $('.our_team_testimonial_dots'),
      prevArrow: $('.our_team_testimonial_prev'),
      nextArrow: $('.our_team_testimonial_next'),
      customPaging: function(slider, i) {
        return '<button type="button" class="custom-dot"></button>';
      },
      responsive: [{
        breakpoint: 768,
        settings: {
          dots: true,
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: true
        }
      }]
    });


    var senior_team_mobile_slider = $('#senior_team_mobile_slider');
    senior_team_mobile_slider.slick({
     slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2000,
      infinite: true,
      arrows: true,
      fade: false,
      speed: 400,
      dots: true,
      appendDots: $('.senior_team_testimonial_dots'),
      prevArrow: $('.senior_team_testimonial_prev'),
      nextArrow: $('.senior_team_testimonial_next'),
      customPaging: function(slider, i) {
        return '<button type="button" class="custom-dot"></button>';
      },
      responsive: [{
        breakpoint: 768,
        settings: {
          dots: true,
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: true
        }
      }]
    });


    var senior_leadership_mobile_slider = $('#senior_leadership_mobile_slider');
    senior_leadership_mobile_slider.slick({
       slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2000,
      infinite: true,
      arrows: true,
      fade: false,
      speed: 400,
      dots: true,
      appendDots: $('.senior_leadership_testimonial_dots'),
      prevArrow: $('.senior_leadership_testimonial_prev'),
      nextArrow: $('.senior_leadership_testimonial_next'),
      customPaging: function(slider, i) {
        return '<button type="button" class="custom-dot"></button>';
      },
      responsive: [{
        breakpoint: 768,
        settings: {
          dots: true,
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: true
        }
      }]
    });
  }

});

// Academic basit JS — Well-being practice smooth auto-scroll (looping)
document.addEventListener("DOMContentLoaded", function () {
  const container = document.querySelector(".wellbeing-practice__images");
  if (!container) return;

  // Avoid "smooth" scroll interpolation fighting our animation.
  container.style.scrollBehavior = "auto";

  let isPaused = false;
  let rafId = null;
  let lastTs = null;

  // Duplicate items once to allow seamless wrap without a visible jump.
  const children = Array.from(container.children);
  if (children.length > 0 && !container.dataset.autoloopReady) {
    const originalScrollWidth = container.scrollWidth;
    children.forEach((el) => container.appendChild(el.cloneNode(true)));
    container.dataset.autoloopReady = "1";
    // Store the original width so we can wrap precisely.
    container.dataset.autoloopWidth = String(originalScrollWidth);
  }

  const getLoopWidth = () => Number(container.dataset.autoloopWidth || 0);

  const pause = () => {
    isPaused = true;
  };
  const resume = () => {
    isPaused = false;
  };

  container.addEventListener("mouseenter", pause);
  container.addEventListener("mouseleave", resume);
  container.addEventListener("touchstart", pause, { passive: true });
  container.addEventListener("touchend", function () {
    setTimeout(resume, 2000);
  }, { passive: true });

  // Speed in px/sec (tuned to match old setInterval feel, but smoother)
  const SPEED = 60;

  const tick = (ts) => {
    if (lastTs == null) lastTs = ts;
    const dt = Math.min(0.05, (ts - lastTs) / 1000); // clamp to avoid large jumps
    lastTs = ts;

    if (!isPaused) {
      const loopWidth = getLoopWidth();
      if (loopWidth > 0) {
        container.scrollLeft += SPEED * dt;
        // Wrap by the original width (content is duplicated, so visuals match).
        if (container.scrollLeft >= loopWidth) {
          container.scrollLeft -= loopWidth;
        }
      }
    }

    rafId = requestAnimationFrame(tick);
  };

  rafId = requestAnimationFrame(tick);

  window.addEventListener("beforeunload", function () {
    if (rafId) cancelAnimationFrame(rafId);
  });
});


// Admission age calculator calendar JS
// Admission age calculator calendar JS
(function () {
  // Determine if current page is Arabic
const isArabic =
  (document.documentElement.lang || "").toLowerCase().startsWith("ar") ||
  document.documentElement.dir === "rtl" ||
  document.body.classList.contains("arabic-page") ||
  document.body.classList.contains("arabic_page") ||
  !!document.querySelector(".admission-age-cut-off-calculator-arabic") ||
  !!document.querySelector("[dir='rtl']");

  const MONTHS = isArabic ? [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر"
  ] : [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const popup = document.getElementById("ag-cal-popup");
  const input = document.getElementById("ag-dob-input");
  const daysEl = document.getElementById("ag-cal-days");
  const monthSel = document.getElementById("ag-cal-month");
  const yearSel = document.getElementById("ag-cal-year");

  if (!popup || !input || !daysEl || !monthSel || !yearSel) return;

  let viewYear = new Date().getFullYear() - 20;
  let viewMonth = 0;
  let selectedDate = null,
    pendingDate = null;

  MONTHS.forEach((m, i) => {
    const o = document.createElement("option");
    o.value = i;
    o.textContent = m;
    monthSel.appendChild(o);
  });
  const curYear = new Date().getFullYear();
  for (let y = curYear; y >= 1940; y--) {
    const o = document.createElement("option");
    o.value = y;
    o.textContent = y;
    yearSel.appendChild(o);
  }

  function renderCalendar() {
    monthSel.value = viewMonth;
    yearSel.value = viewYear;
    daysEl.innerHTML = "";
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const today = new Date();

    for (let i = 0; i < offset; i++) {
      const el = document.createElement("button");
      el.className = "ag-cal-day empty";
      daysEl.appendChild(el);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const el = document.createElement("button");
      el.className = "ag-cal-day";
      el.textContent = d;
      if (
        today.getFullYear() === viewYear &&
        today.getMonth() === viewMonth &&
        today.getDate() === d
      )
        el.classList.add("today");
      if (
        pendingDate &&
        pendingDate.y === viewYear &&
        pendingDate.m === viewMonth &&
        pendingDate.d === d
      )
        el.classList.add("selected");
      el.addEventListener("click", () => {
        pendingDate = { y: viewYear, m: viewMonth, d };
        selectedDate = { ...pendingDate };
        const dd = String(d).padStart(2, "0");
        const mm = String(viewMonth + 1).padStart(2, "0");
        input.value = `${dd}/${mm}/${viewYear}`;
        renderCalendar();
        popup.classList.remove("open");
      });
      daysEl.appendChild(el);
    }
  }

  input.addEventListener("click", () => {
    const d = selectedDate || pendingDate;
    if (d) {
      viewYear = d.y;
      viewMonth = d.m;
      pendingDate = { ...d };
    }
    renderCalendar();
    popup.classList.add("open");
  });

  const calCancel = document.getElementById("ag-cal-cancel");
  const calSet = document.getElementById("ag-cal-set");
  const calPrev = document.getElementById("ag-cal-prev");
  const calNext = document.getElementById("ag-cal-next");
  if (calCancel) {
    calCancel.addEventListener("click", (e) => {
      e.stopPropagation();
      pendingDate = null;
      popup.classList.remove("open");
    });
  }
  if (calSet) {
    calSet.addEventListener("click", (e) => {
      e.stopPropagation();
      if (pendingDate) {
        selectedDate = { ...pendingDate };
        const dd = String(selectedDate.d).padStart(2, "0");
        const mm = String(selectedDate.m + 1).padStart(2, "0");
        input.value = `${dd}/${mm}/${selectedDate.y}`;
      }
      popup.classList.remove("open");
    });
  }
  if (calPrev) {
    calPrev.addEventListener("click", () => {
      viewMonth--;
      if (viewMonth < 0) {
        viewMonth = 11;
        viewYear--;
      }
      renderCalendar();
    });
  }
  if (calNext) {
    calNext.addEventListener("click", () => {
      viewMonth++;
      if (viewMonth > 11) {
        viewMonth = 0;
        viewYear++;
      }
      renderCalendar();
    });
  }
  monthSel.addEventListener("change", () => {
    viewMonth = +monthSel.value;
    renderCalendar();
  });
  yearSel.addEventListener("change", () => {
    viewYear = +yearSel.value;
    renderCalendar();
  });

  document.addEventListener("click", (e) => {
    const inputWrap = input.closest(".ag-calculator__input-wrap");
    if (inputWrap && !inputWrap.contains(e.target)) popup.classList.remove("open");
  });

})();

// Beyond the classroom JS
$(document).ready(function() {
  const tabs = document.querySelectorAll(".cultural_event_inner_tabs .admission-pill-nav__btn");
  const contents = document.querySelectorAll(".cultural_events_cards");

  tabs.forEach(tab => {
      tab.addEventListener("click", function (e) {
          e.preventDefault();
          const tabId = this.getAttribute("data-tab");

          if (!tabId) return;

          const activeTab = document.getElementById(tabId);
          if (!activeTab) return;

          tabs.forEach(btn => btn.classList.remove("admission-pill-nav__btn--active"));
          contents.forEach(content => content.classList.remove("cultural_events_cards_active"));

          this.classList.add("admission-pill-nav__btn--active");
          activeTab.classList.add("cultural_events_cards_active");

          // Active tab visible on mobile
          this.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest"
          });

          // Start each selected columns row from first card.
          activeTab.scrollTo({ left: 0, behavior: "smooth" });
      });
  });

});

// BTC pill nav JS
// Enable mouse drag-to-scroll on the horizontal Beyond the Classroom category pill nav (same as admission.js)
// On RTL (Arabic) pages, center the pill row on load/resize so pillars are not cut off.
(function () {
  const slider = document.querySelector('.btc-pill-nav-wrap');
  if (!slider) return;

  const isRtl = document.documentElement.dir === 'rtl' || document.documentElement.getAttribute('lang') === 'ar' || slider.closest('.arabic-page');

  function centerPillNavScroll() {
    if (!isRtl) return;
    const maxScroll = slider.scrollWidth - slider.clientWidth;
    if (maxScroll <= 0) return;
    const half = maxScroll / 2;
    const rtl = window.getComputedStyle(slider).direction === 'rtl';
    // RTL scrollLeft varies by browser (positive or negative); try both so center is visible
    requestAnimationFrame(function () {
      slider.scrollLeft = rtl ? -half : half;
      if (slider.scrollWidth - slider.clientWidth > 0 && Math.abs(slider.scrollLeft) < 2) {
        slider.scrollLeft = half;
      }
    });
  }

  if (isRtl) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', centerPillNavScroll);
    } else {
      centerPillNavScroll();
    }
    window.addEventListener('resize', centerPillNavScroll);
  }

  let isDown = false;
  let startX;
  let scrollLeft;

  slider.addEventListener('mousedown', (event) => {
    isDown = true;
    slider.classList.add('is-dragging');
    startX = event.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  ['mouseleave', 'mouseup'].forEach((eventName) => {
    slider.addEventListener(eventName, () => {
      isDown = false;
      slider.classList.remove('is-dragging');
    });
  });

  slider.addEventListener('mousemove', (event) => {
    if (!isDown) return;
    event.preventDefault();
    const x = event.pageX - slider.offsetLeft;
    const walk = x - startX;
    slider.scrollLeft = scrollLeft - walk;
  });
})();

// Campus overview JS
(function () {
  // Collect all cards once the DOM is ready
  const cards = Array.from(
    document.querySelectorAll(".cf-world-class-education__card"),
  );
  const lightbox = document.getElementById("cf-lightbox");
  const lightboxImg = document.getElementById("cf-lightbox-img");
  const caption = document.getElementById("cf-lightbox-caption");
  const counter = document.getElementById("cf-lightbox-counter");

  let currentIndex = 0;

  // Build a data array from the cards
  function getItems() {
    return cards.map((card) => ({
      src: card.querySelector("img").src,
      alt: card.querySelector("img").alt || "",
      label:
        card.querySelector(".cf-item-description")?.textContent.trim() || "",
    }));
  }

  window.openLightbox = function (index) {
    currentIndex = index;
    renderImage();
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden"; // prevent background scroll
    lightbox.focus();
  };

  window.closeLightbox = function () {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
  };

  window.changeImage = function (direction) {
  const items = getItems();

  // Pick out-animation based on direction
  const outClass = direction === 1 ? "slide-out-left" : "slide-out-right";
  const inClass  = direction === 1 ? "slide-in-left"  : "slide-in-right";

  lightboxImg.classList.add(outClass);

  setTimeout(() => {
    lightboxImg.classList.remove(outClass);
    currentIndex = (currentIndex + direction + items.length) % items.length;
    renderImage(inClass);
  }, 220); // matches animation duration
};

function renderImage(inClass) {
  const items = getItems();
  const item = items[currentIndex];

  lightboxImg.src = item.src;
  lightboxImg.alt = item.alt;
  caption.textContent = item.label;
  counter.textContent = `${currentIndex + 1} / ${items.length}`;

  if (inClass) {
    lightboxImg.classList.add(inClass);
    lightboxImg.addEventListener(
      "animationend",
      () => lightboxImg.classList.remove(inClass),
      { once: true }
    );
  }
}

  // Keyboard support
  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") changeImage(-1);
    if (e.key === "ArrowRight") changeImage(1);
  });
})();

// School bus meeting carousel JS
(function () {
  var track = document.getElementById("sbMeetingTrack");
  var viewport = document.getElementById("sbMeetingViewport");
  var prevBtn = document.getElementById("sbMeetingPrev");
  var nextBtn = document.getElementById("sbMeetingNext");

  if (!track || !viewport) return;

  var slides = track.querySelectorAll(".sb-meeting-carousel__slide");
  var total = slides.length;
  if (total === 0) return;

  var current = 0;
  var dragging = false;
  var startX = 0;
  var pointerId = null;

  function goTo(index) {
    current = ((index % total) + total) % total;
    track.style.transform = "translateX(-" + current * 100 + "%)";
    for (var i = 0; i < slides.length; i++) {
      slides[i].classList.toggle("is-active", i === current);
    }
  }

  function next() {
    goTo(current + 1);
  }

  function prev() {
    goTo(current - 1);
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      next();
    });
    nextBtn.type = "button";
  }
  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      prev();
    });
    prevBtn.type = "button";
  }

  viewport.addEventListener(
    "pointerdown",
    function (e) {
      if (e.button !== undefined && e.button !== 0) return;
      dragging = true;
      startX = e.clientX;
      pointerId = e.pointerId;
      try {
        viewport.setPointerCapture(pointerId);
      } catch (err) {
        /* ignore */
      }
    },
    { passive: true },
  );

  function endDrag(clientX, pid) {
    if (!dragging) return;
    dragging = false;
    var dx = clientX - startX;
    var threshold = Math.min(48, viewport.offsetWidth * 0.12);
    if (dx < -threshold) next();
    else if (dx > threshold) prev();
    if (pid != null) {
      try {
        viewport.releasePointerCapture(pid);
      } catch (err) {
        /* ignore */
      }
    }
    pointerId = null;
  }

  viewport.addEventListener("pointerup", function (e) {
    endDrag(e.clientX, e.pointerId);
  });
  viewport.addEventListener("pointercancel", function () {
    dragging = false;
    pointerId = null;
  });

  viewport.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    }
  });

  goTo(0);
})();

// Student stories JS
(function () {
  function initCarousel(options) {
    var viewport = document.getElementById(options.viewportId);
    var track = document.getElementById(options.trackId);
    var prevBtn = document.getElementById(options.prevId);
    var nextBtn = document.getElementById(options.nextId);
    var dotsContainer = document.getElementById(options.dotsId);
    var slideSelector = options.slideSelector;

    if (!viewport || !track) return;

    var slides = track.querySelectorAll(slideSelector);
    var total = slides.length;
    if (total === 0) return;

    var current = 0;

    function updateSlides() {
      for (var i = 0; i < slides.length; i++) {
        slides[i].classList.toggle("is-active", i === current);
      }
    }

    function updateDots() {
      if (!dotsContainer) return;
      var dots = dotsContainer.querySelectorAll("button");
      for (var d = 0; d < dots.length; d++) {
        dots[d].classList.toggle("is-active", d === current);
        dots[d].setAttribute("aria-current", d === current ? "true" : "false");
      }
    }

    function goTo(index) {
      current = (index + total) % total;
      var offset = -current * 100;
      track.style.transform = "translateX(" + offset + "%)";
      updateSlides();
      updateDots();
    }

    if (dotsContainer && total > 0) {
      dotsContainer.innerHTML = "";
      for (var j = 0; j < total; j++) {
        (function (idx) {
          var dot = document.createElement("button");
          dot.type = "button";
          dot.setAttribute("aria-label", "Go to slide " + (idx + 1));
          dot.addEventListener("click", function () {
            goTo(idx);
          });
          dotsContainer.appendChild(dot);
        })(j);
      }
    }

    if (prevBtn) prevBtn.addEventListener("click", function () { goTo(current - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { goTo(current + 1); });

    goTo(0);
  }

  /**
   * Alumni carousel: same behavior as home / campus “What makes us unique”
   * (centered active slide, peek, clones, gap-aware translate).
   */
  function initAlumniPeekCarousel() {
    var track = document.getElementById("ssAlumniTrack");
    var viewport = document.getElementById("ssAlumniViewport");
    var dotsEl = document.getElementById("ssAlumniDots");
    var prevBtn = document.getElementById("ssAlumniPrev");
    var nextBtn = document.getElementById("ssAlumniNext");

    if (!track || !viewport || !dotsEl || !prevBtn || !nextBtn) return;

    var originalSlides = Array.from(track.querySelectorAll(".ss-alumni__slide"));
    var total = originalSlides.length;
    if (total === 0) return;

    var firstClone = originalSlides[0].cloneNode(true);
    var lastClone = originalSlides[total - 1].cloneNode(true);

    track.appendChild(firstClone);
    track.insertBefore(lastClone, originalSlides[0]);

    var slides = Array.from(track.querySelectorAll(".ss-alumni__slide"));

    var current = 1;
    var autoplayInterval = null;
    var startX = 0;
    var isDragging = false;

    function getGap() {
      var styles = window.getComputedStyle(track);
      return parseInt(styles.gap, 10) || 0;
    }

    function getSlideWidth() {
      return slides[0].offsetWidth;
    }

    function updatePosition(animate) {
      if (animate === undefined) animate = true;
      var gap = getGap();
      var slideW = getSlideWidth();
      var viewportWidth = viewport.offsetWidth;
      var centerOffset = (viewportWidth - slideW) / 2;
      var offset = current * (slideW + gap) - centerOffset;

      track.style.transition = animate
        ? "transform 0.55s cubic-bezier(0.65, 0, 0.35, 1)"
        : "none";
      track.style.transform = "translateX(-" + offset + "px)";
    }

    originalSlides.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "ss-alumni__dot";
      dot.setAttribute("aria-label", "Slide " + (i + 1));
      dot.addEventListener("click", function () {
        goTo(i + 1);
      });
      dotsEl.appendChild(dot);
    });

    var dots = Array.from(dotsEl.querySelectorAll(".ss-alumni__dot"));

    function updateActive() {
      slides.forEach(function (s) {
        s.classList.remove("is-active");
      });
      dots.forEach(function (d) {
        d.classList.remove("is-active");
      });

      slides[current].classList.add("is-active");

      var realIndex = current - 1;
      if (realIndex < 0) realIndex = total - 1;
      if (realIndex >= total) realIndex = 0;
      dots[realIndex].classList.add("is-active");
    }

    function goTo(index) {
      current = index;
      updatePosition(true);
      updateActive();
    }

    track.addEventListener("transitionend", function (e) {
      if (e.target !== track || e.propertyName !== "transform") return;
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

    prevBtn.addEventListener("click", function () {
      goTo(current - 1);
    });
    nextBtn.addEventListener("click", function () {
      goTo(current + 1);
    });

    track.addEventListener("click", function (e) {
      var arrowBtn = e.target.closest(".ss-alumni__card-arrow");
      if (arrowBtn) goTo(current + 1);
    });

    track.addEventListener("pointerdown", function (e) {
      startX = e.clientX;
      isDragging = true;
    });

    track.addEventListener("pointerup", function (e) {
      if (!isDragging) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 40) {
        if (dx < 0) goTo(current + 1);
        else goTo(current - 1);
      }
      isDragging = false;
    });

    track.addEventListener("pointercancel", function () {
      isDragging = false;
    });

    track.addEventListener("pointerleave", function () {
      isDragging = false;
    });

    function startAutoplay() {
      stopAutoplay();
      autoplayInterval = setInterval(function () {
        goTo(current + 1);
      }, 5000);
    }

    function stopAutoplay() {
      clearInterval(autoplayInterval);
    }

    track.addEventListener("mouseenter", stopAutoplay);
    track.addEventListener("mouseleave", startAutoplay);

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stopAutoplay();
      else startAutoplay();
    });

    window.addEventListener("resize", function () {
      updatePosition(false);
    });

    updatePosition(false);
    updateActive();
    startAutoplay();
  }

  initCarousel({
    viewportId: "ssFeatViewport",
    trackId: "ssFeatTrack",
    prevId: "ssFeatPrev",
    nextId: "ssFeatNext",
    dotsId: "ssFeatDots",
    slideSelector: ".ss-featured__slide",
  });

  initAlumniPeekCarousel();
})();

// Top achiever testimonials JS
(function () {
  function mountSlider(root) {
    if (!root) return;
    var track = root.querySelector("[data-tat-track]");
    var slides = root.querySelectorAll("[data-tat-slide]");
    var prev = root.querySelector("[data-tat-prev]");
    var next = root.querySelector("[data-tat-next]");
    var dotsWrap = root.querySelector("[data-tat-dots]");
    var sliderId = root.getAttribute("data-tat-slider-id");
    var externalControls = sliderId
      ? document.querySelector('[data-tat-slider-controls="' + sliderId + '"]')
      : null;

    if (externalControls) {
      prev = prev || externalControls.querySelector("[data-tat-prev]");
      next = next || externalControls.querySelector("[data-tat-next]");
      dotsWrap = dotsWrap || externalControls.querySelector("[data-tat-dots]");
    }
    if (!track || !slides.length) return;

    var i = 0;
    var n = slides.length;

    function go(idx) {
      i = (idx + n) % n;
      track.style.transform = "translateX(-" + i * 100 + "%)";
      if (dotsWrap) {
        var dots = dotsWrap.querySelectorAll("button[data-tat-dot]");
        for (var d = 0; d < dots.length; d++) {
          var on = d === i;
          dots[d].setAttribute("aria-current", on ? "true" : "false");
          dots[d].classList.toggle("is-active", on);
        }
      }
    }

    if (prev) prev.addEventListener("click", function () { go(i - 1); });
    if (next) next.addEventListener("click", function () { go(i + 1); });

    if (dotsWrap && !dotsWrap.querySelector("[data-tat-dot]")) {
      for (var k = 0; k < n; k++) {
        (function (idx) {
          var b = document.createElement("button");
          b.type = "button";
          b.setAttribute("data-tat-dot", "");
          b.setAttribute("aria-label", "Go to slide " + (idx + 1));
          if (idx === 0) {
            b.setAttribute("aria-current", "true");
            b.classList.add("is-active");
          }
          b.addEventListener("click", function () { go(idx); });
          dotsWrap.appendChild(b);
        })(k);
      }
    } else if (dotsWrap) {
      var existing = dotsWrap.querySelectorAll("button[data-tat-dot]");
      existing.forEach(function (btn, idx) {
        btn.addEventListener("click", function () { go(idx); });
      });
    }

    go(0);
  }

  document.querySelectorAll("[data-tat-student-slider]").forEach(function (el) {
    mountSlider(el);
  });
  mountSlider(document.querySelector("[data-tat-staff-slider]"));
})();

// Tuition Fees page: accordion – click anywhere on the item to open/close JS
// Tuition Fees page: accordion – click anywhere on the item to open/close
(function () {
  function closeItem(item) {
    var trigger = item.querySelector('.tf-accordion__trigger');
    if (!trigger) return;
    var panelId = trigger.getAttribute('aria-controls');
    var panel = panelId ? document.getElementById(panelId) : null;
    trigger.setAttribute('aria-expanded', 'false');
    if (panel) panel.hidden = true;
    item.classList.remove('tf-accordion__item--open');
  }

  function openItem(item) {
    var trigger = item.querySelector('.tf-accordion__trigger');
    if (!trigger) return;
    var panelId = trigger.getAttribute('aria-controls');
    var panel = panelId ? document.getElementById(panelId) : null;
    trigger.setAttribute('aria-expanded', 'true');
    if (panel) panel.hidden = false;
    item.classList.add('tf-accordion__item--open');
  }

  function toggleItem(item, accordionRoot) {
    var trigger = item.querySelector('.tf-accordion__trigger');
    if (!trigger) return;
    var panelId = trigger.getAttribute('aria-controls');
    var panel = panelId ? document.getElementById(panelId) : null;
    var isOpen = trigger.getAttribute('aria-expanded') === 'true';

    if (isOpen) {
      trigger.setAttribute('aria-expanded', 'false');
      if (panel) panel.hidden = true;
      item.classList.remove('tf-accordion__item--open');
    } else {
      if (accordionRoot) {
        accordionRoot.querySelectorAll('.tf-accordion__item').forEach(function (other) {
          if (other !== item) closeItem(other);
        });
      }
      trigger.setAttribute('aria-expanded', 'true');
      if (panel) panel.hidden = false;
      item.classList.add('tf-accordion__item--open');
    }
  }

  function initAccordion() {
    document.querySelectorAll('.tf-accordion').forEach(function (root) {
      root.querySelectorAll('.tf-accordion__item').forEach(function (item) {
        item.addEventListener('click', function (e) {
          if (e.target.closest('.tf-accordion__panel')) return;
          e.preventDefault();
          toggleItem(item, root);
        });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccordion);
  } else {
    initAccordion();
  }
})();

// Language switch JS
// ── Language toggle logic ──
const html = document.documentElement;
const langToggle = document.getElementById("langToggle");

// All elements that have translatable text (exclude the toggle button itself)
const translatableText = document.querySelectorAll(
  "[data-en][data-ar]:not(#langToggle)",
);

// All inputs with swappable placeholders
const placeholderInputs = document.querySelectorAll(
  "[data-placeholder-en][data-placeholder-ar]",
);

// Search input (for expand/collapse toggle)
const searchInput = document.getElementById("heroSearchInput");

let isArabic = false;

if (langToggle) {
  langToggle.addEventListener("click", () => {
    isArabic = !isArabic;

    if (isArabic) {
      // Switch to Arabic
      html.setAttribute("lang", "ar");
      langToggle.textContent = "English";

      translatableText.forEach((el) => {
        el.innerHTML = el.dataset.ar;
      });

      // Swap ALL placeholders to Arabic
      placeholderInputs.forEach((el) => {
        el.placeholder = el.dataset.placeholderAr;
      });
    } else {
      // Switch back to English
      html.setAttribute("lang", "en");
      langToggle.textContent = "العربية";

      translatableText.forEach((el) => {
        el.innerHTML = el.dataset.en;
      });

      // Swap ALL placeholders back to English
      placeholderInputs.forEach((el) => {
        el.placeholder = el.dataset.placeholderEn;
      });
    }
  });
}

// Hero search + video controls are initialized later (DOMContentLoaded block)
// to avoid double-binding when this file is bundled/concatenated.



// Admission JS
// Classic script (no type="module" on the page). Country/city data loads via dynamic import()
// only on the Apply Now page when needed — same library, no static import.

// Enable mouse drag-to-scroll on the horizontal admission pills nav
// Horizontal drag scroll for admission pill nav (works in both LTR and RTL)
(function () {
  var sliders = document.querySelectorAll(".admission-pill-nav-wrap");
  if (!sliders.length) return;

  sliders.forEach(function (slider) {
    var isDown = false;
    var startX;
    var scrollStart;

    slider.addEventListener("mousedown", function (event) {
      isDown = true;
      slider.classList.add("is-dragging");
      startX = event.pageX;
      scrollStart = slider.scrollLeft;
    });

    ["mouseleave", "mouseup"].forEach(function (eventName) {
      slider.addEventListener(eventName, function () {
        isDown = false;
        slider.classList.remove("is-dragging");
      });
    });

    slider.addEventListener("mousemove", function (event) {
      if (!isDown) return;
      event.preventDefault();
      var walk = event.pageX - startX;
      slider.scrollLeft = scrollStart - walk;
    });
  });
})();

// Month/year dropdown + month navigation for academic calendar
(function () {
  const wrap = document.querySelector(
    ".admission-school-timings__month-toggle-wrap"
  );
  if (!wrap) return;

  const monthLabel = document.querySelector(".admission-school-timings__month");
  const dynamicCalendarHost = document.getElementById("academicCalendar");
  const calendarTable = dynamicCalendarHost
    ? null
    : document.querySelector(".admission-calendar__table");
  const calendarBody = calendarTable
    ? calendarTable.querySelector("tbody")
    : null;
  const arrowsContainer = document.querySelector(
    ".admission-school-timings__arrows"
  );
  const arrowButtons = arrowsContainer
    ? arrowsContainer.querySelectorAll(".admission-school-timings__arrow-btn")
    : null;

  const button = wrap.querySelector(".admission-school-timings__month-toggle");
  const icon = wrap.querySelector(".admission-school-timings__month-toggle-icon");
  const dropdown = wrap.querySelector(".admission-school-timings__year-dropdown");
  if (!button || !icon || !dropdown) return;

  const yearButtons = dropdown.querySelectorAll(
    ".admission-school-timings__year-option"
  );

// Determine if current page is Arabic
const isArabicPage =
  (document.documentElement.lang || "").toLowerCase().startsWith("ar") ||
  document.documentElement.dir === "rtl" ||
  document.body.classList.contains("arabic-page") ||
  document.body.classList.contains("arabic_page") ||
  !!document.querySelector(".arabic-page") ||
  !!document.querySelector(".arabic_page");

  // Month nicknames array (English) and Arabic names
  const MONTHS_EN = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const MONTHS_AR = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];

  // Derive initial month/year from label text if possible
  let initialText = monthLabel ? monthLabel.textContent.trim() : "NOV, 2025";
  let [initialMonthToken, initialYearToken] = initialText.split(/\s+/);

  // Try to resolve initial month index from English token; if not found try Arabic; default to November (10)
  let monthIndex = (function () {
    if (!initialMonthToken) return 10;
    const token = initialMonthToken.toLowerCase().replace(",", "");
    const enIndex = MONTHS_EN.findIndex(
      (m) => m.toLowerCase() === token
    );
    if (enIndex !== -1) return enIndex;
    const arIndex = MONTHS_AR.findIndex(
      (m) => m.toLowerCase() === token
    );
    if (arIndex !== -1) return arIndex;
    return 10;
  })();

  let currentYear = parseInt(initialYearToken || "2025", 10) || 2025;
  const initialMonthIndex = monthIndex;
  const initialYear = currentYear;

  // Capture original calendar events keyed by day so they can be restored
  // when the user navigates back to the home month/year.
  const baseEventsByDay = {};
  if (calendarTable && !dynamicCalendarHost) {
    normalizeAdmissionCalendarEventElements(calendarTable);
  }
  if (calendarBody && !dynamicCalendarHost) {
    const dayNumbers = calendarBody.querySelectorAll(".admission-calendar__day-number");
    dayNumbers.forEach((dayEl) => {
      const day = parseInt(dayEl.textContent.trim(), 10);
      if (Number.isNaN(day)) return;
      const cell = dayEl.closest("td");
      if (!cell) return;
      const events = [];
      cell.querySelectorAll(".admission-calendar__event").forEach((eventEl) => {
        const textEl = eventEl.querySelector(".admission-calendar__event-text");
        events.push({
          className: eventEl.className,
          text: textEl ? textEl.textContent.trim() : "",
          title: textEl ? (textEl.getAttribute("title") || "") : "",
        });
      });
      if (events.length) {
        baseEventsByDay[day] = events;
      }
    });
  }

  const escapeHtml = (value) =>
    String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const formatDateKey = (year, monthIdx, dayNum) => {
    const m = String(monthIdx + 1).padStart(2, "0");
    const d = String(dayNum).padStart(2, "0");
    return `${year}-${m}-${d}`;
  };

  /**
   * General Events #256c9c, PD Day #7F3BD7, Resume Classes #22C55E, School Break #FF7676, Holidays = primary red.
   * Accepts CMS `category`/`type` strings or full event titles when category is missing (keyword inference).
   * Optional on HTML chips: data-event-type="holiday|general|pd|resume|break" (recommended when CMS cannot set BEM classes).
   */
  const getAdmissionCalendarEventModifier = (category) => {
    const original = String(category == null ? "" : category).trim();
    const raw = original.toLowerCase();
    const slug = raw.replace(/[\s_]+/g, "-").replace(/[^a-z0-9-]/g, "");

    if (
      !raw ||
      slug === "default" ||
      slug === "general" ||
      slug === "general-events" ||
      slug === "events" ||
      raw.includes("general event")
    ) {
      return "general";
    }
    if (
      slug === "pd-day" ||
      slug === "pd" ||
      slug === "professional-development" ||
      raw.includes("pd day") ||
      raw.includes("professional development")
    ) {
      return "pd";
    }
    if (
      slug === "resume-classes" ||
      slug === "resume" ||
      raw.includes("resume class")
    ) {
      return "resume";
    }
    if (
      slug === "school-break" ||
      slug === "break" ||
      raw.includes("school break") ||
      raw.includes("term break") ||
      raw.includes("spring break") ||
      raw.includes("winter break")
    ) {
      return "break";
    }
    if (
      slug === "holiday" ||
      slug === "holidays" ||
      slug === "public-holiday" ||
      slug === "statutory-holiday" ||
      slug === "religious-holiday" ||
      raw.includes("holiday") ||
      raw.includes("public holiday")
    ) {
      return "holiday";
    }

    /* Title-only / mixed CMS text: infer holiday when category field was omitted */
    const hay = original;
    if (
      /\b(eid|ramadan|prophet|muhamm|mohamm|pbuh|national\s+day|commemoration|islamic\s+new|union\s+day|martyr|guru\s+nanak|diwali|christmas|good\s+friday)\b/i.test(
        hay
      ) ||
      /(عيد|إجازة|إجازة\s*رسمية|مولد|النبي|ذكرى|الوطني|الشهيد|الإسراء|المعراج|رحمة\s*للعالمين|يوم\s*الوطن)/i.test(
        hay
      )
    ) {
      return "holiday";
    }

    return "general";
  };

  window.getAdmissionCalendarEventModifier = getAdmissionCalendarEventModifier;

  const EVENT_MODIFIER_LIST = ["general", "pd", "resume", "break", "holiday"];

  /** Static HTML from CMS: ensure each chip has admission-calendar__event--{type} for correct colors. */
  const normalizeAdmissionCalendarEventElements = (root) => {
    if (!root || typeof root.querySelectorAll !== "function") return;
    root.querySelectorAll(".admission-calendar__event").forEach((el) => {
      EVENT_MODIFIER_LIST.forEach((m) => {
        el.classList.remove("admission-calendar__event--" + m);
      });
      const dataCat =
        el.getAttribute("data-event-type") ||
        el.getAttribute("data-event-category") ||
        el.getAttribute("data-calendar-event-type") ||
        "";
      const textEl = el.querySelector(".admission-calendar__event-text");
      const titleHint = textEl
        ? String(
            textEl.getAttribute("title") ||
              textEl.textContent ||
              ""
          ).trim()
        : "";
      const mod = getAdmissionCalendarEventModifier(dataCat || titleHint);
      el.classList.add("admission-calendar__event--" + mod);
    });
  };

  const getGlobalCalendarEventsMap = () => {
    try {
      if (
        typeof calendarEvents !== "undefined" &&
        calendarEvents &&
        typeof calendarEvents === "object" &&
        !Array.isArray(calendarEvents)
      ) {
        return calendarEvents;
      }
    } catch (e) {
      /* global calendarEvents may be absent */
    }
    return null;
  };

  const normalizeOneKeyedEvent = (ev) => {
    if (ev == null) return null;
    if (typeof ev === "string") {
      const t = ev.trim();
      return t
        ? { title: t, category: getAdmissionCalendarEventModifier(t) }
        : null;
    }
    const title =
      ev.title || ev.name || ev.label || ev.text || "";
    if (!String(title).trim()) return null;
    const rawCat = String(
      ev.category ||
        ev.type ||
        ev.eventType ||
        ev.event_type ||
        ev.eventCategory ||
        ev.event_category ||
        ev.kind ||
        ev.tag ||
        ""
    ).trim();
    const category = rawCat
      ? getAdmissionCalendarEventModifier(rawCat)
      : getAdmissionCalendarEventModifier(title);
    return {
      title: String(title).trim(),
      category,
    };
  };

  const normalizeDayKeyedEvents = (raw) => {
    if (raw == null) return [];
    if (Array.isArray(raw)) {
      return raw.map(normalizeOneKeyedEvent).filter(Boolean);
    }
    const one = normalizeOneKeyedEvent(raw);
    return one ? [one] : [];
  };

  const createCalendarCell = (day, events) => {
    if (!day) {
      return '<td class="admission-calendar__cell--empty"></td>';
    }
    let content = '<span class="admission-calendar__day-number">' + day + '</span>';
    if (Array.isArray(events) && events.length) {
      events.forEach((eventData) => {
        const eventClass = eventData.className || "admission-calendar__event";
        const eventText = eventData.text || "";
        const eventTitle = eventData.title || eventText;
        content +=
          '<span class="' + escapeHtml(eventClass) + '">' +
          '<span class="admission-calendar__event-text" title="' + escapeHtml(eventTitle) + '">' + escapeHtml(eventText) + '</span>' +
          '</span>';
      });
    }
    return '<td>' + content + '</td>';
  };

  const createKeyedEventCalendarCell = (day, rawDayEvents) => {
    if (!day) {
      return '<td class="admission-calendar__cell--empty"></td>';
    }
    let content = '<span class="admission-calendar__day-number">' + day + "</span>";
    const list = normalizeDayKeyedEvents(rawDayEvents);
    list.forEach((ev) => {
      const mod = getAdmissionCalendarEventModifier(ev.category);
      const title = ev.title || "";
      const cls = "admission-calendar__event admission-calendar__event--" + mod;
      content +=
        '<span class="' +
        cls +
        '">' +
        '<span class="admission-calendar__event-text" title="' +
        escapeHtml(title) +
        '">' +
        escapeHtml(title) +
        "</span>" +
        "</span>";
    });
    return "<td>" + content + "</td>";
  };

  const buildDynamicCalendarTableHtml = () => {
    const eventsMap = getGlobalCalendarEventsMap();
    const firstDay = new Date(currentYear, monthIndex, 1).getDay();
    const daysInMonth = new Date(currentYear, monthIndex + 1, 0).getDate();
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

    const cells = [];
    for (let i = 0; i < totalCells; i += 1) {
      const day = i - firstDay + 1;
      if (day < 1 || day > daysInMonth) {
        cells.push(createKeyedEventCalendarCell(null, null));
      } else if (eventsMap) {
        const key = formatDateKey(currentYear, monthIndex, day);
        cells.push(createKeyedEventCalendarCell(day, eventsMap[key]));
      } else {
        cells.push(createKeyedEventCalendarCell(day, null));
      }
    }

    const rows = [];
    for (let i = 0; i < cells.length; i += 7) {
      rows.push("<tr>" + cells.slice(i, i + 7).join("") + "</tr>");
    }

    const weekdayHeaders = isArabicPage
      ? [
          "الأحد",
          "الاثنين",
          "الثلاثاء",
          "الأربعاء",
          "الخميس",
          "الجمعة",
          "السبت",
        ]
      : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const theadRow =
      "<tr>" +
      weekdayHeaders
        .map((label) => '<th scope="col">' + label + "</th>")
        .join("") +
      "</tr>";

    return (
      '<table class="admission-calendar__table" aria-label="Academic calendar">' +
      "<thead>" +
      theadRow +
      "</thead><tbody>" +
      rows.join("") +
      "</tbody></table>"
    );
  };

  const renderCalendar = () => {
    if (dynamicCalendarHost) {
      const existingTable = dynamicCalendarHost.querySelector(
        ".admission-calendar__table"
      );
      const apply = () => {
        dynamicCalendarHost.innerHTML = buildDynamicCalendarTableHtml();
        const t = dynamicCalendarHost.querySelector(".admission-calendar__table");
        if (t) t.classList.remove("admission-calendar__table--is-updating");
      };
      if (existingTable) {
        existingTable.classList.add("admission-calendar__table--is-updating");
        window.setTimeout(apply, 160);
      } else {
        apply();
      }
      return;
    }

    if (!calendarBody || !calendarTable) return;
    const firstDay = new Date(currentYear, monthIndex, 1).getDay();
    const daysInMonth = new Date(currentYear, monthIndex + 1, 0).getDate();
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
    const shouldShowBaseEvents =
      monthIndex === initialMonthIndex && currentYear === initialYear;

    const cells = [];
    for (let i = 0; i < totalCells; i += 1) {
      const day = i - firstDay + 1;
      if (day < 1 || day > daysInMonth) {
        cells.push(createCalendarCell(null));
      } else {
        const events = shouldShowBaseEvents ? baseEventsByDay[day] : null;
        cells.push(createCalendarCell(day, events));
      }
    }

    const rows = [];
    for (let i = 0; i < cells.length; i += 7) {
      rows.push("<tr>" + cells.slice(i, i + 7).join("") + "</tr>");
    }

    calendarTable.classList.add("admission-calendar__table--is-updating");
    window.setTimeout(() => {
      calendarBody.innerHTML = rows.join("");
      calendarTable.classList.remove("admission-calendar__table--is-updating");
    }, 160);
  };

  const updateMonthLabel = () => {
    if (!monthLabel) return;
    const monthNameEn = MONTHS_EN[monthIndex] || MONTHS_EN[0];

    if (isArabicPage) {
      const monthNameAr = MONTHS_AR[monthIndex] || MONTHS_AR[0];
      monthLabel.textContent = `${monthNameAr}, ${currentYear}`;
    } else {
      monthLabel.textContent = `${monthNameEn.toUpperCase()}, ${currentYear}`;
    }
  };

  const closedSrc = icon.getAttribute("data-closed-src");
  const openSrc = icon.getAttribute("data-open-src");

  const setOpen = (isOpen) => {
    if (isOpen) {
      wrap.classList.add("is-open");
      dropdown.setAttribute("aria-hidden", "false");
      if (openSrc) icon.src = openSrc;
    } else {
      wrap.classList.remove("is-open");
      dropdown.setAttribute("aria-hidden", "true");
      if (closedSrc) icon.src = closedSrc;
    }
  };

  button.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = !wrap.classList.contains("is-open");
    setOpen(isOpen);
  });

  // Close when clicking outside
  document.addEventListener("click", (event) => {
    if (!wrap.classList.contains("is-open")) return;
    if (!wrap.contains(event.target)) {
      setOpen(false);
    }
  });

  // Year selection: clicking a year updates the year while keeping month index
  yearButtons.forEach((yearBtn) => {
    yearBtn.addEventListener("click", () => {
      const value = parseInt(yearBtn.textContent.trim(), 10);
      if (!Number.isNaN(value)) {
        currentYear = value;
        updateMonthLabel();
        renderCalendar();
      }
      setOpen(false);
    });
  });

  // Arrow navigation: move through months array with wrapping
  if (arrowButtons && arrowButtons.length === 2) {
    const [prevBtn, nextBtn] = arrowButtons;

    prevBtn.addEventListener("click", () => {
      monthIndex = (monthIndex - 1 + MONTHS_EN.length) % MONTHS_EN.length;
      updateMonthLabel();
      renderCalendar();
    });

    nextBtn.addEventListener("click", () => {
      monthIndex = (monthIndex + 1) % MONTHS_EN.length;
      updateMonthLabel();
      renderCalendar();
    });
  }

  // Ensure label is normalized on load
  updateMonthLabel();
  renderCalendar();
})();

// Mobile carousel for supportive team cards (one card visible with arrows)
(function () {
  const grid = document.querySelector(".admission-supportive-team__grid");
  const prevBtn = document.querySelector(
    ".admission-supportive-team__mobile-arrow--prev"
  );
  const nextBtn = document.querySelector(
    ".admission-supportive-team__mobile-arrow--next"
  );
  if (!grid || !prevBtn || !nextBtn) return;

  const cards = Array.from(
    grid.querySelectorAll(".admission-supportive-team__card")
  );
  if (!cards.length) return;

  let index = 0;

  const setActive = (i) => {
    cards.forEach((card, idx) => {
      card.classList.toggle("is-active", idx === i);
    });
  };

  setActive(index);

  prevBtn.addEventListener("click", () => {
    index = (index - 1 + cards.length) % cards.length;
    setActive(index);
  });

  nextBtn.addEventListener("click", () => {
    index = (index + 1) % cards.length;
    setActive(index);
  });
})();

// Mobile table scroll slider for school timings table
(function () {
  const wrap = document.querySelector(".admission-school-timings__table-wrap");
  const input = document.querySelector(
    ".admission-school-timings__table-slider-input"
  );
  if (!wrap || !input) return;

  const MAX = 1000;

  const getMaxScroll = () => Math.max(0, wrap.scrollWidth - wrap.clientWidth);

  const syncInputFromScroll = () => {
    const maxScroll = getMaxScroll();
    const ratio = maxScroll === 0 ? 0 : wrap.scrollLeft / maxScroll;
    input.value = String(Math.round(ratio * MAX));
  };

  const syncScrollFromInput = () => {
    const maxScroll = getMaxScroll();
    const ratio = Number(input.value) / MAX;
    wrap.scrollLeft = ratio * maxScroll;
  };

  input.addEventListener("input", syncScrollFromInput);
  wrap.addEventListener("scroll", syncInputFromScroll, { passive: true });

  // Keep in sync when layout changes (rotation / resize)
  window.addEventListener("resize", syncInputFromScroll);

  // Initial
  syncInputFromScroll();
})();

// Documentation accordion – expand/collapse + swap arrow SVG
(function () {
  var items = document.querySelectorAll(".admission-process-docs-list__item");
  if (!items.length) return;

  items.forEach(function (item) {
    var header = item.querySelector(".admission-process-docs-list__header");
    var arrow = item.querySelector(".admission-process-docs-list__arrow");
    if (!header || !arrow) return;

    header.addEventListener("click", function () {
      var parent = item.closest(".admission-process-step__docs");
      var siblings = parent ? parent.querySelectorAll(".admission-process-docs-list__item") : [];
      siblings.forEach(function (sib) {
        if (sib !== item && sib.classList.contains("admission-process-docs-list__item--open")) {
          sib.classList.remove("admission-process-docs-list__item--open");
          var sibArrow = sib.querySelector(".admission-process-docs-list__arrow");
          if (sibArrow) sibArrow.src = sibArrow.dataset.closedSrc;
        }
      });
      var isOpen = item.classList.toggle("admission-process-docs-list__item--open");
      arrow.src = isOpen ? arrow.dataset.openSrc : arrow.dataset.closedSrc;
    });
  });
})();

// Apply Now page - stepper (Next / Back) with JS validation
(function () {
  // Fallback: add class to body if apply-now form exists but class is missing (CMS compatibility)
  if (!document.querySelector(".apply-now-page") && document.querySelector(".apply-now-form-shell")) {
    document.body.classList.add("apply-now-page");
  }
  var root = document.querySelector(".apply-now-page");
  if (!root) return;

  var stepItems = Array.from(
    root.querySelectorAll(".apply-now-steps .apply-now-steps__item")
  );
  var panels = Array.from(root.querySelectorAll(".apply-now-step-panel"));
  var nextBtn = root.querySelector(".apply-now-next-btn");
  var backBtn = root.querySelector(".apply-now-back-btn");
  var formSection = root.querySelector(".apply-now-section");
  if (!nextBtn || !backBtn || panels.length === 0 || stepItems.length === 0)
    return;

  var isArabic = document.documentElement.lang === "ar" || document.documentElement.dir === "rtl";
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var phoneRegex = /^[0-9]{7,15}$/;
  var nameRegex = /^[A-Za-z\s\u0600-\u06FF]{2,}$/;

  var errorMsgs = isArabic
    ? { required: "هذا الحقل مطلوب", email: "يرجى إدخال بريد إلكتروني صحيح", phone: "يرجى إدخال رقم هاتف صحيح", name: "يرجى إدخال اسم صحيح (حرفان على الأقل)" }
    : { required: "This field is required", email: "Please enter a valid email address", phone: "Please enter a valid phone number", name: "Please enter a valid name (at least 2 characters)" };

  function showError(field, msg) {
    clearError(field);
    field.classList.add("enquiry-field--error");
    var wrapper = field.closest(".apply-now-field") || field.parentElement;
    var el = document.createElement("span");
    el.className = "enquiry-field__error";
    el.textContent = msg;
    wrapper.appendChild(el);
  }

  function clearError(field) {
    field.classList.remove("enquiry-field--error");
    var wrapper = field.closest(".apply-now-field") || field.parentElement;
    var existing = wrapper.querySelector(".enquiry-field__error");
    if (existing) existing.remove();
  }

  function clearAllErrors() {
    root.querySelectorAll(".enquiry-field__error").forEach(function (el) { el.remove(); });
    root.querySelectorAll(".enquiry-field--error").forEach(function (el) { el.classList.remove("enquiry-field--error"); });
  }

  // Validate only fields with * in their label (required fields)
  function validatePanel(panel) {
    var fields = Array.from(panel.querySelectorAll(".apply-now-field"));
    var valid = true;

    fields.forEach(function (wrapper) {
      var label = wrapper.querySelector("label");
      if (!label || !label.textContent.includes("*")) return; // skip non-required

      var control = wrapper.querySelector("input, select, textarea");
      if (!control) return;

      clearError(control);
      var val = control.value.trim();
      var name = (control.name || "").toLowerCase();
      var type = (control.type || "").toLowerCase();

      // Empty check
      if (!val) {
        showError(control, errorMsgs.required);
        valid = false;
        return;
      }

      // Email validation
      if (type === "email" || name.includes("email")) {
        if (!emailRegex.test(val)) {
          showError(control, errorMsgs.email);
          valid = false;
          return;
        }
      }

      // Phone validation — strip non-digits, check minimum 7
      if (type === "tel" || name.includes("mobile") || name.includes("phone")) {
        var digits = val.replace(/[^0-9]/g, "");
        if (digits.length < 7) {
          showError(control, errorMsgs.phone);
          valid = false;
          return;
        }
      }

      // Name validation (firstName, lastName)
      if (name.includes("firstname") || name.includes("lastname")) {
        if (!nameRegex.test(val)) {
          showError(control, errorMsgs.name);
          valid = false;
          return;
        }
      }
    });

    return valid;
  }

  // Clear error on input/change
  root.addEventListener("input", function (e) {
    if (e.target.matches("input, select, textarea")) clearError(e.target);
  });
  root.addEventListener("change", function (e) {
    if (e.target.matches("input, select, textarea")) clearError(e.target);
  });

  // Country → city binding (hardcoded UAE)
  (function bindCountryCity() {
    var UAE_COUNTRY = isArabic
      ? { value: "AE", label: "الإمارات العربية المتحدة" }
      : { value: "AE", label: "United Arab Emirates" };

    var UAE_CITIES = isArabic
      ? ["دبي", "أبوظبي", "الشارقة", "عجمان", "رأس الخيمة", "الفجيرة", "أم القيوين", "العين"]
      : ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain", "Al Ain"];

    var populate = function (countryId, cityId) {
      var countryEl = root.querySelector(countryId);
      var cityEl = root.querySelector(cityId);
      if (!countryEl || !cityEl) return;

      countryEl.innerHTML = "";
      var countryOpt = document.createElement("option");
      countryOpt.value = UAE_COUNTRY.value;
      countryOpt.textContent = UAE_COUNTRY.label;
      countryOpt.selected = true;
      countryEl.appendChild(countryOpt);

      var cityPlaceholder = isArabic ? "اختر المدينة" : "Select City";
      cityEl.innerHTML = '<option value="" disabled selected>' + cityPlaceholder + "</option>";
      UAE_CITIES.forEach(function (name) {
        var opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
        cityEl.appendChild(opt);
      });
    };

    populate("#g1-country", "#g1-city");
    populate("#g2-country", "#g2-city");
  })();

  var setStep = function (stepNumber) {
    root.classList.toggle("apply-now-page--step-3", stepNumber === 3);
    var nextLabel = isArabic ? "التالي" : "NEXT";
    var submitLabel = isArabic ? "إرسال" : "SUBMIT";

    panels.forEach(function (p) {
      var isActive = p.getAttribute("data-step") === String(stepNumber);
      p.hidden = !isActive;
      p.classList.toggle("apply-now-step-panel--active", isActive);
    });

    stepItems.forEach(function (item, idx) {
      item.classList.toggle("apply-now-steps__item--active", idx === stepNumber - 1);
    });

    var stepsWrap = root.querySelector(".apply-now-steps");
    var activeItem = root.querySelector(".apply-now-steps__item--active");
    if (stepsWrap && activeItem && window.matchMedia("(max-width: 800px)").matches) {
      activeItem.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }

    backBtn.hidden = stepNumber === 1;
    var nextBtnLabel = nextBtn.querySelector(".cta-button-text");
    if (nextBtnLabel) {
      nextBtnLabel.textContent = stepNumber === 3 ? submitLabel : nextLabel;
    } else {
      nextBtn.textContent = stepNumber === 3 ? submitLabel : nextLabel;
    }
  };

  var currentStep = 1;
  setStep(currentStep);

  nextBtn.addEventListener("click", function () {
    var activePanel = root.querySelector(".apply-now-step-panel--active");

    // Validate current panel before proceeding
    if (activePanel && !validatePanel(activePanel)) {
      return;
    }

    if (currentStep === 1) {
      currentStep = 2;
      setStep(currentStep);
      return;
    }
    if (currentStep === 2) {
      currentStep = 3;
      setStep(currentStep);
      return;
    }

    // Step 3: submit
    applyNowSubmit();
  });

  backBtn.addEventListener("click", function () {
    clearAllErrors();
    if (currentStep === 3) { currentStep = 2; setStep(currentStep); return; }
    currentStep = 1;
    setStep(currentStep);
  });

  function collectFormData() {
    var data = {};
    panels.forEach(function (panel) {
      var controls = panel.querySelectorAll("input, select, textarea");
      controls.forEach(function (c) {
        if (c.name) data[c.name] = c.value.trim();
      });
    });
    // Prepend +971 to mobile numbers
    if (data.mobile1) data.mobile1 = "+971" + data.mobile1;
    if (data.mobile2) data.mobile2 = "+971" + data.mobile2;
    return data;
  }

  function applyNowSubmit() {
    var data = collectFormData();
    console.log("Apply Now form submitted:", data);

    var DynamicURLRegister = "/PA_Lead_Capture_Service/daralmarefaapply";
    var dataString = Object.keys(data).map(function (key) {
      return encodeURIComponent(key) + "=" + encodeURIComponent(data[key]);
    }).join("&");

    console.log("Submitting to: " + DynamicURLRegister);
    console.log("Data: " + dataString);

    // TODO: Replace with actual $.ajax call when CMS endpoint is ready
     $.ajax({
       url: DynamicURLRegister,
       method: "POST",
       data: dataString,
       contentType: "application/x-www-form-urlencoded; charset=UTF-8",
       success: function(response) {
         if (response == "SUCCESS") {
           console.log("Submitted");
           showApplyNowSuccess();
           window.dataLayer = window.dataLayer || [];
           window.dataLayer.push({ 'event': 'generate_lead' });
         } else {
           console.log("Response not successful");
         }
       },
       error: function(xhr, status, error) {
         console.log("Error: " + error + status + xhr);
       }
     });

    // Dummy success
    showApplyNowSuccess();
  }

  function showApplyNowSuccess() {
    var msg = isArabic
      ? "تم إرسال طلبك بنجاح! سنتواصل معك قريباً."
      : "Application submitted successfully! We will contact you shortly.";

    var card = root.querySelector(".apply-now-form-shell__card");
    if (card) {
      card.innerHTML =
        '<div class="enquiry-form__success" style="padding:80px 20px;">' +
        '<p class="enquiry-form__success-text">' + msg + "</p>" +
        "</div>";
    }

    formSection.scrollIntoView({ behavior: "smooth", block: "center" });
  }
})();

// Enquiry page — form validation, year dropdown, and submission
(function () {
  var root = document.querySelector(".enquiry-page");
  if (!root) return;

  var yearSelect = root.querySelector("#enquiry-year-input");
  var form = root.querySelector("#enquiry-form");

  if (!yearSelect || !form) return;

var isArabicPage =
  (document.documentElement.lang || "").toLowerCase().startsWith("ar") ||
  document.documentElement.dir === "rtl" ||
  document.body.classList.contains("arabic-page") ||
  document.body.classList.contains("arabic_page") ||
  !!document.querySelector(".arabic-page") ||
  !!document.querySelector(".arabic_page");

  // ── Populate Year of Entry dropdown: current academic year + next 2 ──
  function currentAcademicStart() {
    var today = new Date();
    // Academic year starts in September (month index 8)
    return today.getMonth() >= 8 ? today.getFullYear() : today.getFullYear() - 1;
  }

  function formatAcademicYear(startYear) {
    return startYear + "-" + String(startYear + 1).slice(-2);
  }

  (function populateYearDropdown() {
    var start = currentAcademicStart();
    yearSelect.innerHTML = "";
    for (var i = 0; i < 3; i += 1) {
      var label = formatAcademicYear(start + i);
      var opt = document.createElement("option");
      opt.value = label;
      opt.textContent = label;
      if (i === 0) opt.selected = true;
      yearSelect.appendChild(opt);
    }
  })();

  // ── intl-tel-input for phone field ──
  var enquiryPhoneInput = document.querySelector("#enquiry-phone");
  var enquiryIti = null;
  if (enquiryPhoneInput && typeof window.intlTelInput === "function") {
    enquiryIti = window.intlTelInput(enquiryPhoneInput, {
      initialCountry: "ae",
      separateDialCode: true,
      utilsScript: "./js/vendor/phone-input-util.js",
      allowDropdown: true,
      autoHideDialCode: false,
      nationalMode: false,
      countrySearch: true,
      showFlags: false
    });
  }

  // Restrict phone input to digits only (allow control keys)
  if (enquiryPhoneInput) {
    enquiryPhoneInput.addEventListener("keypress", function (e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key && e.key.length === 1 && !/[0-9]/.test(e.key)) {
        e.preventDefault();
      }
    });
    enquiryPhoneInput.addEventListener("input", function () {
      enquiryPhoneInput.value = enquiryPhoneInput.value.replace(/[^0-9]/g, "");
    });
    enquiryPhoneInput.addEventListener("paste", function (e) {
      e.preventDefault();
      var text = (e.clipboardData || window.clipboardData).getData("text") || "";
      var digits = text.replace(/[^0-9]/g, "");
      var start = enquiryPhoneInput.selectionStart || 0;
      var end = enquiryPhoneInput.selectionEnd || 0;
      var val = enquiryPhoneInput.value;
      enquiryPhoneInput.value = val.slice(0, start) + digits + val.slice(end);
    });
  }

  // ── Validation helpers ──
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{7,15}$/;
  const nameRegex = /^[A-Za-z\s\u0600-\u06FF]{2,}$/;

  const errorMessages = isArabicPage
    ? {
        name: "يرجى إدخال اسم صحيح (حرفان على الأقل، حروف فقط)",
        email: "يرجى إدخال بريد إلكتروني صحيح",
        phone: "يرجى إدخال رقم هاتف صحيح",
        grade: "يرجى اختيار الصف",
      }
    : {
        name: "Please enter a valid name (at least 2 characters, letters only)",
        email: "Please enter a valid email address",
        phone: "Please enter a valid phone number",
        grade: "Please select a grade",
      };

  function showError(field, message) {
    clearError(field);
    const wrapper = field.closest(".enquiry-field") || field.parentElement;
    field.classList.add("enquiry-field--error");
    const errorEl = document.createElement("span");
    errorEl.className = "enquiry-field__error";
    errorEl.textContent = message;
    wrapper.appendChild(errorEl);
  }

  function clearError(field) {
    field.classList.remove("enquiry-field--error");
    const wrapper = field.closest(".enquiry-field") || field.parentElement;
    const existing = wrapper.querySelector(".enquiry-field__error");
    if (existing) existing.remove();
  }

  function clearAllErrors() {
    form.querySelectorAll(".enquiry-field__error").forEach((el) => el.remove());
    form.querySelectorAll(".enquiry-field--error").forEach((el) => el.classList.remove("enquiry-field--error"));
  }

  function validateForm() {
    clearAllErrors();
    let isValid = true;

    const nameInput = form.querySelector("#enquiry-name");
    const emailInput = form.querySelector("#enquiry-email");
    const phoneInput = form.querySelector("#enquiry-phone");
    const gradeInput = form.querySelector("#enquiry-grade");

    if (!nameInput.value.trim() || !nameRegex.test(nameInput.value.trim())) {
      showError(nameInput, errorMessages.name);
      isValid = false;
    }

    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      showError(emailInput, errorMessages.email);
      isValid = false;
    }

    var phoneValue = phoneInput.value.replace(/\s/g, "").replace(/[-()+]/g, "");
    if (!phoneValue || phoneValue.length < 7) {
      showError(phoneInput, errorMessages.phone);
      isValid = false;
    }

    if (!gradeInput.value) {
      showError(gradeInput, errorMessages.grade);
      isValid = false;
    }

    return isValid;
  }

  // Clear error on input
  ["#enquiry-name", "#enquiry-email", "#enquiry-phone", "#enquiry-grade"].forEach((sel) => {
    const el = form.querySelector(sel);
    if (el) {
      el.addEventListener("input", () => clearError(el));
      el.addEventListener("change", () => clearError(el));
    }
  });

  // ── Submit handler ──
  form?.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const nameInput = form.querySelector("#enquiry-name");
    const emailInput = form.querySelector("#enquiry-email");
    const phoneInput = form.querySelector("#enquiry-phone");
    const gradeInput = form.querySelector("#enquiry-grade");

    const formData = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: enquiryIti ? enquiryIti.getNumber() : phoneInput.value.trim(),
      grade: gradeInput.value,
      yearOfEntry: yearSelect.value,
    };

    console.log("Enquiry form submitted:", formData);

    // Dummy submit — replace with actual CMS endpoint
    enquirySubmit(formData);
  });

  function enquirySubmit(data) {
    var DynamicURLRegister = "/PA_Lead_Capture_Service/daralmarefaenquiry";
    var dataString =
      "name=" + encodeURIComponent(data.name) +
      "&email=" + encodeURIComponent(data.email) +
      "&phone=" + encodeURIComponent(data.phone) +
      "&grade=" + encodeURIComponent(data.grade) +
      "&yearOfEntry=" + encodeURIComponent(data.yearOfEntry);

    console.log("Submitting to: " + DynamicURLRegister);
    console.log("Data: " + dataString);

    $.ajax({
      url: DynamicURLRegister,
      method: "POST",
      data: dataString,
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      success: function (response) {
        if (response == "SUCCESS") {
          console.log("Submitted");
          showSuccessMessage();
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ 'event': 'generate_lead' });
        } else {
          console.log("Response not successful");
          showErrorMessage();
        }
      },
      error: function (xhr, status, error) {
        console.log("Error: " + error + status + xhr);
        showErrorMessage();
      }
    });
  }

  function showSuccessMessage() {
    var successMsg = isArabicPage
      ? "شكراً لتقديم النموذج، سيتواصل معك فريق القبول قريباً."
      : "Thank you for submitting the form, our admission team will contact you shortly.";

    form.innerHTML =
      '<div class="enquiry-form__success">' +
      '<p class="enquiry-form__success-text">' + successMsg + "</p>" +
      "</div>";

    form.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function showErrorMessage() {
    var errMsg = isArabicPage
      ? "حدث خطأ ما، يرجى المحاولة مرة أخرى."
      : "Something went wrong, please try again.";

    clearAllErrors();
    var existing = form.querySelector(".enquiry-form__general-error");
    if (existing) existing.remove();

    var errEl = document.createElement("div");
    errEl.className = "enquiry-form__general-error enquiry-field__error";
    errEl.style.marginTop = "16px";
    errEl.style.textAlign = "center";
    errEl.textContent = errMsg;
    form.appendChild(errEl);
  }
})();

// Student leadership carousel JS
(function () {
  const viewport = document.getElementById("slCarouselViewport");
  const track = document.getElementById("slCarouselTrack");
  const prevBtn = document.getElementById("slCarouselPrev");
  const nextBtn = document.getElementById("slCarouselNext");
  const captionEl = document.getElementById("slCarouselCaption");
  const pills = document.querySelectorAll(".sl-leaders__pills-wrap .btc-pill-nav__btn");
  const slides = document.querySelectorAll(".sl-carousel__slide");

  if (!track || !viewport || slides.length === 0) return;

  const total = slides.length;
  let current = 0;

 

  const titles = [
    { plain: "Head Boy", accent: "and Head Girl" },
    { plain: "House", accent: "Captains" },
    { plain: "School", accent: "Council" },
  ];

  function goTo(index) {
    current = (index + total) % total;
    const offset = -current * 100;
    track.style.transform = "translateX(" + offset + "%)";

    pills.forEach((p, i) => {
      p.classList.toggle("btc-pill-nav__btn--active", i === current);
      p.setAttribute("aria-pressed", i === current ? "true" : "false");
    });

    if (captionEl) captionEl.textContent = captions[current] || "";

    const titleEl = document.querySelector(".sl-carousel-caption__title");
    if (titleEl && titles[current]) {
      const plainSpan = titleEl.querySelector(".sl-carousel-caption__title-plain");
      const accentSpan = titleEl.querySelector(".sl-carousel-caption__title-accent");
      if (plainSpan) plainSpan.textContent = titles[current].plain;
      if (accentSpan) accentSpan.textContent = titles[current].accent;
    }
  }

  if (prevBtn) prevBtn.addEventListener("click", function () { goTo(current - 1); });
  if (nextBtn) nextBtn.addEventListener("click", function () { goTo(current + 1); });

  pills.forEach(function (pill, index) {
    pill.addEventListener("click", function () { goTo(index); });
  });

  goTo(0);
})();

// Student leadership carousel JS (Arabic)
(function () {
  const viewport = document.getElementById("slCarouselViewport");
  const track = document.getElementById("slCarouselTrack");
  const prevBtn = document.getElementById("slCarouselPrev");
  const nextBtn = document.getElementById("slCarouselNext");
  const captionEl = document.getElementById("slCarouselCaption");
  const pills = document.querySelectorAll(".sl-leaders__pills-wrap .btc-pill-nav__btn");
  const slides = document.querySelectorAll(".sl-carousel__slide");

  if (!track || !viewport || slides.length === 0) return;

  const total = slides.length;
  let current = 0;

  var captions = [
    "يمثل رئيس الطلاب ورئيسة الطالبات هيئة الطلاب، ويقودان التجمعات المدرسية، ويعملان مع إدارة المدرسة لتعزيز ثقافة إيجابية وشاملة. يلهمان زملاءهما ويقدمان نموذجا في النزاهة والمسؤولية والخدمة.",
    "يقود قادة الفصول فصولهم في الأنشطة والفعاليات. يشجعون العمل الجماعي والروح الانتماء بين الطلاب عبر الصفوف.",
    "يمنح مجلس المدرسة الطلاب صوتا في الحياة المدرسية. يجتمع ممثلون من صفوف مختلفة بانتظام لمناقشة الأفكار واقتراح التحسينات والعمل مع الكادر على مبادرات تخدم المجتمع المدرسي بأكمله.",
  ];

  var titles = [
    { plain: "رئيس الطلاب", accent: "ورئيسة الطالبات" },
    { plain: "قادة", accent: "الفصول" },
    { plain: "مجلس", accent: "المدرسة" },
  ];

  function goTo(index) {
    current = (index + total) % total;
    var offset = -current * 100;
    track.style.transform = "translateX(" + offset + "%)";

    pills.forEach(function (p, i) {
      p.classList.toggle("btc-pill-nav__btn--active", i === current);
      p.setAttribute("aria-pressed", i === current ? "true" : "false");
    });

    if (captionEl) captionEl.textContent = captions[current] || "";

    var titleEl = document.querySelector(".sl-carousel-caption__title");
    if (titleEl && titles[current]) {
      var plainSpan = titleEl.querySelector(".sl-carousel-caption__title-plain");
      var accentSpan = titleEl.querySelector(".sl-carousel-caption__title-accent");
      if (plainSpan) plainSpan.textContent = titles[current].plain;
      if (accentSpan) accentSpan.textContent = titles[current].accent;
    }
  }

  if (prevBtn) prevBtn.addEventListener("click", function () { goTo(current - 1); });
  if (nextBtn) nextBtn.addEventListener("click", function () { goTo(current + 1); });

  pills.forEach(function (pill, index) {
    pill.addEventListener("click", function () { goTo(index); });
  });

  goTo(0);
})();

// Community Feedback page - form validation and submission
(function () {
  var form = document.querySelector("#feedback-form");
  if (!form) return;

  var isArabicPage =
    (document.documentElement.lang || "").toLowerCase().startsWith("ar") ||
    document.documentElement.dir === "rtl" ||
    document.body.classList.contains("arabic-page") ||
    !!document.querySelector(".arabic-page");

  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var nameRegex = /^[A-Za-z\s\u0600-\u06FF]{2,}$/;

  var errorMessages = isArabicPage
    ? {
        name: "يرجى إدخال اسم صحيح (حرفان على الأقل، حروف فقط)",
        email: "يرجى إدخال بريد إلكتروني صحيح",
        message: "يرجى إدخال رسالتك",
      }
    : {
        name: "Please enter a valid name (at least 2 characters, letters only)",
        email: "Please enter a valid email address",
        message: "Please enter your message",
      };

  function showError(field, message) {
    clearError(field);
    var wrapper = field.closest(".feedback-field") || field.closest(".enquiry-field") || field.parentElement;
    field.classList.add("enquiry-field--error");
    field.style.borderColor = "#BB133E";
    field.style.borderWidth = "2px";
    var errorEl = document.createElement("span");
    errorEl.className = "enquiry-field__error";
    errorEl.textContent = message;
    errorEl.style.color = "#FFFFFF";
    errorEl.style.fontSize = "12px";
    errorEl.style.marginTop = "4px";
    errorEl.style.display = "block";
    wrapper.appendChild(errorEl);
  }

  function clearError(field) {
    field.classList.remove("enquiry-field--error");
    field.style.borderColor = "";
    field.style.borderWidth = "";
    var wrapper = field.closest(".feedback-field") || field.closest(".enquiry-field") || field.parentElement;
    var existing = wrapper.querySelector(".enquiry-field__error");
    if (existing) existing.remove();
  }

  function clearAllErrors() {
    form.querySelectorAll(".enquiry-field__error").forEach(function (el) { el.remove(); });
    form.querySelectorAll(".enquiry-field--error").forEach(function (el) { el.classList.remove("enquiry-field--error"); });
  }

  function validateForm() {
    clearAllErrors();
    var isValid = true;

    var nameInput = form.querySelector("#feedback-name");
    var emailInput = form.querySelector("#feedback-email");
    var messageInput = form.querySelector("#feedback-message");
    var firstErrorField = null;

    // Validate name - required and proper format
    if (!nameInput.value.trim()) {
      var nameErrorMsg = isArabicPage ? "الاسم مطلوب" : "Name is required";
      showError(nameInput, nameErrorMsg);
      isValid = false;
      if (!firstErrorField) firstErrorField = nameInput;
    } else if (!nameRegex.test(nameInput.value.trim())) {
      showError(nameInput, errorMessages.name);
      isValid = false;
      if (!firstErrorField) firstErrorField = nameInput;
    }

    // Validate email - required and proper format
    if (!emailInput.value.trim()) {
      var emailRequiredMsg = isArabicPage ? "البريد الإلكتروني مطلوب" : "Email is required";
      showError(emailInput, emailRequiredMsg);
      isValid = false;
      if (!firstErrorField) firstErrorField = emailInput;
    } else if (!emailRegex.test(emailInput.value.trim())) {
      showError(emailInput, errorMessages.email);
      isValid = false;
      if (!firstErrorField) firstErrorField = emailInput;
    }

    // Validate message - required
    if (!messageInput.value.trim()) {
      var messageRequiredMsg = isArabicPage ? "الرسالة مطلوبة" : "Message is required";
      showError(messageInput, messageRequiredMsg);
      isValid = false;
      if (!firstErrorField) firstErrorField = messageInput;
    }

    // Scroll to first error field if validation fails
    if (!isValid && firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      firstErrorField.focus();
    }

    return isValid;
  }

  ["#feedback-name", "#feedback-email", "#feedback-message"].forEach(function (selector) {
    var element = form.querySelector(selector);
    if (element) {
      element.addEventListener("input", function () { clearError(element); });
      element.addEventListener("change", function () { clearError(element); });
    }
  });

  var isSubmitting = false;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Prevent double submission
    if (isSubmitting) return;

    if (!validateForm()) {
      console.log("Form validation failed - not submitted");
      return;
    }

    isSubmitting = true;
    var submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      var originalText = submitBtn.textContent;
      submitBtn.textContent = isArabicPage ? "جاري الإرسال..." : "Submitting...";
    }

    var nameInput = form.querySelector("#feedback-name");
    var emailInput = form.querySelector("#feedback-email");
    var messageInput = form.querySelector("#feedback-message");

    var formData = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      message: messageInput.value.trim(),
    };

    feedbackSubmit(formData, submitBtn, originalText);
  });

  function feedbackSubmit(data, submitBtn, originalText) {
    var dynamicURLRegister = "/PA_Lead_Capture_Service/daralmarefafeedback";
    var dataString =
      "name=" + encodeURIComponent(data.name) +
      "&email=" + encodeURIComponent(data.email) +
      "&message=" + encodeURIComponent(data.message);

    $.ajax({
      url: dynamicURLRegister,
      method: "POST",
      data: dataString,
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      success: function (response) {
        if (response == "SUCCESS") {
          console.log("Form submitted successfully!");
          showSuccessMessage();
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ event: "feedback_submitted" });
        } else {
          console.log("Form submission failed");
          showErrorMessage();
          // Re-enable button on error
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            isSubmitting = false;
          }
        }
      },
      error: function () {
        console.log("Form submission error");
        showErrorMessage();
        // Re-enable button on error
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          isSubmitting = false;
        }
      },
    });
  }

  function showSuccessMessage() {
    var successMsg = isArabicPage
      ? "شكراً لإرسال ملاحظاتك، سيتواصل معك فريقنا قريباً."
      : "Thank you for your feedback, our team will contact you shortly.";

    form.innerHTML =
      '<div class="enquiry-form__success">' +
      '<p class="enquiry-form__success-text">' + successMsg + "</p>" +
      "</div>";

    form.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function showErrorMessage() {
    var errMsg = isArabicPage
      ? "حدث خطأ ما، يرجى المحاولة مرة أخرى."
      : "Something went wrong, please try again.";

    clearAllErrors();
    var existing = form.querySelector(".enquiry-form__general-error");
    if (existing) existing.remove();

    var errEl = document.createElement("div");
    errEl.className = "enquiry-form__general-error enquiry-field__error";
    errEl.style.marginTop = "16px";
    errEl.style.marginBottom = "16px";
    errEl.style.padding = "12px 16px";
    errEl.style.textAlign = "center";
    errEl.style.backgroundColor = "#ffe6e6";
    errEl.style.borderLeft = "4px solid #BB133E";
    errEl.style.color = "#FFFFFF";
    errEl.style.fontSize = "14px";
    errEl.textContent = errMsg;
    form.insertBefore(errEl, form.firstChild);
    form.scrollIntoView({ behavior: "smooth", block: "center" });
  }
})();

// Hero section video controls JS
document.addEventListener("DOMContentLoaded", () => {
  /* ── Search toggle (SAFE) ── */
  const searchBtn = document.getElementById("heroSearchBtn");
  const searchInput = document.getElementById("heroSearchInput");

  if (searchBtn && searchInput) {
    searchBtn.addEventListener("click", () => {
      const open = searchInput.classList.toggle("is-open");
      if (open) {
        searchInput.focus();
      } else {
        searchInput.blur();
        searchInput.value = "";
      }
    });

    // Close search on outside click
    document.addEventListener("click", (e) => {
      if (!searchBtn.contains(e.target) && !searchInput.contains(e.target)) {
        searchInput.classList.remove("is-open");
        searchInput.value = "";
      }
    });
  }

  /* ── Video controls (FIXED) ── */
  const video = document.getElementById("heroVideo");
  const playBtn = document.getElementById("heroPlayBtn");
  const playIcon = document.getElementById("heroPlayIcon");
  const volumeBtn = document.getElementById("heroVolumeBtn");
  const volumeIcon = document.getElementById("heroVolumeIcon");

  // Safety check (prevents JS crash)
  if (!video || !playBtn || !volumeBtn) return;

  /* ▶️ Play / Pause */
  playBtn.addEventListener("click", () => {
    if (video.paused) {
      video.play();
      playIcon.style.opacity = "1";
    } else {
      video.pause();
      playIcon.style.opacity = "0.6";
    }
  });

  /* 🔊 Volume toggle */
  volumeBtn.addEventListener("click", () => {
    video.muted = !video.muted;
    volumeBtn.classList.toggle("is-unmuted", !video.muted);
  });
});


// Beyond the classroom - Extra Curricular activities Tabs

(function () {
  var wrapper  = document.querySelector(".beyond-the-classroom-extra-curricular-func");
  if (!wrapper) return;

  var buttons  = wrapper.querySelectorAll(".core-curriculum-gap .admission-pill-nav__btn");
  var img      = wrapper.querySelector(".beyond-the-classroom-extra-curricular__slide img");
  var tabTitle = document.getElementById("beyond-the-classroom-extra-curricular__tab-title");
  var tabBody  = document.getElementById("beyond-the-classroom-extra-curricular__tab-body");

  var activeIndex = 0;

  function beyondECSwitchTab(index, btn) {
    if (index === activeIndex) return;
    activeIndex = index;

    buttons.forEach(function (b, i) {
      var isActive = i === index;
      b.classList.toggle("btc-pill-nav__btn--active", isActive);
      b.setAttribute("aria-pressed", String(isActive));
    });

    img.classList.add("beyond-the-classroom-extra-curricular__img--fade");
    tabTitle.classList.add("beyond-the-classroom-extra-curricular__text--fade");
    tabBody.classList.add("beyond-the-classroom-extra-curricular__text--fade");

   setTimeout(function () {
  img.src = btn.dataset.imgSrc;
  img.alt = btn.dataset.imgAlt;

  if (btn.dataset.titlePlain && btn.dataset.titleBold) {
    tabTitle.innerHTML =
      btn.dataset.titlePlain +
      "<strong>" +
      btn.dataset.titleBold +
      "</strong>";
  } else if (btn.dataset.title) {
    tabTitle.textContent = btn.dataset.title;
  }

  tabBody.textContent = btn.dataset.body;

  img.classList.remove("beyond-the-classroom-extra-curricular__img--fade");
  tabTitle.classList.remove("beyond-the-classroom-extra-curricular__text--fade");
  tabBody.classList.remove("beyond-the-classroom-extra-curricular__text--fade");
}, 350);
  }

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var index = parseInt(btn.getAttribute("data-slide"), 10);
      beyondECSwitchTab(index, btn);
    });
  });
})();
