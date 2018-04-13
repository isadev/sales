<?php

use App\Library\Auth;
use App\Library\Mail;
use App\Library\Guid;
use Phalcon\Mvc\View;
use Phalcon\Mvc\Dispatcher;
use App\Library\UserManager;
use Phalcon\Flash\Direct as Flash;
use Phalcon\Logger\Formatter\Line;
use Phalcon\Logger\Adapter\Stream;
use Phalcon\Mvc\Url as UrlResolver;
use Phalcon\Mvc\View\Engine\Php as PhpEngine;
use Phalcon\Logger\Adapter\File as LogProvider;
use Phalcon\Mvc\View\Engine\Volt as VoltEngine;
use Phalcon\Session\Adapter\Files as SessionAdapter;
use Phalcon\Mvc\Model\Metadata\Memory as MetaDataAdapter;

// Register the events manager
$di->set('dispatcher', function () use ($di) {
    $eventsManager = $di->getShared('eventsManager');
    // Handles now found exceptions
    $eventsManager->attach('dispatch:beforeException', new NotFoundPlugin);
    $eventsManager->attach("dispatch:beforeExecuteRoute", $di->get('preflight'));
    // Handles security and ACL
    $eventsManager->attach('dispatch:beforeExecuteRoute', new SecurityPlugin);
    $dispatcher = new Dispatcher();
    $dispatcher->setEventsManager($eventsManager);

    return $dispatcher;
});
/**
 * Shared configuration service
 */
$di->setShared('config', function () {
    return include APP_PATH . "/config/config.php";
});
$di->set('router', function () {
    return include APP_PATH . "/config/router.php";
    }, true);

/**
 * The URL component is used to generate all kind of urls in the application
 */
$di->setShared('url', function () {
    $config = $this->getConfig();

    $url = new UrlResolver();
    $url->setBaseUri($config->application->baseUri);

    return $url;
});

/**
 * Setting up the view component
 */
$di->setShared('view', function () {
    $config = $this->getConfig();

    $view = new View();
    $view->setDI($this);
    $view->setViewsDir($config->application->viewsDir);

    $view->registerEngines([
        '.volt' => function ($view) {
            $config = $this->getConfig();

            $volt = new VoltEngine($view, $this);

            $volt->setOptions([
                'compiledPath' => $config->application->cacheDir,
                'compiledSeparator' => '_'
            ]);

            return $volt;
        },
        '.phtml' => PhpEngine::class

    ]);

    return $view;
});

/**
 * Database connection is created based in the parameters defined in the configuration file
 */
$di->setShared('db', function () {
    $config = $this->getConfig();

    $class = 'Phalcon\Db\Adapter\Pdo\\' . $config->database->adapter;
    $params = [
        'host'     => $config->database->host,
        'username' => $config->database->username,
        'password' => $config->database->password,
        'dbname'   => $config->database->dbname,
        'charset'  => $config->database->charset
    ];

    if ($config->database->adapter == 'Postgresql') {
        unset($params['charset']);
    }

    $connection = new $class($params);

    return $connection;
});


/**
 * If the configuration specify the use of metadata adapter use it or use memory otherwise
 */
$di->setShared('modelsMetadata', function () {
    return new MetaDataAdapter();
});

/**
 * Register the session flash service with the Twitter Bootstrap classes
 */
$di->set('flash', function () {
    return new Flash([
        'error'   => 'alert alert-danger',
        'success' => 'alert alert-success',
        'notice'  => 'alert alert-info',
        'warning' => 'alert alert-warning'
    ]);
});

/**
 * Start the session the first time some component request the session service
 */
$di->setShared('session', function () {
    $session = new SessionAdapter();
    $session->start();

    return $session;
});
/**
 * Configuración de Crypt para enciptación base64
 */
$di->set("crypt", function () {
        $crypt = new Crypt();
        // Set a global encryption key
        $crypt->setKey("%31.1e$i86e$f!8jz");
        return $crypt;
    },
    true
);

/**
 * Servicio de envio de correos
 */
$di->set('mail', function(){
    return new Mail();
});
/**
 * Configuration CorsOrigin Preflight
 */
$di->set('preflight', function() {
    return new PreFlightListener();
}, true);
/**
 * UserManager
 */
$di->set('userMgr', function () {
    return new UserManager();
});
/**
 * Auth
 */
$di->set('auth', function () {
    return new Auth();
});
/**
 * GUID Class
 */
$di->set('guid', function () {
    return new Guid();
});
/**
 * Log Service
 */
$di->set('log', function () {
    $config = $this->getConfig();
    switch ($config->application->logger) {
        case 1:
            $logPath = $config->application->logger_path;
            $logFilename = (new DateTime('now'))->format('Y-m-d') . '.log';
            $logger = new LogProvider($logPath . $logFilename);
            break;
        default:
            $logger = new Stream("php://stderr");
            break;
    }

    $formatter = new Line(null, 'Y-m-d H:i:s');

    $logger->setFormatter($formatter);

    return $logger;
});