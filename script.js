const siteHeader = document.getElementById("siteHeader");
const navToggle = document.getElementById("navToggle");
const navLinksMenu = document.getElementById("navLinks");
const navLinks = [...document.querySelectorAll(".nav-link")];
const pageLinks = [...document.querySelectorAll('a[href^="#"]')].filter(
  (link) => link.hash.length > 1,
);
const topBtn = document.getElementById("topBtn");
const root = document.documentElement;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let headerHeight = 88;
let navigationLock = null;
let navigationTimer;
let scrollTicking = false;

const setMenuOpen = (isOpen) => {
  navLinksMenu.classList.toggle("open", isOpen);
  siteHeader.classList.toggle("menu-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation menu" : "Open navigation menu",
  );

  const icon = navToggle.querySelector("i");
  icon.classList.toggle("bx-menu", !isOpen);
  icon.classList.toggle("bx-x", isOpen);
};

const updateHeaderMetrics = () => {
  headerHeight = Math.ceil(siteHeader.getBoundingClientRect().height);
  root.style.setProperty("--header-height", `${headerHeight}px`);
};

const getScrollOffset = () => {
  const scrollGap = Number.parseFloat(
    getComputedStyle(root).getPropertyValue("--scroll-gap"),
  );

  return headerHeight + (Number.isFinite(scrollGap) ? scrollGap : 22);
};

const navSections = navLinks
  .map((link) => document.getElementById(link.hash.slice(1)))
  .filter(Boolean);

const setActiveNav = (activeId) => {
  navLinks.forEach((link) => {
    const isActive = link.hash === `#${activeId}`;
    link.classList.remove("active");
    link.removeAttribute("aria-current");

    if (isActive) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });
};

const findActiveSectionId = () => {
  if (window.scrollY <= 2) {
    return "home";
  }

  const pageBottom = window.scrollY + window.innerHeight;
  const documentHeight = root.scrollHeight;

  if (pageBottom >= documentHeight - 2) {
    return "contact";
  }

  const viewportTop = getScrollOffset();
  const viewportBottom = window.innerHeight;
  let activeId = "home";
  let largestVisibleArea = -1;

  navSections.forEach((section) => {
    const bounds = section.getBoundingClientRect();
    const visibleTop = Math.max(bounds.top, viewportTop);
    const visibleBottom = Math.min(bounds.bottom, viewportBottom);
    const visibleArea = Math.max(0, visibleBottom - visibleTop);

    if (visibleArea > largestVisibleArea) {
      largestVisibleArea = visibleArea;
      activeId = section.id;
    }
  });

  return activeId;
};

const updatePageState = () => {
  siteHeader.classList.toggle("is-scrolled", window.scrollY > 16);
  topBtn.style.display = window.scrollY > 500 ? "grid" : "none";

  if (!navigationLock) {
    setActiveNav(findActiveSectionId());
  }
};

const finishNavigation = () => {
  if (!navigationLock) {
    return;
  }

  window.clearTimeout(navigationTimer);
  navigationLock = null;
  updatePageState();
};

const scrollToSection = (targetId, updateHash = true) => {
  const target = document.getElementById(targetId);

  if (!target) {
    return;
  }

  setMenuOpen(false);
  navigationLock = targetId;
  setActiveNav(targetId);
  window.clearTimeout(navigationTimer);

  window.requestAnimationFrame(() => {
    updateHeaderMetrics();

    const targetTop =
      targetId === "home"
        ? 0
        : Math.max(
            0,
            window.scrollY + target.getBoundingClientRect().top - getScrollOffset(),
          );

    window.scrollTo({
      top: targetTop,
      behavior: prefersReducedMotion.matches ? "auto" : "smooth",
    });

    if (updateHash) {
      history.replaceState(null, "", `#${targetId}`);
    }

    if (prefersReducedMotion.matches) {
      window.requestAnimationFrame(finishNavigation);
    } else {
      navigationTimer = window.setTimeout(finishNavigation, 1000);
    }
  });
};

navToggle.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  setMenuOpen(!isOpen);
});

pageLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = decodeURIComponent(link.hash.slice(1));

    if (document.getElementById(targetId)) {
      event.preventDefault();
      scrollToSection(targetId);
    }
  });
});

document.addEventListener("click", (event) => {
  if (!siteHeader.contains(event.target)) {
    setMenuOpen(false);
  }
});

document.addEventListener("keydown", (event) => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";

  if (event.key === "Escape" && isOpen) {
    setMenuOpen(false);
    navToggle.focus();
  }
});

window.addEventListener(
  "scroll",
  () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        updatePageState();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  },
  { passive: true },
);

window.addEventListener("scrollend", finishNavigation, { passive: true });

["wheel", "touchstart"].forEach((eventName) => {
  window.addEventListener(eventName, finishNavigation, { passive: true });
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 900) {
    setMenuOpen(false);
  }

  window.requestAnimationFrame(() => {
    updateHeaderMetrics();
    updatePageState();
  });
});

if ("ResizeObserver" in window) {
  new ResizeObserver(updateHeaderMetrics).observe(siteHeader);
}

topBtn.addEventListener("click", () => scrollToSection("home"));

const openCv = () => {
  window.open("./image/Chettha.portfolio.pdf", "_blank", "noopener");
};

document.getElementById("viewCv")?.addEventListener("click", openCv);
document.getElementById("viewCv1")?.addEventListener("click", openCv);

if (window.AOS) {
  AOS.init({
    duration: 650,
    easing: "ease-out",
    once: true,
    offset: 60,
    disable: () => prefersReducedMotion.matches,
  });
}

const form = document.getElementById("contactForm");

if (form && window.emailjs) {
  emailjs.init("uLJ1iD1_xIxe2dM7T");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    emailjs
      .sendForm("service_od3x04l", "template_jh6dxpf", form)
      .then(() => {
        alert("Message sent successfully!");
        form.reset();
      })
      .catch((error) => {
        console.error("Unable to send contact form:", error);
        alert("Failed to send message. Please try again.");
      });
  });
}

updateHeaderMetrics();
updatePageState();

window.addEventListener("load", () => {
  updateHeaderMetrics();

  const initialId = decodeURIComponent(window.location.hash.slice(1));

  if (initialId && document.getElementById(initialId)) {
    scrollToSection(initialId, false);
  } else {
    updatePageState();
  }
});
