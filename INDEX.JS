/* ══════════════════════════════════════════════════════
   SmartTrip — Horizon Groupe  |  INDEX.JS
   Carousel boucle + Carte SVG + Notifications Email & WhatsApp
   ══════════════════════════════════════════════════════ */

"use strict";

/* ═══════════════════════════════════════════════════════
   CONFIGURATION GLOBALE (Notifications)
   ═══════════════════════════════════════════════════════ */
const CONFIG = {
  emailjs: {
    publicKey:  "yd2nON7ewanu5Wjn4",
    serviceId:  "service_n9bk1at",
    templateId: "UV0LeVkV5rGCziGWxMzGn",
  },
  ownerEmail: "sowpapa2224@gmail.com",
  ownerPhone: "788988476",
  callmebot: {
    apiKey: "VOTRE_APIKEY", // ⚠️ Remplacer par votre clé API reçue par CallMeBot
  },
};

/* ═══════════════════════════════════════════════════════
   DONNÉES DESTINATIONS
   ═══════════════════════════════════════════════════════ */
const DESTINATIONS = [
  {
    id: 1,
    nom: "Désert de Lompoul",
    categorie: "Aventure",
    description: "Un océan de dunes de sable au cœur du Sénégal. Nuitées en bivouac, balades à dos de chameau et couchers de soleil inoubliables.",
    duree: "2-3 jours",
    prix_base: 85000,
    couleur: "#EF9F27",
    image: "PAYS.jpg", 
    tags: ["Aventure", "Nature"],
    note: 4.9
  },
  {
    id: 2,
    nom: "Parc du Niokolo-Koba",
    categorie: "Nature",
    description: "Réserve naturelle classée UNESCO. Lions, éléphants, hippopotames dans leur habitat naturel lors de safaris authentiques.",
    duree: "3-4 jours",
    prix_base: 120000,
    couleur: "#1D9E75",
    image: "djoudj.jpg",
    tags: ["Nature", "Éco-tourisme"],
    note: 4.8
  },
  {
    id: 3,
    nom: "Île de Gorée / Dakar",
    categorie: "Culturel",
    description: "Patrimoine UNESCO. L'Île de Gorée et la Maison des Esclaves, symboles forts de l'histoire de l'Afrique. Dakar, ville vibrante.",
    duree: "1-2 jours",
    prix_base: 45000,
    couleur: "#A0522D",
    image: "dkr.jpg",
    tags: ["Culturel", "Histoire"],
    note: 4.9
  },
  {
    id: 4,
    nom: "Parc de Djoudj",
    categorie: "Éco-tourisme",
    description: "3e réserve ornithologique mondiale. Des millions de flamants roses, pélicans et hérons dans un cadre naturel exceptionnel.",
    duree: "1-2 jours",
    prix_base: 55000,
    couleur: "#1D9E75",
    image: "lampoul.jpg", 
    tags: ["Éco-tourisme", "Nature"],
    note: 4.7
  },
  {
    id: 5,
    nom: "Saint-Louis",
    categorie: "Culturel",
    description: "Ancienne capitale de l'AOF, classée UNESCO. Architecture coloniale, pont Faidherbe, jazz festival et la langue de Barbarie.",
    duree: "2-3 jours",
    prix_base: 65000,
    couleur: "#378ADD",
    image: "sn.jpg",
    tags: ["Culturel", "Détente"],
    note: 4.8
  },
  {
    id: 6,
    nom: "Casamance",
    categorie: "Détente",
    description: "Le paradis vert et bleu du Sénégal. Plages préservées, forêts tropicales, pirogues sur le fleuve et villages traditionnels Diola.",
    duree: "4-5 jours",
    prix_base: 150000,
    couleur: "#378ADD",
    image: "casamance2.jpg",
    tags: ["Détente", "Éco-tourisme"],
    note: 4.9
  }
];

// Helper pour mapper rapidement les IDs avec les noms de destination
const DEST_MAP = DESTINATIONS.reduce((acc, curr) => {
  acc[curr.id] = curr.nom;
  return acc;
}, {});

/* ═══════════════════════════════════════════════════════
   CHARGEMENT ASYNCHRONE D'EMAILJS
   ═══════════════════════════════════════════════════════ */
(function loadEmailJS() {
  if (document.querySelector('script[src*="email.min.js"]')) return;
  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
  script.onload = () => emailjs.init(CONFIG.emailjs.publicKey);
  document.head.appendChild(script);
})();

/* ═══════════════════════════════════════════════════════
   FONCTIONS UTILITAIRES
   ═══════════════════════════════════════════════════════ */
function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function showToast(message, type = "success") {
  const oldToast = document.getElementById("toast");
  if (oldToast) oldToast.remove();

  const toast = document.createElement("div");
  toast.id = "toast";
  toast.className = `toast ${type === "error" ? "toast--error" : ""}`;
  
  toast.innerHTML = `
    <span class="toast-icon">${type === "error" ? "❌" : "✅"}</span>
    <span id="toastMsg">${message}</span>
  `;

  // Styles de base dynamiques au cas où le CSS externe manque
  Object.assign(toast.style, {
    position: "fixed", bottom: "2rem", right: "2rem",
    background: type === "success" ? "#1a7a4a" : "#c0392b",
    color: "#fff", padding: "1rem 1.5rem", borderRadius: "10px",
    fontSize: "0.95rem", fontWeight: "600",
    boxShadow: "0 4px 20px rgba(0,0,0,0.25)", zIndex: "9999",
    opacity: "0", transform: "translateY(20px)",
    transition: "all 0.4s ease", maxWidth: "320px"
  });

  document.body.appendChild(toast);
  
  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  });

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
    setTimeout(() => toast.remove(), 400);
  }, 4500);
}

/* ═══════════════════════════════════════════════════════
   INTERFACE & EFFETS VISUELS
   ═══════════════════════════════════════════════════════ */
function initProgressBar() {
  const bar = document.getElementById("progressBar");
  if (!bar) return;
  window.addEventListener("scroll", () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    bar.style.width = Math.min((scrollTop / (scrollHeight - clientHeight)) * 100, 100) + "%";
  }, { passive: true });
}

function initNavbar() {
  const navbar   = document.getElementById("navbar");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");

  if (navbar) {
    window.addEventListener("scroll", () => {
      navbar.classList.toggle("scrolled", window.scrollY > 60);
    }, { passive: true });
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + e.target.id));
      }
    });
  }, { rootMargin: "-50% 0px -50% 0px" });

  sections.forEach(s => obs.observe(s));
}

function initMobileMenu() {
  const burger     = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  if (!burger || !mobileMenu) return;

  burger.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("open");
    burger.classList.toggle("open", open);
  });

  mobileMenu.querySelectorAll("a").forEach(l => l.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
    burger.classList.remove("open");
  }));

  document.addEventListener("click", (e) => {
    if (!burger.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove("open");
      burger.classList.remove("open");
    }
  });
}

function initScrollReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("is-visible"); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });

  document.querySelectorAll(".fade-in,.reveal-fade,.reveal-up,.reveal-right")
    .forEach(el => obs.observe(el));
}

function initCounters() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.target, 10);
      const start  = performance.now();
      const dur    = 1800;
      const step   = (ts) => {
        const p = Math.min((ts - start) / dur, 1);
        const v = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(v * target).toLocaleString("fr-FR");
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString("fr-FR");
      };
      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll(".stat-num[data-target]").forEach(el => obs.observe(el));
}

function initParticles() {
  const container = document.getElementById("heroParticles");
  if (!container) return;
  for (let i = 0; i < 18; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    const size = Math.random() * 80 + 20;
    p.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}%;bottom:-${size}px;animation-delay:${Math.random()*12}s;animation-duration:${Math.random()*10+12}s;`;
    container.appendChild(p);
  }
}

/* ═══════════════════════════════════════════════════════
   CAROUSELS (Hero & Destinations)
   ═══════════════════════════════════════════════════════ */
function initHeroCarousel() {
  const track  = document.getElementById("heroCarouselTrack");
  const dotsEl = document.getElementById("heroDots");
  if (!track || !dotsEl) return;

  const slides = Array.from(track.querySelectorAll(".hero-slide"));
  const total  = slides.length;
  let current  = 0;
  let timer    = null;

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "carousel-dot" + (i === 0 ? " active" : "");
    dot.addEventListener("click", () => goTo(i));
    dotsEl.appendChild(dot);
  });

  function goTo(idx) {
    current = ((idx % total) + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsEl.querySelectorAll(".carousel-dot").forEach((d, i) =>
      d.classList.toggle("active", i === current)
    );
  }

  function next() { goTo(current + 1); }
  function startAuto() { timer = setInterval(next, 3200); }
  function stopAuto()  { clearInterval(timer); }

  const carouselParent = track.closest(".hero-carousel");
  if (carouselParent) {
    carouselParent.addEventListener("mouseenter", stopAuto);
    carouselParent.addEventListener("mouseleave", startAuto);
  }

  startAuto();
}

function buildDestCard(dest) {
  const card = document.createElement("div");
  card.className = "dest-card";
  card.dataset.cat = dest.categorie;
  
  card.innerHTML = `
    <div class="dest-card-img" style="background-image: url('${dest.image}'); background-size: cover; background-position: center; height: 220px; border-top-left-radius: 16px; border-top-right-radius: 16px;"></div>
    <div class="dest-card-body">
      <h3 class="dest-card-title">${dest.nom}</h3>
      <p class="dest-card-desc">${dest.description}</p>
      <div class="dest-card-tags">
        ${dest.tags.map(t => `<span class="dest-tag">${t}</span>`).join("")}
        <span class="dest-tag">⏱️ ${dest.duree}</span>
      </div>
      <div class="dest-card-footer">
        <span class="dest-rating">
          <span class="star" style="color: #FFB100;">★</span> ${dest.note}
        </span>
        <span class="dest-price">dès <strong>${dest.prix_base.toLocaleString("fr-FR")} FCFA</strong></span>
      </div>
    </div>
  `;

  card.addEventListener("click", () => {
    const sel = document.getElementById("destination");
    if (sel) {
      sel.value = dest.id;
      document.getElementById("reservations")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  return card;
}

function initDestinationsCarousel() {
  const track   = document.getElementById("destinationsTrack");
  const prevBtn = document.getElementById("destPrev");
  const nextBtn = document.getElementById("destNext");
  if (!track) return;

  track.innerHTML = ""; 

  const allDests = [...DESTINATIONS, ...DESTINATIONS]; 
  allDests.forEach(d => track.appendChild(buildDestCard(d)));

  const CARD_W   = 300 + 26; 
  let pos        = 0;
  let autoTimer  = null;

  function slideTo(newPos) {
    pos = newPos;
    if (pos >= DESTINATIONS.length) {
      setTimeout(() => {
        track.style.transition = "none";
        pos = 0;
        track.style.transform = `translateX(0)`;
        track.offsetHeight;
        track.style.transition = "";
      }, 560);
    }
    if (pos < 0) {
      pos = DESTINATIONS.length - 1;
    }
    track.style.transform = `translateX(-${pos * CARD_W}px)`;
  }

  if (nextBtn) nextBtn.addEventListener("click", () => slideTo(pos + 1));
  if (prevBtn) prevBtn.addEventListener("click", () => slideTo(pos - 1));

  function startAuto() { autoTimer = setInterval(() => slideTo(pos + 1), 3800); }
  function stopAuto()  { clearInterval(autoTimer); }

  const wrapper = document.querySelector(".destinations-carousel-wrapper");
  if (wrapper) {
    wrapper.addEventListener("mouseenter", stopAuto);
    wrapper.addEventListener("mouseleave", startAuto);
  }

  startAuto();

  const filterBtns = document.querySelectorAll(".filter-btn");
  const grid       = document.getElementById("destinationsGrid");
  const carWrapper = document.querySelector(".destinations-carousel-wrapper");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;

      if (filter === "all") {
        if (carWrapper) carWrapper.style.display = "";
        if (grid)       grid.style.display = "none";
        startAuto();
      } else {
        if (carWrapper) carWrapper.style.display = "none";
        if (grid) {
          grid.style.display = "grid";
          grid.innerHTML = "";
          const filtered = DESTINATIONS.filter(d => d.tags.includes(filter) || d.categorie === filter);
          if (filtered.length === 0) {
            grid.innerHTML = `<p style="color:var(--text-muted);padding:2rem">Aucune destination dans cette catégorie pour le moment.</p>`;
          } else {
            filtered.forEach(d => {
              const card = buildDestCard(d);
              card.style.opacity = "1";
              card.style.transform = "none";
              grid.appendChild(card);
            });
          }
        }
        stopAuto();
      }
    });
  });
}

/* ═══════════════════════════════════════════════════════
   CARTE SVG & NAVIGATION FLUIDE
   ═══════════════════════════════════════════════════════ */
function initMapInteractions() {
  const pins        = document.querySelectorAll(".map-pin");
  const legendItems = document.querySelectorAll(".legend-item");

  legendItems.forEach(item => {
    item.addEventListener("click", () => {
      const idx = item.dataset.idx;
      legendItems.forEach(li => li.classList.remove("active"));
      item.classList.add("active");

      const pin = document.querySelector(`.map-pin[data-idx="${idx}"]`);
      if (pin) {
        const dot = pin.querySelector(".pin-dot");
        if (dot) {
          dot.style.transform = "scale(1.8)";
          setTimeout(() => { dot.style.transform = ""; }, 600);
        }
      }
    });
  });

  pins.forEach(pin => {
    pin.addEventListener("click", () => {
      const idx  = pin.dataset.idx;
      const dest = DESTINATIONS[idx];
      if (!dest) return;
      const sel = document.getElementById("destination");
      if (sel) {
        sel.value = dest.id;
        document.getElementById("reservations")?.scrollIntoView({ behavior: "smooth" });
        showToast(`📍 ${dest.nom} sélectionné — renseignez vos dates`);
      }
    });
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      const nav = document.getElementById("navbar")?.offsetHeight || 70;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - nav, behavior: "smooth" });
    });
  });
}

/* ═══════════════════════════════════════════════════════
   MOTEURS DE NOTIFICATIONS (E-mail & WhatsApp)
   ═══════════════════════════════════════════════════════ */
async function sendEmailNotification(data) {
  return emailjs.send(CONFIG.emailjs.serviceId, CONFIG.emailjs.templateId, {
    to_email:     CONFIG.ownerEmail,
    destination:  data.destination,
    date_arrivee: data.date_arrivee,
    date_depart:  data.date_depart,
    nom:          data.nom,
    telephone:    data.telephone,
    email_client: data.email,
    nb_personnes: data.nb_personnes,
    message:      data.message || "Aucun message",
  });
}

async function sendWhatsAppNotification(data) {
  if (!CONFIG.callmebot.apiKey || CONFIG.callmebot.apiKey === "VOTRE_APIKEY") {
    console.warn("Notification WhatsApp ignorée : Clé API CallMeBot non configurée.");
    return;
  }
  const texte =
    `🌍 *NOUVELLE RÉSERVATION — Horizon Groupe*\n\n` +
    `📍 *Destination :* ${data.destination}\n` +
    `📅 *Arrivée :* ${data.date_arrivee}\n` +
    `📅 *Départ :* ${data.date_depart}\n` +
    `👤 *Nom :* ${data.nom}\n` +
    `📞 *Tél :* ${data.telephone}\n` +
    `✉️ *Email :* ${data.email}\n` +
    `👥 *Personnes :* ${data.nb_personnes}\n` +
    `💬 *Message :* ${data.message || "Aucun"}`;

  const url = `https://api.callmebot.com/whatsapp.php?phone=221${CONFIG.ownerPhone}&text=${encodeURIComponent(texte)}&apikey=${CONFIG.callmebot.apiKey}`;
  await fetch(url, { method: "GET", mode: "no-cors" });
}

/* ═══════════════════════════════════════════════════════
   FORMULAIRE DE RÉSERVATION UNIQUE
   ═══════════════════════════════════════════════════════ */
function initReservationForm() {
  const form    = document.getElementById("reservationForm");
  const btnText = document.querySelector("#submitResa .btn-text");
  const btnLoad = document.querySelector("#submitResa .btn-loader");
  const submit  = document.getElementById("submitResa");

  if (!form) return;

  // Limitation des dates à aujourd'hui minimum
  const today = new Date().toISOString().split("T")[0];
  const arrInput = document.getElementById("dateArrivee");
  const deptInput = document.getElementById("dateDepart");
  
  if (arrInput) arrInput.min = today;
  if (deptInput) deptInput.min = today;

  arrInput?.addEventListener("change", (e) => {
    if (deptInput) deptInput.min = e.target.value;
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) { 
      form.reportValidity(); 
      return; 
    }

    // Gestion de l'état visuel du bouton de chargement
    if (submit) submit.disabled = true;
    if (btnText) btnText.style.display = "none";
    if (btnLoad) btnLoad.style.display = "inline";

    const fd = new FormData(form);
    
    // Extraction propre des champs du formulaire
    const rawDestValue = fd.get("destination") || fd.get("destination_id");
    const data = {
      destination:  DEST_MAP[rawDestValue] || rawDestValue,
      date_arrivee: formatDate(fd.get("dateArrivee") || fd.get("date_arrivee")),
      date_depart:  formatDate(fd.get("dateDepart") || fd.get("date_depart")),
      nom:          fd.get("nomResa") || fd.get("nom"),
      telephone:    fd.get("telephone"),
      email:        fd.get("emailResa") || fd.get("email"),
      nb_personnes: fd.get("nbPersonnes") || fd.get("nb_personnes") || "1",
      message:      fd.get("messageResa") || fd.get("message") || "Aucun",
    };

    try {
      // Envois simultanés E-mailJS + CallMeBot WhatsApp
      await Promise.all([
        sendEmailNotification(data),
        sendWhatsAppNotification(data)
      ]);

      showToast("✅ Réservation envoyée ! L'équipe Horizon Groupe vous contactera sous 24h.");
      form.reset();
    } catch (err) {
      console.error("Erreur d'envoi de la réservation :", err);
      showToast("Erreur lors de l'envoi. Veuillez réessayer ou nous appeler directement.", "error");
    } finally {
      if (submit) submit.disabled = false;
      if (btnText) btnText.style.display = "inline";
      if (btnLoad) btnLoad.style.display = "none";
    }
  });
}

/* ═══════════════════════════════════════════════════════
   INIT GLOBAL
   ═══════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  initProgressBar();
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initCounters();
  initParticles();
  initSmoothScroll();
  initHeroCarousel();
  initDestinationsCarousel();
  initMapInteractions();
  initReservationForm();
});