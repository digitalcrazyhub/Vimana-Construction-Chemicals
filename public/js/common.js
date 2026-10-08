async function loadComponent(id, file) {

    const container = document.getElementById(id);

    if (!container) return;

    try {
        const response = await fetch(file);

        if (!response.ok) return;

        container.innerHTML = await response.text();

        if (typeof window.initNavbar === "function") {
            window.initNavbar();
        }
    } catch (_) {
        /* Components are optional; a failed request must not stop the page. */
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("#year, #vmYear").forEach((year) => {
        year.textContent = new Date().getFullYear();
    });
});
