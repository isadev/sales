Sales Application Web
========================

Aplicación de gestión de visitas, reuniones, clientes y productos con integración con BPulse.

**Stack tecnológico Backend**
*   [**latest**]  Nginx 
>                 Servidor Web
*   [**7.1.9**]   PHP 
>                 Lenguaje de Programación
*   [**5.6.35**]  MySQL 
>                 Motor de Base de Datos Relacional
*   [**3.2.2**]     Phalcon 
>                 Integración de Pruebas Unitarias
*   [**latest**]  Composer 
>                 Gestor de paquetes y Bundles
*   [**4.8**]     PHPUnit 
>                 Integración de Pruebas Unitarias

**Stack tecnológico Frontend**
*   [**1.3.3**]    Backbone JS
>                  Framework FrontEnd
*   [**1.8.3**]    Underscore JS
>                  Complemento para Backbone JS
*   [**3.3.7**]    Bootstrap
>                  Framework para Controles de FrontEnd
*   [**1.10.16**]  JQuery DataTables
>                  Para manejo de Tablas Dinámicas
*   [**3.0**]      PNotify
>                  Para mensajes y notificaciones
*   [**2.0**]      SweetAlert
>                  Para alertas tipo Modal con Interacción del Usuario
*   [**3.2.1**]    JQuery
>                  Librería de complemento Javascript
*   [**1.12.1**]   JQuery UI
>                  Complemento de JQuery
*   [**2.1.24**]   Bootstrap Datepicker
>                  Para manejo de Fechas
*   [**3.5.1**]    Fullcalendar
>                  Para integración de Calendario
*   [**2.0**]      Select2
>                  Para Selectores con buscador
*   [**4.4.4**]    Bootstrap File Input
>                  Para frontal de Upload Files
*   [**0.8.1**]    FormValidation
>                  Validaciones en formularios
*   [**3.0**]      jQuery Smart Wizard
>                  Complemento para Steps Manager
*   [**1.0.1**]    iCheck
>                  Customización de controles
*   [**1.2.13**]   jQuery Knob
>                  Customización de controles
*   [**2.2.0**]    Ion Range Slider
>                  Customización de controles
*   [**4.7**]      Font Awesome Icons
>                  Fuente de Iconografía

**Instalación de Aplicación**
NOTA: La configuración de instalación ahora descrita está elaborada para Sistemas operativos Linux.

* Requerimientos Minimos:
Tener instalados los siguientes aplicativos en el sistema operativo
  1. Docker
  2. Docker-compose

[1] Configuración de Host de la aplicación:
  1. En el directorio docker/nginx, editar el archivo *vhost.conf*
    El parametro *server_name* corresponde al nombre del host por el que se va a acceder a la aplicación
    NOTA: Si se prefiere, se podria dejar el mismo hosts configurado en el archivo *vhosts.conf*
  2. Editar el Archivo *docker-compose.override.yml* para indicar la [*IP Address*] de la interfaz de red local en la que se van a configurar los contenedores.
  3. Luego de haber configurado el Nombre del Hots y la IP de acceso se debe modificar el Host de la maquina anfitrion, editando el archivo *hosts*
    que está en el directorio */etc/*, y configurar el server_name apuntando a la IP configurada en el paso anterior
    ```[IP Address]      server_name
    ```
[2] Build Imagenes de Dockers
  1. Abrir un linea de comandos y situarse en el directorio raiz del proyecto
  2. Luego se procede a contruir las imagenes de los contenedores de Docker con el comando *docker-compose up --build -d*
```
[username@localhost]$ docker-compose up --build -d
```
[3] Instalación de dependencias PHP
  1. La instalación de las dependencias en el proyecto se debe realizar desde el contenedor *Nginx-PHP7*. Para ello desde la linea de comandos
    se debe ejecutar el comando *docker exec -ti Nginx-PHP7 runuser www-data -c 'composer install'*
```
[username@localhost]$ docker exec -ti Nginx-PHP7 runuser www-data -c 'composer install'
```
[4] Instalación de dependencias con Bower
  1. La instalación de las dependencias en el proyecto se debe realizar desde el contenedor *Nginx-PHP7*. Para ello desde la linea de comandos
    se debe ejecutar el comando *docker exec -ti Nginx-PHP7 runuser www-data -c 'bower install'*
```
[username@localhost]$ docker exec -ti Nginx-PHP7 runuser www-data -c 'bower install'
```
NOTA: Para entornos de desarrollo, si se desea instalar una dependencia se debe ejecutar el comando *docker exec -ti Nginx-PHP7 runuser www-data -c 'bower install --save dependency'*

[5] Verificar acceso por el Navegador
  1. Para realizar la verificación de que la aplicación se instaló correctamente se debe entrar en el navegador de su preferencia (Recomendado Google Chrome o Firefox)
    y tipear en la barra de url el *server_name* configurado en el paso 1.1
>   Ej: http://www.salesweb.dev

[6] Verificar acceso a la base de datos
  1. Para verificar el acceso a la base de datos se debe ingresar en el navegador y tipear en la barra de url
    el *server_name* configurado en el paso 1.1 indicandole el puerto de acceso :8080
>   Ej: http://www.salesweb.dev:8080

NOTA: En el paso 5 o 6 ocurre una *redirección forzando el uso del protocolo HTTPS (Puede pasar en el Navegador Chrome)* se debe cambiar en el paso 1 el *server_name* por uno con un dominio distinto a *.dev*. Por ejemplo: www.salesweb.local
=========================================================================================================

**Migraciones de Base de Datos**
NOTA: La doumentación de la migración descrita está elaborada para Sistemas operativos Linux y debe ser ejecutada luego de construir el docker ó al detectar una migración por ejecutar en BD.

* Requerimientos Minimos:
Tener construidos y corriendo los contenedores docker

[1] Deshabilitar chequeo de FOREING KEY
  1. Para deshabilitar la comprobación de FOREING KEY se debe ingresar al contenedor de MYSQL con el siguiente comando en la terminal *docker exec -ti Nginx-MYSQL mysql -uroot -p*. Luego de ésto aparece en a siguiente linea la solicitud de ingresar la contraseña *docker*.
  2. Luego de estar dentro de contenedor de MYSQL se debe ejecutar elsiguiente comando en la terminal *SET GLOBAL FOREIGN_KEY_CHECKS=0;*. Ésto va a deshabilitar la comprobación.
  Luego de éste paso se debe volver al paso [2] Para ejecutar nuevamente la migración
* NOTA: Al finalizar todo el proceso de ejecución de las migraciones se debe retornar la verificación de Foregn keys. Para ello se debe ejecutar el proceso [3] ajustando el comando a: *SET GLOBAL FOREIGN_KEY_CHECKS=1;*


[2] Montar la tabla City en BD:
  1. Para ello se debe ejecutar el comando *docker exec -i Nginx-MYSQL mysql -udocker -pdocker salesDB < city.sql* en la terminal.
```
[username@localhost]$ docker exec -i Nginx-MYSQL mysql -udocker -pdocker salesDB < city.sql
```
* NOTA: Éste proceso se debe ejecutar cituado en el directorio raiz del proyecto. De pretender ejecutarse desde otro directorio se debe ajustar el último parámetro del comando para indicar la ruta a la tabla city.

[3] Correr la migración con Phalcon Devel Tools:
  1. Para ello se debe ejecutar el comando *docker exec -ti Nginx-PHP7 runuser www-data -c 'phalcon migration run --verbose --table=user,role,client,country,itinerary_type,product,product_category,province,question_type,status,question,price,questionnaire,payment_method,customer,customer_contact,expense,itinerary,answer,invoice,invoice_product,work_day,customer_assign,questionnaire_type,sync_status'* en la terminal.
```
[username@localhost]$ docker exec -ti Nginx-PHP7 runuser www-data -c 'phalcon migration run --verbose --table=user,role,client,country,itinerary_type,product,product_category,province,question_type,status,question,price,questionnaire,payment_method,customer,customer_contact,expense,itinerary,answer,invoice,invoice_product,work_day,customer_assign,questionnaire_type,sync_status'
```
* NOTA: Éste proceso ejecuta acciones de creación y modificación de Tablas en la Base de datos, inserciones, etc. De ser necesario se debe ejecutar el comando agregando el flat *--force* al final para forzar la ejecución de la migración.
* NOTA: Si al momento de ejecutar las migraciones se detiene el proeso mostrando un error como éste: *SQLSTATE[HY000]: General error: 1215 Cannot add foreign key constraint* se debe ejecutar el paso [1] nuevamente.
* NOTA: Si al momento de ejecutar las migraciones se detiene el proeso mostrando un mensaje como éste: Info: Everything is up to date, Se debe ejecutar desde la raiz del proyecto el comando *git checkout www/.phalcon/migration-version* para limpiar las versiones de migración aplicadas.
