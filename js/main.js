(function () {
  "use strict";

  // Mobile nav toggle
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.querySelector(".mobile-menu");

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var isOpen = menu.getAttribute("data-open") === "true";
      menu.setAttribute("data-open", String(!isOpen));
      toggle.setAttribute("aria-expanded", String(!isOpen));
    });

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        menu.setAttribute("data-open", "false");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Scroll reveal
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i % 4, 3) * 60 + "ms";
      observer.observe(el);
    });
  }

  // Back to top button
  var backToTop = document.getElementById("back-to-top");
  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });

    if ("IntersectionObserver" in window) {
      var sentinel = document.createElement("div");
      sentinel.style.position = "absolute";
      sentinel.style.top = "600px";
      sentinel.style.height = "1px";
      sentinel.style.width = "1px";
      sentinel.setAttribute("aria-hidden", "true");
      document.body.appendChild(sentinel);

      var topObserver = new IntersectionObserver(function (entries) {
        backToTop.setAttribute("data-visible", String(!entries[0].isIntersecting));
      });
      topObserver.observe(sentinel);
    } else {
      backToTop.setAttribute("data-visible", "true");
    }
  }

  // 3D tilt on cards, pointer-fine devices only
  var canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (canHover) {
    var tiltEls = document.querySelectorAll(".pillar, .result-card");
    var MAX_TILT = 6;

    tiltEls.forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var rect = el.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width;
        var y = (e.clientY - rect.top) / rect.height;
        var tiltY = (x - 0.5) * MAX_TILT * 2;
        var tiltX = (0.5 - y) * MAX_TILT * 2;
        el.style.setProperty("--tilt-x", tiltX.toFixed(2) + "deg");
        el.style.setProperty("--tilt-y", tiltY.toFixed(2) + "deg");
      });

      el.addEventListener("mouseleave", function () {
        el.style.setProperty("--tilt-x", "0deg");
        el.style.setProperty("--tilt-y", "0deg");
      });
    });
  }

  // Read My Full Story toggle
  var storyToggle = document.querySelector(".story-toggle");
  var storyExtra = document.getElementById("story-extra");
  if (storyToggle && storyExtra) {
    storyToggle.addEventListener("click", function () {
      var isExpanded = storyToggle.getAttribute("aria-expanded") === "true";
      var willExpand = !isExpanded;
      storyToggle.setAttribute("aria-expanded", String(willExpand));
      storyToggle.textContent = willExpand ? "Show Less" : "Read My Full Story";
      storyExtra.hidden = !willExpand;
    });
  }
})();
