<?php

namespace Test;

use \Phalcon\Test\UnitTestCase as UnitTestCase;
use Phalcon\Mvc\Router;

/**
 * Class IndexTest
 */
class IndexTest extends UnitTestCase
{
    public function testTestCase()
    {
        echo "
              *****************************************
              ***     SALES APLICATIONS TESTS       ***
              *****************************************";
        $this->assertEquals(
            "works",
            "works",
            "This is OK"
        );
    }
}