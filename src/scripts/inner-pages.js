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
