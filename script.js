const map = L.map('map').setView([52.2297, 21.0122], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

async function loadLines() {
    const response = await fetch('lines.json');
    const data = await response.json();
    renderLines(data);
    renderReports(data);
}

function renderLines(lines) {
    lines.forEach(line => {
        if (line.przebieg) {
            L.polyline(line.przebieg, { color: line.kolor || '#000', weight: 5 })
                .addTo(map);
        }
        if (line.zdarzenia) {
            line.zdarzenia.forEach(event => {
                const marker = L.marker(event.wspolrzedne)
                    .addTo(map)
                    .bindPopup(`<strong>${line.nazwa}</strong>: ${event.opis}`);
                event._marker = marker; // store for later
            });
        }
    });
}

function renderReports(lines) {
    const reportsList = document.getElementById('reports');
    lines.forEach(line => {
        if (line.zdarzenia) {
            line.zdarzenia.forEach(event => {
                const li = document.createElement('li');
                li.className = 'report-item';
                li.textContent = `[${line.nazwa}] ${event.typ}: ${event.opis}`;
                li.addEventListener('click', () => {
                    map.setView(event.wspolrzedne, 15);
                    if (event._marker) event._marker.openPopup();
                });
                reportsList.appendChild(li);
            });
        }
    });
}

loadLines();
