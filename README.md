
# Visor de Polígonos Interactivos

Este visor permite visualizar un mapa con zonas delimitadas por polígonos y verificar si una dirección se encuentra dentro de ellas.

🔗 **[Abrir visor en línea](https://rodox2886.github.io/visor-mapa)**

---

## 🧭 Modos de uso

- 👀 **Modo Consulta**: permite verificar si una dirección está dentro de los polígonos cargados.
- 🛠️ **Modo Administrador**: permite crear, editar y eliminar polígonos.
  - Para acceder al modo administrador, ingresar la contraseña: `admin2025`.

---

## 🔄 Cómo actualizar los polígonos

1. Ingresar al visor en modo administrador.
2. Dibujar o modificar los polígonos deseados.
3. Hacer clic en **"Descargar GeoJSON actualizado"**.
4. Renombrar el archivo descargado a `poligonos.geojson`.
5. Volver a este repositorio y hacer clic en `Add file` > `Upload files`.
6. Subir el archivo `poligonos.geojson`, reemplazando el anterior.
7. Hacer clic en **"Commit changes"**.
8. Esperar de **1 a 5 minutos** y luego refrescar la página del visor (`Ctrl + F5`) para ver los cambios.

---

## 📁 Archivos del proyecto

- `index.html`: visor principal.
- `script.js`: lógica para cargar y editar los polígonos.
- `style.css`: estilos visuales del visor.
- `poligonos.geojson`: archivo que contiene los polígonos visibles para todos los usuarios.

---

## 🧠 Recomendaciones

- Si los polígonos no se ven tras una actualización, hacer **Ctrl + F5** para forzar recarga sin caché.
- No eliminar ni cambiar el nombre del archivo `poligonos.geojson`, ya que es clave para que el visor funcione.

---

## 🛠 Autor

Proyecto desarrollado por Rodolfo Raúl Flores.
