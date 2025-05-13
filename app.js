
// ------------------------------
// 1) Imports Firebase & i18n
// ------------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// ------------------------------
// 2) Variables globales
// ------------------------------
let currentLang = 'fr';  // langue active
const firebaseApp = initializeApp({
  apiKey: "AIzaSyCsq9a_DFYnv2q4ZojJQ40MQVLpl5LAS-s",
  authDomain: "memo-coffee.firebaseapp.com",
  projectId: "memo-coffee",
  storageBucket: "memo-coffee.firebasestorage.app",
  messagingSenderId: "553680788912",
  appId: "1:553680788912:web:ba31ba1df4102b38110a75",
  measurementId: "G-SY7TKEEEE2"
});
const db = getFirestore(firebaseApp);
const reviewsCol = collection(db, "reviews");

// ------------------------------
// 3) Affichage des boutons de langue
// ------------------------------
function updateLangButtons() {
  document.getElementById('lang-vn')
    .classList.toggle('hidden', currentLang === 'vn');
  document.getElementById('lang-fr')
    .classList.toggle('hidden', currentLang === 'fr');
}

// ------------------------------
// 4) Firestore : envoyer + charger les avis
// ------------------------------
async function postReview({ name, rating, comment }) {
  try {
    await addDoc(reviewsCol, {
      name: name || "Anonyme",
      rating,
      comment,
      timestamp: serverTimestamp()
    });
  } catch (e) {
    console.error("Erreur ajout avis :", e);
  }
}

async function loadReviews() {
  const q = query(reviewsCol, orderBy("timestamp", "desc"));
  const snapshot = await getDocs(q);
  const ul = document.getElementById("reviews-list");
  if (!ul) return;
  ul.innerHTML = "";
  snapshot.forEach(doc => {
    const { name, rating, comment } = doc.data();
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${name}</strong> — ${"★".repeat(rating)}${"☆".repeat(5 - rating)}
      <p>${comment}</p>
    `;
    ul.appendChild(li);
  });
}

// ------------------------------
// 5) i18n : charger et appliquer
// ------------------------------
async function loadTranslations(lang) {
  const res = await fetch(`locales/${lang}.json`);
  return await res.json();
}

function applyTranslations(trans) {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (trans[key]) el.textContent = trans[key];
  });
  const infoEl = document.getElementById("language-info");
  if (infoEl) {
    const infoKey = currentLang === 'fr' ? 'langInfo.fr' : 'langInfo.vn';
    if (trans[infoKey]) {
      infoEl.textContent = trans[infoKey];
    }
  }
}

// ------------------------------
// 6) Chargement dynamique de pages
// ------------------------------
async function loadPage(page) {
  console.log("👉 loadPage appelé avec page =", page);
  const res = await fetch(`./partials/${page}.html`);
  console.log(`📄 fetch ./partials/${page}.html → status`, res.status);
  const html = await res.text();
  console.log("🏷️ HTML reçu :", html.slice(0, 50));
  document.getElementById("content").innerHTML = html;
}

// ------------------------------
// 7) Initialisation générale
// ------------------------------
async function init(page = "home", lang = "fr") {
  // 7.1) Langue
  currentLang = lang;
  updateLangButtons();

  // 7.2) Traductions
  const trans = await loadTranslations(lang);
  try {
    applyTranslations(trans);
  } catch (e) {
    console.error("🛑 Erreur i18n, on continue quand même :", e);
  }

  // 7.3) Contenu dynamique
  await loadPage(page);
  if (page === 'home') {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
// ——— Animation au scroll pour le hero ———
const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      heroObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

// on observe le texte et l’image du hero
document.querySelectorAll('.hero-text, .hero-image').forEach(el => {
  heroObserver.observe(el);
});

  document.querySelectorAll('#hero-image, #project-desc')
    .forEach(el => io.observe(el));
}


  // 7.4) Masquer le splash si jamais il était encore visible
  const splash = document.getElementById("splash");

  // 7.5) Background flou uniquement sur home
  if (page !== 'home') {
    document.querySelector(".background-layer")?.remove();
    document.querySelector(".background-overlay")?.remove();
  }

  // 7.6) Formulaire Contact (Formspree)
  if (page === "contact") {
    const form = document.getElementById("contact-form");
    form?.addEventListener("submit", async e => {
      e.preventDefault();
      const data = new FormData(form);
      const res = await fetch(form.action, {
        method: "POST",
        body: data,
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        form.reset();
        document.getElementById("form-success").style.display = 'block';
      } else {
        alert("Une erreur est survenue, veuillez réessayer.");
      }
    });
  }

  // 7.7) Formulaire d’avis + chargement des avis
  if (page === "home") {
    const rform = document.getElementById("review-form");
    rform?.addEventListener("submit", async e => {
      e.preventDefault();
      if (rform.phone.value) return;  // honeypot
      await postReview({
        name: rform.name.value.trim(),
        rating: Number(rform.rating.value),
        comment: rform.comment.value.trim()
      });
      rform.reset();
      document.getElementById("review-success").style.display = 'block';
      setTimeout(() => {
        document.getElementById("review-success").style.display = 'none';
      }, 3000);
      loadReviews();
      // apparition au scroll pour l'image et la description
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('#hero-image, #project-desc').forEach(el => {
  el.classList.add('hidden-on-scroll');
  io.observe(el);
});

    });
    loadReviews();
    // ——— Animation au scroll pour l’image et la description ———
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

// on observe les deux sections
document.querySelectorAll('#hero-image, #project-desc').forEach(el => {
  el.classList.add('animate-on-scroll');
  io.observe(el);
});

  }

  // 7.8) Mise à jour de la nav active
  document.querySelectorAll(".site-nav a").forEach(a => {
    a.classList.toggle("active", a.dataset.page === page);
  });
}

// ------------------------------
// 8) Événements globaux & démarrage
// ------------------------------
document.querySelectorAll(".site-nav a").forEach(a => {
  a.addEventListener("click", e => {
    e.preventDefault();
    init(a.dataset.page, currentLang);
  });
});
document.getElementById("lang-vn").addEventListener("click", () => {
  init(document.querySelector(".site-nav .active").dataset.page, 'vn');
});
document.getElementById("lang-fr").addEventListener("click", () => {
  init(document.querySelector(".site-nav .active").dataset.page, 'fr');
});
// Observer pour animer au scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.animate-on-scroll').forEach(el => {
  observer.observe(el);
});

// lancement initial
init();
