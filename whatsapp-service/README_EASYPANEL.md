# Despliegue en Easypanel

Este microservicio usa `whatsapp-web.js`, el cual requiere un navegador Chromium en segundo plano (Puppeteer) para funcionar. Por ello, el `Dockerfile` proporcionado está optimizado con Alpine Linux y Chromium preinstalado.

## Paso a Paso para Easypanel

1. **Sube el código a tu repositorio**
   Asegúrate de que la carpeta `whatsapp-service` y todos sus archivos (`index.js`, `package.json`, `Dockerfile`) estén en un repositorio de GitHub/GitLab que Easypanel pueda leer. Si vas a desplegar solo el microservicio, la raíz del repositorio debe contener el `Dockerfile`.

2. **Crea un Nuevo Servicio App en Easypanel**
   - Ve a tu proyecto en Easypanel.
   - Haz clic en **Create Service** y selecciona **App**.
   - Ponle un nombre, por ejemplo: `whatsapp-api`.

3. **Configura el Origen (Source)**
   - En la pestaña **Source**, selecciona **GitHub** (o el que uses) y vincula tu repositorio.
   - Asegúrate de poner correctamente la rama (ej. `main`).
   - Si tu `whatsapp-service` está dentro de una subcarpeta en tu repo principal (ej. `HSPichanga/whatsapp-service`), en **Build Context** o **Subfolder** pon `whatsapp-service` (o la ruta correspondiente).

4. **Configura el Build**
   - Selecciona el método de Build: **Dockerfile**.

5. **Variables de Entorno (Environment)**
   - Ve a la pestaña **Environment**.
   - No necesitas variables obligatorias para que funcione, pero si quieres forzar el puerto puedes agregar: `PORT=3000`.

6. **Despliega (Deploy)**
   - Haz clic en el botón **Deploy**. 
   - Espera a que termine la construcción. Puede demorar un par de minutos porque instala Chromium.

7. **Escanear el Código QR (MUY IMPORTANTE)**
   `whatsapp-web.js` no funciona hasta que vincules tu celular escaneando el código QR.
   - Ve a la pestaña **Logs** de tu servicio `whatsapp-api` en Easypanel.
   - Verás un mensaje en la terminal que dice: `--- ESCANEA EL CÓDIGO QR PARA INICIAR SESIÓN ---` seguido de un código QR grande formado por caracteres.
   - Abre WhatsApp en el celular que vas a usar como "bot".
   - Ve a **Dispositivos Vinculados** -> **Vincular Dispositivo** y escanea el QR directamente desde la pantalla de tu computadora.
   - Una vez escaneado, los logs dirán: `Autenticación exitosa.` y `¡Cliente de WhatsApp está listo!`.

8. **Configura tu App C# para que apunte a Easypanel**
   - Ve a la sección **Domains** en tu servicio de Easypanel y copia la URL pública generada (ej. `https://whatsapp-api.tu-servidor.com`).
   - Ve al panel de administración de tu aplicación web (la página de Configuración de WhatsApp que creamos).
   - En "URL de la API de Node.js", pega la URL seguida de `/send` (ej. `https://whatsapp-api.tu-servidor.com/send`).

¡Listo! Tu backend C# enviará peticiones a tu microservicio hospedado en Easypanel.
