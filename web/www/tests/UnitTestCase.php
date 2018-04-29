<?php
namespace App\Test;

use \Phalcon\Di;
use \Phalcon\Test\UnitTestCase as PhalconTestCase;
use \Phalcon\Db\Adapter\Pdo\Mysql as DbAdapter;

abstract class UnitTestCase extends PhalconTestCase
{
    /**
     * @var bool
     */
    private $_loaded = false;



    public function setUp(Phalcon\DiInterface $di = NULL, Phalcon\Config $config = NULL)
    {
        $config = include __DIR__ . "../apps/config/config.php";
        // Load any additional services that might be required during testing
        $di = DI::getDefault();

        $di = new FactoryDefault();        

        // get any DI components here. If you have a config, be sure to pass it to the parent
        parent::setUp($di,$config);
        // get any DI components here. If you have a config, be sure to pass it to the parent
        /**
         * Database connection is created based in the parameters defined in the configuration file
         */
        $this->di['db'] = function () use ($config) {
            return new DbAdapter(
                [
                    "host" => $config->database->host,
                    "username" => $config->database->username,
                    "password" => $config->database->password,
                    "dbname" => $config->database->dbname
                ]
            );
        };

        $this->_loaded = true;
    }

    /**
     * Check if the test case is setup properly
     *
     * @throws \PHPUnit_Framework_IncompleteTestError;
     */
    public function __destruct()
    {
        if (!$this->_loaded) {
            throw new \PHPUnit_Framework_IncompleteTestError(
                "Please run parent::setUp()."
            );
        }
    }
}