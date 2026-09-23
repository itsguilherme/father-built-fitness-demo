(function () {
  "use strict";

  var modal = document.getElementById("apply-modal");
  if (!modal) return;

  var formShell = document.getElementById("apply-form-shell");
  var bookingShell = document.getElementById("apply-booking-shell");
  var form = document.getElementById("apply-form");
  var steps = Array.prototype.slice.call(form.querySelectorAll(".form-step"));
  var prevBtn = document.getElementById("apply-prev-step");
  var nextBtn = document.getElementById("apply-next-step");
  var submitBtn = document.getElementById("apply-submit-step");
  var progressText = document.getElementById("progress-text");
  var progressFill = document.getElementById("progress-fill");
  var currentStep = 0;
  var lastFocused = null;

  function showStep(index) {
    steps.forEach(function (step, i) {
      step.hidden = i !== index;
    });
    prevBtn.disabled = index === 0;
    nextBtn.hidden = index === steps.length - 1;
    submitBtn.hidden = index !== steps.length - 1;
    progressText.textContent = "Step " + (index + 1) + " of " + steps.length;
    progressFill.style.width = Math.round(((index + 1) / steps.length) * 100) + "%";
  }

  function stepIsValid(index) {
    var inputs = steps[index].querySelectorAll("input[required]");
    for (var i = 0; i < inputs.length; i++) {
      var el = inputs[i];
      if (el.type === "radio") {
        var group = steps[index].querySelectorAll('input[name="' + el.name + '"]');
        var checked = Array.prototype.some.call(group, function (r) { return r.checked; });
        if (!checked) return false;
      } else if (!el.value) {
        return false;
      }
    }
    return true;
  }

  nextBtn.addEventListener("click", function () {
    if (!stepIsValid(currentStep)) {
      steps[currentStep].reportValidity ? steps[currentStep].reportValidity() : null;
      var firstInput = steps[currentStep].querySelector("input");
      if (firstInput) firstInput.focus();
      return;
    }
    currentStep = Math.min(currentStep + 1, steps.length - 1);
    showStep(currentStep);
  });

  prevBtn.addEventListener("click", function () {
    currentStep = Math.max(currentStep - 1, 0);
    showStep(currentStep);
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!stepIsValid(currentStep)) return;

    formShell.hidden = true;
    bookingShell.hidden = false;

    var calendarRoot = bookingShell.querySelector("[data-booking-widget]");
    if (window.BookingPreview && calendarRoot) {
      window.BookingPreview.buildCalendar(calendarRoot);
    }
  });

  function openModal() {
    lastFocused = document.activeElement;
    modal.hidden = false;
    modal.setAttribute("data-allow-close", "true");
    document.body.style.overflow = "hidden";
    currentStep = 0;
    showStep(0);
    formShell.hidden = false;
    bookingShell.hidden = true;
    var firstInput = form.querySelector("input");
    if (firstInput) firstInput.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll("[data-open-apply-modal]").forEach(function (btn) {
    btn.addEventListener("click", openModal);
  });

  document.querySelectorAll("[data-close-apply-modal]").forEach(function (el) {
    el.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });
})();
