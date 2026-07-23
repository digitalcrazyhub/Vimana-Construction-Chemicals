/* ============ Vimana Static ============ */

// Data
const SERVICES = [
  { icon: "home", title: "Terrace Waterproofing", desc: "UV-resistant membranes engineered to withstand sun, rain and thermal cycling." },
  { icon: "layers", title: "Roof Waterproofing", desc: "Seamless liquid systems and PU coatings for total roof protection." },
  { icon: "droplets", title: "Bathroom Waterproofing", desc: "Cementitious barriers that stop leakage at floor and wall junctions." },
  { icon: "building-2", title: "Basement Waterproofing", desc: "Negative & positive side systems for lasting protection against hydrostatic pressure." },
  { icon: "waves", title: "Swimming Pool", desc: "Crystalline and elastomeric coatings certified for water contact surfaces." },
  { icon: "wrench", title: "Wall Crack Repair", desc: "Structural crack sealing with polymer-modified injection systems." },
  { icon: "factory", title: "Industrial Waterproofing", desc: "Heavy-duty solutions for plants, warehouses and process floors." },
  { icon: "beaker", title: "Injection Grouting", desc: "PU and epoxy grouting to seal active leaks and consolidate substrates." },
];

const PRODUCTS = [
  { img: "assets/product-1.jpg", name: "Vimana ElastoShield", desc: "Elastomeric acrylic waterproof coating for terraces and exteriors." },
  { img: "assets/product-2.jpg", name: "Vimana FlexSeal PU", desc: "High-performance polyurethane sealant for expansion joints." },
  { img: "assets/product-3.jpg", name: "Vimana CrystalGuard", desc: "Crystalline waterproofing powder for concrete substrates." },
  { img: "assets/product-4.jpg", name: "Vimana BondPrime", desc: "Multi-surface bonding primer engineered for maximum adhesion." },
];

const STEPS = [
  { icon: "clipboard-check", title: "Inspection", desc: "On-site survey and leak mapping by certified engineers." },
  { icon: "flask-conical", title: "Analysis", desc: "Substrate, exposure and moisture assessment." },
  { icon: "compass", title: "Recommendation", desc: "Tailored waterproofing system with clear scope and cost." },
  { icon: "hard-hat", title: "Application", desc: "Trained applicators using genuine Vimana chemicals." },
  { icon: "check-circle-2", title: "Quality Testing", desc: "Ponding, adhesion and thickness checks before sign-off." },
  { icon: "shield-check", title: "Warranty Support", desc: "Up to 10-year warranty backed by our service team." },
];

const WHY = [
  { icon: "award", title: "Certified Professionals" },
  { icon: "flask-conical", title: "Premium Chemicals" },
  { icon: "zap", title: "Latest Technology" },
  { icon: "shield-check", title: "Long Lasting Protection" },
  { icon: "wallet", title: "Affordable Pricing" },
  { icon: "timer", title: "On Time Delivery" },
  { icon: "check-circle-2", title: "Warranty Support" },
  { icon: "heart", title: "Customer Satisfaction" },
];

const VM = [
  { icon: "target", title: "Vision", desc: "To be South Asia's most trusted waterproofing partner — protecting every structure we touch for a generation." },
  { icon: "trending-up", title: "Mission", desc: "Deliver honest advice, premium chemicals and expert application on every project — big or small." },
  { icon: "sparkles", title: "Core Values", desc: "Integrity. Craft. Accountability. Continuous innovation. Customer obsession above all else." },
];

const PROCESS = [
  { n: "01", title: "Site Inspection", desc: "Detailed on-site visit and leak mapping." },
  { n: "02", title: "Problem Analysis", desc: "Root-cause diagnosis and moisture testing." },
  { n: "03", title: "Product Selection", desc: "Right chemistry for substrate and exposure." },
  { n: "04", title: "Application", desc: "Certified applicators, controlled conditions." },
  { n: "05", title: "Quality Check", desc: "Ponding, thickness and adhesion verification." },
  { n: "06", title: "Project Delivery", desc: "Handover with warranty and care guide." },
];

const INDUSTRIES = [
  { icon: "home", label: "Residential" },
  { icon: "building-2", label: "Commercial" },
  { icon: "factory", label: "Industrial" },
  { icon: "hospital", label: "Hospitals" },
  { icon: "graduation-cap", label: "Educational" },
  { icon: "package", label: "Warehouses" },
  { icon: "hard-hat", label: "Factories" },
  { icon: "truck", label: "Infrastructure" },
];

const REVIEWS = [
  { name: "Rajesh Menon", company: "Skyline Developers", rating: 5, quote: "Vimana solved a persistent basement leakage our previous contractor couldn't fix. Two years later — bone dry. Their process is genuinely thorough." },
  { name: "Anita Sharma", company: "Prakash Residency", rating: 5, quote: "From inspection to warranty, everything was transparent and professional. The terrace looks better than before and the leak is gone for good." },
  { name: "Vikram Rao", company: "Coastal Warehousing Ltd", rating: 5, quote: "We rely on Vimana for all our facility waterproofing. Their chemicals are premium and their applicators are the best trained team we've worked with." },
];

const HERO_SLIDES = [
  { eyebrow: "Residential · Commercial · Industrial", title: "Protect Your Building From Water Damage", desc: "Premium waterproofing solutions engineered by certified experts. Trusted protection that lasts for decades — not seasons." },
  { eyebrow: "Advanced Construction Chemicals", title: "High-Performance Waterproofing Chemicals", desc: "Formulated for long-lasting protection. From liquid membranes to crystalline sealers — every product engineered for real-world performance." },
  { eyebrow: "End-to-End Protection", title: "Built Strong. Protected Forever.", desc: "Complete waterproofing solutions with expert application and premium construction chemicals — one accountable partner from inspection to warranty." },
];

// Render helpers
const el = (h) => { const t = document.createElement("template"); t.innerHTML = h.trim(); return t.content.firstElementChild; };

// Services
document.getElementById("servicesGrid").innerHTML = SERVICES.map(s => `
  <div class="card reveal">
    <div class="icon"><i data-lucide="${s.icon}"></i></div>
    <h3>${s.title}</h3><p>${s.desc}</p>
  </div>`).join("");

// Products
document.getElementById("productsGrid").innerHTML = PRODUCTS.map(p => `
  <div class="product-card reveal">
    <div class="product-img"><img src="${p.img}" alt="${p.name}" loading="lazy"/><span class="product-tag">Vimana</span></div>
    <div class="product-body">
      <h3>${p.name}</h3><p>${p.desc}</p>
      <a href="#products" class="btn-outline">View Product</a>
    </div>
  </div>`).join("");

// Timeline
document.getElementById("timeline").innerHTML = STEPS.map(s => `
  <li class="reveal"><div class="tl-icon"><i data-lucide="${s.icon}"></i></div>
    <h3>${s.title}</h3><p>${s.desc}</p></li>`).join("");

// Why
document.getElementById("whyGrid").innerHTML = WHY.map(w => `
  <div class="why-card reveal"><div class="icon"><i data-lucide="${w.icon}"></i></div><h3>${w.title}</h3></div>`).join("");

// VM
document.getElementById("vmGrid").innerHTML = VM.map(v => `
  <div class="vm-card reveal"><div class="icon"><i data-lucide="${v.icon}"></i></div><h3>${v.title}</h3><p>${v.desc}</p></div>`).join("");

// Process
document.getElementById("processGrid").innerHTML = PROCESS.map(p => `
  <div class="proc-card reveal">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:1rem">
      <div class="proc-num">${p.n}</div>
      <div style="width:40px;height:40px;border-radius:50%;border:1px solid rgba(255,255,255,.2);display:grid;place-items:center"><span class="dot"></span></div>
    </div>
    <h3>${p.title}</h3><p>${p.desc}</p><div class="proc-line"></div>
  </div>`).join("");

// Industries
document.getElementById("industriesGrid").innerHTML = INDUSTRIES.map(i => `
  <div class="ind-card reveal"><div class="icon"><i data-lucide="${i.icon}"></i></div><h3>${i.label}</h3></div>`).join("");

// Reviews
document.getElementById("reviewsGrid").innerHTML = REVIEWS.map(r => `
  <div class="review reveal">
    <div class="stars">${Array.from({length:r.rating}).map(()=>'<i data-lucide="star"></i>').join("")}</div>
    <p>"${r.quote}"</p>
    <div class="reviewer"><div class="avatar">${r.name[0]}</div><div><div class="name">${r.name}</div><div class="company">${r.company}</div></div></div>
  </div>`).join("");

// Hero dots
const dotsEl = document.getElementById("heroDots");
dotsEl.innerHTML = HERO_SLIDES.map((_,i)=>`<button data-i="${i}" class="${i===0?'active':''}" aria-label="Slide ${i+1}"></button>`).join("");

// Year
document.getElementById("year").textContent = new Date().getFullYear();

// Init icons after render
window.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) lucide.createIcons();
  else setTimeout(() => window.lucide && lucide.createIcons(), 400);
});

// Navbar scroll + progress
const nav = document.getElementById("navbar");
const bar = document.getElementById("scrollbar");
const toTop = document.getElementById("toTop");
function onScroll(){
  const h = document.documentElement;
  const total = h.scrollHeight - h.clientHeight;
  const p = total > 0 ? (h.scrollTop/total)*100 : 0;
  bar.style.width = p + "%";
  nav.classList.toggle("scrolled", h.scrollTop > 40);
  toTop.classList.toggle("show", h.scrollTop > 400);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Mobile menu
document.getElementById("mobileToggle").addEventListener("click", () => {
  document.getElementById("mobileMenu").classList.toggle("open");
});
document.querySelectorAll("#mobileMenu a").forEach(a => a.addEventListener("click", ()=>{
  document.getElementById("mobileMenu").classList.remove("open");
}));

// To top
toTop.addEventListener("click", () => window.scrollTo({top:0,behavior:"smooth"}));

// Hero slider
let heroIndex = 0;
const slideEls = document.querySelectorAll(".hero-slide");
function showSlide(i){
  heroIndex = (i + HERO_SLIDES.length) % HERO_SLIDES.length;
  slideEls.forEach((el,idx)=>el.classList.toggle("active", idx===heroIndex));
  document.querySelectorAll("#heroDots button").forEach((b,idx)=>b.classList.toggle("active", idx===heroIndex));
  const s = HERO_SLIDES[heroIndex];
  document.getElementById("heroEyebrow").textContent = s.eyebrow;
  document.getElementById("heroTitle").textContent = s.title;
  document.getElementById("heroDesc").textContent = s.desc;
  document.getElementById("slideNum").textContent = String(heroIndex+1).padStart(2,"0");
}
document.getElementById("prevSlide").addEventListener("click", ()=>showSlide(heroIndex-1));
document.getElementById("nextSlide").addEventListener("click", ()=>showSlide(heroIndex+1));
dotsEl.addEventListener("click", (e)=>{ const b = e.target.closest("button"); if (b) showSlide(+b.dataset.i); });
setInterval(()=>showSlide(heroIndex+1), 6500);

// Reveal on scroll
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e => { if (e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); }});
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

// Counters
const counterIO = new IntersectionObserver((entries)=>{
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const target = +e.target.dataset.count;
    const dur = 1600;
    const start = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - start)/dur);
      const eased = 1 - Math.pow(1-p, 3);
      e.target.textContent = Math.floor(eased * target).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
      else e.target.textContent = target.toLocaleString();
    };
    requestAnimationFrame(tick);
    counterIO.unobserve(e.target);
  });
}, { threshold: 0.4 });
document.querySelectorAll("[data-count]").forEach(el => counterIO.observe(el));

// Re-init lucide after dynamic rendering
setTimeout(()=>{ if (window.lucide) lucide.createIcons(); }, 100);
