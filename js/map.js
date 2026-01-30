let map;
let coveragePolygons = [];
let currentLandmarkIndex = -1;

const landmarks = [
    {
        coords: [54.7185, 55.9257],
        title: "Памятник Салавату Юлаеву",
        desc: "Символ Башкортостана и Уфы. Самый большой конный памятник в России.",
        zoom: 16
    },
    {
        coords: [53.0436, 57.0638],
        title: "Пещера Шульган-Таш",
        desc: "Знаменита наскальными рисунками эпохи палеолита.",
        zoom: 14
    },
    {
        coords: [54.5186, 58.8419],
        title: "Гора Иремель",
        desc: "Священная гора, вторая по высоте вершина Южного Урала.",
        zoom: 13
    },
    {
        coords: [53.5544, 56.0989],
        title: "Шихан Торатау",
        desc: "Один из древнейших коралловых рифов планеты, величественный шихан.",
        zoom: 14
    },
    {
        coords: [54.7351, 55.9587],
        title: "Центр Уфы (T2)",
        desc: "Здесь ловит отличный 4G от T2!",
        zoom: 15
    }
];

function initMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

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
    leftArrow.onclick = () => navigateTour(-1);
    mapContainer.appendChild(leftArrow);

    const rightArrow = document.createElement('button');
    rightArrow.innerHTML = '❯';
    rightArrow.className = 'map-nav-arrow right';
    rightArrow.onclick = () => navigateTour(1);
    mapContainer.appendChild(rightArrow);

    // Add Coverage Filters
    const filters = document.createElement('div');
    filters.id = 'coverage-filters';
    filters.className = 'coverage-filters';
    filters.style.display = 'none';
    filters.innerHTML = `
        <label><input type="checkbox" checked onchange="toggleLayer('2G')"> 2G</label>
        <label><input type="checkbox" checked onchange="toggleLayer('3G')"> 3G</label>
        <label><input type="checkbox" checked onchange="toggleLayer('4G')"> 4G/LTE</label>
    `;
    mapContainer.appendChild(filters);

    if (typeof DG !== 'undefined') {
        DG.then(function () {
            map = DG.map('map', {
                center: [54.7351, 55.9587],
                zoom: 12,
                fullscreenControl: false,
                zoomControl: true
            });

            landmarks.forEach(place => {
                DG.marker(place.coords).addTo(map)
                    .bindPopup(`<b>${place.title}</b><br>${place.desc}`);
            });

            const t2Salons = [
                [54.7360, 55.9600],
                [54.7250, 55.9450],
                [54.7400, 55.9700],
                [54.7600, 56.0000]
            ];
            t2Salons.forEach(coord => {
                DG.marker(coord, {
                    icon: DG.icon({
                        iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/T2_Logo.svg/1200px-T2_Logo.svg.png',
                        iconSize: [30, 15],
                        className: 't2-marker'
                    })
                }).addTo(map).bindPopup("<b>Салон T2</b><br>Подключись к лучшему!");
            });

            const routeCoords = landmarks.map(l => l.coords);
            DG.polyline(routeCoords, {
                color: '#2979FF',
                weight: 4,
                dashArray: '10, 10',
                opacity: 0.7
            }).addTo(map);

            const covBtn = document.createElement('button');
            covBtn.innerText = "📶 Покрытие T2";
            covBtn.className = "tour-btn";
            covBtn.style.top = "80px";
            covBtn.onclick = toggleCoverage;
            mapContainer.appendChild(covBtn);
        });
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
        if (label && label.innerText.includes("Покрытие T2")) {
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
    
    // Initialize storage if needed (though we just reset it above if off, here we need it clean or check existence)
    // Actually, let's just regenerate for simplicity or check if empty.
    // The previous code had a simple array, now we need an object for layers.
    // Let's re-initialize to be safe as we switched from array to object structure in logic
    if (Array.isArray(coveragePolygons)) {
         coveragePolygons = { '2G': [], '3G': [], '4G': [], '5G': [] };
    }

    const centerLat = 54.7351;
    const centerLon = 55.9587;
    const hexRadius = 0.008;
    const rows = 12;
    const cols = 12;

    for (let r = -rows; r <= rows; r++) {
        for (let c = -cols; c <= cols; c++) {
            const xOffset = c * (hexRadius * 1.5);
            const yOffset = r * (hexRadius * Math.sqrt(3)) + (c % 2) * (hexRadius * Math.sqrt(3) / 2);
            const center = [centerLat + yOffset, centerLon + xOffset];

            // Random generation logic
            const rand = Math.random();
            let type = null;
            let color = '';

            if (rand > 0.85) continue; // Gap

            if (rand > 0.6) {
                type = '4G';
                color = '#00E676'; // Green
            } else if (rand > 0.3) {
                type = '3G';
                color = '#2979FF'; // Blue
            } else if (rand > 0.1) {
                type = '2G';
                color = '#FFC107'; // Amber
            } else {
                type = '5G';
                color = '#9C27B0'; // Purple
            }

            const coords = [];
            for (let i = 0; i < 6; i++) {
                const angle = (i * 60 + 30) * Math.PI / 180;
                coords.push([
                    center[0] + hexRadius * Math.sin(angle),
                    center[1] + hexRadius * Math.cos(angle)
                ]);
            }
            coords.push(coords[0]);

            const polygon = DG.polygon(coords, {
                color: color,
                weight: 1,
                opacity: 0.6,
                fillOpacity: 0.3,
                className: `coverage-${type}` // Helper class if needed
            }).addTo(map);

            if (!coveragePolygons[type]) coveragePolygons[type] = [];
            coveragePolygons[type].push(polygon);
        }
    }

    showMapLabel("Покрытие T2", "Управляйте слоями 2G/3G/4G/5G с помощью фильтров.");
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
    if (currentLandmarkIndex >= landmarks.length) currentLandmarkIndex = 0;
    if (currentLandmarkIndex < 0) currentLandmarkIndex = landmarks.length - 1;
    
    const place = landmarks[currentLandmarkIndex];
    
    map.flyTo(place.coords, place.zoom);
    showMapLabel(place.title, place.desc);
}

function startTour() {
    isTourActive = true;
    document.querySelectorAll('.map-nav-arrow').forEach(el => el.style.display = 'flex');
    navigateTour(1);
}

function showMapLabel(title, desc) {
    let label = document.getElementById('map-label');
    if (!label) {
        label = document.createElement('div');
        label.id = 'map-label';
        label.className = 'map-label';
        document.getElementById('map').appendChild(label);
    }
    label.innerHTML = `<strong>${title}</strong><br>${desc}<br><small>Используйте стрелки ⬅ ➡ для навигации</small>`;
    label.style.display = 'block';
}
