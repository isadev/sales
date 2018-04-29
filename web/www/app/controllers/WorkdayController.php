<?php

use App\Models\WorkDay;
use Phalcon\Mvc\View; 
use App\Library\ExceptionsEnums as ExcEnums;
use Phalcon\Filter;
use Phalcon\Http\Response as Response;

class WorkdayController extends ControllerBase
{
    public function listAction()
    {
        $view = new View();
        $excm = new ExcEnums;
        $filter = new Filter(); 
        $workday = new WorkDay();
        $results = [];
        if($filter->sanitize($this->request->getQuery("dateLastSync"), "int")){
            $dateTimestamp = $filter->sanitize($this->request->getQuery("dateLastSync"), "int");
            $dateLastSync = date('Y-m-d H:i:s', $dateTimestamp);
        }else{
            $dateLastSync = null;
        }
        $workdays = $workday->query()    
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
                'domain' => $workdays,
                'error' => null
        );
        return json_encode($response);
    }
    /**
     * Funcion encargada de devolver los datos de un WorkDay dado su guId
     *
     * @return Response
     */
    public function searchByIdAction($workDayId)
    {

        $workDay = new WorkDay();
        $workDay = $workDay->findById($workDayId);

        $response = new Response();
        $this->view->disable();

        if (count($workDay) > 0) {
            $response->setStatusCode(200, "OK");
            $response->setContent(json_encode($workDay[0]));
            return $response;
        }   
        $response->setStatusCode(404, "Bad Request");
        $response->setContent(json_encode("Param not found"));
        return $response;
    }
    /**
     * Crear una WorkDay
     *
     */
    public function createAction()
    {
        $response = new Response();
        $filter = new Filter(); 
        $request = $this->request->getJsonRawBody();

            // create the workDay
            $workDay = new WorkDay();
            $workDay->setId($filter->sanitize($request->id, 'string'));
            $workDay->setItemType($filter->sanitize($request->item_type, 'string'));
            $workDay->setStartDate($filter->sanitize($request->start_date,'string'));
            $workDay->setEndDate($filter->sanitize($request->end_date, 'string'));
            $workDay->setUserId($filter->sanitize($request->user_id, 'string'));
        

        if (!$workDay->save()) {
            $response->setStatusCode(403,"Bad Request");
            $totalMessage = [];
            foreach ($workDay->getMessages() as $message) {
                array_push($totalMessage, $message->getMessage());
            }
            return $response->setContent(json_encode($totalMessage, false));
        }
        $response->setStatusCode(201,"OK");
        return $response->setContent(json_encode("OK", false));
    }
    /**
     * Actualizar los datos existentes de un WorkDay a partir de su ID
     *
     */
    public function updateAction()
    {
        $response = new Response();
        $filter = new Filter(); 
        $request = $this->request->getJsonRawBody();

        $workDay = new WorkDay();
        $workDay->findFirstByid($filter->sanitize($request->id));
        if (!$workDay) {
            $response->setStatusCode(404,"Bad Request");
            return $response->setContent(json_encode("WorkDay Not Found",false));
        }        

        $workDay->setItemType($filter->sanitize($request->item_type, 'string'));
        $workDay->setStartDate($filter->sanitize($request->start_date,'string'));
        $workDay->setEndDate($filter->sanitize($request->end_date, 'string'));
        $workDay->setUserId($filter->sanitize($request->user_id, 'string'));

        if (!$workDay->save()) {
            $response->setStatusCode(403,"Bad Request");
            $totalMessage = [];
            foreach ($workDay->getMessages() as $message) {
                array_push($totalMessage, $message->getMessage());
            }
            return $response->setContent(json_encode($totalMessage, false));
        }
        $response->setStatusCode(201,"OK");
        return $response->setContent(json_encode("OK", false));
    }
    /**
     * Elimina un WorkDay dado un ID
     *
     */
    public function deleteAction()
    {
        $response = new Response();
        $request = $this->request->getJsonRawBody();
        $workDay = new WorkDay();
        $workDay->findByid($request['id']);

        if (!$workDay) {
            $response->setStatusCode(404,"Bad Request");
            return $response->setContent(json_encode("WorkDay Not Found",false));
        }

        if (!$workDay->delete()) {
            $response->setStatusCode(403,"Bad Request");
            $totalMessage = [];
            foreach ($workDay->getMessages() as $message) {
                array_push($totalMessage, $message);
            }
            return $response->setContent(json_encode($totalMessage, false));
        }

        $response->setStatusCode(201,"OK");
        return $response->setContent(json_encode("OK", false));
    }
}