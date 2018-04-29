<?php

use Phalcon\Filter;
use Phalcon\Mvc\View; 
use App\Models\Customer;
use App\Models\CustomerAssign;
use Phalcon\Http\Response as Response;
use App\Library\ExceptionsEnums as ExcEnums;

class CustomerController extends ControllerBase
{
    public function listAction()
    {
        $view = new View();
        $excm = new ExcEnums;
        $filter = new Filter;
        $customer = new Customer();
        $results = [];
        $query = $filter->sanitize($this->request->getQuery("query"), "string");
        if($filter->sanitize($this->request->getQuery("dateLastSync"), "int")){
            $dateTimestamp = $filter->sanitize($this->request->getQuery("dateLastSync"), "int");
            $dateLastSync = date('Y-m-d H:i:s', $dateTimestamp);
        }else{
            $dateLastSync = null;
        }
        if(isset($query)){
            $customers = $customer->query()
                ->where('name LIKE :name:')
                ->andWhere('client_id = :query:')
                ->andWhere("date_updated >= :last_sync:")
                ->bind(array('name' => '%' . $query .'%', 'query' => $this->auth->getUser()->getClientId(), "last_sync" => $dateLastSync ? $dateLastSync : '%'))
                ->execute();
        }else{
            $customers = $customer->query()
                ->andWhere('client_id = :query:')
                ->andWhere("date_updated >= :last_sync:")
                ->bind(array('query' => $this->auth->getUser()->getClientId(), "last_sync" => $dateLastSync ? $dateLastSync : '%'))
                ->execute();
        }
        foreach ($customers as $key => $value) {
            $row = $value->toArray();
            $row["city"]=array("id" => $value->getCityId(), "name" => $value->getCity()->getName());
            $row["province"] = array("id" => $value->getCity()->getProvince()->getId(), "name" => $value->getCity()->getProvince()->getName());
            $row["country"] = array("id" => $value->getCity()->getProvince()->getCountry()->getId(), "name" => $value->getCity()->getProvince()->getCountry()->getName());
            $results[$key]= $row;
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
                'domain' => $results,
                'error' => null
        );
        return json_encode($response);
    }
    /**
     * Funcion encargada de devolver los datos de un Customer dado su guId
     *
     * @return Response
     */
    public function searchByIdAction($customerId)
    {

        $customer = new Customer();
        $customer = $customer->findById($customerId);

        $response = new Response();
        $this->view->disable();

        if (count($customer) > 0) {
            $response->setStatusCode(200, "OK");
            $response->setContent(json_encode($customer[0]));
            return $response;
        }   
        $response->setStatusCode(404, "Bad Request");
        $response->setContent(json_encode("Param not found"));
        return $response;
    }
    /**
     * Crear una Customer
     *
     */
    public function createAction()
    {
        $response = new Response();
        $filter = new Filter(); 
        $request = $this->request->getJsonRawBody();
        $customer = new Customer();

        $conditions = ['name'=>$filter->sanitize($request->name, "string"), 'client'=>$filter->sanitize($request->client_id, "string")];            
        $model = $customer->findFirst([
            'conditions' => 'name=:name: AND client_id=:client:',
            'bind' => $conditions,
        ]);
        if ($model) { 
            $response->setStatusCode(400,"Found"); 
            return $response->setContent(json_encode("Client Exist",false)); 
        } 
        // create the customer          
        $customer->setName($filter->sanitize($request->name, "string"));
        $customer->setPhone($filter->sanitize($request->phone, "string"));
        $customer->setAddress($filter->sanitize($request->address, "string"));
        $customer->setPostalCode($filter->sanitize($request->postal_code, "string"));
        $customer->setNit($filter->sanitize($request->nit, "string"));
        $customer->setCityId($filter->sanitize($request->city_id, "int"));
        
        if (!$customer->save()) {
            $response->setStatusCode(400,"Bad Request");
            $totalMessage = [];
            foreach ($customer->getMessages() as $message) {
                array_push($totalMessage, $message->getMessage());
            }
            return $response->setContent(json_encode($totalMessage, false));
        }
        $row = $customer->toArray(); 
        $row["city"]=array("id" => $customer->getCityId(), "name" => $customer->getCity()->getName());
        $row["province"] = array("id" => $customer->getCity()->getProvince()->getId(), "name" => $customer->getCity()->getProvince()->getName());
        $row["country"] = array("id" => $customer->getCity()->getProvince()->getCountry()->getId(), "name" => $customer->getCity()->getProvince()->getCountry()->getName());
 
        $response = array( 
            'title' => "Excelente", 
            'message' => "Solicitud procesada", 
            'domain' => $row, 
            'error' => null 
        ); 
        return json_encode($response); 
    }
    /**
     * Actualizar los datos existentes de un Customer a partir de su ID
     *
     */
    public function updateAction()
    {
        $response = new Response();
        $request = $this->request->getJsonRawBody();
        $filter = new Filter(); 
        $model = new Customer();
        $customer = $model->findFirstById($filter->sanitize($request->id, "string"));
        if (!$customer) {
            $response->setStatusCode(400,"Not found");
            return $response->setContent(json_encode("Customer Not Found",false));
        }        

        $customer->setName($filter->sanitize($request->name, "string"));
        $customer->setPhone($filter->sanitize($request->phone, "string"));
        $customer->setAddress($filter->sanitize($request->address, "string"));
        $customer->setPostalCode($filter->sanitize($request->postal_code, "string"));
        $customer->setNit($filter->sanitize($request->nit, "string"));
        $customer->setCityId($filter->sanitize($request->city_id, "int"));

        if (!$customer->save()) {
            $response->setStatusCode(400,"Bad Request");
            $totalMessage = [];
            foreach ($customer->getMessages() as $message) {
                array_push($totalMessage, $message->getMessage());
            }
            return $response->setContent(json_encode($totalMessage, false));
        }
        $row = $customer->toArray(); 
        $row["city"]=array("id" => $customer->getCityId(), "name" => $customer->getCity()->getName());
        $row["province"] = array("id" => $customer->getCity()->getProvince()->getId(), "name" => $customer->getCity()->getProvince()->getName());
        $row["country"] = array("id" => $customer->getCity()->getProvince()->getCountry()->getId(), "name" => $customer->getCity()->getProvince()->getCountry()->getName());
 
        $response = array( 
            'title' => "Excelente", 
            'message' => "Solicitud procesada", 
            'domain' => $row, 
            'error' => null 
        ); 
        return json_encode($response); 
    }
    /**
     * Elimina un Customer dado un ID
     *
     */
    public function deleteAction($id)
    {
        $response = new Response();
        $model = new Customer();
        $filter = new Filter();
        $customer = $model->findFirstById($filter->sanitize($id, "string")); 

        if (!$customer) {
            $response->setStatusCode(400,"Not found");
            return $response->setContent(json_encode("Customer Not Found",false));
        }
        if (!$customer->delete()) {
            $response->setStatusCode(400,"Bad Request");
            $totalMessage = [];
            foreach ($customer->getMessages() as $message) {
                array_push($totalMessage, $message);
            }
            return $response->setContent(json_encode($totalMessage, false));
        }

        $response->setStatusCode(200,"OK");
        return $response->setContent(json_encode("OK Delete", false));
    }
}