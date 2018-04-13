<?php

namespace App\Test;

use \GuzzleHttp\Client as Browser;
use \GuzzleHttp\Psr7\Response;
use \GuzzleHttp\Tests\Server;
use \GuzzleHttp\Handler\MockHandler;
use \GuzzleHttp\HandlerStack;
use \GuzzleHttp\Psr7\Request;
use \GuzzleHttp\Exception\RequestException;

/**
 * Class IndexTest
 */
class UserTest extends UnitTestCase
{
    public function testList()
    {
        $browser = new Browser([
            'base_uri' => 'http://www.salesweb.test'
        ]);
        // $user = new \App\Models\User();
        // The first request is intercepted with the first response.
        $statusCode = $browser->request('GET', '/')->getStatusCode();
        $body = $browser->request('GET', '/')->getBody()->getContents();
        $this->assertEquals(
            $statusCode,
            200
        );
        $this->assertContains(
            "FOR DEMO PURPOSES ONLY",
            $body
        );
    }
}