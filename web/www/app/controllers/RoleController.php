<?php

use Phalcon\Mvc\View; 
use App\Models\City;
use App\Library\ExceptionsEnums as ExcEnums;
use Phalcon\Filter;
use Phalcon\Http\Response as Response;
use App\Models\Role;

class RoleController extends ControllerBase
{
    public function listAction()
    {
        $view = new View();
        $excm = new ExcEnums;
        $role = new Role();
        $filter = new Filter();

        $roles = $role->find();
        // Disable several levels
        $view->disableLevel(
            [
                View::LEVEL_LAYOUT      => true,
                View::LEVEL_MAIN_LAYOUT => true
            ]
        );
        $this->setJsonResponse();
        if(!$this->auth->getUser()) {
            $exec = $excm->getExcMsg(excEnums::EXC_RQ_003);
            $response = array(
                'title' => "Lo siento",
                'message' => "Ha ocurrido un error",
                'domain' => null,
                'error' => array(
                    'message' => $exec[1],
                    'execCode' => $exec[0]
                    )
                );
                return json_encode($response);
            }
        $response = array(
                'title' => "Session activa",
                'message' => "su session está activa exitosamente",
                'domain' => $roles,
                'error' => null
        );
        return json_encode($response);
    }
}