<?php
/*
 * Modified: prepend directory path of current file, because of this file own different ENV under between Apache and command line.
 * NOTE: please remove this comment.
 */
defined('BASE_PATH') || define('BASE_PATH', getenv('BASE_PATH') ?: realpath(dirname(__FILE__) . '/../..'));
defined('APP_PATH') || define('APP_PATH', BASE_PATH . '/app');


return new \Phalcon\Config([
    'database' => [
        'adapter'     => 'Mysql',
        'host'        => 'dbmysql',
        'username'    => 'docker',
        'password'    => 'docker',
        'dbname'      => 'salesDB',
        'charset'     => 'utf8',
    ],
    'application' => [
        'appDir'         => APP_PATH . '/',
        'controllersDir' => APP_PATH . '/controllers/',
        'modelsDir'      => APP_PATH . '/models/',
        'migrationsDir'  => APP_PATH . '/migrations/',
        'viewsDir'       => APP_PATH . '/views/',
        'pluginsDir'     => APP_PATH . '/plugins/',
        'libraryDir'     => APP_PATH . '/library/',
        'cacheDir'       => BASE_PATH . '/cache/',
        'translationsDir'=> APP_PATH . '/messages/',
        'uploadsDir'=> BASE_PATH . '/public/files/uploads/',
        'logger'         => 2,// 1 = File Logger, 2 = std:err Logger,
        // This allows the baseUri to be understand project paths that are not in the root directory
        // of the webpspace.  This will break if the public/index.php entry point is moved or
        // possibly if the web server rewrite rules are changed. This can also be set to a static path.
        'baseUri'        => "/",
    ],
    'environment' => 'devel',
    'mail' => [
        'fromName' => 'BPulse',
        'fromEmail' => 'correo@gmail.com',
        'smtp' => [
            'server'	=> 'smtp.gmail.com',
            'port' 		=> 465,
            'security' => 'ssl',
            'username' => 'usuario_quien_envia@host.com',
            'password' => 'contraseña_usuario_quien_envia',
        ]
    ],
]);
