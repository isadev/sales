<?php

use Phalcon\Mvc\View; 
use App\Models\City;
use App\Library\ExceptionsEnums as ExcEnums;
use Phalcon\Filter;
use Phalcon\Http\Response as Response;

class CityController extends ControllerBase
{
    public function listAction()
    {
        $view = new View();
        $excm = new ExcEnums;
        $city = new City();
        $filter = new Filter();
        $query = $filter->sanitize($this->request->getQuery("query"), "int");
        $term = $filter->sanitize($this->request->getQuery("term"), "string");

        if(isset($term)){
            $cities = $city->query()    
                ->where('name LIKE :name:')
                ->andWhere('province_id = :query:')
                ->bind(array('name' => '%' . $term .'%', 'query' => $query))
                ->execute();
        }else{
            $cities = $city->findByProvinceId($query);
        }
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
                'domain' => $cities,
                'error' => null
        );
        return json_encode($response);
    }
}