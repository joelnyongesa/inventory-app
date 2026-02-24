#!/bin/sh
set -e

echo "==> Waiting for database to be reachable..."
# Retry loop: Neon can take a moment to wake from idle
RETRIES=10
until php -r "
    \$dsn = 'pgsql:host=' . getenv('DB_HOST') . ';port=' . (getenv('DB_PORT') ?: '5432') . ';dbname=' . getenv('DB_DATABASE') . ';sslmode=require';
    new PDO(\$dsn, getenv('DB_USERNAME'), getenv('DB_PASSWORD'));
    echo 'ok';
" 2>/dev/null | grep -q ok; do
    RETRIES=$((RETRIES - 1))
    if [ "$RETRIES" -le 0 ]; then
        echo "ERROR: Could not connect to database. Check DB_* env vars." >&2
        exit 1
    fi
    echo "    Database not ready yet, retrying in 3 s... ($RETRIES attempts left)"
    sleep 3
done
echo "    Database is ready."

echo "==> Running migrations..."
php artisan migrate --force

echo "==> Caching Laravel configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "==> Starting services..."
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
