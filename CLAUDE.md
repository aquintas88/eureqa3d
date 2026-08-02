# CLAUDE.md — Eureqa3D Web

## Stack del proyecto

- Node.js + Express 5, PostgreSQL (`pg`), sesiones con `express-session` + `connect-pg-simple`.
- Frontend público en HTML + CSS + JS **vanilla, sin build step** (ver README). No introducir React, bundlers, Tailwind ni ningún paso de compilación sin avisar antes: es una decisión explícita del proyecto.
- Despliegue en Railway vía `nixpacks.toml`.

## Diseño y frontend

Antonio no tiene conocimientos de diseño: toma tú las decisiones visuales, no le preguntes por preferencias estéticas ni le pidas que valore opciones de estilo. Dale un resultado bien resuelto por defecto y avísale solo si necesitas que decida algo de negocio (contenido, textos, prioridades).

- **Sistema de diseño existente**: `assets/styles.css` ya define un sistema de marca coherente (paleta teal `#3990B0` / naranja `#D57C1B` / tinta `#1c2127`, radios, sombras, curvas de easing en `:root`). Es la fuente de verdad. Extiende y reutiliza estas variables CSS en vez de inventar colores, radios o sombras nuevas. Si una pantalla nueva necesita un tono que no existe, deriva de la paleta existente, no introduzcas una paleta paralela.
- **Animaciones**: usa la librería **Motion** (antes Framer Motion), en su versión **vanilla JS** (paquete `motion`, no `framer-motion`, ese es solo para React). Importa vía CDN sin build (`import { animate } from "https://esm.sh/motion"`) para mantener la filosofía "sin build" del proyecto. Reutiliza las curvas de easing ya definidas en `--ease-out` / `--ease-in-out` en vez de las de Motion por defecto, para que las animaciones combinen con las transiciones CSS existentes.
- **Buenas prácticas web actuales**: antes de escribir HTML/CSS/JS de cliente, usa la skill `modern-web-guidance` (ya instalada) para aplicar patrones actuales (scroll-driven animations, container queries, `:has()`, optimización de imágenes, Core Web Vitals, etc.) en vez de patrones obsoletos.
- **Verificación visual obligatoria**: después de construir o modificar cualquier interfaz, usa el MCP de **chrome-devtools** para capturar el resultado en pantalla y revisar visualmente que se vea bien (espaciados, alineación, contraste, comportamiento responsive en móvil y escritorio). Corrige antes de dar la tarea por terminada. No asumas que el CSS quedó bien sin verlo en pantalla.

### Si el MCP de chrome-devtools no está instalado en este proyecto

Ejecutar una vez en terminal, dentro de esta carpeta:

```bash
claude mcp add chrome-devtools -s user -- npx chrome-devtools-mcp@latest
```
