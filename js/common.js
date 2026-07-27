async function loadComponent(id, file) {
    const container = document.getElementById(id);

    if (!container) return;

    try {
        const response = await fetch(file, { cache: "no-store" });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        container.innerHTML = await response.text();

        if (typeof initNavbar === "function") {
            initNavbar();
        }
    } catch (error) {
        console.error(`Failed to load component ${file}:`, error);
    }
}

const basePath = window.location.pathname.includes("/page/") ? "../" : "";

loadComponent("navbar-container", `${basePath}page/header.html`);
loadComponent("footer-container", `${basePath}page/footer.html`);

// Dynamic year
const year = document.getElementById("year");

if (year) {
    year.textContent = new Date().getFullYear();
}