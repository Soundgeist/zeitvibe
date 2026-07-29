/* Zeitvibe Ventures — progressive enhancement only.
   The page is complete and readable without this file. */

(function () {
  'use strict';

  /* Current year in the footer, so it never goes stale. */
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  var targets = document.querySelectorAll('[data-reveal]');

  /* No IntersectionObserver (or motion is unwelcome): show everything now. */
  if (!('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('in'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      observer.unobserve(entry.target); // reveal once, never re-hide
    });
  }, {
    rootMargin: '0px 0px -12% 0px',
    threshold: 0.1
  });

  targets.forEach(function (el) { observer.observe(el); });
})();
