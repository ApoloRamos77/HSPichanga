FROM nginx:alpine

# Copiar archivos estáticos compilados
COPY . /usr/share/nginx/html/chapatucancha

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8081

CMD ["nginx", "-g", "daemon off;"]
