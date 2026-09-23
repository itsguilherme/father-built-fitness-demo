/* Booking widget DESIGN PREVIEW ONLY.
   Not wired to a real backend yet, Shaun doesn't have a booking-backend
   deployed. All dates/times here are generated locally in the browser so
   the calendar looks and feels real without touching any API. Once his
   booking-backend exists, swap this file for the real booking-widget.js
   (same pattern as Allison's site) and point it at his own API_BASE.
   Never copy Allison's booking-widget.js as-is here, it's hardcoded to
   her own backend and would leak her calendar into Shaun's site. */
(function () {
  "use strict";

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function buildCalendar(root) {
    if (root.dataset.calendarInitialized) return;
    root.dataset.calendarInitialized = "true";

    var state = {
      viewYear: new Date().getFullYear(),
      viewMonth: new Date().getMonth(),
      selectedDate: null,
      selectedTime: null
    };

    var monthLabel = root.querySelector("#cal-month-label");
    var grid = root.querySelector("#cal-grid");
    var prevBtn = root.querySelector("#cal-prev");
    var nextBtn = root.querySelector("#cal-next");
    var timesPanel = root.querySelector("#booking-times");
    var timesContainer = root.querySelector("#booking-slots-times");
    var stepSlots = root.querySelector("#step-slots");
    var stepForm = root.querySelector("#step-form");
    var stepConfirm = root.querySelector("#step-confirm");
    var recapEl = root.querySelector("#recap-time");
    var confirmRecapEl = root.querySelector("#confirm-recap");
    var backBtn = root.querySelector("#booking-back-btn");
    var form = root.querySelector("#booking-form");

    var MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var TIMES = ["9:00 AM", "11:00 AM", "1:30 PM", "3:00 PM"];

    function render() {
      monthLabel.textContent = MONTH_NAMES[state.viewMonth] + " " + state.viewYear;
      grid.innerHTML = "";

      var firstDay = new Date(state.viewYear, state.viewMonth, 1).getDay();
      var daysInMonth = new Date(state.viewYear, state.viewMonth + 1, 0).getDate();
      var today = new Date();
      today.setHours(0, 0, 0, 0);

      for (var i = 0; i < firstDay; i++) {
        grid.appendChild(document.createElement("span"));
      }

      for (var d = 1; d <= daysInMonth; d++) {
        var cellDate = new Date(state.viewYear, state.viewMonth, d);
        var dow = cellDate.getDay();
        var isPast = cellDate < today;
        var isWeekend = dow === 0 || dow === 6;
        var available = !isPast && !isWeekend;

        var cell = document.createElement("button");
        cell.type = "button";
        cell.className = "booking-day";
        cell.textContent = String(d);
        cell.setAttribute("data-available", String(available));

        var dateKey = state.viewYear + "-" + pad(state.viewMonth + 1) + "-" + pad(d);
        if (state.selectedDate === dateKey) {
          cell.setAttribute("data-selected", "true");
        }

        if (available) {
          cell.addEventListener("click", function (dateKey, cellDate) {
            return function () {
              state.selectedDate = dateKey;
              state.selectedTime = null;
              timesPanel.hidden = false;
              render();
              renderTimes(cellDate);
              cell_scrollIntoView(timesPanel);
            };
          }(dateKey, cellDate));
        } else {
          cell.disabled = true;
        }

        grid.appendChild(cell);
      }
    }

    function cell_scrollIntoView(el) {
      if (window.matchMedia("(max-width: 640px)").matches) {
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }

    function renderTimes(cellDate) {
      timesContainer.innerHTML = "";
      var label = cellDate.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
      root.querySelector("#booking-times-heading").textContent = "Available times, " + label;

      TIMES.forEach(function (time) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "booking-time-btn";
        btn.textContent = time;
        btn.addEventListener("click", function () {
          state.selectedTime = time;
          recapEl.textContent = label + " at " + time + " (EST)";
          stepSlots.hidden = true;
          stepForm.hidden = false;
        });
        timesContainer.appendChild(btn);
      });
    }

    if (backBtn) {
      backBtn.addEventListener("click", function () {
        stepForm.hidden = true;
        stepSlots.hidden = false;
      });
    }

    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        confirmRecapEl.textContent = recapEl.textContent + ". A confirmation email is on its way.";
        stepForm.hidden = true;
        stepConfirm.hidden = false;
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        state.viewMonth -= 1;
        if (state.viewMonth < 0) {
          state.viewMonth = 11;
          state.viewYear -= 1;
        }
        render();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        state.viewMonth += 1;
        if (state.viewMonth > 11) {
          state.viewMonth = 0;
          state.viewYear += 1;
        }
        render();
      });
    }

    render();
  }

  document.querySelectorAll("[data-booking-widget]").forEach(buildCalendar);

  window.BookingPreview = { buildCalendar: buildCalendar };
})();
