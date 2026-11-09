# ColdTrack Dashboard

Panel React con Vite y Tailwind CSS para consultar la flota, la telemetría y las
alertas de equipos de frío. El simulador envía lecturas de `SIM-001` a Flask.

Con Node 24, ejecutar `npm ci` y `npm run dev`. Arrancar también `apy.py`
en el repositorio `ColdTrack-Gateway` en el puerto 5000. Abrir
`http://localhost:5173`. Vite redirige las peticiones de la API a Flask.

Para preparar el frontend de producción, ejecutar `npm run build`.
Flask sirve el directorio `dist` y el dashboard usa la API del mismo origen.
El procedimiento de despliegue y las variables de sesión están en el
[README del backend](https://github.com/abcdfer/ColdTrack-Gateway).
