
// Translations
const translations = {
    ru: {
        nav_dict: "Словарь",
        nav_culture: "Культура",
        nav_connect: "Связь",
        region: "Башкортостан",
        hero_title: "Открой <span>Башкортостан</span> <br>на скорости T2",
        hero_subtitle: "Будущее связи и вековые традиции в одном месте",
        section_dict: "Язык гор (Тел)",
        learned: "Изучено:",
        from: "из",
        tab_words: "Слова",
        tab_alphabet: "Алфавит",
        tab_about: "О Башкирах",
        tab_test: "Тест",
        section_culture: "Дух Урала",
        map_title: "Карта достопримечательностей",
        footer: "&copy; 2026 T2 Мобайл x Башкортостан. Будущее уже здесь."
    },
    ba: {
        nav_dict: "Һүҙлек",
        nav_culture: "Мәҙәниәт",
        nav_connect: "Бәйләнеш",
        region: "Башҡортостан",
        hero_title: "<span>Башҡортостанды</span> T2 <br>тиҙлегендә ас",
        hero_subtitle: "Бәйләнеш киләсәге һәм быуаттар йолалары бер урында",
        section_dict: "Тауҙар теле",
        learned: "Өйрәнелде:",
        from: "/",
        tab_words: "Һүҙҙәр",
        tab_alphabet: "Әлифба",
        tab_about: "Башҡорттар",
        tab_test: "Тест",
        section_culture: "Урал рухы",
        card_ural_title: "Урал-батыр",
        card_ural_desc: "Кешеләргә ғүмер бүләк иткән һәм үлемде еңгән батыр тураһында боронғо эпос.",
        card_honey_title: "Башҡорт балы",
        card_honey_desc: "Республика алтыны. Һаулыҡ һәм ҡунаҡсыллыҡ символы.",
        card_kurai_title: "Ҡурай",
        card_kurai_desc: "Дала елдәре ишетелгән ҡамыр флейта. Башҡорт халҡының күңел тауышы.",
        map_title: "Иҫтәлекле урындар картаһы",
        footer: "&copy; 2026 T2 Мобайл x Башҡортостан. Киләсәк бында."
    }
};

let currentLang = 'ru';
window.currentLang = currentLang;

function toggleLanguage() {
    currentLang = currentLang === 'ru' ? 'ba' : 'ru';
    window.currentLang = currentLang;
    document.getElementById('current-lang').innerText = currentLang.toUpperCase();
    
    // Update all translatable elements
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (translations[currentLang][key]) {
            el.innerHTML = translations[currentLang][key];
        }
    });

    // Update button style slightly
    const btn = document.querySelector('.lang-switch-btn');
    if (currentLang === 'ba') {
        btn.style.borderColor = '#00E676';
        btn.style.color = '#00E676';
    } else {
        btn.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        btn.style.color = 'white';
    }
}

function initApp() {
    renderLearningContent();
    
    // Start animations or other init logic
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    document.querySelectorAll('.word-card, .story-card').forEach(el => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });

    // Initialize Map directly (Leaflet)
    if (typeof initMap === 'function') {
        initMap();
    }

    // Pre-load voices
    if (window.speechSynthesis) {
        window.speechSynthesis.getVoices();
    }

    // Show Welcome Modal
    setTimeout(() => {
        const modal = document.getElementById('welcome-modal');
        if (modal) {
            modal.classList.add('active');
        }
    }, 1000);
}

// Close Welcome Modal
function closeWelcomeModal() {
    const modal = document.getElementById('welcome-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none'; // Optional: remove from flow after transition
        }, 500);
    }
}
window.closeWelcomeModal = closeWelcomeModal; // Make it globally available

// Add map loading indicator
const mapContainer = document.getElementById('map');
if (mapContainer) {
    mapContainer.innerHTML = '<div style="display:flex;height:100%;align-items:center;justify-content:center;color:#666;">Загрузка карты...</div>';
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
