
# 🚀 Guía de Instalación: LinguistAI

Sigue estos pasos para convertir este código en tu propia plataforma educativa en vivo.

## 🛠️ 1. Preparación Local (En tu PC)

1.  **Instala Node.js:** Descárgalo de [nodejs.org](https://nodejs.org/).
2.  **Crea tu carpeta:** Crea una carpeta llamada `linguist-ai` y coloca todos los archivos proporcionados dentro.
3.  **Obtén tu API KEY:**
    - Ve a [Google AI Studio](https://aistudio.google.com/).
    - Haz clic en **"Get API Key"**.
    - Crea un archivo llamado `.env` en tu carpeta y pega esto: `API_KEY=TU_LLAVE_AQUI`
4.  **Ejecuta:**
    - Abre la terminal en esa carpeta.
    - Escribe: `npm install` (y presiona Enter).
    - Escribe: `npm run dev` (y presiona Enter).
    - ¡Listo! Abre el enlace que te dé la terminal.

---

## 🐙 2. Subir a GitHub (Copia de Seguridad)

GitHub permite que el mundo vea tu proyecto y facilita el hosting.

1.  Crea una cuenta en [GitHub.com](https://github.com/).
2.  Instala [Git](https://git-scm.com/).
3.  En la terminal de tu proyecto:
    ```bash
    git init
    git add .
    git commit -m "Lanzamiento oficial LinguistAI"
    ```
4.  Crea un repositorio en GitHub llamado `linguist-ai` y sigue sus pasos para "push an existing repository".

---

## 🌐 3. Subir al Hosting (Vercel - Gratis)

Vercel pondrá tu app en internet con una dirección `.vercel.app`.

1.  Ve a [Vercel.com](https://vercel.com/) y regístrate con tu GitHub.
2.  Dale a **"Add New"** -> **"Project"**.
3.  Selecciona tu repositorio `linguist-ai`.
4.  **MUY IMPORTANTE:** Antes de darle a "Deploy", ve a la sección **Environment Variables**.
    - Añade una variable: `API_KEY`
    - En el valor: Pega tu llave de Google Gemini.
5.  Dale a **Deploy**. ¡Tu academia está en vivo!

---

## 🔑 Datos de Acceso
- **Contraseña predeterminada:** `LINGUIST2025`
- **Panel de Admin:** Puedes crear lecciones personalizadas desde la sección de Admin en la app.

¡Mucha suerte con tu nueva plataforma!
