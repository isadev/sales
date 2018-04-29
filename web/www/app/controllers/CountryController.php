<?php

use Phalcon\Mvc\View; 
use App\Models\Country;
use App\Library\ExceptionsEnums as ExcEnums;
use Phalcon\Filter;
use Phalcon\Http\Response as Response;

class CountryController extends ControllerBase
{
    public function listAction()
    {
        $view = new View();
        $excm = new ExcEnums;
        $country = new Country();
        $filter = new Filter();
        $query = $filter->sanitize($this->request->getQuery("query"), "string");
        $countries = $country->query();
        $countries->where("name LIKE :name:");
        $countries->bind(array('name' => '%' . $query .'%'));
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
                'domain' => $countries->execute(),
                'error' => null
        );
        return json_encode($response);
    }
}