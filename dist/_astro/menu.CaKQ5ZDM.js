(function () {
  let cleanupMenu = function () {};

  function initMenu() {
    cleanupMenu();

    const menuBtn = document.querySelector(".menu-trigger");
    const topHeader = document.querySelector(".top-header");
    const overlay = document.getElementById("menuOverlay");
    const closeBtn = document.getElementById("menuOverlayClose");
    const hoverBubble = document.getElementById("menuHoverBubble");
    const menuLinks = overlay ? overlay.querySelectorAll(".menu-overlay-link") : [];
    const subMenuLinks = overlay ? overlay.querySelectorAll(".menu-submenu-link") : [];
    const submenuToggleButtons = overlay ? overlay.querySelectorAll(".menu-submenu-toggle") : [];

    if (!menuBtn || !overlay || !closeBtn) {
      cleanupMenu = function () {};
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    function updateCurrentLinkState() {
      const currentPath = window.location.pathname.replace(/\/$/, "") || "/";

      menuLinks.forEach(function (link) {
        const href = link.getAttribute("href");
        if (!href) return;

        const normalizedHref = href.replace(/\/$/, "") || "/";
        const isCurrent = normalizedHref === "/"
          ? currentPath === "/"
          : currentPath === normalizedHref || currentPath.startsWith(normalizedHref + "/");

        link.toggleAttribute("aria-current", isCurrent);
      });
    }

    function updateScrolledHeaderState() {
      if (!topHeader) return;
      const isScrolled = window.scrollY > 8;
      topHeader.classList.toggle("is-scrolled", isScrolled);
      topHeader.classList.toggle("shadow", isScrolled);
    }

    function isMobileMenuViewport() {
      return window.matchMedia("(max-width: 767.98px)").matches;
    }

    function collapseMobileSubmenus() {
      const openItems = overlay.querySelectorAll(".menu-item.is-open");
      openItems.forEach(function (item) {
        item.classList.remove("is-open");
      });

      submenuToggleButtons.forEach(function (button) {
        button.setAttribute("aria-expanded", "false");
      });
    }

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
      collapseMobileSubmenus();
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
      collapseMobileSubmenus();
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

    const parentLinkBySubmenu = new WeakMap();

    updateCurrentLinkState();
    menuBtn.setAttribute("aria-expanded", "false");
    updateScrolledHeaderState();

    menuBtn.addEventListener("click", function () {
      if (overlay.classList.contains("is-open")) {
        closeMenu();
        return;
      }

      openMenu();
    }, { signal });

    closeBtn.addEventListener("click", closeMenu, { signal });

    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) {
        closeMenu();
      }
    }, { signal });

    submenuToggleButtons.forEach(function (button) {
      button.addEventListener("click", function (event) {
        if (!isMobileMenuViewport()) return;

        event.preventDefault();
        event.stopPropagation();

        const item = button.closest(".menu-item");
        if (!item) return;

        const willOpen = !item.classList.contains("is-open");
        collapseMobileSubmenus();

        if (!willOpen) {
          hideBubble();
          return;
        }

        item.classList.add("is-open");
        button.setAttribute("aria-expanded", "true");

        const parentLink = item.querySelector(".menu-overlay-link");
        if (parentLink) {
          showBubbleForLink(parentLink);
        }
      }, { signal });
    });

    menuLinks.forEach(function (link) {
      const item = link.closest(".menu-item");
      const submenu = item ? item.querySelector(".menu-submenu") : null;

      link.addEventListener("mouseenter", function () {
        showBubbleForLink(link);
      }, { signal });

      link.addEventListener("mouseleave", function () {
        if (!submenu || !submenu.matches(":hover")) {
          hideBubble();
        }
      }, { signal });

      link.addEventListener("focus", function () {
        showBubbleForLink(link);
      }, { signal });

      link.addEventListener("blur", function () {
        if (!submenu || !submenu.matches(":focus-within")) {
          hideBubble();
        }
      }, { signal });

      link.addEventListener("click", closeMenu, { signal });

      if (submenu) {
        parentLinkBySubmenu.set(submenu, link);

        submenu.addEventListener("mouseenter", function () {
          showBubbleForLink(link);
        }, { signal });

        submenu.addEventListener("mouseleave", function () {
          hideBubble();
        }, { signal });
      }
    });

    subMenuLinks.forEach(function (link) {
      link.addEventListener("mouseenter", function () {
        const submenu = link.closest(".menu-submenu");
        const parentLink = submenu ? parentLinkBySubmenu.get(submenu) : null;
        if (parentLink) {
          showBubbleForLink(parentLink);
        }
      }, { signal });

      link.addEventListener("focus", function () {
        const submenu = link.closest(".menu-submenu");
        const parentLink = submenu ? parentLinkBySubmenu.get(submenu) : null;
        if (parentLink) {
          showBubbleForLink(parentLink);
        }
      }, { signal });

      link.addEventListener("click", closeMenu, { signal });
    });

    overlay.addEventListener("mouseleave", hideBubble, { signal });

    window.addEventListener("resize", function () {
      if (overlay.classList.contains("is-open")) {
        setMenuCompensation();
      }

      if (!isMobileMenuViewport()) {
        collapseMobileSubmenus();
      }
    }, { signal });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && overlay.classList.contains("is-open")) {
        closeMenu();
      }
    }, { signal });

    window.addEventListener("scroll", updateScrolledHeaderState, { passive: true, signal });

    cleanupMenu = function () {
      controller.abort();
    };
  }

  if (!window.__panebarcoMenuBound) {
    document.addEventListener("astro:before-swap", function () {
      cleanupMenu();
    });

    document.addEventListener("astro:page-load", initMenu);
    window.__panebarcoMenuBound = true;
  }

  initMenu();
})();
