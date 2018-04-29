<?php

$loader = new \Phalcon\Loader();

/**
 * We're a registering a set of directories taken from the configuration file
 */
$loader->registerDirs(
    [
        $config->application->controllersDir,
        $config->application->modelsDir,
        $config->application->libraryDir,
        $config->application->pluginsDir
    ]
)
->registerNamespaces(
    array(
        'App\Controllers'    => "../app/controllers/",
        'App\Models'    => "../app/models/",
        'App\Library'    => "../app/library/",
        'App\Plugins'    => "../app/plugins/",
        'GuzzleHttp'=> '../vendor/guzzlehttp/guzzle/src/', 
    )
)->register();
