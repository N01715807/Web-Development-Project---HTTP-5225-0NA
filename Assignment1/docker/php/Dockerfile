FROM php:8.2-fpm-alpine
RUN apk add --no-cache icu-dev oniguruma-dev && docker-php-ext-install pdo pdo_mysql intl
WORKDIR /var/www
