(function () {
  const modeHeadings = document.querySelectorAll("[data-commercial-mode-heading]");
  if (!modeHeadings.length) return;

  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    modeHeadings.forEach(function (heading) {
      heading.classList.add("is-in-view");
    });
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
})();
