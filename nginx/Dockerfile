#nginx dockerfile
#FROM nginx

#RUN mkdir -p /etc/nginx/ssl

#RUN openssl req -x509 -newkey rsa:4096 -keyout /etc/nginx/ssl/ft_fran.key -out /etc/nginx/ssl/ft_fran.crt -days 365 -nodes \
#    -subj "/C=US/ST=State/L=City/O=Organization/OU=OrgUnit/CN=ft_fran"

#COPY conf/nginx.conf /etc/nginx/nginx.conf
#CMD ["nginx", "-g", "daemon off;"]

FROM nginx

# Install netcat
RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*

# Copy configuration and wait script
COPY conf/nginx.conf /etc/nginx/nginx.conf
COPY wait-for-service.sh /wait-for-service.sh

RUN chmod +x /wait-for-service.sh

# CMD is overridden by docker-compose, but default is still nginx
CMD ["nginx", "-g", "daemon off;"]
