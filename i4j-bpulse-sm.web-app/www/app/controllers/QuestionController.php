<?php

use App\Models\Question;
use Phalcon\Mvc\View; 
use App\Library\ExceptionsEnums as ExcEnums;
use Phalcon\Filter;
use Phalcon\Http\Response as Response;

class QuestionController extends ControllerBase
{
    public function listAction()
    {
        $view = new View();
        $excm = new ExcEnums;
        $filter = new Filter(); 
        $question = new Question();
        $results = [];
        if($filter->sanitize($this->request->getQuery("dateLastSync"), "int")){
            $dateTimestamp = $filter->sanitize($this->request->getQuery("dateLastSync"), "int");
            $dateLastSync = date('Y-m-d H:i:s', $dateTimestamp);
        }else{
            $dateLastSync = null;
        }
        $questions = $question->query()    
            ->andWhere("date_updated >= :last_sync:")
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
                'domain' => $questions,
                'error' => null
        );
        return json_encode($response);
    }
    /**
     * Funcion encargada de devolver los datos de un Question dado su guId
     *
     * @return Response
     */
    public function searchByIdAction($questionId)
    {

        $question = new Question();
        $question = $question->findById($questionId);

        $response = new Response();
        $this->view->disable();

        if (count($question) > 0) {
            $response->setStatusCode(200, "OK");
            $response->setContent(json_encode($question[0]));
            return $response;
        }   
        $response->setStatusCode(404, "Bad Request");
        $response->setContent(json_encode("Param not found"));
        return $response;
    }
    /**
     * Crear una Question
     *
     */
    public function createAction()
    {
        $response = new Response();
        $filter = new Filter(); 
        $request = $this->request->getJsonRawBody();

        $question = new Question();
            // create the question
        $question->setLabel($filter->sanitize($request->label, "string"));
        $question->setQuestionTypeId($filter->sanitize($request->question_type_id, "int"));
        $question->setQuestionnaireId($filter->sanitize($request->questionnaire_id, "string"));
        
        if (!$question->save()) {
            $response->setStatusCode(400,"Bad Request");
            $totalMessage = [];
            foreach ($question->getMessages() as $message) {
                array_push($totalMessage, $message->getMessage());
            }
            return $response->setContent(json_encode($totalMessage, false));
        }
        $row = $question->toArray();
        $response = array( 
            'title' => "Excelente", 
            'message' => "Solicitud procesada", 
            'domain' => $row, 
            'error' => null 
        ); 
        return json_encode($response); 
    }
    /**
     * Actualizar los datos existentes de un Question a partir de su ID
     *
     */
    public function updateAction()
    {
        $response = new Response();
        $filter = new Filter(); 
        $request = $this->request->getJsonRawBody();
        $model = new Question();
        $question = $model->findFirstById($filter->sanitize($request->id, "string")); 

        if(!$question) {
            $response->setStatusCode(400,"Not found");
            return $response->setContent(json_encode("Question Not Found",false));
        }

        $question->setLabel($filter->sanitize($request->label, "string"));
        $question->setQuestionTypeId($filter->sanitize($request->question_type_id, "int"));
        $question->setQuestionnaireId($filter->sanitize($request->questionnaire_id, "string"));

        if (!$question->save()) {
            $response->setStatusCode(400,"Bad Request");
            $totalMessage = [];
            foreach ($question->getMessages() as $message) {
                array_push($totalMessage, $message->getMessage());
            }
            return $response->setContent(json_encode($totalMessage, false));
        }
        $row = $question->toArray();
        $response = array( 
            'title' => "Excelente", 
            'message' => "Solicitud procesada", 
            'domain' => $row, 
            'error' => null 
        ); 
        return json_encode($response);
    }
    /**
     * Elimina un Question dado un ID
     *
     */
    public function deleteAction()
    {
        $response = new Response();
        $request = $this->request->getJsonRawBody();
        $filter = new Filter(); 
        $model = new Question();
        $question = $model->findFirstById($filter->sanitize($id, "string"));

        if (!$question) {
            $response->setStatusCode(400,"Bad Request");
            return $response->setContent(json_encode("Question Not Found",false));
        }
        if (!$question->delete()) {
            $response->setStatusCode(400,"Bad Request");
            $totalMessage = [];
            foreach ($question->getMessages() as $message) {
                array_push($totalMessage, $message);
            }
            return $response->setContent(json_encode($totalMessage, false));
        }

        $response->setStatusCode(200,"OK");
        return $response->setContent(json_encode("OK Delete", false));
    }
}