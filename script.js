
const map = L.map('map').setView([-34.6, -58.45], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

let poligonosLayer = new L.FeatureGroup().addTo(map);
let clientePoints = [];
let clientesLayer = L.layerGroup().addTo(map);
let drawControl;
let esAdmin = false;

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function contarClientesEnPoligono(geojsonPoly) {
  let count = 0;
  clientePoints.forEach(c => {
    const pt = turf.point([c.LONGITUD, c.LATITUD]);
    if (turf.booleanPointInPolygon(pt, geojsonPoly)) {
      count++;
    }
  });
  return count;
}

let lastMarker = null;


document.getElementById('download-btn').addEventListener('click', () => {
  const geojson = poligonosLayer.toGeoJSON();
  const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'poligonos_actualizados.geojson';
  a.click();
  URL.revokeObjectURL(url);
});

function iniciarModoAdmin() {
  esAdmin = true;
  document.getElementById('user-mode').textContent = '🛠️ Modo Administrador';

  drawControl = new L.Control.Draw({
    draw: {
      polygon: {
        shapeOptions: {
          color: getRandomColor(),
          fillOpacity: 0.3
        }
      },
      polyline: false,
      rectangle: false,
      circle: false,
      marker: false,
      circlemarker: false
    },
    edit: {
      featureGroup: poligonosLayer,
      remove: true
    }
  });
  map.addControl(drawControl);

  map.on(L.Draw.Event.CREATED, function (e) {
    const layer = e.layer;
    const color = getRandomColor();
    const nombre = prompt('Nombre del área:', 'Área') || 'Área';
    layer.setStyle({ color, fillColor: color, fillOpacity: 0.3 });
    layer.feature = {
      type: 'Feature',
      properties: { nombre }
    };
    poligonosLayer.addLayer(layer);
    layer.bindTooltip(nombre, { permanent: true, direction: 'center' });
    layer.on('click', function (e) {
      const cantidad = contarClientesEnPoligono(layer.toGeoJSON());
      L.popup()
        .setLatLng(e.latlng)
        .setContent(`<b>${nombre}</b><br>Clientes dentro: ${cantidad}`)
        .openOn(map);
    });
  });
}

window.onload = () => {
  const clave = prompt('Contraseña para edición (dejar vacío para solo consulta):');
  if (clave === 'admin2025') {
    iniciarModoAdmin();
  } else {
    document.getElementById('user-mode').textContent = '👀 Modo Consulta';
  }

  fetch('clientes.json')
    .then(res => res.json())
    .then(clientes => {
      clientePoints = clientes;
      clientes.forEach(c => {
        const marker = L.circleMarker([c.LATITUD, c.LONGITUD], {
          radius: 5,
          fillColor: "#007bff",
          color: "#007bff",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        });
    clientesLayer.addLayer(marker);
        marker.bindPopup(`<b>${c.RAZON_SOCIAL}</b><br>${c.LOCALIDAD}`);
      });

      fetch('poligonos.geojson')
        .then(res => res.json())
        .then(data => {
          L.geoJSON(data, {
            style: () => {
              const c = getRandomColor();
              return { color: c, fillColor: c, fillOpacity: 0.3 };
            },
            onEachFeature: (feature, layer) => {
              const nombre = feature.properties?.nombre || 'Área';
              layer.bindTooltip(nombre, { permanent: true, direction: 'center' });
              layer.on('click', function (e) {
                const cantidad = contarClientesEnPoligono(layer.toGeoJSON());
                L.popup()
                  .setLatLng(e.latlng)
                  .setContent(`<b>${nombre}</b><br>Clientes dentro: ${cantidad}`)
                  .openOn(map);
              });
              poligonosLayer.addLayer(layer);
            }
          });
        });
    });
};



document.getElementById('export-summary-btn').addEventListener('click', () => {
  const resumen = [];
  poligonosLayer.eachLayer(layer => {
    const geojson = layer.toGeoJSON();
    const nombre = layer.feature?.properties?.nombre || 'Área';
    const cantidad = contarClientesEnPoligono(geojson);
    resumen.push({ nombre, cantidad });
  });

  const contenido = "Polígono,Cantidad de Clientes\n" + resumen.map(r => `${r.nombre},${r.cantidad}`).join("\n");
  const blob = new Blob([contenido], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'resumen_poligonos.csv';
  a.click();
  URL.revokeObjectURL(url);
});

document.getElementById('toggle-clientes').addEventListener('change', function () {
  if (this.checked) {
    map.addLayer(clientesLayer);
  } else {
    map.removeLayer(clientesLayer);
  }
});
