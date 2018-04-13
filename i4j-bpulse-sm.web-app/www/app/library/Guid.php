<?php
namespace App\Library;

use Phalcon\Security\Random;

class Guid extends ComponentBase
{

    /**
     * Generate a UUID (version 4).
     * @return string
     */
    public function generate() {
        // Class Ramdon Instance
        $random = new Random();
        $uuid   = trim($random->uuid(), '{}');
        
        return $uuid;
    }
}