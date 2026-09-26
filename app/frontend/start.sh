#!/bin/sh
set -e

CERT_DIR="/etc/nginx/certs"
CERT="$CERT_DIR/cert.pem"
KEY="$CERT_DIR/key.pem"

if [ ! -f "$CERT" ] || [ ! -f "$KEY" ]; then
    echo "[start.sh] No TLS certs found - generating temporary self-signed cert..."
    mkdir -p "$CERT_DIR"
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout "$KEY" \
        -out "$CERT" \
        -subj "/CN=localhost"
    echo "[start.sh] Self-signed cert generated."
fi

echo "[start.sh] Starting Next.js server..."
HOSTNAME=0.0.0.0 node /app/server.js &

echo "[start.sh] Waiting for next.js to be ready..."
until nc -z 127.0.0.1 3000; do
    sleep 0.2
done
echo "[start.sh] Next.js is ready."

echo "[start.sh] Starting nginx..."
exec nginx -g "daemon off;"