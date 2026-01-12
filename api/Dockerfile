FROM php:8.2-apache

# Install dependencies and extensions
RUN docker-php-ext-install pdo pdo_mysql

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Update Apache configuration to allow .htaccess
RUN sed -i 's/AllowOverride None/AllowOverride All/g' /etc/apache2/apache2.conf

# Set working directory
WORKDIR /var/www/html

# Copy source code
COPY api/ ./api/
COPY database/ ./database/
RUN cp ./database/config.docker.php ./database/config.php

# Set permissions
RUN chown -R www-data:www-data /var/www/html
