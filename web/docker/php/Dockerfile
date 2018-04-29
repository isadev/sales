FROM php:7.1-fpm
# Environment variables
ENV HOMEPATH /webapp

# here is the installation NodeJS and Bower
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get install -y nodejs \
    && npm install -g bower

# Install iconv, mcryot, gd
RUN apt-get install -y \
        libfreetype6-dev \
        libjpeg62-turbo-dev \
        libmcrypt-dev \
        libpng12-dev \
        git \
        mysql-client \
    && docker-php-ext-install -j$(nproc) iconv mcrypt \
    && docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/ \
    && docker-php-ext-install -j$(nproc) gd

# Install memcached
RUN apt-get install -y libmemcached-dev nano \
  && git clone https://github.com/php-memcached-dev/php-memcached /usr/src/php/ext/memcached \
  && cd /usr/src/php/ext/memcached && git checkout -b php7 origin/php7 \
  && docker-php-ext-configure memcached \
  && docker-php-ext-install memcached opcache mbstring

# Install curl
RUN apt-get install -y libcurl4-openssl-dev \
    && docker-php-ext-install curl
# Install zip json pdo_mysql
RUN docker-php-ext-install zip json pdo_mysql
## APCu
RUN yes | pecl install apcu \
    && docker-php-ext-enable apcu

# Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Install zephir
RUN composer global require "phalcon/zephir:dev-master" 

RUN  cd /  && \
    git clone --depth=1 git://github.com/phalcon/cphalcon.git && \
    cd cphalcon/build && \
    ./install

RUN echo "extension=phalcon.so" > /usr/local/etc/php/conf.d/phalcon.ini

# Install phalcon dev tool 
RUN composer require "phalcon/devtools" -d /usr/local/bin/
RUN ln -s /usr/local/bin/vendor/phalcon/devtools/phalcon.php /usr/bin/phalcon

# Xdebug
# here is the installation
RUN pecl install xdebug
RUN docker-php-ext-enable xdebug

WORKDIR $HOMEPATH
# Add www-data user to sudo group
RUN adduser www-data sudo
# Add permission to the folder
RUN chown -R www-data:www-data $HOMEPATH /var/www
# Add permission to the volume
RUN usermod -u 1000 www-data
# Giving a shell to www-data
RUN chsh -s /bin/bash www-data
