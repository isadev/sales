<?php

use App\Models\Itinerary;
use Phalcon\Mvc\View; 
use App\Library\ExceptionsEnums as ExcEnums;
use Phalcon\Http\Response as Response;
use Phalcon\Filter;

class ItineraryController extends ControllerBase
{
    public function listAction()
    {
        $view = new View();
        $excm = new ExcEnums;
        $filter = new Filter(); 
        $itinerary = new Itinerary();
        $results = [];
        if($filter->sanitize($this->request->getQuery("dateLastSync"), "int")){
            $dateTimestamp = $filter->sanitize($this->request->getQuery("dateLastSync"), "int");
            $dateLastSync = date('Y-m-d H:i:s', $dateTimestamp);
        }else{
            $dateLastSync = null;
        }
        if(($this->request->get("itinerary_type")!==null || $this->request->get("sellerId")!==null || $this->request->get("cityId")!==null) && $this->auth->getUser()->getRoleId()!=3){
            $itinerary_type = $this->request->get("itinerary_type") == '-1' || $this->request->get("itinerary_type") === null ? '%' : $filter->sanitize($this->request->get("itinerary_type"), "int");
            $sellerId = $this->request->get("sellerId") == '-1' || $this->request->get("sellerId") === null ? '%' : $filter->sanitize($this->request->get("sellerId"), "string");
            $cityId = $this->request->get("cityId") == '-1' || $this->request->get("cityId") === null ? '%' : $filter->sanitize($this->request->get("cityId"), "int");
            $itineraries = $itinerary->query()    
                    ->where('client_id LIKE :client:')
                    ->andWhere('user_id LIKE :seller:')
                    ->andWhere('itinerary_type_id LIKE :itinerary_type:')
                    ->andWhere("date_updated >= :last_sync:")
                    ->andWhere('city_id LIKE :city:')
                    ->bind(array(
                        'client' => $this->auth->getUser()->getClientId(),
                        "last_sync" => $dateLastSync ? $dateLastSync : '%',
                        'seller' => $sellerId,
                        'itinerary_type' => $itinerary_type,
                        'city' => $cityId
                    ))
                    ->execute();
        }else if($this->auth->getUser()->getRoleId()==3){
             $itineraries = $itinerary->query()    
                    ->where('user_id LIKE :user:')
                    ->andWhere("date_updated >= :last_sync:")
                    ->bind(array(
                        "last_sync" => $dateLastSync ? $dateLastSync : '%',
                        'user' => $this->auth->getUser()->getId()
                    ))
                    ->execute();
        }else{
             $itineraries = $itinerary->query()    
                    ->where('client_id LIKE :client:')
                    ->andWhere("date_updated >= :last_sync:")
                    ->bind(array(
                        'client' => $this->auth->getUser()->getClientId(),
                        "last_sync" => $dateLastSync ? $dateLastSync : '%'
                    ))
                    ->execute();
        }
        foreach ($itineraries as $key => $value) {
            $row = $value->toArray();
            $row["customer"]=array("id" => $value->getCustomerId(), "name" => $value->getCustomer()->getName());
            $row["customer_contact"]=array("id" => $value->getCustomerContactId(), "name" => $value->getCustomerContact()->getFirstName()." ".$value->getCustomerContact()->getLastName(), "mobile" => $value->getCustomerContact()->getMobile(), "phone" => $value->getCustomerContact()->getPhone(), "email" => $value->getCustomerContact()->getEmail());
            $row["itinerary_type"]=array("id" => $value->getItineraryTypeId(), "name" => $value->getItineraryType()->getName());
            $row["status"]=array("id" => $value->getStatusId(), "name" => $value->getStatus()->getName());
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
     * Funcion encargada de devolver los datos de un Itinerary dado su guId
     *
     * @return Response
     */
    public function searchByIdAction($itineraryId)
    {

        $itinerary = new Itinerary();
        $itinerary = $itinerary->findById($itineraryId);

        $response = new Response();
        $this->view->disable();

        if (count($itinerary) > 0) {
            $response->setStatusCode(200, "OK");
            $response->setContent(json_encode($itinerary[0]));
            return $response;
        }   
        $response->setStatusCode(404, "Bad Request");
        $response->setContent(json_encode("Param not found"));
        return $response;
    }
    /**
     * Crear una Itinerary
     *
     */
    public function createAction()
    {
        $response = new Response();
        $filter = new Filter(); 
        $request = $this->request->getJsonRawBody();
        $itinerary = new Itinerary();
        
        // create the itinerary
        $itinerary->setAddress($filter->sanitize($request->address, "string"));
        $itinerary->setDateTime($filter->sanitize($request->date_time, "string"));
        $itinerary->setCityId($filter->sanitize($request->city_id, "int"));
        $itinerary->setCustomerId($filter->sanitize($request->customer_id, "string"));
        $itinerary->setItineraryTypeId($filter->sanitize($request->itinerary_type_id, "int"));
        $itinerary->setStatusId($filter->sanitize($request->status_id, "int"));
        $itinerary->setCustomerContactId($filter->sanitize($request->customer_contact_id, "string"));
        $itinerary->setObservation($request->observation ? $filter->sanitize($request->observation, "string") : null);
        
        if (!$itinerary->save()) {
            $response->setStatusCode(400,"Bad Request");
            $totalMessage = [];
            foreach ($itinerary->getMessages() as $message) {
                array_push($totalMessage, $message->getMessage());
            }
            return $response->setContent(json_encode($totalMessage, false));
        }
        $defaults = [
            "title" => $this->getTranslation()->_("title"), 
            "textAction"=> $this->getTranslation()->_("textAction"),
            "buttonCenter"=> $this->getTranslation()->_("buttonCenter"),
            "textRecommended"=> $this->getTranslation()->_("textRecommended"),
            "textFooter"=> $this->getTranslation()->_("textFooter")
        ];
        $email = $this->getMail()->send($itinerary->getUser()->getEmail(), $this->getTranslation()->_("itineraryEdit"), null, $defaults);
        $row = $itinerary->toArray();
        $row["customer"]=array("id" => $itinerary->getCustomerId(), "name" => $itinerary->getCustomer()->getName());
        $row["date_time"]=$itinerary->getDateTime();
        $row["customer_contact"]=array("id" => $itinerary->getCustomerContactId(), "name" => $itinerary->getCustomerContact()->getFirstName()." ".$itinerary->getCustomerContact()->getLastName(), "mobile" => $itinerary->getCustomerContact()->getMobile(), "phone" => $itinerary->getCustomerContact()->getPhone(), "email" => $itinerary->getCustomerContact()->getEmail());
        $row["itinerary_type"]=array("id" => $itinerary->getItineraryTypeId(), "name" => $itinerary->getItineraryType()->getName());
        $row["status"]=array("id" => $itinerary->getStatusId(), "name" => $itinerary->getStatus()->getName());
        $row["city"]=array("id" => $itinerary->getCityId(), "name" => $itinerary->getCity()->getName());
        $row["province"] = array("id" => $itinerary->getCity()->getProvince()->getId(), "name" => $itinerary->getCity()->getProvince()->getName());
        $row["country"] = array("id" => $itinerary->getCity()->getProvince()->getCountry()->getId(), "name" => $itinerary->getCity()->getProvince()->getCountry()->getName()); 
 
        $response = array( 
            'title' => "Excelente", 
            'message' => "Solicitud procesada", 
            'domain' => $row, 
            'error' => null 
        ); 
        return json_encode($response); 
    }
    /**
     * Actualizar los datos existentes de un Itinerary a partir de su ID
     *
     */
    public function updateAction()
    {
        $response = new Response();
        $filter = new Filter(); 
        $request = $this->request->getJsonRawBody();
        $model = new Itinerary();
        $itinerary = $model->findFirstById($filter->sanitize($request->id, "string"));
        if (!$itinerary) {
            $response->setStatusCode(404,"Not found");
            return $response->setContent(json_encode("Itinerary Not Found",false));
        }

        $itinerary->setAddress($filter->sanitize($request->address, "string"));
        $itinerary->setDateTime($filter->sanitize($request->date_time, "string"));
        $itinerary->setCityId($filter->sanitize($request->city_id, "int"));
        $itinerary->setCustomerId($filter->sanitize($request->customer_id, "string"));
        $itinerary->setItineraryTypeId($filter->sanitize($request->itinerary_type_id, "int"));
        $itinerary->setStatusId($filter->sanitize($request->status_id, "int"));
        $itinerary->setCustomerContactId($filter->sanitize($request->customer_contact_id, "string"));
        $itinerary->setObservation($request->observation ? $filter->sanitize($request->observation, "string") : null);

        if (!$itinerary->save()) {
            $response->setStatusCode(400,"Bad Request");
            $totalMessage = [];
            foreach ($itinerary->getMessages() as $message) {
                array_push($totalMessage, $message->getMessage());
            }
            return $response->setContent(json_encode($totalMessage, false));
        }
        $defaults = [
            "title" => $this->getTranslation()->_("title"), 
            "textAction"=> $this->getTranslation()->_("textAction"),
            "buttonCenter"=> $this->getTranslation()->_("buttonCenter"),
            "textRecommended"=> $this->getTranslation()->_("textRecommended"),
            "textFooter"=> $this->getTranslation()->_("textFooter")
        ];
        $email = $this->getMail()->send($itinerary->getUser()->getEmail(), $this->getTranslation()->_("itineraryEdit"), null, $defaults);
        $row = $itinerary->toArray();
        $row["customer"]=array("id" => $itinerary->getCustomerId(), "name" => $itinerary->getCustomer()->getName());
        $row["date_time"]=$itinerary->getDateTime();
        $row["customer_contact"]=array("id" => $itinerary->getCustomerContactId(), "name" => $itinerary->getCustomerContact()->getFirstName()." ".$itinerary->getCustomerContact()->getLastName(), "mobile" => $itinerary->getCustomerContact()->getMobile(), "phone" => $itinerary->getCustomerContact()->getPhone(), "email" => $itinerary->getCustomerContact()->getEmail());
        $row["itinerary_type"]=array("id" => $itinerary->getItineraryTypeId(), "name" => $itinerary->getItineraryType()->getName());
        $row["status"]=array("id" => $itinerary->getStatusId(), "name" => $itinerary->getStatus()->getName());
        $row["city"]=array("id" => $itinerary->getCityId(), "name" => $itinerary->getCity()->getName());
        $row["province"] = array("id" => $itinerary->getCity()->getProvince()->getId(), "name" => $itinerary->getCity()->getProvince()->getName());
        $row["country"] = array("id" => $itinerary->getCity()->getProvince()->getCountry()->getId(), "name" => $itinerary->getCity()->getProvince()->getCountry()->getName()); 
 
        $response = array( 
            'title' => "Excelente", 
            'message' => "Solicitud procesada", 
            'domain' => $row, 
            'error' => null 
        ); 
        return json_encode($response); 
    }
    /**
     * Elimina un Itinerary dado un ID
     *
     */
    public function deleteAction($id)
    {       
        $response = new Response();
        $filter = new Filter(); 
        $model = new Itinerary();
        $itinerary = $model->findFirstById($filter->sanitize($id, "string"));

        if (!$itinerary) {
            $response->setStatusCode(400,"Not found");
            return $response->setContent(json_encode("Itinerary Not Found",false));
        }

        if (!$itinerary->delete()) {
            $response->setStatusCode(400,"Bad Request");
            $totalMessage = [];
            foreach ($itinerary->getMessages() as $message) {
                array_push($totalMessage, $message);
            }
            return $response->setContent(json_encode($totalMessage, false));
        }

        $response->setStatusCode(200,"OK");
        return $response->setContent(json_encode("OK Delete", false));
    }
}