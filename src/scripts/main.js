(function () {
  let cleanupHomePage = function () {};

  function setupPortfolioReveal(cleanups) {
    const portfolioSection = document.getElementById("portfolio");
    const nextSection = document.getElementById("paneblog");
    const portfolioCards = portfolioSection
      ? portfolioSection.querySelectorAll(".portfolio-item")
      : [];

    if (!portfolioSection || !nextSection || portfolioCards.length === 0) return;

    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      portfolioCards.forEach(function (card) {
        card.classList.add("is-in-view");
      });
      return;
    }

    portfolioCards.forEach(function (card, index) {
      card.style.transitionDelay = String(index * 0.08) + "s";
    });

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-in-view");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -50% 0px",
      }
    );

    portfolioCards.forEach(function (card) {
      observer.observe(card);
    });

    cleanups.push(function () {
      observer.disconnect();
    });
  }

  function setupRevealTitles(cleanups) {
    const revealTitles = document.querySelectorAll(".section-title-reveal");
    if (!revealTitles.length) return;

    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealTitles.forEach(function (title) {
        title.classList.add("is-in-view");
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

    revealTitles.forEach(function (title) {
      observer.observe(title);
    });

    cleanups.push(function () {
      observer.disconnect();
    });
  }

  function setupTypingText(cleanups) {
    const typingText = document.getElementById("typing-text");
    if (!typingText) return;

    const words = (typingText.dataset.words || "")
      .split("|")
      .map(function (word) {
        return word.trim();
      })
      .filter(Boolean);

    if (words.length === 0) return;

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let currentColor = "#009FE3";
    let timeoutId = null;
    let disposed = false;

    const palette = ["#009FE3", "#B03D4F", "#995791", "#3394B2", "#30997B"];
    const typingSpeed = 90;
    const deletingSpeed = 55;
    const wordPause = 1200;
    const restartPause = 350;

    function queue(nextStep, delay) {
      timeoutId = window.setTimeout(nextStep, delay);
    }

    function animateTyping() {
      if (disposed) return;

      const currentWord = words[wordIndex];

      if (!isDeleting) {
        if (charIndex === 0) {
          currentColor = palette[Math.floor(Math.random() * palette.length)];
          typingText.style.color = currentColor;
        }

        charIndex += 1;
        typingText.textContent = currentWord.slice(0, charIndex).toUpperCase();

        if (charIndex === currentWord.length) {
          isDeleting = true;
          queue(animateTyping, wordPause);
          return;
        }

        queue(animateTyping, typingSpeed);
        return;
      }

      charIndex -= 1;
      typingText.textContent = currentWord.slice(0, Math.max(0, charIndex)).toUpperCase();

      if (charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        queue(animateTyping, restartPause);
        return;
      }

      queue(animateTyping, deletingSpeed);
    }

    typingText.textContent = "";
    queue(animateTyping, 500);

    cleanups.push(function () {
      disposed = true;
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    });
  }

  function setupChatSlider(cleanups) {
    const messages = [
      {
        date: "15/01/2026",
        character: "Maya",
        avatar: "/images/teams-avatar-che-fate-01.png",
        title: "Titolo del messaggio",
        text: "Aenean vel tortor aliquet, lobortis ligula a, tempus metus.",
      },
      {
        date: "22/01/2026",
        character: "Luca",
        avatar: "/images/teams-avatar-che-fate-02.png",
        title: "Secondo messaggio",
        text: "Integer posuere erat a ante venenatis dapibus posuere velit aliquet.",
      },
      {
        date: "30/01/2026",
        character: "Nora",
        avatar: "/images/teams-avatar-che-fate-03.png",
        title: "Terzo messaggio",
        text: "Donec sed odio dui. Cras mattis consectetur purus sit amet fermentum.",
      },
    ];

    const dateEl = document.getElementById("chatSliderDate");
    const titleEl = document.getElementById("chatSliderTitle");
    const textEl = document.getElementById("chatSliderText");
    const avatarImg = document.getElementById("chatSliderAvatarImg");
    const prevBtn = document.getElementById("chatSliderPrev");
    const nextBtn = document.getElementById("chatSliderNext");
    const dotsWrap = document.getElementById("chatSliderDots");
    const chatPop = document.querySelector(".chat-pop");

    if (
      !dateEl ||
      !titleEl ||
      !textEl ||
      !avatarImg ||
      !prevBtn ||
      !nextBtn ||
      !dotsWrap ||
      !chatPop ||
      messages.length === 0
    ) {
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;
    let activeIndex = 0;
    let autoplayTimer = null;

    function mod(index, length) {
      return ((index % length) + length) % length;
    }

    function restartAutoplay() {
      if (autoplayTimer) {
        window.clearInterval(autoplayTimer);
      }

      autoplayTimer = window.setInterval(function () {
        render(activeIndex + 1, false);
      }, 5000);
    }

    dotsWrap.innerHTML = "";
    const dots = messages.map(function (_, index) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "chat-dot";
      dot.setAttribute("aria-label", "Vai al messaggio " + (index + 1));
      dot.addEventListener("click", function () {
        render(index, true);
      }, { signal });
      dotsWrap.appendChild(dot);
      return dot;
    });

    function render(index, userInitiated) {
      activeIndex = mod(index, messages.length);
      const item = messages[activeIndex];

      dateEl.textContent = item.date;
      titleEl.textContent = item.title;
      textEl.textContent = item.text;
      avatarImg.src = item.avatar;
      avatarImg.alt = "Avatar di " + item.character;

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === activeIndex);
      });

      if (userInitiated) {
        restartAutoplay();
      }
    }

    prevBtn.addEventListener("click", function () {
      render(activeIndex - 1, true);
    }, { signal });

    nextBtn.addEventListener("click", function () {
      render(activeIndex + 1, true);
    }, { signal });

    chatPop.addEventListener("mouseenter", function () {
      if (autoplayTimer) {
        window.clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }, { signal });

    chatPop.addEventListener("mouseleave", function () {
      restartAutoplay();
    }, { signal });

    render(0, false);
    restartAutoplay();

    cleanups.push(function () {
      controller.abort();
      if (autoplayTimer) {
        window.clearInterval(autoplayTimer);
      }
    });
  }

  function initHomePage() {
    cleanupHomePage();

    const cleanups = [];
    setupPortfolioReveal(cleanups);
    setupRevealTitles(cleanups);
    setupTypingText(cleanups);
    setupChatSlider(cleanups);

    cleanupHomePage = function () {
      cleanups.forEach(function (dispose) {
        dispose();
      });
    };
  }

  if (!window.__panebarcoHomeBound) {
    document.addEventListener("astro:before-swap", function () {
      cleanupHomePage();
    });

    document.addEventListener("astro:page-load", initHomePage);
    window.__panebarcoHomeBound = true;
  }

  initHomePage();
})();
