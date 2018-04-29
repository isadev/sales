<?php

use Phalcon\Acl;
use Phalcon\Events\Event;
use Phalcon\Mvc\Dispatcher;
use Phalcon\Mvc\User\Plugin;
use App\Library\PermissionMenu;
use Phalcon\Http\Response as Response;
use App\Library\ExceptionsEnums as ExcEnums;

class SecurityPlugin extends Plugin
{

    public function beforeExecuteRoute(Event $event, Dispatcher $dispatcher) {
        $controller = strtolower($dispatcher->getControllerName());
        $action = $dispatcher->getActionName();
        $permisionsMenu = new PermissionMenu;
        if (in_array($controller, ['errors', "rest_api"] ) || $dispatcher->getPreviousControllerName() == "rest_api") {
            return true;
        }
        
        $auth = $this->auth->getUser();
        if (!$auth) {
            if ($controller != 'session') {
                $this->destroySession();
                $this->response->redirect('/');
                return false;
            }
        }
        // var_dump($role, $controller, $action);die;
        if($controller!=="session"){
            $role = $this->auth->getUser()->getRoleId();
            $permission = $permisionsMenu->getPermissionByRole($role, $controller, $action);
            if(!$permission){
                $excm = new ExcEnums;
                $excm = $excm->getExcMsg(excEnums::EXC_RQ_003);
                $error = array(
                    'message' => $excm[1],
                    'execCode' => $excm[0]
                );
                $result = array(
                    'title' => "Lo siento",
                    'message' => "Ha ocurrido un error",
                    'domain' => null,
                    'error' => $error
                );
                $this->response->setStatusCode(403,"Permission denied");
                $this->response->setContent(json_encode($result));
                return false;
            }
        }
    }

    private function destroySession() {
        if (!$this->session->isStarted())
            $this->session->destroy();
    }

}