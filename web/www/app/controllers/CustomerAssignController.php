<?php

use Phalcon\Filter;
use Phalcon\Mvc\View; 
use App\Models\Customer;
use App\Models\CustomerAssign;
use Phalcon\Http\Response as Response;
use App\Library\ExceptionsEnums as ExcEnums;

class CustomerAssignController extends ControllerBase
{
    /**
     * Asignar a un Vendedor
     *
     */
    public function assignSellerAction()
    {
        $response = new Response();
        $filter = new Filter(); 
        $request = $this->request->getJsonRawBody();
        $customer = new Customer();
        $customerAssign = new CustomerAssign();
        $conditions = ['customer'=>$filter->sanitize($request->customer_id, "string"), 'user'=>$filter->sanitize($request->user_id, "string")];            
        $model2 = $customerAssign->findFirst([
            'conditions' => 'customer_id=:customer: AND user_id=:user:',
            'bind' => $conditions,
            ]);
            
        if ($model2) { 
            $response->setStatusCode(400,"Assign Exists"); 
            return $response->setContent(json_encode("Assign Exists",false)); 
        } 
        $model = $customer->findFirstById($filter->sanitize($request->customer_id, "string"));
        if (!$model) { 
            $response->setStatusCode(400,"Not Found"); 
            return $response->setContent(json_encode("Customer No Exist",false)); 
        } 

        // create the customer          
        $customerAssign->setCustomerId($filter->sanitize($request->customer_id, "string"));
        $customerAssign->setUserId($filter->sanitize($request->user_id, "string"));
        $customerAssign->setStatus(0);
        if (!$customerAssign->save()) {
            $response->setStatusCode(400,"Bad Request");
            $totalMessage = [];
            foreach ($customerAssign->getMessages() as $message) {
                array_push($totalMessage, $message->getMessage());
            }
            return $response->setContent(json_encode($totalMessage, false));
        }
        $row = $customerAssign->toArray(); 
        $row["customer"]=$customerAssign->getCustomer();
        $results[]= $row;
 
        $response = array( 
            'title' => "Excelente", 
            'message' => "Solicitud procesada", 
            'domain' => $results, 
            'error' => null 
        ); 
        return json_encode($response); 
    }
    /**
     * Aprobar una asignación a un Vendedor
     *
     */
    public function approveAction()
    {
        $response = new Response();
        $filter = new Filter(); 
        $request = $this->request->getJsonRawBody();
        $customerAssign = new CustomerAssign();
        $conditions = ['customer'=>$filter->sanitize($request->customer_id, "string"), 'user'=>$filter->sanitize($request->user_id, "string")];            
        $model2 = $customerAssign->findFirst([
            'conditions' => 'customer_id=:customer: AND user_id=:user:',
            'bind' => $conditions,
            ]);
            
        if (!$model2) { 
            $response->setStatusCode(400,"Assign not Exists"); 
            return $response->setContent(json_encode("Assign not Exists",false)); 
        }

        // create the customer          
        $model2->setStatus(1);
        if (!$model2->save()) {
            $response->setStatusCode(400,"Bad Request");
            $totalMessage = [];
            foreach ($model2->getMessages() as $message) {
                array_push($totalMessage, $message->getMessage());
            }
            return $response->setContent(json_encode($totalMessage, false));
        }
        $row = $model2->toArray(); 
 
        $response = array( 
            'title' => "Excelente", 
            'message' => "Solicitud procesada", 
            'domain' => $row, 
            'error' => null 
        ); 
        return json_encode($response); 
    }
    /**
     * Listar un CustomerAssign dado un ID de Vendedor
     *
     */
    public function listAssignAction($sellerId)
    {
            $view = new View();
            $excm = new ExcEnums;
            $filter = new Filter;
            $customer = new CustomerAssign();
            $results = [];
            $seller = $sellerId !== '' && $sellerId!==-1 ? $filter->sanitize($sellerId, "string") : "%";
    
            $customers = $customer->query()    
                ->where('user_id LIKE :seller:')
                ->bind(array('seller' => $seller))
                ->execute();
            foreach ($customers as $key => $value) {
                $row = $value->toArray();
                $row["customer"]=$value->getCustomer();
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
     * Listar un Customer dado un ID de Vendedor
     *
     */
    public function listAssignCompleteAction()
    {
        $view = new View();
        $excm = new ExcEnums;
        $filter = new Filter;
        $customer = new CustomerAssign();
        $results = [];

        $customers = $customer->findByStatus(0);
        foreach ($customers as $key => $value) {
            $row = $value->toArray();
            $row["customer"]=$value->getCustomer();
            $row["user"]["name"]=$value->getUser()->getFirstName()." ".$value->getUser()->getLastName();
            $row["user"]["id"]=$value->getUserId();
            $row["user"]["email"]=$value->getUser()->getEmail();
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
     * Listar un Customer no asignados dado un ID de Vendedor
     *
     */
    public function listCustomerNoAssignAction()
    {
            $view = new View();
            $excm = new ExcEnums;
            $filter = new Filter;
            $customer = new Customer();
            $results = [];
            $params = $filter->sanitize($this->request->getQuery("query"), "string");
            // Disable several levels
            $view->disableLevel(
                [
                    View::LEVEL_LAYOUT      => true,
                    View::LEVEL_MAIN_LAYOUT => true
                ]
            );
            $this->setJsonResponse();
            if(!$this->auth->getUser() || $params=='') {
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
            $querySQL = $this->modelsManager->createQuery('SELECT * FROM App\Models\Customer AS c WHERE c.client_id = :client: AND c.id NOT IN (SELECT customer_id FROM App\Models\CustomerAssign WHERE user_id = :user:) ORDER BY name ASC');
            $customers  = $querySQL->execute(
                [
                    'client' => $this->auth->getUser()->getClientId(),
                    'user' => $params
                ]
            );           
            foreach ($customers as $key => $value) {
                $row = $value->toArray();
                $results[$key]= $row;
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
     * Elimina un CustomerAssign dado un ID
     *
     */
    public function deleteAssignAction($id)
    {
        $response = new Response();
        $model = new CustomerAssign();
        $filter = new Filter();
        $customerAssign = $model->findFirstById($filter->sanitize($id, "string")); 

        if (!$customerAssign) {
            $response->setStatusCode(400,"Not found");
            return $response->setContent(json_encode("CustomerAssign Not Found",false));
        }
        if (!$customerAssign->delete()) {
            $response->setStatusCode(400,"Bad Request");
            $totalMessage = [];
            foreach ($customerAssign->getMessages() as $message) {
                array_push($totalMessage, $message);
            }
            return $response->setContent(json_encode($totalMessage, false));
        }

        $response->setStatusCode(200,"OK");
        return $response->setContent(json_encode("OK Delete", false));
    }
}