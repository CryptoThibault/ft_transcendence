#!/bin/sh

# Usage: wait-for-service.sh host:port [host:port]...

# Loop through all arguments as host:port pairs
for service in "$@"; do
  host=$(echo "$service" | cut -d: -f1)
  port=$(echo "$service" | cut -d: -f2)

  echo "Waiting for $host:$port to be available..."

  while ! nc -z "$host" "$port"; do
    sleep 1
  done

  echo "$host:$port is available."
done

# Start Nginx
echo "All services are up. Starting Nginx..."
exec nginx -g "daemon off;"

