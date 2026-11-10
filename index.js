// Language handling. The content itself is duplicated in the HTML
// (span.en / span.fr pairs); this script only decides which language
// is active. It flips the class on <body>, keeps <html lang> in sync
// for screen readers and search engines, and remembers the choice.
const btnLang = document.getElementById('btn-lang');
const groupSelect = document.getElementById('other_groups');

const pageTitles = {
  en: 'QGIS Canada User Group',
  fr: "Groupe d'utilisateurs QGIS Canada"
};

function applySelectLang(lang) {
  if (!groupSelect) return;
  groupSelect.querySelectorAll('[data-en][data-fr]').forEach(function (el) {
    const text = el.getAttribute('data-' + lang) || el.getAttribute('data-en');
    if (el.tagName === 'OPTGROUP') {
      el.label = text;
    } else {
      el.textContent = text;
    }
  });
}

function setLang(lang) {
  document.body.classList.remove('lang-en', 'lang-fr');
  document.body.classList.add('lang-' + lang);
  document.documentElement.lang = lang;
  document.title = pageTitles[lang];
  // The button shows the language you would switch to
  btnLang.textContent = lang === 'en' ? 'FR' : 'EN';
  applySelectLang(lang);
  try {
    localStorage.setItem('qgis-ca-lang', lang);
  } catch (e) {
    // storage unavailable (private browsing, etc.): no persistence, fine
  }
}

// First visit: follow the browser language. Later visits: saved choice.
let saved = null;
try {
  saved = localStorage.getItem('qgis-ca-lang');
} catch (e) {}
if (saved !== 'en' && saved !== 'fr') {
  saved = (navigator.language || '').toLowerCase().startsWith('fr') ? 'fr' : 'en';
}
setLang(saved);

btnLang.addEventListener('click', function () {
  setLang(document.documentElement.lang === 'en' ? 'fr' : 'en');
});

// Poster modal (opens only when the button is clicked)
const modal = document.getElementById('poster-modal');
const posterImg = document.getElementById('poster-img');
const openBtn = document.getElementById('open-poster');
const closeBtn = document.getElementById('close-poster');

if (modal && posterImg && openBtn && closeBtn) {
  const posterSrc = {
    en: './images/QGIS_Canada_meeting_affiche_courriel_horizontal_EN.jpg',
    fr: './images/QGIS_Canada_rencontre_affiche_courriel_horizontal_FR.jpg'
  };

  function updatePoster() {
    const lang = document.documentElement.lang || 'en';
    posterImg.src = posterSrc[lang] || posterSrc.en;
    posterImg.alt = lang === 'fr' ? 'Affiche QGIS Day' : 'QGIS Day poster';
  }

  function openModal() {
    updatePoster();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });

  // Keep poster in sync if language changes while modal is open
  const originalSetLang = setLang;
  setLang = function (lang) {
    originalSetLang(lang);
    if (modal.classList.contains('active')) updatePoster();
  };
} else {
  console.warn('Poster modal elements missing – check that #poster-modal, #poster-img, #open-poster and #close-poster exist in the HTML.');
}