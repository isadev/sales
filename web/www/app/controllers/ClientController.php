<?php

use Phalcon\Mvc\View; 
use App\Models\Client;
use App\Library\ExceptionsEnums as ExcEnums;
use Phalcon\Filter;
use Phalcon\Http\Response as Response;

class ClientController extends ControllerBase
{
    public function listAction()
    {
        $view = new View();
        $excm = new ExcEnums;
        $client = new Client();
        $clients = $client->find();
        $results = [];
        foreach ($clients as $key => $value) {
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
    public function impersonateAction() {
        $request = $this->request;
        $excm = new ExcEnums;
        $filter = new Filter();

         $data = $request->getJsonRawBody();
         $this->setJsonResponse();
         $domain = [];
         $exec = empty($data->clientId) ? $excm->getExcMsg(excEnums::EXC_FIELD_001) : $excm->getExcMsg(excEnums::EXC_RQ_001);
         if ($request->isAjax() && $request->isPost() && !empty($data->clientId)) {
             if($this->auth->getUser() && $this->auth->getUser()->getRoleId()==1){
                 $clientId = $filter->sanitize($data->clientId, "string");
                 $result = $this->auth->impersonateClient($clientId);
                 if($result){
                     $domain = $this->auth->getUser();
                     $response = array(
                         'title' => "Excelente",
                         'message' => "Operación realizada",
                         'domain' => $domain,
                         'error' => null
                         );
                     return json_encode($response);
                 }
             }else{
                 $exec = $excm->getExcMsg(excEnums::EXC_RQ_003);
             }
         }
        $response = array(
            'title' => "Lo siento",
            'message' => "Ha ocurrido un error",
            'domain' => $domain,
            'error' => array(
                'message' => $exec[1],
                'execCode' => $exec[0]
                )
            );
        return json_encode($response);
    }
    /**
     * Funcion encargada de devolver los datos de un Client dado su guId
     *
     * @return Response
     */
    public function searchByIdAction($clientId)
    {

        $client = new Client();
        $client = $client->findById($clientId);

        $response = new Response();
        $this->view->disable();

        if (count($client) > 0) {
            $response->setStatusCode(200, "OK");
            $response->setContent(json_encode($client[0]));
            return $response;
        }   
        $response->setStatusCode(404, "Bad Request");
        $response->setContent(json_encode("Param not found"));
        return $response;
    }
    /**
     * Crear un Client
     *
     */
    public function createAction()
    {
        $response = new Response();

            // create the user
            $client = new Client();
            $filter = new Filter();

            $data = $this->request->getJsonRawBody();
            $model = $client->findFirstByEmail($filter->sanitize($data->email, "email"));
            if ($model) {
                $response->setStatusCode(400,"Found");
                return $response->setContent(json_encode("Client Exist",false));
            }

            $client->setName($filter->sanitize($data->name, "string"));
            $client->setContactFirstName($filter->sanitize($data->contact_first_name, "string"));
            $client->setContactLastName($filter->sanitize($data->contact_last_name, "string"));
            $client->setPhone($filter->sanitize($data->phone, "string"));
            $client->setAddress($filter->sanitize($data->address, "string"));
            $client->setPostelCode($filter->sanitize($data->postel_code, "int"));
            $client->setEmail($filter->sanitize($data->email, "email"));
            $client->setBpulseUrl($filter->sanitize($data->bpulse_url, "string"));
            $client->setEnable($filter->sanitize($data->enable, "int"));
            $client->setCityId($filter->sanitize($data->city_id, "int"));
        

        if (!$client->save()) {
            $response->setStatusCode(400,"Bad Request");
            $totalMessage = [];
            foreach ($client->getMessages() as $message) {
                array_push($totalMessage, $message->getMessage());
            }
            return $response->setContent(json_encode($totalMessage, false));
        }
        $row = $client->toArray();
        $row["city"]=array("id" => $client->getCityId(), "name" => $client->getCity()->getName());
        $row["province"] = array("id" => $client->getCity()->getProvince()->getId(), "name" => $client->getCity()->getProvince()->getName());
        $row["country"] = array("id" => $client->getCity()->getProvince()->getCountry()->getId(), "name" => $client->getCity()->getProvince()->getCountry()->getName());

        $response = array(
            'title' => "Excelente",
            'message' => "Solicitud procesada",
            'domain' => $row,
            'error' => null
        );
        return json_encode($response);
    }
    /**
     * Actualizar los datos existentes de un Client a partir de su ID
     *
     */
    public function updateAction()
    {
        $response = new Response();
        $model = new Client();
        $filter = new Filter();
        $data = $this->request->getJsonRawBody();
        $client = $model->findFirstById($filter->sanitize($data->id, "string"));
        if (!$client) {
            $response->setStatusCode(403,"Bad Request");
            return $response->setContent(json_encode("Client Not Found",false));
        }

        $client->setName($filter->sanitize($data->name, "string"));
        $client->setContactFirstName($filter->sanitize($data->contact_first_name, "string"));
        $client->setContactLastName($filter->sanitize($data->contact_last_name, "string"));
        $client->setPhone($filter->sanitize($data->phone, "string"));
        $client->setAddress($filter->sanitize($data->address, "string"));
        $client->setPostelCode($filter->sanitize($data->postel_code, "int"));
        $client->setEmail($filter->sanitize($data->email, "email"));
        $client->setBpulseUrl($filter->sanitize($data->bpulse_url, "string"));
        $client->setEnable($filter->sanitize($data->enable, "int"));
        $client->setCityId($filter->sanitize($data->city_id, "int"));

        if (!$client->save()) {
            $response->setStatusCode(400,"Bad Request");
            $totalMessage = [];
            foreach ($client->getMessages() as $message) {
                array_push($totalMessage, $message->getMessage());
            }
            return $response->setContent(json_encode($totalMessage, false));
        }
            $row = $client->toArray();
            $row["city"]=array("id" => $client->getCityId(), "name" => $client->getCity()->getName());
            $row["province"] = array("id" => $client->getCity()->getProvince()->getId(), "name" => $client->getCity()->getProvince()->getName());
            $row["country"] = array("id" => $client->getCity()->getProvince()->getCountry()->getId(), "name" => $client->getCity()->getProvince()->getCountry()->getName());

        $response = array(
            'title' => "Excelente",
            'message' => "Solicitud procesada",
            'domain' => $row,
            'error' => null
        );
        return json_encode($response);

    }
    /**
     * Elimina un Client dado un ID
     *
     */
    public function deleteAction($id)
    {
        $response = new Response();
        $model = new Client();
        $filter = new Filter();
        $client = $model->findFirstById($filter->sanitize($id, "string"));

        if (!$client) {
            $response->setStatusCode(400,"Bad Request");
            return $response->setContent(json_encode("Client Not Found",false));
        }

        if (!$client->delete()) {
            $response->setStatusCode(403,"Bad Request");
            $totalMessage = [];
            foreach ($client->getMessages() as $message) {
                array_push($totalMessage, $message);
            }
            return $response->setContent(json_encode($totalMessage, false));
        }

        $response->setStatusCode(200,"OK");
        return $response->setContent(json_encode("OK delete", false));
    }
}