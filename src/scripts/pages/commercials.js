(function () {
  let cleanupCommercialsPage = function () {};

  function initCommercialsPage() {
    cleanupCommercialsPage();

    const modeHeadings = document.querySelectorAll("[data-commercial-mode-heading]");
    if (!modeHeadings.length) {
      cleanupCommercialsPage = function () {};
      return;
    }

    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      modeHeadings.forEach(function (heading) {
        heading.classList.add("is-in-view");
      });

      cleanupCommercialsPage = function () {};
      return;
    }

    let lastScrollY = window.scrollY;
    const observer = new IntersectionObserver(
      function (entries) {
        const currentScrollY = window.scrollY;
        const isScrollingUp = currentScrollY < lastScrollY;
        lastScrollY = currentScrollY;

        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in-view");
            return;
          }

          if (isScrollingUp) {
            entry.target.classList.remove("is-in-view");
          }
        });
      },
      {
        threshold: 0.01,
        rootMargin: "-35% 0px -35% 0px",
      }
    );

    modeHeadings.forEach(function (heading) {
      observer.observe(heading);
    });

    cleanupCommercialsPage = function () {
      observer.disconnect();
    };
  }

  if (!window.__panebarcoCommercialsBound) {
    document.addEventListener("astro:before-swap", function () {
      cleanupCommercialsPage();
    });

    document.addEventListener("astro:page-load", initCommercialsPage);
    window.__panebarcoCommercialsBound = true;
  }

  initCommercialsPage();
})();
