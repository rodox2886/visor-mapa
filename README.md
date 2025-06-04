
# Visor de Polígonos y Verificador de Ubicación

Este visor permite visualizar un mapa con zonas delimitadas por polígonos y verificar si una dirección o ubicación se encuentra dentro de ellas.

🔗 **[Abrir visor en línea](https://rodox2886.github.io/visor-mapa)**

---

## 🧭 Modos de uso

- 👀 **Modo Consulta**: permite verificar ubicaciones ingresando coordenadas manualmente o por dirección.
- 🛠️ **Modo Administrador**: permite crear, editar y eliminar polígonos.
  - Para acceder al modo administrador, ingresar la contraseña: `admin2025`.

---

## 🔍 Funciones disponibles

- Verificación por:
  - 📌 Dirección
  - 📍 Coordenadas (Lat / Lng)
  - 📡 Ubicación actual del dispositivo (botón **"📍 Usar mi ubicación"**)
- Dibujo, edición y renombrado de polígonos (modo administrador)
- Carga automática de polígonos desde `poligonos.geojson`

---

## 🔄 Cómo actualizar los polígonos

1. Ingresar en modo administrador.
2. Dibujar o modificar los polígonos deseados.
3. Descargar el nuevo archivo GeoJSON (si tienes esta función disponible).
4. Renombrar el archivo descargado a `poligonos.geojson`.
5. Subirlo a este repositorio reemplazando el anterior.
6. Esperar de 1 a 5 minutos.
7. Refrescar el visor con **Ctrl + F5**.

---

## 📁 Archivos del proyecto

- `index.html`: visor principal con mapa interactivo.
- `script.js`: lógica para verificar ubicación, manejar polígonos y geolocalización.
- `poligonos.geojson`: zonas cargadas en el mapa.
- `README.md`: instrucciones y documentación del visor.

---

## 🧠 Recomendaciones

- Si los polígonos no se ven tras una actualización, hacer **Ctrl + F5** para forzar recarga sin caché.
- La geolocalización puede fallar en navegadores con permisos bloqueados o en equipos sin GPS.
- No eliminar ni cambiar el nombre del archivo `poligonos.geojson`, ya que es clave para que el visor funcione.

---

## 🛠 Autor

Desarrollado por Procesos Tecnicos
