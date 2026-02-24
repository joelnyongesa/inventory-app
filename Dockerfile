# ============================================================
# Stage 1: Frontend — Build Vite/React assets
# ============================================================
FROM node:22-alpine AS frontend

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --prefer-offline

COPY . .
RUN npm run build

# ============================================================
# Stage 2: Composer — Install PHP production dependencies
# ============================================================
FROM composer:2 AS composer

WORKDIR /app

# Copy manifest first to leverage Docker layer caching
COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-scripts \
    --no-autoloader \
    --prefer-dist \
    --ignore-platform-reqs

# Copy full source, then dump an optimised autoloader
COPY . .
RUN composer dump-autoload --optimize --no-dev

# ============================================================
# Stage 3: Runtime — PHP-FPM + Nginx
# ============================================================
FROM php:8.2-fpm-alpine AS production

# ----- System dependencies -----
# libpq      → runtime PostgreSQL client library
# libzip     → runtime zip support
# nginx      → web server
# supervisor → process manager (nginx + php-fpm)
RUN apk add --no-cache \
        nginx \
        supervisor \
        libpq \
        libzip && \
    # Build-time deps (removed after install to shrink image)
    apk add --no-cache --virtual .build-deps \
        libpq-dev \
        libzip-dev && \
    docker-php-ext-install -j"$(nproc)" \
        pdo_pgsql \
        bcmath \
        opcache \
        zip && \
    apk del .build-deps

# ----- PHP configuration -----
COPY docker/php.ini    /usr/local/etc/php/conf.d/app.ini
COPY docker/www.conf   /usr/local/etc/php-fpm.d/www.conf

# ----- Nginx configuration -----
COPY docker/nginx.conf /etc/nginx/nginx.conf

# ----- Supervisor configuration -----
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# ----- Application -----
WORKDIR /var/www/html

# Copy PHP vendor from composer stage
COPY --from=composer /app/vendor ./vendor

# Copy built frontend assets from node stage
COPY --from=frontend /app/public/build ./public/build

# Copy application source (entrypoint copies last to bust cache last)
COPY . .

# Pre-create writable runtime directories (storage & bootstrap/cache)
RUN mkdir -p \
        storage/framework/cache/data \
        storage/framework/sessions \
        storage/framework/views \
        storage/logs \
        bootstrap/cache && \
    chown -R www-data:www-data \
        storage \
        bootstrap/cache && \
    chmod -R 775 \
        storage \
        bootstrap/cache

# ----- Entrypoint -----
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Cloud Run expects the container to listen on PORT (default 8080)
EXPOSE 8080

ENTRYPOINT ["/entrypoint.sh"]
