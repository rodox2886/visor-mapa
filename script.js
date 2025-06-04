
let esAdmin = false;
let drawControl;
const map = L.map('map').setView([-34.6, -58.4], 12);
const drawnItems = new L.FeatureGroup().addTo(map);
let lastMarker = null;

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

function colorAleatorio() {
  return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
}

function bindPolygonLabel(layer, name) {
  layer.bindTooltip(`<b>${name}</b>`, {
    permanent: true,
    direction: 'center'
  });
}

function cargarPoligonosDesdeGeoJSON() {
  fetch('poligonos.geojson')
    .then(response => response.json())
    .then(geojson => {
      geojson.features.forEach(feature => {
        const nombre = feature.properties.nombre || 'Sin nombre';
        const color = feature.properties.color || colorAleatorio();
        const coords = feature.geometry.coordinates[0].map(p => [p[1], p[0]]);
        const layer = L.polygon(coords, {
          color: color,
          fillColor: color,
          fillOpacity: 0.4,
          weight: 2
        });
        layer.feature = {
          type: 'Feature',
          properties: { nombre, color },
          geometry: feature.geometry
        };
        bindPolygonLabel(layer, nombre);
        if (esAdmin) {
          layer.on('dblclick', function(e) {
            e.originalEvent.preventDefault();
            const nuevo = prompt('Nuevo nombre:', nombre);
            if (nuevo) {
              layer.feature.properties.nombre = nuevo;
              bindPolygonLabel(layer, nuevo);
            }
          });
        }
        drawnItems.addLayer(layer);
      });
      if (drawnItems.getLayers().length > 0) {
        map.fitBounds(drawnItems.getBounds());
      }
    })
    .catch(err => console.error('Error al cargar el GeoJSON:', err));
}

function verificarUbicacion(latlng) {
  const pt = turf.point([latlng.lng, latlng.lat]);
  let dentro = false;
  drawnItems.eachLayer(layer => {
    const poly = layer.toGeoJSON();
    if (turf.booleanPointInPolygon(pt, poly)) {
      dentro = true;
    }
  });
  return dentro;
}

document.getElementById('check-btn').addEventListener('click', async () => {
  const lat = parseFloat(document.getElementById('lat').value);
  const lng = parseFloat(document.getElementById('lng').value);
  const dir = document.getElementById('address').value.trim();

  let latlng;
  if (!isNaN(lat) && !isNaN(lng)) {
    latlng = { lat, lng };
  } else if (dir) {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(dir)}&limit=1`);
    const data = await res.json();
    if (data && data.length > 0) {
      latlng = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
  }

  if (!latlng) {
    alert('No se pudo obtener una ubicación.');
    return;
  }

  if (lastMarker) map.removeLayer(lastMarker);
  lastMarker = L.marker([latlng.lat, latlng.lng]).addTo(map).bindPopup('Ubicación').openPopup();
  map.setView([latlng.lat, latlng.lng], 16);

  const dentro = verificarUbicacion(latlng);
  if (dentro) {
    alert('❌ No es posible crear un nuevo suministro en esta dirección.');
  } else {
    alert('✅ Es posible crear un nuevo suministro en esta dirección.');
  }
});

document.getElementById('download-btn').addEventListener('click', () => {
  const geojson = drawnItems.toGeoJSON();
  const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'nuevo_poligonos.geojson';
  a.click();
  URL.revokeObjectURL(url);
});

window.addEventListener('load', () => {
  const clave = prompt('Contraseña para edición (dejar vacío para consulta):');
  if (clave === 'admin2025') {
    esAdmin = true;
    document.getElementById('user-mode').textContent = '🛠️ Modo Administrador';
    drawControl = new L.Control.Draw({
      draw: {
        polygon: true,
        polyline: false,
        circle: false,
        rectangle: false,
        marker: false,
        circlemarker: false
      },
      edit: {
        featureGroup: drawnItems,
        remove: true
      }
    });
    map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, function (e) {
      const layer = e.layer;
      const color = colorAleatorio();
      layer.setStyle({ color: color, fillColor: color, fillOpacity: 0.4 });
      const nombre = prompt('Nombre del polí­gono:', 'Área');
      layer.feature = { type: 'Feature', properties: { nombre, color } };
      bindPolygonLabel(layer, nombre);
      layer.on('dblclick', function(e) {
        e.originalEvent.preventDefault();
        const nuevo = prompt('Nuevo nombre:', nombre);
        if (nuevo) {
          layer.feature.properties.nombre = nuevo;
          bindPolygonLabel(layer, nuevo);
        }
      });
      drawnItems.addLayer(layer);
    });
  } else {
    document.getElementById('download-btn').style.display = 'none';
    document.getElementById('user-mode').textContent = '👀 Modo Consulta';
  }

  cargarPoligonosDesdeGeoJSON();
});
