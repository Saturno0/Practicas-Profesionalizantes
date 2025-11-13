# WoodCraft Studio

Landing page y backend ligero para gestionar consultas de carpintería artesanal. El frontend es un sitio estático pensado para publicarse en GitHub Pages, mientras que el backend en Node.js expone el endpoint REST que procesa el formulario y envía correos mediante Nodemailer.

## Tabla de contenidos
- [Características](#características)
- [Arquitectura](#arquitectura)
- [Requisitos](#requisitos)
- [Configuración del entorno](#configuración-del-entorno)
- [Ejecución local](#ejecución-local)
- [Despliegue en GitHub Pages](#despliegue-en-github-pages)
- [Manual de usuario](#manual-de-usuario)
- [API backend](#api-backend)
- [Estructura del proyecto](#estructura-del-proyecto)

## Características
- Landing moderna construida con HTML/CSS/JS puro dentro de `public/`.
- Animaciones básicas (navbar móvil, scroll reveal) y formulario de contacto con validaciones mínimas.
- Backend Express con CORS y Nodemailer para reenviar el mensaje al dueño y enviar confirmación al cliente.
- Configuración lista para publicarse en GitHub Pages con `gh-pages` y conectar contra un backend remoto.
- Variables de entorno aisladas mediante `.env` (ignorado) y ejemplo en `.env.example`.

## Arquitectura
| Capa       | Descripción                                                                 |
|------------|-----------------------------------------------------------------------------|
| Frontend   | Archivos estáticos en `public/`. El script principal detecta si corre en localhost o en un dominio (GitHub Pages) para decidir la URL del backend. |
| Backend    | `server.js` expone `/api/contact`. Usa `dotenv` para cargar credenciales y `nodemailer` para enviar correos. |
| Despliegue | `npm run deploy` publica la carpeta `public/` en la rama `gh-pages`. El backend debe alojarse aparte (por ejemplo en Render, Railway, etc.). |

## Requisitos
- Node.js 18+ y npm.
- Cuenta de correo con contraseña de aplicación (para `MAIL_USER` y `MAIL_PASSWORD`).
- Git configurado si vas a desplegar mediante GitHub Pages.

## Configuración del entorno
1. Instala dependencias:
   ```bash
   npm install
   ```
2. Crea un archivo `.env` tomando como referencia `.env.example`:
   ```
   MAIL_USER=tu-correo@ejemplo.com
   MAIL_PASSWORD=contraseña-de-aplicación
   PORT=3000          # Opcional, por defecto 3000
   ```
3. Define la URL del backend público que usará el frontend en producción. En `public/index.html` hay un bloque:
   ```html
   <script>
     window.API_BASE_URL = "https://tu-backend-en-produccion.com";
   </script>
   ```
   Sustituye el valor por la URL donde hospedes `server.js`. En local no necesitas cambiar nada: el frontend detecta `localhost` y usa `http://localhost:3000`.

## Ejecución local
1. Levanta el backend:
   ```bash
   npm start
   ```
   Esto inicia Express en `http://localhost:3000`.
2. Sirve el frontend. Puedes abrir `public/index.html` con una extensión como Live Server o correr:
   ```bash
   npx serve public
   ```
   Visita `http://localhost:4173` (o el puerto que indique `serve`) y usa la landing. El formulario enviará solicitudes `POST` a `http://localhost:3000/api/contact`.

## Despliegue en GitHub Pages
1. Asegúrate de haber configurado Git y tener permisos de push al repositorio remoto.
2. Ejecuta:
   ```bash
   npm run deploy
   ```
   El comando `gh-pages -d public` generará la rama `gh-pages` con el contenido estático y GitHub Pages servirá el sitio.
3. Después del primer despliegue, ve a la configuración del repositorio en GitHub y selecciona `gh-pages` como fuente de Pages (directorio raíz).
4. Actualiza `window.API_BASE_URL` con la URL pública del backend para que el formulario funcione en producción.

## Manual de usuario
La landing está pensada para clientes finales. Secciones principales:
- **Hero**: resumen de servicios y acceso rápido a “Ver servicios” o “Solicitar presupuesto”.
- **Servicios** y **Ventajas**: muestran tarjetas con ofertas principales.
- **Testimonios** y **Galería**: refuerzan credibilidad con reseñas e imágenes.
- **Contacto**: incluye datos directos y el formulario controlado por JS.

Flujo recomendado para un usuario final:
1. Navega por las secciones desde la barra superior (o el menú móvil).
2. En la sección **Contacto**, completa nombre, email, tipo de proyecto (opcional) y mensaje.
3. Presiona “Enviar consulta”. Verás mensajes de estado debajo del formulario:
   - Gris: enviando.
   - Verde: enviado con éxito.
   - Rojo: hubo un error (por ejemplo, servidor inalcanzable).
4. Recibirás un correo de confirmación si el backend está configurado correctamente.

## API backend
`POST /api/contact`
- **Body JSON**
  ```json
  {
    "name": "Nombre del cliente",
    "email": "cliente@dominio.com",
    "projectType": "residencial|comercial|restauracion|otro",
    "message": "Detalle del proyecto"
  }
  ```
- **Respuestas**
  - `200 { ok: true, message: "Correo enviado correctamente" }`
  - `400 { error: "Faltan campos obligatorios" }`
  - `500 { error: "Error al enviar el correo" }`

## Estructura del proyecto
```
.
├── public/              # HTML, CSS, JS y assets del sitio estático
│   ├── index.html
│   ├── index.css
│   └── index.js
├── server.js            # API Express para manejar el formulario
├── package.json         # Dependencias y scripts (start, deploy)
├── package-lock.json
├── .env.example         # Plantilla de configuración
├── .gitignore
└── README.md
```

> Nota: `.env` y `node_modules/` están ignorados para evitar publicar credenciales o dependencias instaladas localmente.
