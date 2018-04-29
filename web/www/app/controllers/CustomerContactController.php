<?php

use App\Models\CustomerContact;
use Phalcon\Mvc\View;
use App\Library\ExceptionsEnums as ExcEnums;
use Phalcon\Http\Response as Response;
use Phalcon\Filter;

class CustomerContactController extends ControllerBase
{
    public function listAction()
    {
        $view = new View();
        $excm = new ExcEnums;
        $customerContact = new CustomerContact();
        $filter = new Filter();
        $query = $filter->sanitize($this->request->getQuery("query"), "string");
        $term = $filter->sanitize($this->request->getQuery("term"), "string");

        $customerContacts = [];
        if($filter->sanitize($this->request->getQuery("dateLastSync"), "int")){
            $dateTimestamp = $filter->sanitize($this->request->getQuery("dateLastSync"), "int");
            $dateLastSync = date('Y-m-d H:i:s', $dateTimestamp);
        }else{
            $dateLastSync = null;
        }
        if($this->request->getQuery("term")!==null){
            $customerContacts = $customerContact->query()    
                ->where('first_name LIKE :name:')
                ->orWhere('last_name LIKE :name:')
                ->andWhere("date_updated >= :last_sync:")
                ->andWhere('customer_id = :query:')
                ->bind(array('name' => '%' . $term .'%', 'query' => $query, "last_sync" => $dateLastSync ? $dateLastSync : '%'))
                ->execute();
        }else if($this->request->getQuery("term")===null && $this->request->getQuery("query")!==null){
            $customerContacts = $customerContact->query()    
                ->andWhere('customer_id = :query:')
                ->andWhere("date_updated >= :last_sync:")
                ->bind(array('query' => $query, "last_sync" => $dateLastSync ? $dateLastSync : '%'))
                ->execute();
        }else{
            $customerContacts = $customerContact->query()    
                ->andWhere("date_updated >= :last_sync:")
                ->bind(array("last_sync" => $dateLastSync ? $dateLastSync : '%'))
                ->execute();
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
                'domain' => $customerContacts,
                'error' => null
        );
        return json_encode($response);
    }
    /**
     * Funcion encargada de devolver los datos de un CustomerContact dado su guId
     *
     * @return Response
     */
    public function searchByIdAction($customerContactId)
    {

        $customerContact = new CustomerContact();
        $customerContact = $customerContact->findById($customerContactId);

        $response = new Response();
        $this->view->disable();

        if (count($customerContact) > 0) {
            $response->setStatusCode(200, "OK");
            $response->setContent(json_encode($customerContact[0]));
            return $response;
        }   
        $response->setStatusCode(404, "Bad Request");
        $response->setContent(json_encode("Param not found"));
        return $response;
    }
    /**
     * Crear una CustomerContact
     *
     */
    public function createAction()
    {
        $response = new Response();
        $filter = new Filter(); 
        $request = $this->request->getJsonRawBody();

        $customerContact = new CustomerContact();
        $model = $customerContact->findFirstByEmail($filter->sanitize($request->email, "email")); 
        if ($model) { 
            $response->setStatusCode(400,"Found"); 
            return $response->setContent(json_encode("Customer Contact Exist",false)); 
        } 
        // create the customerContact
        $customerContact->setFirstName($filter->sanitize($request->first_name, "string"));
        $customerContact->setLastName($filter->sanitize($request->last_name, "string"));
        $customerContact->setEmail($filter->sanitize($request->email, "email"));
        $customerContact->setPhone($filter->sanitize($request->phone, "string"));
        $customerContact->setMobile($filter->sanitize($request->mobile, "string"));
        $customerContact->setJobTitle($filter->sanitize($request->job_title, "string"));
        $customerContact->setCustomerId($filter->sanitize($request->customer_id, "string"));
        
        if (!$customerContact->save()) {
            $response->setStatusCode(400,"Bad Request");
            $totalMessage = [];
            foreach ($customerContact->getMessages() as $message) {
                array_push($totalMessage, $message->getMessage());
            }
            return $response->setContent(json_encode($totalMessage, false));
        }
        $row = $customerContact->toArray(); 
 
        $response = array( 
            'title' => "Excelente", 
            'message' => "Solicitud procesada", 
            'domain' => $row, 
            'error' => null 
        ); 
        return json_encode($response); 
    }
    /**
     * Actualizar los datos existentes de un CustomerContact a partir de su ID
     *
     */
    public function updateAction()
    {
        $response = new Response();
        $request = $this->request->getJsonRawBody();
        $filter = new Filter(); 
        $model = new CustomerContact();
        $customerContact = $model->findFirstById($filter->sanitize($request->id, "string")); 
        if (!$customerContact) {
            $response->setStatusCode(400,"Bad Request");
            return $response->setContent(json_encode("CustomerContact Not Found",false));
        }        

        $customerContact->setFirstName($filter->sanitize($request->first_name, "string"));
        $customerContact->setLastName($filter->sanitize($request->last_name, "string"));
        $customerContact->setEmail($filter->sanitize($request->email, "email"));
        $customerContact->setPhone($filter->sanitize($request->phone, "string"));
        $customerContact->setMobile($filter->sanitize($request->mobile, "string"));
        $customerContact->setJobTitle($filter->sanitize($request->job_title, "string"));
        $customerContact->setCustomerId($filter->sanitize($request->customer_id, "string"));

        if (!$customerContact->save()) {
            $response->setStatusCode(400,"Bad Request");
            $totalMessage = [];
            foreach ($customerContact->getMessages() as $message) {
                array_push($totalMessage, $message->getMessage());
            }
            return $response->setContent(json_encode($totalMessage, false));
        }
        $row = $customerContact->toArray(); 
 
        $response = array( 
            'title' => "Excelente", 
            'message' => "Solicitud procesada", 
            'domain' => $row, 
            'error' => null 
        ); 
        return json_encode($response); 
    }
    /**
     * Elimina un CustomerContact dado un ID
     *
     */
    public function deleteAction($id)
    {        
        $response = new Response();
        $filter = new Filter(); 
        $request = $this->request->getJsonRawBody();
        $model = new CustomerContact();
        $customerContact = $model->findFirstById($filter->sanitize($id, "string"));

        if (!$customerContact) {
            $response->setStatusCode(400,"Bad Request");
            return $response->setContent(json_encode("CustomerContact Not Found",false));
        }

        if (!$customerContact->delete()) {
            $response->setStatusCode(400,"Bad Request");
            $totalMessage = [];
            foreach ($customerContact->getMessages() as $message) {
                array_push($totalMessage, $message);
            }
            return $response->setContent(json_encode($totalMessage, false));
        }

        $response->setStatusCode(200,"OK");
        return $response->setContent(json_encode("OK Delete", false));
    }
}