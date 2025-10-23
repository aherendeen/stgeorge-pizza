const nav = document.querySelector(".site-nav");
const toggle = document.querySelector(".menu-toggle");
const highlight = document.querySelector("[data-menu-highlight]");
const grid = document.querySelector("[data-menu-grid]");
const menuDataEl = document.getElementById("menu-data");

const menuData = (() => {
  if (!menuDataEl) return [];
  try {
    return JSON.parse(menuDataEl.textContent || "[]");
  } catch (error) {
    console.error("Unable to parse menu data", error);
    return [];
  }
})();

const tabs = Array.from(document.querySelectorAll("[data-menu-tab]"));

const closeNav = () => {
  if (!nav || !toggle) return;
  nav.setAttribute("data-open", "false");
  toggle.setAttribute("aria-expanded", "false");
};

const openNav = () => {
  if (!nav || !toggle) return;
  nav.setAttribute("data-open", "true");
  toggle.setAttribute("aria-expanded", "true");
};

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    if (expanded) {
      closeNav();
    } else {
      openNav();
    }
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement && window.innerWidth < 780) {
      closeNav();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 780) {
      nav.removeAttribute("data-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

const renderCategory = (id) => {
  if (!grid || !menuData.length) return;
  const category = menuData.find((entry) => entry.id === id) || menuData[0];
  if (!category) return;

  if (highlight) {
    highlight.textContent = category.highlight;
  }

  grid.innerHTML = category.items
    .map((item) => {
      const tags = (item.tags || [])
        .map((tag) => `<span>${tag}</span>`)
        .join("");

      return `
        <article class="menu-item" data-category="${category.id}">
          <header>
            <h3>${item.name}</h3>
            <strong>${item.price}</strong>
          </header>
          <p>${item.description}</p>
          <div class="menu-tags">${tags}</div>
        </article>
      `;
    })
    .join("");
};

if (tabs.length && menuData.length) {
  tabs.forEach((tab) => {
    if (tab.dataset.initial === "true") {
      tab.setAttribute("aria-pressed", "true");
    }

    tab.addEventListener("click", () => {
      tabs.forEach((button) => button.setAttribute("aria-pressed", button === tab ? "true" : "false"));
      renderCategory(tab.dataset.menuTab);
    });
  });

  renderCategory(tabs.find((tab) => tab.dataset.initial === "true")?.dataset.menuTab || menuData[0]?.id);
}

if (menuDataEl) {
  menuDataEl.remove();
}

window.addEventListener("scroll", () => {
  const header = document.querySelector(".site-header");
  if (!header) return;
  if (window.scrollY > 12) {
    header.dataset.scroll = "scrolled";
  } else {
    header.dataset.scroll = "top";
  }
});
