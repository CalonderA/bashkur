let map;
let coveragePolygons = { '2G': [], '3G': [], '4G': [], '5G': [] };
let currentLandmarkIndex = -1;
let isCoverageMode = false;
let isTourActive = false;
let mapMarkers = [];

const landmarksData = [
    {
        coords: [54.7185, 55.9257],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Salavat_Yulaev_Monument.jpg/300px-Salavat_Yulaev_Monument.jpg",
        zoom: 16,
        ru: {
            title: "Памятник Салавату Юлаеву",
            desc: "Символ Башкортостана и Уфы. Самый большой конный памятник в России. Высота достигает 9,8 м, вес — 40 тонн. Скульптор Сосланбек Тавасиев работал над памятником 30 лет."
        },
        ba: {
            title: "Салават Юлаев һәйкәле",
            desc: "Башҡортостандың һәм Өфөнөң символы. Рәсәйҙәге иң ҙур атлы һәйкәл. Бейеклеге 9,8 метр, ауырлығы — 40 тонна. Скульптор Сосланбек Тавасиев һәйкәл өҫтөндә 30 йыл эшләгән."
        }
    },
    {
        coords: [53.0436, 57.0638],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Kapova_cave.jpg/300px-Kapova_cave.jpg",
        zoom: 14,
        ru: {
            title: "Пещера Шульган-Таш",
            desc: "Знаменита наскальными рисунками эпохи палеолита (возраст около 18 тысяч лет). Входит в список наследия ЮНЕСКО."
        },
        ba: {
            title: "Шүлгәнташ мәмерйәһе",
            desc: "Палеолит осорондағы ҡая һүрәттәре менән дан тота (йәше яҡынса 18 мең йыл). ЮНЕСКО мираҫы исемлегенә инә."
        }
    },
    {
        coords: [54.5186, 58.8419],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Iremel_Big.jpg/300px-Iremel_Big.jpg",
        zoom: 13,
        ru: {
            title: "Гора Иремель",
            desc: "Священная гора, вторая по высоте вершина Южного Урала (1582 м). Место силы, окутанное множеством легенд."
        },
        ba: {
            title: "Ирәмәл тауы",
            desc: "Изге тау, Көньяҡ Уралдың бейеклеге буйынса икенсе түбәһе (1582 м). Күп легендалар менән уратып алынған көс урыны."
        }
    },
    {
        coords: [53.5544, 56.0989],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Toratau.jpg/300px-Toratau.jpg",
        zoom: 14,
        ru: {
            title: "Шихан Торатау",
            desc: "Один из древнейших коралловых рифов планеты, величественный шихан. Возраст — около 280-300 миллионов лет."
        },
        ba: {
            title: "Торатау шиханы",
            desc: "Планетаның иң боронғо мәрйен рифтарының береһе, бөйөк шихан. Йәше — яҡынса 280-300 миллион йыл."
        }
    },
    {
        coords: [54.2597, 58.3666],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Inzerskie_Zubchatki.jpg/400px-Inzerskie_Zubchatki.jpg",
        zoom: 13,
        ru: {
            title: "Инзерские Зубчатки",
            desc: "Горный хребет в Белорецком районе. Скалы причудливой формы напоминают зубья крепостной стены или руины древнего замка."
        },
        ba: {
            title: "Инйәр тештәре",
            desc: "Белорет районындағы тау һырты. Сәйер формалағы ҡаялар ҡәлғә стенаһы тешрәрен йәки боронғо һарай емереклектәрен хәтерләтә."
        }
    },
    {
        coords: [55.4261, 56.5539],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Pavlovskoye_Reservoir_2011.jpg/400px-Pavlovskoye_Reservoir_2011.jpg",
        zoom: 12,
        ru: {
            title: "Павловское водохранилище",
            desc: "Крупнейшее водохранилище Башкортостана. Живописные берега, отличная рыбалка и возможность для водных прогулок."
        },
        ba: {
            title: "Павловка һыуһаҡлағысы",
            desc: "Башҡортостандың иң ҙур һыуһаҡлағысы. Йәмле ярҙар, шәп балыҡ тотоу һәм һыуҙа йөрөү мөмкинлеге."
        }
    },
    {
        coords: [54.7222, 55.9444],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Fountain_Seven_girls_Ufa.jpg/400px-Fountain_Seven_girls_Ufa.jpg",
        zoom: 17,
        ru: {
            title: "Фонтан «Семь девушек»",
            desc: "Самый музыкальный фонтан Уфы. Скульптуры изображают героинь древней башкирской легенды и знаменитого танца."
        },
        ba: {
            title: "«Ете ҡыҙ» фонтаны",
            desc: "Өфөләге иң музыкаль фонтан. Скульптуралар боронғо башҡорт легендаһы һәм билдәле бейеү героиняларын һүрәтләй."
        }
    },
    {
        coords: [54.3550, 55.8740],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Blue_lake_Bashkortostan.jpg/400px-Blue_lake_Bashkortostan.jpg",
        zoom: 15,
        ru: {
            title: "Голубое озеро (Зянгяр-куль)",
            desc: "Уникальное карстовое озеро с водой лазурного цвета. Температура воды круглый год держится около +5°C."
        },
        ba: {
            title: "Зәңгәр күл",
            desc: "Зәңгәр төҫтәге һыулы уникаль карст күле. Һыу температураһы йыл әйләнәһенә яҡынса +5°C тора."
        }
    },
    {
        coords: [55.2983, 58.1317],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Conference-hall_Yangantau.jpg/400px-Conference-hall_Yangantau.jpg",
        zoom: 13,
        ru: {
            title: "Гора Янган-Тау",
            desc: "«Горящая гора» — уникальный памятник природы. Из недр горы выходят горячие газы и пар. Известный курорт и геопарк ЮНЕСКО."
        },
        ba: {
            title: "Янғантау",
            desc: "«Янған тау» — уникаль тәбиғәт ҡомартҡыһы. Тауҙың төпкөлөнән ҡайнар газдар һәм пар сыға. Билдәле курорт һәм ЮНЕСКО геопаркы."
        }
    },
    {
        coords: [54.3167, 54.5833],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Aslykul_Lake.jpg/400px-Aslykul_Lake.jpg",
        zoom: 12,
        ru: {
            title: "Озеро Аслыкуль",
            desc: "Самое большое озеро Башкортостана. Живописное место с чистой водой и богатой природой. Памятник природы."
        },
        ba: {
            title: "Асылыкүл",
            desc: "Башҡортостандың иң ҙур күле. Таҙа һыулы һәм бай тәбиғәтле йәмле урын. Тәбиғәт ҡомартҡыһы."
        }
    },
    {
        coords: [54.8197, 56.0558],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Lala_Tulpan_mosque.jpg/400px-Lala_Tulpan_mosque.jpg",
        zoom: 16,
        ru: {
            title: "Мечеть «Ляля-Тюльпан»",
            desc: "Одна из главных мечетей Уфы. Архитектурный облик напоминает цветущий тюльпан — символ весны и возрождения."
        },
        ba: {
            title: "«Ләлә-Тюльпан» мәсете",
            desc: "Өфөнөң төп мәсеттәренең береһе. Архитектура ҡиәфәте сәскә атҡан тюльпанды — яҙ һәм яңырыу символын хәтерләтә."
        }
    },
    {
        coords: [55.3833, 56.6500],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Krasny_Klyuch_Spring.jpg/400px-Krasny_Klyuch_Spring.jpg",
        zoom: 15,
        ru: {
            title: "Источник Красный Ключ",
            desc: "Самый крупный родник в России и второй по величине в мире. Вода выходит из карстовых воронок мощным потоком."
        },
        ba: {
            title: "Ҡыҙыл Шишмә",
            desc: "Рәсәйҙә иң ҙур һәм донъяла ҙурлығы буйынса икенсе шишмә. Һыу карст упҡындарынан ҡеүәтле ағым менән сыға."
        }
    }
];

function initMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;
    
    // Ensure container has height
    if (mapContainer.offsetHeight === 0) {
        mapContainer.style.height = '450px';
    }

    // Check if Leaflet is loaded
    if (typeof L === 'undefined') {
        mapContainer.innerHTML = 'Leaflet library not found.';
        return;
    }

    try {
        // Clear any previous content/loading text
        mapContainer.innerHTML = '';

        // Create UI elements
        const tourBtn = document.createElement('button');
        tourBtn.innerText = "🚀 3D Тур по Башкирии";
        tourBtn.className = "tour-btn";
        tourBtn.onclick = startTour;
        mapContainer.appendChild(tourBtn);
        mapContainer.style.position = 'relative';

        // Add Arrows
        const leftArrow = document.createElement('button');
        leftArrow.innerHTML = '❮';
        leftArrow.className = 'map-nav-arrow left';
        leftArrow.style.display = 'none'; // Initially hidden
        leftArrow.onclick = () => navigateTour(-1);
        mapContainer.appendChild(leftArrow);

        const rightArrow = document.createElement('button');
        rightArrow.innerHTML = '❯';
        rightArrow.className = 'map-nav-arrow right';
        rightArrow.style.display = 'none'; // Initially hidden
        rightArrow.onclick = () => navigateTour(1);
        mapContainer.appendChild(rightArrow);

        // Add Coverage Filters
        const filters = document.createElement('div');
        filters.id = 'coverage-filters';
        filters.className = 'coverage-filters';
        filters.style.display = 'none';
        filters.innerHTML = `
            <div class="filters-title">Покрытие сети</div>
            <label><input type="checkbox" checked onchange="toggleLayer('2G')"> <span>2G</span></label>
            <label><input type="checkbox" checked onchange="toggleLayer('3G')"> <span>3G</span></label>
            <label><input type="checkbox" checked onchange="toggleLayer('4G')"> <span>4G/LTE</span></label>
            <label><input type="checkbox" checked onchange="toggleLayer('5G')"> <span>5G</span></label>
        `;
        mapContainer.appendChild(filters);

        // Initialize Leaflet Map
        map = L.map('map', {
            center: [54.7351, 55.9587],
            zoom: 12,
            zoomControl: false, // We'll add it or move it if needed
            attributionControl: false
        });

        // Add Light Theme Tile Layer (CartoDB Positron)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);

        L.control.zoom({
            position: 'topright'
        }).addTo(map);

        // Landmarks Markers
        mapMarkers = [];
        landmarksData.forEach((place, index) => {
            const marker = L.marker(place.coords).addTo(map);
            marker._id = index;
            mapMarkers.push(marker);
            updateMarkerPopup(marker, place, window.currentLang || 'ru');
        });

        // Route Polyline
        const routeCoords = landmarksData.map(l => l.coords);
        L.polyline(routeCoords, {
            color: '#00E676', // Bashkir Green
            weight: 5,
            dashArray: '10, 10',
            opacity: 0.8
        }).addTo(map);

        const covBtn = document.createElement('button');
        covBtn.innerText = "📶 Покрытие T2";
        covBtn.className = "tour-btn";
        covBtn.style.top = "80px";
        covBtn.onclick = toggleCoverage;
        mapContainer.appendChild(covBtn);

    } catch (e) {
        console.error("Map init error:", e);
        mapContainer.innerHTML = "Ошибка инициализации карты: " + e.message;
    }
}

function updateMarkerPopup(marker, place, lang) {
    const data = place[lang] || place['ru'];
    const popupContent = `
        <div class="popup-content" style="text-align: center; min-width: 200px;">
            <h3 style="margin: 0 0 10px 0; color: #333; font-size: 16px;">${data.title}</h3>
            <img src="${place.image}" alt="${data.title}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <p style="margin: 0; font-size: 13px; color: #555; line-height: 1.4;">${data.desc}</p>
        </div>
    `;
    marker.bindPopup(popupContent);
}

function updateMapLanguage(lang) {
    if (!map || !mapMarkers.length) return;
    mapMarkers.forEach(marker => {
        const place = landmarksData[marker._id];
        updateMarkerPopup(marker, place, lang);
    });
    
    // Update tour label if active
    if (currentLandmarkIndex >= 0) {
        const place = landmarksData[currentLandmarkIndex];
        const data = place[lang] || place['ru'];
        showMapLabel(data.title, data.desc, place.image);
    }
}

function toggleCoverage() {
    if (!map) return;
    
    // Toggle state
    isCoverageMode = !isCoverageMode;
    const filters = document.getElementById('coverage-filters');
    const label = document.getElementById('map-label');

    // If turning off
    if (!isCoverageMode) {
        if (filters) filters.style.display = 'none';
        
        // Hide label if it's the coverage one
        if (label && label.innerText.includes("Покрытие")) {
            label.style.display = 'none';
        }

        // Remove all polygons
        Object.values(coveragePolygons).forEach(arr => {
            if (Array.isArray(arr)) arr.forEach(p => p.remove());
        });
        coveragePolygons = { '2G': [], '3G': [], '4G': [], '5G': [] };
        
        return;
    }

    // Turning on
    if (filters) filters.style.display = 'flex';
    
    // Initialize storage if needed
    if (Array.isArray(coveragePolygons)) {
         coveragePolygons = { '2G': [], '3G': [], '4G': [], '5G': [] };
    }

    const centerLat = 54.7351;
    const centerLon = 55.9587;

    // Define Coverage Zones (Smooth Circles/Blobs)
    // 5G - High speed in center
    const zone5G = L.circle([centerLat, centerLon], {
        color: '#9C27B0',
        fillColor: '#9C27B0',
        fillOpacity: 0.3,
        radius: 2000, // 2km
        weight: 1
    }).addTo(map);
    coveragePolygons['5G'].push(zone5G);

    // 4G - City wide
    const zone4G = L.circle([centerLat, centerLon], {
        color: '#00E676',
        fillColor: '#00E676',
        fillOpacity: 0.2,
        radius: 6000, // 6km
        weight: 1
    }).addTo(map);
    coveragePolygons['4G'].push(zone4G);

    // 4G - Additional Hub (e.g. Airport/North)
    const zone4G_2 = L.circle([centerLat + 0.08, centerLon + 0.05], {
        color: '#00E676',
        fillColor: '#00E676',
        fillOpacity: 0.2,
        radius: 3500,
        weight: 1
    }).addTo(map);
    coveragePolygons['4G'].push(zone4G_2);

    // 3G - Wide coverage
    const zone3G = L.circle([centerLat, centerLon], {
        color: '#2979FF',
        fillColor: '#2979FF',
        fillOpacity: 0.1,
        radius: 12000, // 12km
        weight: 1
    }).addTo(map);
    coveragePolygons['3G'].push(zone3G);

    // 2G - Entire region
    const zone2G = L.circle([centerLat, centerLon], {
        color: '#FFC107',
        fillColor: '#FFC107',
        fillOpacity: 0.05,
        radius: 25000, // 25km
        weight: 1
    }).addTo(map);
    coveragePolygons['2G'].push(zone2G);
}

function toggleLayer(type) {
    if (!coveragePolygons[type]) return;
    const checkbox = document.querySelector(`input[onchange="toggleLayer('${type}')"]`);
    const isVisible = checkbox ? checkbox.checked : true;

    coveragePolygons[type].forEach(p => {
        if (isVisible) p.addTo(map);
        else p.remove();
    });
}

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
    
    if (e.key === 'ArrowRight') {
        navigateTour(1);
    } else if (e.key === 'ArrowLeft') {
        navigateTour(-1);
    }
});

function navigateTour(direction) {
    if (!map) return;
    
    currentLandmarkIndex = (currentLandmarkIndex + direction);
    
    // Wrap around
    if (currentLandmarkIndex >= landmarksData.length) currentLandmarkIndex = 0;
    if (currentLandmarkIndex < 0) currentLandmarkIndex = landmarksData.length - 1;
    
    const place = landmarksData[currentLandmarkIndex];
    const data = place[window.currentLang || 'ru'] || place['ru'];
    
    map.flyTo(place.coords, place.zoom);
    showMapLabel(data.title, data.desc, place.image);
}

function startTour() {
    isTourActive = true;
    document.querySelectorAll('.map-nav-arrow').forEach(el => el.style.display = 'flex');
    navigateTour(1);
}

function showMapLabel(title, desc, image) {
    let label = document.getElementById('map-label');
    if (!label) {
        label = document.createElement('div');
        label.id = 'map-label';
        label.className = 'map-label';
        document.getElementById('map').appendChild(label);
    }
    
    let imgHtml = image ? `<img src="${image}" alt="${title}">` : '';
    
    label.innerHTML = `
        ${imgHtml}
        <div class="map-label-content">
            <strong>${title}</strong>
            <p>${desc}</p>
            <div class="map-actions">
                <button class="map-btn-read">📖 Читать</button>
                <button class="map-btn-photo">📸 Фото</button>
            </div>
            <small>Используйте стрелки ⬅ ➡ для навигации</small>
        </div>
    `;
    label.style.display = 'block';

    // Add event listeners
    const readBtn = label.querySelector('.map-btn-read');
    if(readBtn) {
        readBtn.onclick = (e) => {
            e.stopPropagation();
            alert(desc + '\n\n(Полная статья скоро будет доступна)');
        };
    }

    const photoBtn = label.querySelector('.map-btn-photo');
    if(photoBtn) {
        photoBtn.onclick = (e) => {
             e.stopPropagation();
             if(!image) return;
             
             // Create lightbox
             const lightbox = document.createElement('div');
             lightbox.style.position = 'fixed';
             lightbox.style.top = '0';
             lightbox.style.left = '0';
             lightbox.style.width = '100%';
             lightbox.style.height = '100%';
             lightbox.style.background = 'rgba(0,0,0,0.95)';
             lightbox.style.zIndex = '9999';
             lightbox.style.display = 'flex';
             lightbox.style.alignItems = 'center';
             lightbox.style.justifyContent = 'center';
             lightbox.style.cursor = 'pointer';
             lightbox.style.animation = 'fadeIn 0.3s';
             
             const img = document.createElement('img');
             img.src = image;
             img.style.maxHeight = '90vh';
             img.style.maxWidth = '90vw';
             img.style.borderRadius = '10px';
             img.style.boxShadow = '0 0 50px rgba(0,0,0,0.5)';
             img.style.transform = 'scale(0.9)';
             img.style.transition = 'transform 0.3s';
             
             setTimeout(() => img.style.transform = 'scale(1)', 10);
             
             lightbox.appendChild(img);
             
             const close = document.createElement('div');
             close.innerHTML = '×';
             close.style.position = 'absolute';
             close.style.top = '20px';
             close.style.right = '30px';
             close.style.color = 'white';
             close.style.fontSize = '40px';
             close.style.fontFamily = 'Arial';
             lightbox.appendChild(close);

             lightbox.onclick = () => lightbox.remove();
             document.body.appendChild(lightbox);
        };
    }
}
