#!/bin/sh
set -e

echo "==> Running database migrations..."
# PGCONNECT_TIMEOUT tells libpq (used by pdo_pgsql) to give up after 15 s
# if it cannot reach the host. Without this, PDO can hang indefinitely when
# Neon's serverless compute is cold-starting, causing the 240 s probe timeout.
PGCONNECT_TIMEOUT=15 php artisan migrate --force

echo "==> Seeding database (idempotent — safe to run on every start)..."
PGCONNECT_TIMEOUT=15 php artisan db:seed --force

echo "==> Caching Laravel configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "==> Starting services..."
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
