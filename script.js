// REGISTER SERVICE WORKER
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}

// ART QUOTES
const artQuotes = [
  "Every artist dips his brush in his own soul. – Henry Ward Beecher",
  "Art is not what you see, but what you make others see. – Edgar Degas",
  "Creativity takes courage. – Henri Matisse",
  "I found I could say things with color that I couldn't say any other way. – Georgia O'Keeffe",
  "Art enables us to find ourselves and lose ourselves at the same time. – Thomas Merton",
  "The purpose of art is washing the dust of daily life off our souls. – Pablo Picasso",
  "Art is the lie that enables us to realize the truth. – Pablo Picasso",
  "To be an artist is to believe in life. – Henry Moore",
  "Every child is an artist. The problem is how to remain an artist once we grow up. – Picasso",
  "Art is never finished, only abandoned. – Leonardo da Vinci",
  "Color is a power which directly influences the soul. – Wassily Kandinsky",
  "In art, the hand can never execute anything higher than the heart can imagine. – Emerson",
];

const quoteEl = document.getElementById('art-quote');
const randomQuote = artQuotes[Math.floor(Math.random() * artQuotes.length)];
quoteEl.textContent = `"${randomQuote}"`;

/* ----------------- CONSTANTS ----------------- */
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-description');
const modalPrice = document.getElementById('modal-price');
const modalEnquire = document.getElementById('modal-enquire');

const WA_TEXT = (title, price) => `Hi, I'm interested in "${title}" priced at ₹${price}. Is it available?`;

/* ----------------- MODAL HANDLING ----------------- */
function openModal(p) {
  modalImg.src = p.image;
  modalImg.alt = p.title;
  modalTitle.textContent = p.title;
  modalDesc.textContent = p.description;
  modalPrice.textContent = `Price: ₹${p.price}`;
  modalEnquire.href = `https://wa.me/918926006763?text=${encodeURIComponent(WA_TEXT(p.title, p.price))}`;
  modal.classList.remove('hidden');
}
function closeModal() {
  modal.classList.add('hidden');
}
modal.addEventListener('click', e => {
  if (e.target === modal) closeModal();
});

/* ----------------- NAVBAR BLUR ----------------- */
const navBar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navBar.style.backdropFilter = window.scrollY > 100 ? 'blur(10px)' : 'blur(0)';
});

/* ----------------- INTERSECTION OBSERVER ----------------- */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });
document.querySelectorAll('.section').forEach(sec => observer.observe(sec));

/* ----------------- GALLERY SECTIONS ----------------- */
let currentBudget = 200000;
const isMobile = window.innerWidth <= 768;

function renderAllSections(budgetMax = 200000) {
  const container = document.getElementById('gallery-sections');
  container.innerHTML = '';

  const categories = [...new Set(paintings.map(p => p.category))];

  categories.forEach(cat => {
    const filtered = paintings.filter(p => p.category === cat && p.price <= budgetMax);

    const section = document.createElement('div');
    section.className = 'gallery-section';

    const title = document.createElement('h3');
    title.className = 'gallery-section-title';
    title.textContent = cat;
    section.appendChild(title);

    if (filtered.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'empty-msg';
      empty.textContent = 'No artworks in this budget range.';
      section.appendChild(empty);
    } else {
      const grid = document.createElement('div');
      grid.className = 'gallery-grid-inner';
      grid.style.cssText = 'display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;margin-bottom:1.5rem;';

      filtered.forEach(p => {
        const card = document.createElement('div');
        card.className = 'gallery-card';

        if (isMobile) {
          // MOBILE → no overlay, tap image opens modal directly
          card.innerHTML = `
            <img src="${p.image}" alt="${p.title}" loading="lazy">
          `;
          card.addEventListener('click', () => openModal(p));
        } else {
          // DESKTOP → hover overlay with View + Enquire
          card.innerHTML = `
            <img src="${p.image}" alt="${p.title}" loading="lazy">
            <div class="card-overlay">
              <a href="javascript:void(0)" class="view-btn" data-id="${p.id}">👁 View</a>
              <a href="https://wa.me/918926006763?text=${encodeURIComponent(WA_TEXT(p.title, p.price))}"
                 target="_blank" class="whatsapp-btn" onclick="event.stopPropagation()">💬 Enquire</a>
            </div>
          `;
        }

        grid.appendChild(card);
      });
      section.appendChild(grid);
    }
    container.appendChild(section);
  });

  // attach view btn listeners for desktop only
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = +e.target.dataset.id;
      const p = paintings.find(p => p.id === id);
      openModal(p);
    });
  });
}

/* ----------------- BUDGET SLIDER ----------------- */
const slider = document.getElementById('budget-slider');
const budgetValue = document.getElementById('budget-value');

function formatPrice(val) {
  return '₹' + Number(val).toLocaleString('en-IN');
}

slider.addEventListener('input', () => {
  const val = slider.value;
  const percent = ((val - 2000) / (200000 - 2000)) * 100;
  slider.style.background = `linear-gradient(to right, #f5c518 ${percent}%, #555 ${percent}%)`;
  budgetValue.textContent = formatPrice(val);
  currentBudget = +val;
  renderAllSections(currentBudget);
});

/* ----------------- THEME TOGGLE ----------------- */
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('change', () => {
  document.body.classList.toggle('light', themeToggle.checked);
});

/* ----------------- INSTALL POPUP ----------------- */
let deferredPrompt;
const installPopup = document.getElementById('install-popup');
const installBtn = document.getElementById('install-btn');
const dismissBtn = document.getElementById('dismiss-btn');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

const isInstalled = window.matchMedia('(display-mode: standalone)').matches
  || window.navigator.standalone === true;

if (!isInstalled) {
  setTimeout(() => {
    installPopup.classList.remove('hidden');
    setTimeout(() => {
      installPopup.classList.add('hidden');
    }, 5000);
  }, 5000);
}

installBtn.addEventListener('click', async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    deferredPrompt = null;
  } else {
    alert('To install: Click ⋮ menu → "Install app" or "Add to Home Screen"');
  }
  installPopup.classList.add('hidden');
});

dismissBtn.addEventListener('click', () => {
  installPopup.classList.add('hidden');
});

/* ----------------- INIT ----------------- */
function init() {
  renderAllSections(200000);
}
init();

// HAMBURGER MENU
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', (e) => {
  e.stopPropagation();
  mobileMenu.classList.toggle('hidden');
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
  });
});

document.addEventListener('click', (e) => {
  if (!mobileMenu.contains(e.target) && e.target !== hamburger) {
    mobileMenu.classList.add('hidden');
  }
});