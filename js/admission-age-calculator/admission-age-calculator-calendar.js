// admission-age-calculator-calendar.js
(function () {
  const MONTHS = [
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

  if (!popup || !input) return;

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

  document.getElementById("ag-cal-cancel").addEventListener("click", (e) => {
    e.stopPropagation();
    pendingDate = null;
    popup.classList.remove("open");
  });

  document.getElementById("ag-cal-set").addEventListener("click", (e) => {
    e.stopPropagation();
    if (pendingDate) {
      selectedDate = { ...pendingDate };
      const dd = String(selectedDate.d).padStart(2, "0");
      const mm = String(selectedDate.m + 1).padStart(2, "0");
      input.value = `${dd}/${mm}/${selectedDate.y}`;
    }
    popup.classList.remove("open");
  });

  document.getElementById("ag-cal-prev").addEventListener("click", () => {
    viewMonth--;
    if (viewMonth < 0) {
      viewMonth = 11;
      viewYear--;
    }
    renderCalendar();
  });
  document.getElementById("ag-cal-next").addEventListener("click", () => {
    viewMonth++;
    if (viewMonth > 11) {
      viewMonth = 0;
      viewYear++;
    }
    renderCalendar();
  });
  monthSel.addEventListener("change", () => {
    viewMonth = +monthSel.value;
    renderCalendar();
  });
  yearSel.addEventListener("change", () => {
    viewYear = +yearSel.value;
    renderCalendar();
  });

  document.addEventListener("click", (e) => {
    if (!input.closest(".ag-calculator__input-wrap").contains(e.target))
      popup.classList.remove("open");
  });

  // ── Dynamic "Your age on Jan 1, YYYY" label ──
  const yearDropdown = document.getElementById("enquiry-year-input");
  const allCardTitles = document.querySelectorAll(".ag-calculator__card-title");
  let ageLabelEl = null;
  allCardTitles.forEach((el) => {
    const text = el.textContent.toLowerCase();
    if (text.includes("age on") || text.includes("عمرك في")) ageLabelEl = el;
  });

  // ── Parse the reference date from the age label ──
  function getReferenceDate() {
    if (!ageLabelEl) return null;
    const text = ageLabelEl.textContent.trim();
    const enMatch = text.match(/(\w+)\s+(\d+),?\s+(\d{4})/);
    const arMatch = text.match(/(\d+)\s+(\S+)\s+(\d{4})/);
    const arabicMonths = {
      يناير: 0,
      فبراير: 1,
      مارس: 2,
      أبريل: 3,
      مايو: 4,
      يونيو: 5,
      يوليو: 6,
      أغسطس: 7,
      سبتمبر: 8,
      أكتوبر: 9,
      نوفمبر: 10,
      ديسمبر: 11,
    };
    if (enMatch) {
      const monthNames = {
        jan: 0,
        feb: 1,
        mar: 2,
        apr: 3,
        may: 4,
        jun: 5,
        jul: 6,
        aug: 7,
        sep: 8,
        sept: 8,
        oct: 9,
        nov: 10,
        dec: 11,
      };
      const monthKey = enMatch[1].toLowerCase().slice(0, 4);
      const month =
        monthNames[monthKey] ??
        monthNames[enMatch[1].toLowerCase().slice(0, 3)];
      if (month === undefined) return null;
      return new Date(
        parseInt(enMatch[3], 10),
        month,
        parseInt(enMatch[2], 10),
      );
    }
    if (arMatch) {
      const day = parseInt(arMatch[1], 10);
      const month = arabicMonths[arMatch[2]];
      const year = parseInt(arMatch[3], 10);
      if (month === undefined) return null;
      return new Date(year, month, day);
    }
    return null;
  }

  // ── Age calculation ──
  function calculateAge(dob, refDate) {
    if (dob >= refDate) return { years: 0, months: 0, days: 0 };
    let years = refDate.getFullYear() - dob.getFullYear();
    let months = refDate.getMonth() - dob.getMonth();
    let days = refDate.getDate() - dob.getDate();
    if (days < 0) {
      months--;
      days += new Date(refDate.getFullYear(), refDate.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    return { years, months, days };
  }

  // ── Update result cards ──
  function updateResultCards(years, months, totalDays) {
    const resultItems = document.querySelectorAll(
      ".ag-calculator__result-value",
    );
    if (resultItems.length >= 3) {
      resultItems[0].textContent = years + (years === 1 ? " Year" : " Years");
      resultItems[1].textContent =
        months + (months === 1 ? " Month" : " Months");
      resultItems[2].textContent =
        totalDays + (totalDays === 1 ? " Day" : " Days");
    }
  }

  // ── Get selected academic year start (e.g. "2025-26" → 2025) ──
  function getSelectedAcademicYearStart() {
    if (!yearDropdown || !yearDropdown.value) return null;
    const match = yearDropdown.value.match(/^(\d{4})/);
    return match ? parseInt(match[1], 10) : null;
  }

  // ── Year Group data sets keyed by academic year start ──
  const KHDA_NOTE =
    "Please note that class placement is based on the Transfer Certificate and the last grade completed by the student, in accordance with KHDA regulations.";
  const ADMISSIONS_NOTE =
    "Please refer to admissions office for class placements **";

  // Each rule: { from: {y,m,d}, to: {y,m,d}, yearGroup: string|null, note: string|null }
  const YEAR_GROUP_RULES = {
    // Academic year 2025-26
    2025: [
      {
        from: { y: 2023, m: 1, d: 1 },
        to: { y: 2023, m: 12, d: 31 },
        yearGroup: "Prekg",
        note: null,
      },
      {
        from: { y: 2022, m: 1, d: 1 },
        to: { y: 2022, m: 12, d: 31 },
        yearGroup: "KG1",
        note: null,
      },
      {
        from: { y: 2021, m: 1, d: 1 },
        to: { y: 2021, m: 12, d: 31 },
        yearGroup: null,
        note: ADMISSIONS_NOTE,
      },
      {
        from: { y: 2020, m: 1, d: 1 },
        to: { y: 2020, m: 12, d: 31 },
        yearGroup: null,
        note: ADMISSIONS_NOTE,
      },
      {
        from: { y: 2019, m: 9, d: 1 },
        to: { y: 2019, m: 12, d: 31 },
        yearGroup: "Grade 1",
        note: KHDA_NOTE,
      },
      {
        from: { y: 2019, m: 1, d: 1 },
        to: { y: 2019, m: 8, d: 31 },
        yearGroup: "Grade 2",
        note: KHDA_NOTE,
      },
      {
        from: { y: 2018, m: 9, d: 1 },
        to: { y: 2018, m: 12, d: 31 },
        yearGroup: "Grade 2",
        note: KHDA_NOTE,
      },
      {
        from: { y: 2018, m: 1, d: 1 },
        to: { y: 2018, m: 8, d: 31 },
        yearGroup: "Grade 3",
        note: KHDA_NOTE,
      },
      {
        from: { y: 2017, m: 1, d: 1 },
        to: { y: 2017, m: 12, d: 31 },
        yearGroup: "Grade 4",
        note: KHDA_NOTE,
      },
      {
        from: { y: 2016, m: 1, d: 1 },
        to: { y: 2016, m: 12, d: 31 },
        yearGroup: "Grade 5",
        note: KHDA_NOTE,
      },
      {
        from: { y: 2015, m: 1, d: 1 },
        to: { y: 2015, m: 12, d: 31 },
        yearGroup: "Grade 6",
        note: KHDA_NOTE,
      },
      {
        from: { y: 2014, m: 1, d: 1 },
        to: { y: 2014, m: 12, d: 31 },
        yearGroup: "Grade 7",
        note: KHDA_NOTE,
      },
      {
        from: { y: 2013, m: 1, d: 1 },
        to: { y: 2013, m: 12, d: 31 },
        yearGroup: "Grade 8",
        note: KHDA_NOTE,
      },
      {
        from: { y: 2012, m: 1, d: 1 },
        to: { y: 2012, m: 12, d: 31 },
        yearGroup: "Grade 9",
        note: KHDA_NOTE,
      },
      {
        from: { y: 2011, m: 1, d: 1 },
        to: { y: 2011, m: 12, d: 31 },
        yearGroup: "Grade 10",
        note: KHDA_NOTE,
      },
      {
        from: { y: 2010, m: 1, d: 1 },
        to: { y: 2010, m: 12, d: 31 },
        yearGroup: "Grade 11",
        note: KHDA_NOTE,
      },
      {
        from: { y: 2009, m: 1, d: 1 },
        to: { y: 2009, m: 12, d: 31 },
        yearGroup: "Grade 12",
        note: KHDA_NOTE,
      },
    ],

    // Academic year 2026-27
    2026: [
      {
        from: { y: 2024, m: 1, d: 1 },
        to: { y: 2024, m: 12, d: 31 },
        yearGroup: "Prekg",
        note: null,
      },
      {
        from: { y: 2023, m: 1, d: 1 },
        to: { y: 2023, m: 12, d: 31 },
        yearGroup: "KG1",
        note: null,
      },
      {
        from: { y: 2022, m: 1, d: 1 },
        to: { y: 2022, m: 12, d: 31 },
        yearGroup: "KG2",
        note: null,
      },
      {
        from: { y: 2021, m: 1, d: 1 },
        to: { y: 2021, m: 12, d: 31 },
        yearGroup: null,
        note: ADMISSIONS_NOTE,
      },
      {
        from: { y: 2020, m: 1, d: 1 },
        to: { y: 2020, m: 12, d: 31 },
        yearGroup: null,
        note: ADMISSIONS_NOTE,
      },
      {
        from: { y: 2019, m: 9, d: 1 },
        to: { y: 2019, m: 12, d: 31 },
        yearGroup: "Grade 2",
        note: KHDA_NOTE,
      },
      {
        from: { y: 2019, m: 1, d: 1 },
        to: { y: 2019, m: 8, d: 31 },
        yearGroup: "Grade 3",
        note: KHDA_NOTE,
      },
      {
        from: { y: 2018, m: 9, d: 1 },
        to: { y: 2018, m: 12, d: 31 },
        yearGroup: "Grade 3",
        note: KHDA_NOTE,
      },
      {
        from: { y: 2018, m: 1, d: 1 },
        to: { y: 2018, m: 8, d: 31 },
        yearGroup: "Grade 4",
        note: KHDA_NOTE,
      },
      {
        from: { y: 2017, m: 1, d: 1 },
        to: { y: 2017, m: 12, d: 31 },
        yearGroup: "Grade 5",
        note: KHDA_NOTE,
      },
      {
        from: { y: 2016, m: 1, d: 1 },
        to: { y: 2016, m: 12, d: 31 },
        yearGroup: "Grade 6",
        note: KHDA_NOTE,
      },
      {
        from: { y: 2015, m: 1, d: 1 },
        to: { y: 2015, m: 12, d: 31 },
        yearGroup: "Grade 7",
        note: KHDA_NOTE,
      },
      {
        from: { y: 2014, m: 1, d: 1 },
        to: { y: 2014, m: 12, d: 31 },
        yearGroup: "Grade 8",
        note: KHDA_NOTE,
      },
      {
        from: { y: 2013, m: 1, d: 1 },
        to: { y: 2013, m: 12, d: 31 },
        yearGroup: "Grade 9",
        note: KHDA_NOTE,
      },
      {
        from: { y: 2012, m: 1, d: 1 },
        to: { y: 2012, m: 12, d: 31 },
        yearGroup: "Grade 10",
        note: KHDA_NOTE,
      },
      {
        from: { y: 2011, m: 1, d: 1 },
        to: { y: 2011, m: 12, d: 31 },
        yearGroup: "Grade 11",
        note: KHDA_NOTE,
      },
      {
        from: { y: 2010, m: 1, d: 1 },
        to: { y: 2010, m: 12, d: 31 },
        yearGroup: "Grade 12",
        note: KHDA_NOTE,
      },
    ],

    // Academic year 2027-28
    2027: [
      {
        from: { y: 2025, m: 1, d: 1 },
        to: { y: 2025, m: 12, d: 31 },
        yearGroup: "Prekg",
        note: null,
      },
      {
        from: { y: 2024, m: 1, d: 1 },
        to: { y: 2024, m: 12, d: 31 },
        yearGroup: "KG1",
        note: null,
      },
      {
        from: { y: 2023, m: 1, d: 1 },
        to: { y: 2023, m: 12, d: 31 },
        yearGroup: "KG2",
        note: null,
      },
      {
        from: { y: 2022, m: 1, d: 1 },
        to: { y: 2022, m: 12, d: 31 },
        yearGroup: "Grade 1",
        note: null,
      },
      {
        from: { y: 2021, m: 1, d: 1 },
        to: { y: 2021, m: 12, d: 31 },
        yearGroup: null,
        note: ADMISSIONS_NOTE,
      },
      {
        from: { y: 2020, m: 1, d: 1 },
        to: { y: 2020, m: 12, d: 31 },
        yearGroup: null,
        note: ADMISSIONS_NOTE,
      },
      {
        from: { y: 2019, m: 9, d: 1 },
        to: { y: 2019, m: 12, d: 31 },
        yearGroup: "Grade 3",
        note: KHDA_NOTE,
      },
      {
        from: { y: 2019, m: 1, d: 1 },
        to: { y: 2019, m: 8, d: 31 },
        yearGroup: "Grade 4",
        note: KHDA_NOTE,
      },
      {
        from: { y: 2018, m: 9, d: 1 },
        to: { y: 2018, m: 12, d: 31 },
        yearGroup: "Grade 4",
        note: KHDA_NOTE,
      },
      {
        from: { y: 2018, m: 1, d: 1 },
        to: { y: 2018, m: 8, d: 31 },
        yearGroup: "Grade 5",
        note: KHDA_NOTE,
      },
      {
        from: { y: 2017, m: 1, d: 1 },
        to: { y: 2017, m: 12, d: 31 },
        yearGroup: "Grade 6",
        note: KHDA_NOTE,
      },
      {
        from: { y: 2016, m: 1, d: 1 },
        to: { y: 2016, m: 12, d: 31 },
        yearGroup: "Grade 7",
        note: KHDA_NOTE,
      },
      {
        from: { y: 2015, m: 1, d: 1 },
        to: { y: 2015, m: 12, d: 31 },
        yearGroup: "Grade 8",
        note: KHDA_NOTE,
      },
      {
        from: { y: 2014, m: 1, d: 1 },
        to: { y: 2014, m: 12, d: 31 },
        yearGroup: "Grade 9",
        note: KHDA_NOTE,
      },
      {
        from: { y: 2013, m: 1, d: 1 },
        to: { y: 2013, m: 12, d: 31 },
        yearGroup: "Grade 10",
        note: KHDA_NOTE,
      },
      {
        from: { y: 2012, m: 1, d: 1 },
        to: { y: 2012, m: 12, d: 31 },
        yearGroup: "Grade 11",
        note: KHDA_NOTE,
      },
      {
        from: { y: 2011, m: 1, d: 1 },
        to: { y: 2011, m: 12, d: 31 },
        yearGroup: "Grade 12",
        note: KHDA_NOTE,
      },
    ],
  };

  // ── Year Group Logic ──
  function getYearGroup(dob, academicYearStart) {
    const rules = YEAR_GROUP_RULES[academicYearStart];
    if (!rules) return { yearGroup: null, note: null };

    const dobMs = dob.getTime();
    for (const rule of rules) {
      const fromMs = new Date(
        rule.from.y,
        rule.from.m - 1,
        rule.from.d,
      ).getTime();
      const toMs = new Date(rule.to.y, rule.to.m - 1, rule.to.d).getTime();
      if (dobMs >= fromMs && dobMs <= toMs) {
        return { yearGroup: rule.yearGroup, note: rule.note };
      }
    }

    return { yearGroup: null, note: null };
  }

  // ── Update the Year Group card ──
  function updateYearGroupCard(dob, academicYearStart) {
    const yearGroupEl = document.querySelector(".ag-calculator__year-group");
    const yearGroupCard = yearGroupEl
      ? yearGroupEl.closest(".ag-calculator__card")
      : null;
    const noteEl = yearGroupCard
      ? Array.from(
          yearGroupCard.querySelectorAll(".ag-calculator__card-title"),
        ).find((el) => !el.textContent.toLowerCase().includes("eligible"))
      : null;

    const { yearGroup, note } = getYearGroup(dob, academicYearStart);

    if (yearGroupEl) {
      if (yearGroup) {
        yearGroupEl.textContent = yearGroup;
        yearGroupEl.style.display = "";
      } else {
        yearGroupEl.textContent = "";
        yearGroupEl.style.display = "none";
      }
    }

    if (noteEl) {
      if (note) {
        noteEl.textContent = note;
        noteEl.style.display = "";
      } else {
        noteEl.textContent = "";
        noteEl.style.display = "none";
      }
    }
  }

  // ── Wire up Calculate button ──
  const calculateBtn = document.querySelector(".ag-calculator__btn");
  if (calculateBtn) {
    calculateBtn.addEventListener("click", () => {
      const dobValue = input.value.trim();
      if (!dobValue) {
        alert("Please select your Date of Birth.");
        return;
      }
      const [dd, mm, yyyy] = dobValue.split("/").map(Number);
      if (!dd || !mm || !yyyy) {
        alert("Invalid date format. Please select a valid Date of Birth.");
        return;
      }
      const dob = new Date(yyyy, mm - 1, dd);

      const refDate = getReferenceDate();
      if (!refDate) {
        alert("Please select an Academic Year first.");
        return;
      }

      const { years, months, days } = calculateAge(dob, refDate);
      updateResultCards(years, months, days);

      const academicYearStart = getSelectedAcademicYearStart();
      if (academicYearStart !== null) {
        updateYearGroupCard(dob, academicYearStart);
      }
    });
  }

  // ── Academic year dropdown → update label ──
  function updateAgeLabel() {
    if (!ageLabelEl || !yearDropdown) return;
    const selectedValue = yearDropdown.value;
    const match = selectedValue.match(/^(\d{4})/);
    if (!match) return;
    const endYear = parseInt(match[1], 10) + 1;
    const isRTL = document.documentElement.dir === "rtl";
    ageLabelEl.textContent = isRTL
      ? `عمرك في 1 يناير ${endYear}`
      : `Your age on Jan 1, ${endYear}`;
  }

  if (yearDropdown) {
    yearDropdown.addEventListener("change", updateAgeLabel);
    updateAgeLabel();
  }
})();
