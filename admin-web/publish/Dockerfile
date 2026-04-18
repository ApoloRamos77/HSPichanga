FROM nginx:stable-alpine
# Copy the pre-built files from the current directory (context should be admin-web/publish)
COPY . /usr/share/nginx/html
# Copy the custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8081
CMD ["nginx", "-g", "daemon off;"]
