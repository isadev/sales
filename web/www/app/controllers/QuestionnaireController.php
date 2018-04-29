<?php

use App\Models\Questionnaire;
use Phalcon\Http\Response as Response;
use Phalcon\Mvc\View;
use App\Library\ExceptionsEnums as ExcEnums;
use Phalcon\Filter;

class QuestionnaireController extends ControllerBase
{
    public function listAction()
    {
        $view = new View();
        $excm = new ExcEnums;
        $filter = new Filter(); 
        $questionnaire = new Questionnaire();
        $results = [];
        if($filter->sanitize($this->request->getQuery("dateLastSync"), "int")){
            $dateTimestamp = $filter->sanitize($this->request->getQuery("dateLastSync"), "int");
            $dateLastSync = date('Y-m-d H:i:s', $dateTimestamp);
        }else{
            $dateLastSync = null;
        }
        $questionnaires = $questionnaire->query()    
                ->where('client_id = :client:')
                ->andWhere("date_updated >= :last_sync:")
                ->bind(array(
                    'client' => $this->auth->getUser()->getClientId(),
                    "last_sync" => $dateLastSync ? $dateLastSync : '%'
                ))
                ->execute();
        foreach ($questionnaires as $key => $value) {
            $row = $value->toArray();
            $row["itinerary_type"]=array("id" => $value->getItineraryTypeId(), "name" => $value->getItineraryType()->getName());
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
     * Funcion encargada de devolver los datos de un Questionnaire dado su guId
     *
     * @return Response
     */
    public function searchByIdAction($questionnaireId)
    {

        $questionnaire = new Questionnaire();
        $questionnaire = $questionnaire->findById($questionnaireId);

        $response = new Response();
        $this->view->disable();

        if (count($questionnaire) > 0) {
            $response->setStatusCode(200, "OK");
            $response->setContent(json_encode($questionnaire[0]));
            return $response;
        }   
        $response->setStatusCode(404, "Bad Request");
        $response->setContent(json_encode("Param not found"));
        return $response;
    }
    /**
     * Crear una Questionnaire
     *
     */
    public function createAction()
    {
        $response = new Response();

        $request = $this->request->getJsonRawBody();
        $filter = new Filter();
            // create the Questionnaire
            $questionnaire = new Questionnaire();
            $questionnaire->setLabel($filter->sanitize($request->label, 'string'));
            $questionnaire->setItineraryTypeId($filter->sanitize($request->itinerary_type_id, 'int'));
            $questionnaire->setEnabled($filter->sanitize($request->enabled, 'int'));
        

        if (!$questionnaire->save()) {
            $response->setStatusCode(400,"Bad Request");
            $totalMessage = [];
            foreach ($questionnaire->getMessages() as $message) {
                array_push($totalMessage, $message->getMessage());
            }
            return $response->setContent(json_encode($totalMessage, false));
        }
        $row = $questionnaire->toArray();
        $row["itinerary_type"]=array("id" => $questionnaire->getItineraryTypeId(), "name" => $questionnaire->getItineraryType()->getName());

        $response = array( 
            'title' => "Excelente", 
            'message' => "Solicitud procesada", 
            'domain' => $row, 
            'error' => null 
        ); 
        return json_encode($response); 
    }
    /**
     * Actualizar los datos existentes de un Questionnaire a partir de su ID
     *
     */
    public function updateAction()
    {
        $response = new Response();
        $filter = new Filter(); 
        $request = $this->request->getJsonRawBody();
        $model = new Questionnaire();
        $questionnaire = $model->findFirstById($filter->sanitize($request->id, "string"));
        if (!$questionnaire) {
            $response->setStatusCode(404,"Not found");
            return $response->setContent(json_encode("Questionnaire Not Found",false));
        }

        $questionnaire->setLabel($filter->sanitize($request->label, 'string'));
        $questionnaire->setItineraryTypeId($filter->sanitize($request->itinerary_type_id, 'int'));
        $questionnaire->setEnabled($filter->sanitize($request->enabled, 'int'));


        if (!$questionnaire->save()) {
            $response->setStatusCode(400,"Bad Request");
            $totalMessage = [];
            foreach ($questionnaire->getMessages() as $message) {
                array_push($totalMessage, $message->getMessage());
            }
            return $response->setContent(json_encode($totalMessage, false));
        }

        $row = $questionnaire->toArray();
        $row["itinerary_type"]=array("id" => $questionnaire->getItineraryTypeId(), "name" => $questionnaire->getItineraryType()->getName());

        $response = array( 
            'title' => "Excelente", 
            'message' => "Solicitud procesada", 
            'domain' => $row, 
            'error' => null 
        ); 
        return json_encode($response); 
    }
    /**
     * Elimina un Questionnaire dado un ID
     *
     */
    public function deleteAction($id)
    {
        $response = new Response();
        $filter = new Filter(); 
        $model = new Questionnaire();
        $questionnaire = $model->findFirstById($filter->sanitize($id, "string"));

        if (!$questionnaire) {
            $response->setStatusCode(400,"Not found");
            return $response->setContent(json_encode("Questionnaire Not Found",false));
        }

        if (!$questionnaire->delete()) {
            $response->setStatusCode(400,"Bad Request");
            $totalMessage = [];
            foreach ($questionnaire->getMessages() as $message) {
                array_push($totalMessage, $message);
            }
            return $response->setContent(json_encode($totalMessage, false));
        }

        $response->setStatusCode(200,"OK");
        return $response->setContent(json_encode("OK Delete", false));
    }
}