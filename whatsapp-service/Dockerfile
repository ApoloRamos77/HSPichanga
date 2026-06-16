FROM node:18-alpine

# Instalar dependencias necesarias para Puppeteer en Alpine Linux
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      nodejs \
      yarn

# Indicarle a Puppeteer que use el ejecutable de Chromium instalado en el sistema
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Crear y cambiar al directorio de trabajo de la app
WORKDIR /usr/src/app

# Copiar package.json y restaurar dependencias
COPY package*.json ./
RUN npm install --production

# Copiar el resto del código
COPY . .

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
