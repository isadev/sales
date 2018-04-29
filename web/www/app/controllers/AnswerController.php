<?php

use App\Models\Answer;
use Phalcon\Mvc\View; 
use App\Library\ExceptionsEnums as ExcEnums;
use Phalcon\Filter;
use Phalcon\Http\Response as Response;

class AnswerController extends ControllerBase
{
    public function listAction()
    {
        $view = new View();
        $excm = new ExcEnums;
        $filter = new Filter(); 
        $answer = new Answer();
        $results = [];
        if($filter->sanitize($this->request->getQuery("dateLastSync"), "int")){
            $dateTimestamp = $filter->sanitize($this->request->getQuery("dateLastSync"), "int");
            $dateLastSync = date('Y-m-d H:i:s', $dateTimestamp);
        }else{
            $dateLastSync = null;
        }
        $answers = $answer->query()    
            ->where("date_updated >= :last_sync:")
            ->bind(array(
                "last_sync" => $dateLastSync ? $dateLastSync : '%'
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
                'domain' => $answers,
                'error' => null
        );
        return json_encode($response);
    }
    /**
     * Funcion encargada de devolver los datos de un Answer dado su guId
     *
     * @return Response
     */
    public function searchByIdAction($answerId)
    {

        $answer = new Answer();
        $answer = $answer->findById($answerId);

        $response = new Response();
        $this->view->disable();

        if (count($answer) > 0) {
            $response->setStatusCode(200, "OK");
            $response->setContent(json_encode($answer[0]));
            return $response;
        }   
        $response->setStatusCode(404, "Bad Request");
        $response->setContent(json_encode("Param not found"));
        return $response;
    }
    /**
     * Crear una Answer
     *
     */
    public function createAction()
    {
        $response = new Response();
        $filter = new Filter();
        $request = $this->request->getJsonRawBody();

        $answer = new Answer();
        $model = $answer->findFirstById($filter->sanitize($request->id, "string"));
        if ($model) {
            $response->setStatusCode(400,"Found");
            return $response->setContent(json_encode("Awsner Exist",false));
        }        

        $answer->setTextData($filter->sanitize($request->text_data, "string"));
        $answer->setAttachedData($filter->sanitize($request->attached_data, "string"));
        $answer->setQuestionId($filter->sanitize($request->question_id, "string"));
        $answer->setItineraryId($filter->sanitize($request->geolocation, "string"));

        if (!$answer->save()) {
            $response->setStatusCode(400,"Bad Request");
            $totalMessage = [];
            foreach ($answer->getMessages() as $message) {
                array_push($totalMessage, $message->getMessage());
            }
            return $response->setContent(json_encode($totalMessage, false));
        }
        $row = $answer->toArray(); 
 
        $response = array( 
            'title' => "Excelente", 
            'message' => "Solicitud procesada", 
            'domain' => $row, 
            'error' => null 
        ); 
        return json_encode($response); 
    }
    /**
     * Actualizar los datos existentes de un Answer a partir de su ID
     *
     */
    public function updateAction()
    {
        $response = new Response();
        $filter = new Filter();
        $request = $this->request->getJsonRawBody();

        $model = new Answer();
        $answer = $model->findFirstById($filter->sanitize($request["id"], "string"));
        if (!$answer) {
            $response->setStatusCode(400,"Not found");
            return $response->setContent(json_encode("Awsner not found",false));
        }        

        $answer->setTextData($filter->sanitize($request->text_data, "string"));
        $answer->setAttachedData($filter->sanitize($request->attached_data, "string"));
        $answer->setQuestionId($filter->sanitize($request->question_id, "string"));
        $answer->setItineraryId($filter->sanitize($request->geolocation, "string"));

        if (!$answer->save()) {
            $response->setStatusCode(400,"Bad Request");
            $totalMessage = [];
            foreach ($answer->getMessages() as $message) {
                array_push($totalMessage, $message->getMessage());
            }
            return $response->setContent(json_encode($totalMessage, false));
        }
        $row = $answer->toArray(); 
 
        $response = array( 
            'title' => "Excelente", 
            'message' => "Solicitud procesada", 
            'domain' => $row, 
            'error' => null 
        ); 
        return json_encode($response); 
    }
    /**
     * Elimina un Answer dado un ID
     *
     */
    public function deleteAction($id)
    {
        $response = new Response();
        $request = $this->request->getJsonRawBody();
        $model = new Answer();
        $filter = new Filter(); 
        $answer = $model->findFirstById($filter->sanitize($id, "string"));

        if (!$answer) {
            $response->setStatusCode(400,"Bad Request");
            return $response->setContent(json_encode("Answer Not Found",false));
        }

        if (!$answer->delete()) {
            $response->setStatusCode(400,"Bad Request");
            $totalMessage = [];
            foreach ($answer->getMessages() as $message) {
                array_push($totalMessage, $message);
            }
            return $response->setContent(json_encode($totalMessage, false));
        }

        $response->setStatusCode(200,"OK");
        return $response->setContent(json_encode("OK Delete", false));
    }
}