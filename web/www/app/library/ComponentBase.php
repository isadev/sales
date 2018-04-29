<?php
namespace App\Library;


use Phalcon\Mvc\User\Component;

abstract class ComponentBase extends Component
{
    /**
     * @return \Phalcon\Db\Adapter\Pdo
     */
    protected function getDb() {
        return $this->get('db');
    }

    protected function getConfig() {
        return $this->get('config');
    }

    /**
     * @return UserManager
     */
    protected function getUserMgr() {
        return $this->get('userMgr');
    }

    /**
     * @return Auth
     */
    protected function getAuth() {//Comentario
        return $this->di->get('auth');
    }



    /**
     * @return \Phalcon\Logger\AdapterInterface
     */
    protected function getLog() {
        return $this->get('log');
    }

    protected function get($svc) {
        return $this->getDI()->get($svc);
    }
}