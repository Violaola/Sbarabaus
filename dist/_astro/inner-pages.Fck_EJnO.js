(function () {
  // Astro componentization removes the old HTML partial fetch fallback.
  // This script is now reserved for inner-page-only enhancements.
  const overlay = document.getElementById("menuOverlay");
  if (!overlay) return;

  const currentPath = window.location.pathname.replace(/\/$/, "") || "/";
  const links = overlay.querySelectorAll(".menu-overlay-link");

  links.forEach(function (link) {
    const href = link.getAttribute("href");
    if (!href) return;

    const normalizedHref = href.replace(/\/$/, "") || "/";
    const isCurrent = normalizedHref === "/"
      ? currentPath === "/"
      : currentPath === normalizedHref || currentPath.startsWith(normalizedHref + "/");

    link.toggleAttribute("aria-current", isCurrent);
  });
})();

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

(function () {
  const timeline = document.querySelector("[data-studio-timeline]");
  if (!timeline) return;

  const slidesTrack = timeline.querySelector(".studio-timeline-slides");
  const slides = slidesTrack ? Array.from(slidesTrack.querySelectorAll(".studio-timeline-card")) : [];
  const prevBtn = timeline.querySelector("[data-timeline-prev]");
  const nextBtn = timeline.querySelector("[data-timeline-next]");
  const timelineSection = timeline.closest(".studio-timeline");
  const dots = timelineSection ? Array.from(timelineSection.querySelectorAll("[data-timeline-dot]")) : [];
  const viewport = timeline.querySelector(".studio-timeline-viewport");

  if (!slidesTrack || slides.length === 0 || !prevBtn || !nextBtn || dots.length !== slides.length) {
    return;
  }

  let activeIndex = 0;
  const prefersReducedMotion = window.matchMedia
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    slidesTrack.style.transition = "none";
  }

  function mod(index, length) {
    return ((index % length) + length) % length;
  }

  function render(nextIndex) {
    activeIndex = mod(nextIndex, slides.length);
    slidesTrack.style.transform = "translateX(" + String(activeIndex * -100) + "%)";

    slides.forEach(function (slide, slideIndex) {
      const isActive = slideIndex === activeIndex;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });

    dots.forEach(function (dot, dotIndex) {
      const isActive = dotIndex === activeIndex;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-selected", String(isActive));
      dot.tabIndex = isActive ? 0 : -1;
    });
  }

  prevBtn.addEventListener("click", function () {
    render(activeIndex - 1);
  });

  nextBtn.addEventListener("click", function () {
    render(activeIndex + 1);
  });

  dots.forEach(function (dot, dotIndex) {
    dot.addEventListener("click", function () {
      render(dotIndex);
    });
  });

  if (viewport) {
    let touchStartX = null;

    viewport.addEventListener("touchstart", function (event) {
      if (!event.touches || event.touches.length === 0) return;
      touchStartX = event.touches[0].clientX;
    }, { passive: true });

    viewport.addEventListener("touchend", function (event) {
      if (touchStartX === null || !event.changedTouches || event.changedTouches.length === 0) return;

      const deltaX = event.changedTouches[0].clientX - touchStartX;
      touchStartX = null;

      if (Math.abs(deltaX) < 40) return;
      if (deltaX > 0) {
        render(activeIndex - 1);
        return;
      }

      render(activeIndex + 1);
    }, { passive: true });
  }

  render(0);
})();

(function () {
  const image = document.querySelector("[data-studio-panebarcos-image]");
  const trigger = document.querySelector("[data-studio-panebarcos-trigger]");

  if (!image || !trigger) return;

  const images = [
    "/images/lo-studio-panebarcos-01.jpg",
    "/images/lo-studio-panebarcos-02.jpg",
    "/images/lo-studio-panebarcos-03.jpg",
    "/images/lo-studio-panebarcos-04.jpg",
  ];

  let activeIndex = images.indexOf(image.getAttribute("src") || "");
  if (activeIndex < 0) activeIndex = 0;

  images.slice(1).forEach(function (src) {
    const preloadImage = new Image();
    preloadImage.src = src;
  });

  trigger.addEventListener("click", function () {
    activeIndex = (activeIndex + 1) % images.length;
    image.setAttribute("src", images[activeIndex]);
  });
})();
