(function () {
  const menuBtn = document.querySelector(".menu-trigger");
  const overlay = document.getElementById("menuOverlay");
  const closeBtn = document.getElementById("menuOverlayClose");
  const hoverBubble = document.getElementById("menuHoverBubble");
  const menuLinks = overlay ? overlay.querySelectorAll(".menu-overlay-link") : [];
  const subMenuLinks = overlay ? overlay.querySelectorAll(".menu-submenu-link") : [];

  if (!menuBtn || !overlay || !closeBtn) return;
  if (overlay.dataset.menuInitialized === "true") return;

  overlay.dataset.menuInitialized = "true";
  menuBtn.setAttribute("aria-expanded", "false");

  function setMenuCompensation() {
    const isMobileViewport = window.matchMedia("(max-width: 767.98px)").matches;
    const scrollbarComp = isMobileViewport
      ? 0
      : Math.max(0, window.innerWidth - document.documentElement.clientWidth);

    document.documentElement.style.setProperty(
      "--menu-scrollbar-comp",
      scrollbarComp + "px"
    );
  }

  function openMenu() {
    setMenuCompensation();
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("menu-open");
    menuBtn.setAttribute("aria-expanded", "true");

    if (hoverBubble) {
      hoverBubble.classList.remove("is-visible");
      hoverBubble.src = "";
    }
  }

  function closeMenu() {
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("menu-open");
    menuBtn.setAttribute("aria-expanded", "false");
    document.documentElement.style.removeProperty("--menu-scrollbar-comp");

    if (hoverBubble) {
      hoverBubble.classList.remove("is-visible");
      hoverBubble.src = "";
    }
  }

  function showBubbleForLink(link) {
    if (!hoverBubble) return;

    const src = link.dataset.bubble;
    if (!src) return;

    const linkRect = link.getBoundingClientRect();
    const overlayRect = overlay.getBoundingClientRect();
    const centerX = linkRect.left - overlayRect.left + linkRect.width / 2;
    const centerY = linkRect.top - overlayRect.top + linkRect.height / 2;

    hoverBubble.src = src;
    hoverBubble.alt = "Balloon " + link.textContent.trim();
    hoverBubble.style.setProperty("--bubble-x", centerX + "px");
    hoverBubble.style.setProperty("--bubble-y", centerY + "px");
    hoverBubble.classList.add("is-visible");
  }

  function hideBubble() {
    if (!hoverBubble) return;
    hoverBubble.classList.remove("is-visible");
  }

  menuBtn.addEventListener("click", function () {
    if (overlay.classList.contains("is-open")) {
      closeMenu();
      return;
    }

    openMenu();
  });

  closeBtn.addEventListener("click", closeMenu);

  overlay.addEventListener("click", function (event) {
    if (event.target === overlay) {
      closeMenu();
    }
  });

  const parentLinkBySubmenu = new WeakMap();

  menuLinks.forEach(function (link) {
    const item = link.closest(".menu-item");
    const submenu = item ? item.querySelector(".menu-submenu") : null;

    link.addEventListener("mouseenter", function () {
      showBubbleForLink(link);
    });

    link.addEventListener("mouseleave", function () {
      if (!submenu || !submenu.matches(":hover")) {
        hideBubble();
      }
    });

    link.addEventListener("focus", function () {
      showBubbleForLink(link);
    });

    link.addEventListener("blur", function () {
      if (!submenu || !submenu.matches(":focus-within")) {
        hideBubble();
      }
    });

    link.addEventListener("click", closeMenu);

    if (submenu) {
      parentLinkBySubmenu.set(submenu, link);

      submenu.addEventListener("mouseenter", function () {
        showBubbleForLink(link);
      });

      submenu.addEventListener("mouseleave", function () {
        hideBubble();
      });
    }
  });

  subMenuLinks.forEach(function (link) {
    link.addEventListener("mouseenter", function () {
      const submenu = link.closest(".menu-submenu");
      const parentLink = submenu ? parentLinkBySubmenu.get(submenu) : null;
      if (parentLink) {
        showBubbleForLink(parentLink);
      }
    });

    link.addEventListener("focus", function () {
      const submenu = link.closest(".menu-submenu");
      const parentLink = submenu ? parentLinkBySubmenu.get(submenu) : null;
      if (parentLink) {
        showBubbleForLink(parentLink);
      }
    });

    link.addEventListener("click", closeMenu);
  });

  overlay.addEventListener("mouseleave", hideBubble);

  window.addEventListener("resize", function () {
    if (overlay.classList.contains("is-open")) {
      setMenuCompensation();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && overlay.classList.contains("is-open")) {
      closeMenu();
    }
  });
})();
