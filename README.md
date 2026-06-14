# Eureqa3D

Portal web de **Eureqa3D** — servicio integral de impresión 3D especializado en el sector salud (Extremadura).

Reconstrucción moderna del portal existente ([eureqa3d.com](http://eureqa3d.com/)) manteniendo logo y colores de marca, con una **zona privada** para publicar contenido (noticias y jornadas/eventos) que se muestra en la web pública.

## Stack

- **Node.js + Express 5**
- **PostgreSQL** (`pg`) con schema `eureqa3d`
- Sesiones con `express-session` + `connect-pg-simple`
- Autenticación con `bcryptjs`
- Front público en HTML + CSS + JS vanilla (sin build)
- Despliegue en **Railway** vía `nixpacks.toml`

## Estructura

```
server.js            API + rutas (público, auth, admin)
db/init.js           Pool de PostgreSQL
views/public/        Páginas públicas (inicio, quiénes somos, método, servicios, noticias, contacto)
views/login.html     Acceso a la zona privada
views/admin.html     Panel de administración (SPA)
assets/              CSS, JS y logo
```

## Contenido público

Inicio · Quiénes somos · Método Eureqa · Traumatología · Otras especialidades · Noticias · Contacto.

## Zona privada (`/admin`)

- **Noticias**: crear, editar, publicar/despublicar. Las publicadas aparecen en `/noticias` y en la home.
- **Jornadas y eventos**: agenda que se muestra en la home.
- **Mensajes**: bandeja del formulario de contacto.

## Desarrollo

```bash
npm install
cp .env.example .env   # configura DATABASE_URL y SESSION_SECRET
npm run dev            # http://localhost:8080
```

Al arrancar por primera vez se crean las tablas y un usuario admin
(`ADMIN_EMAIL` / `ADMIN_PASSWORD`, por defecto `admin@eureqa3d.com` / `changeme`).
Cambia la contraseña en producción.

## Variables de entorno

Ver [`.env.example`](.env.example).
