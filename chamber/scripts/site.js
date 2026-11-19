const menu = document.querySelector("#menu-toggle");
const navigation = document.querySelector("#main-nav");
const desktop = window.matchMedia("(min-width: 44rem)");

function setMenu(isOpen) {
    navigation.hidden = !isOpen;
    menu.setAttribute("aria-expanded", String(isOpen));
}

function applyNavigationLayout() {
    menu.hidden = desktop.matches;
    setMenu(desktop.matches);
}

applyNavigationLayout();
desktop.addEventListener("change", applyNavigationLayout);
menu.addEventListener("click", () => setMenu(navigation.hidden));

document.querySelector("#current-year").textContent = new Date().getFullYear();
document.querySelector("#last-modified").textContent = document.lastModified;
