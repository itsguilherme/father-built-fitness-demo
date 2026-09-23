(function () {
  "use strict";

  document.querySelectorAll(".faq-question").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var isOpen = btn.getAttribute("aria-expanded") === "true";
      var answer = btn.nextElementSibling;
      btn.setAttribute("aria-expanded", String(!isOpen));
      if (answer) answer.hidden = isOpen;
    });
  });
})();
