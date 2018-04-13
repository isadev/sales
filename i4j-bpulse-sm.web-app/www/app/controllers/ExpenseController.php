<?php

use App\Models\Expense;
use Phalcon\Mvc\View; 
use App\Library\ExceptionsEnums as ExcEnums;
use Phalcon\Filter;
use Phalcon\Http\Response as Response;

class ExpenseController extends ControllerBase
{
    public function listAction()
    {
        $view = new View();
        $excm = new ExcEnums;
        $filter = new Filter(); 
        $expense = new Expense();
        $results = [];
        if($filter->sanitize($this->request->getQuery("dateLastSync"), "int")){
            $dateTimestamp = $filter->sanitize($this->request->getQuery("dateLastSync"), "int");
            $dateLastSync = date('Y-m-d H:i:s', $dateTimestamp);
        }else{
            $dateLastSync = null;
        }
        $expenses = $expense->query()    
            ->where('user_id LIKE :user:')
            ->andWhere("date_updated >= :last_sync:")
            ->bind(array(
                "last_sync" => $dateLastSync ? $dateLastSync : '%',
                'user' => $this->auth->getUser()->getId()
            ))
            ->execute();
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
                'domain' => $expenses,
                'error' => null
        );
        return json_encode($response);
    }
    /**
     * Funcion encargada de devolver los datos de un Expense dado su guId
     *
     * @return Response
     */
    public function searchByIdAction($expenseId)
    {

        $expense = new Expense();
        $expense = $expense->findById($expenseId);

        $response = new Response();
        $this->view->disable();

        if (count($expense) > 0) {
            $response->setStatusCode(200, "OK");
            $response->setContent(json_encode($expense[0]));
            return $response;
        }   
        $response->setStatusCode(404, "Bad Request");
        $response->setContent(json_encode("Param not found"));
        return $response;
    }
    /**
     * Crear una Expense
     *
     */
    public function createAction()
    {
       var_dump($this->request->getUploadedFiles());
       die();
        
        $response = new Response();
        $filter = new Filter(); 
        $request = $this->request->getJsonRawBody();
        $expense = new Expense();

        // create the expense
        $expense->setItem($filter->sanitize($request->item, "string"));
        $expense->setDescription($filter->sanitize($request->description, "string"));
        $expense->setValue($filter->sanitize($request->value, "string"));
        $expense->setAtteched($filter->sanitize($request->atteched, "string"));
        $expense->setUserCreated($filter->sanitize($request->user_created, "string"));
        $expense->setDateCreated($filter->sanitize($request->date_created, "string"));
        $expense->setDateUpdated($filter->sanitize($request->date_updated, "string"));
        $expense->setUserUpdated($filter->sanitize($request->user_updated, "string"));
        $expense->setUserId($filter->sanitize($request->user_id, "string"));
        $expense->setItineraryId($filter->sanitize($request->itinerary_id, "string"));
        $expense->setSyncStatusId($filter->sanitize($request->sync_status_id, "string"));
        
        if (!$expense->save()) {
            $response->setStatusCode(400,"Bad Request");
            $totalMessage = [];
            foreach ($expense->getMessages() as $message) {
                array_push($totalMessage, $message->getMessage());
            }
            return $response->setContent(json_encode($totalMessage, false));
        }
        $row = $expense->toArray(); 
 
        $response = array( 
            'title' => "Excelente", 
            'message' => "Solicitud procesada", 
            'domain' => $row, 
            'error' => null 
        ); 
        return json_encode($response); 
    }
    /**
     * Actualizar los datos existentes de un Expense a partir de su ID
     *
     */
    public function updateAction()
    {
        $response = new Response();
        $filter = new Filter(); 
        $request = $this->request->getJsonRawBody();
        $model = new Expense();
        $expense = $model->findFirstById($filter->sanitize($request->id, "string")); 

        if(!$expense) {
            $response->setStatusCode(400,"Not found");
            return $response->setContent(json_encode("Expense Not Found",false));
        }        

        $expense->setItem($filter->sanitize($request->item, "string"));
        $expense->setDescription($filter->sanitize($request->description, "string"));
        $expense->setValue($filter->sanitize($request->value, "string"));
        $expense->setAtteched($filter->sanitize($request->atteched, "string"));
        $expense->setUserCreated($filter->sanitize($request->user_created, "string"));
        $expense->setDateCreated($filter->sanitize($request->date_created, "string"));
        $expense->setDateUpdated($filter->sanitize($request->date_updated, "string"));
        $expense->setUserUpdated($filter->sanitize($request->user_updated, "string"));
        $expense->setUserId($filter->sanitize($request->user_id, "string"));
        $expense->setItineraryId($filter->sanitize($request->itinerary_id, "string"));
        $expense->setSyncStatusId($filter->sanitize($request->sync_status_id, "string"));

        if (!$expense->save()) {
            $response->setStatusCode(400,"Bad Request");
            $totalMessage = [];
            foreach ($expense->getMessages() as $message) {
                array_push($totalMessage, $message->getMessage());
            }
            return $response->setContent(json_encode($totalMessage, false));
        }
        $row = $expense->toArray(); 

        $response = array( 
            'title' => "Excelente", 
            'message' => "Solicitud procesada", 
            'domain' => $row, 
            'error' => null 
        ); 
        return json_encode($response); 
    }
    /**
     * Elimina un Expense dado un ID
     *
     */
    public function deleteAction($id)
    {
        $response = new Response();
        $request = $this->request->getJsonRawBody();
        $model = new Expense();
        $filter = new Filter(); 
        $expense = $model->findFirstById($filter->sanitize($id, "string")); 

        if (!$expense) {
            $response->setStatusCode(400,"Not found");
            return $response->setContent(json_encode("Expense Not Found",false));
        }

        if (!$expense->delete()) {
            $response->setStatusCode(400,"Bad Request");
            $totalMessage = [];
            foreach ($expense->getMessages() as $message) {
                array_push($totalMessage, $message);
            }
            return $response->setContent(json_encode($totalMessage, false));
        }

        $response->setStatusCode(200,"OK");
        return $response->setContent(json_encode("OK Delete", false));
    }
}