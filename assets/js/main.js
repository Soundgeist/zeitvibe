/* Zeitvibe Ventures. Progressive enhancement only.
   The page is complete and readable without this file.

   Scroll-reveal animation was removed deliberately: the site's register is
   printed matter, not a product page, and staged fade-ups read as the latter. */

(function () {
  'use strict';

  /* Current year in the footer, so it never goes stale. */
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
