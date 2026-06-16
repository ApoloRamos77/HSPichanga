FROM node:18-bullseye-slim

# Instalar dependencias necesarias para que el Chromium de Puppeteer funcione en Debian
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    libnss3 \
    libxss1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    libgbm-dev \
    && rm -rf /var/lib/apt/lists/*

# Crear y cambiar al directorio de trabajo de la app
WORKDIR /usr/src/app

# Copiar package.json y restaurar dependencias
# NOTA: Puppeteer descargará su propio binario de Chromium garantizado para ser compatible
COPY package*.json ./
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
