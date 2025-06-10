#FROM nginx

# Install netcat
#RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*
#RUN mkdir -p /etc/nginx/ssl
# Copy configuration and wait script
#COPY conf/nginx.conf /etc/nginx/nginx.conf
#COPY wait-for-service.sh /wait-for-service.sh
# adding a copy instruction for frontend
#COPY ../frontend/dist /usr/share/nginx/html
#RUN chmod +x /wait-for-service.sh
#EXPOSE 443
# CMD is overridden by docker-compose, but default is still nginx
#CMD ["nginx", "-g", "daemon off;"]


FROM nginx

# Install netcat and openssl (for generating cert)
RUN apt-get update && apt-get install -y \
    netcat-openbsd \
    openssl \
 && rm -rf /var/lib/apt/lists/*

# Create SSL directory
RUN mkdir -p /etc/nginx/ssl

# Generate self-signed certificate (valid for 1 year)
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/ft_transcendence.key \
  -out /etc/nginx/ssl/ft_transcendence.crt \
  -subj "/C=MO/ST=IDF/L=Paris/O=LocalDev/CN=localhost"

# Copy nginx configuration and wait script
COPY conf/nginx.conf /etc/nginx/nginx.conf
COPY wait-for-service.sh /wait-for-service.sh
RUN chmod +x /wait-for-service.sh

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
