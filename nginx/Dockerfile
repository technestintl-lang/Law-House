FROM nginx:1.25-alpine

# Copy nginx configuration
COPY ./conf.d/default.conf /etc/nginx/conf.d/default.conf

# Create directory for SSL certificates
RUN mkdir -p /etc/ssl/certs /etc/ssl/private

# Create a self-signed certificate for development (will be replaced in production)
RUN apk add --no-cache openssl && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/legisflow.key \
    -out /etc/ssl/certs/legisflow.pem \
    -subj "/C=CM/ST=Littoral/L=Douala/O=LegisFlow/OU=IT/CN=legisflow.example.com" && \
    apk del openssl

# Create directory for static files
RUN mkdir -p /usr/share/nginx/html/static

# Set proper permissions
RUN chmod -R 755 /usr/share/nginx/html && \
    chown -R nginx:nginx /usr/share/nginx/html

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]

