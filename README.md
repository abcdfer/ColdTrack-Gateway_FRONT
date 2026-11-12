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

## Estructura y flujo de trabajo

El frontend sigue las convenciones del [frontend de PADI](https://github.com/PAD2026-TFI/billetera-virtual-frontend/tree/dev).

- `src/AppRoutes.jsx` define la navegación con React Router. El guard de sesión
  está en `src/components/routing` y los enlaces a equipos conservan `/?device=ID`.
- `src/pages` contiene las pantallas y `src/components` agrupa los componentes
  por función. La interfaz reutiliza Tailwind, Radix y variantes con CVA.
- `src/services/api.js` concentra las peticiones a Flask. Los stores de
  Zustand contienen el estado de sesión y el tema. Flask valida la sesión
  mediante su cookie y el navegador guarda la preferencia de tema.
- El formulario de ingreso usa React Hook Form y Zod. Los tests de Vitest y
  Testing Library se ubican junto a los componentes y rutas que verifican.

Usá Node 22.12 o superior. El CI usa Node 24 y ejecuta `npm ci`, `npm test`
y `npm run build`. Para activar la revisión de credenciales antes de cada
commit, ejecutá una vez por clon `git config core.hooksPath .githooks`.
También podés revisar los cambios preparados con `npm run check:credentials`.

Trabajá en ramas `feature/<tarea>-<descripcion>` y usá Conventional Commits
en español. Abrí el PR contra la rama de integración que ya contiene tu base.
En PADI esa rama es `dev`. En ColdTrack, las ramas `codex/coldtrack-web` y
`codex/frontend-tema-claro` contienen la integración web y el cambio de tema.
