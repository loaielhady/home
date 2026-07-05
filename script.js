(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.querySelector(".nav-toggle");
  var mobileNav = document.getElementById("mobile-nav");
  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = mobileNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobileNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Commit log accordion ---------- */
  document.querySelectorAll(".commit__row").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", expanded ? "false" : "true");
    });
  });

  /* ---------- Career uptime counter ----------
     "Boot date" = start of hands-on IT/infrastructure career (2019).
     Framed as a system uptime readout — a nod to the DevOps mindset. */
  var BOOT_DATE = new Date("2019-01-01T00:00:00Z");

  function formatUptime(ms) {
    var totalSeconds = Math.floor(ms / 1000);
    var days = Math.floor(totalSeconds / 86400);
    var years = Math.floor(days / 365);
    var remDays = days % 365;
    var hours = Math.floor((totalSeconds % 86400) / 3600);
    var minutes = Math.floor((totalSeconds % 3600) / 60);
    var seconds = totalSeconds % 60;
    return (
      years + "y " + remDays + "d " +
      String(hours).padStart(2, "0") + ":" +
      String(minutes).padStart(2, "0") + ":" +
      String(seconds).padStart(2, "0")
    );
  }

  var uptimeCounter = document.getElementById("uptime-counter");
  var uptimeFooter = document.getElementById("uptime-footer");

  function tickUptime() {
    var diff = Date.now() - BOOT_DATE.getTime();
    var formatted = formatUptime(diff);
    if (uptimeCounter) uptimeCounter.textContent = formatted;
    if (uptimeFooter) uptimeFooter.textContent = formatted;
  }

  if (uptimeCounter || uptimeFooter) {
    tickUptime();
    if (!reduceMotion) {
      setInterval(tickUptime, 1000);
    }
  }

  /* ---------- Hero typewriter ---------- */
  var outputLines = document.querySelectorAll(".line--out:not(.line--uptime) span");

  function typeLine(el, text, speed, callback) {
    var i = 0;
    (function step() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        i++;
        setTimeout(step, speed);
      } else if (callback) {
        callback();
      }
    })();
  }

  function runTypewriter() {
    var lines = Array.prototype.slice.call(outputLines);
    var idx = 0;
    function next() {
      if (idx >= lines.length) return;
      var el = lines[idx];
      var text = el.parentElement.getAttribute("data-final") || "";
      typeLine(el, text, 22, function () {
        idx++;
        setTimeout(next, 180);
      });
    }
    next();
  }

  if (outputLines.length) {
    if (reduceMotion) {
      outputLines.forEach(function (el) {
        el.textContent = el.parentElement.getAttribute("data-final") || "";
      });
    } else {
      runTypewriter();
    }
  }
})();
