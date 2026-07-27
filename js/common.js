async function loadComponent(id, file) {

    const container = document.getElementById(id);

    if (!container) return;

    const response = await fetch(file);

    container.innerHTML = await response.text();

    initNavbar();
}

loadComponent("navbar-container", "page/header.html");
loadComponent("footer-container", "page/footer.html");

//Dynamic year

const year=document.getElementById("year");

if(year){

    year.textContent=new Date().getFullYear();

}