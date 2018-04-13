<?php

use App\Models\Price;
use Phalcon\Mvc\View; 
use App\Library\ExceptionsEnums as ExcEnums;
use Phalcon\Filter;
use Phalcon\Http\Response as Response;

class PriceController extends ControllerBase
{
    public function listAction()
    {
        $view = new View();
        $excm = new ExcEnums;
        $filter = new Filter(); 
        $price = new Price();
        $results = [];
        if($filter->sanitize($this->request->getQuery("dateLastSync"), "int")){
            $dateTimestamp = $filter->sanitize($this->request->getQuery("dateLastSync"), "int");
            $dateLastSync = date('Y-m-d H:i:s', $dateTimestamp);
        }else{
            $dateLastSync = null;
        }
        $prices = $price->query()    
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
                'domain' => $prices,
                'error' => null
        );
        return json_encode($response);
    }
    /**
     * Funcion encargada de devolver los datos de un Price dado su guId
     *
     * @return Response
     */
    public function searchByIdAction($priceId)
    {

        $price = new Price();
        $price = $price->findById($priceId);

        $response = new Response();
        $this->view->disable();

        if (count($price) > 0) {
            $response->setStatusCode(200, "OK");
            $response->setContent(json_encode($price[0]));
            return $response;
        }   
        $response->setStatusCode(404, "Bad Request");
        $response->setContent(json_encode("Param not found"));
        return $response;
    }
    /**
     * Crear una Price
     *
     */
    public function createAction()
    {
        $response = new Response();
        $filter = new Filter(); 
        $request = $this->request->getJsonRawBody();
        $price = new Price();

        $model = $price->findFirstByProductId($filter->sanitize($request->product_id, "string"));

        if ($model) { 
            $response->setStatusCode(400,"Found"); 
            return $response->setContent(json_encode("Price Exist",false)); 
        } 
        // create the Price
        $price->setValue($filter->sanitize($request->value, "float"));
        $price->setStartDate($filter->sanitize($request->start_date, "string"));
        $price->setEndDate($filter->sanitize($request->end_date, "string"));
        $price->setProductId($filter->sanitize($request->product_id, "string"));
        
        if (!$price->save()) {
            $response->setStatusCode(400,"Bad Request");
            $totalMessage = [];
            foreach ($price->getMessages() as $message) {
                array_push($totalMessage, $message->getMessage());
            }
            return $response->setContent(json_encode($totalMessage, false));
        }
        $row = $price->toArray();
        $response = array( 
            'title' => "Excelente", 
            'message' => "Solicitud procesada", 
            'domain' => $row, 
            'error' => null 
        ); 
        return json_encode($response); 
    }
    /**
     * Actualizar los datos existentes de un Price a partir de su ID
     *
     */
    public function updateAction()
    {

        $response = new Response();
        $filter = new Filter(); 
        $request = $this->request->getJsonRawBody();
        $model = new Price();
        $price = $model->findFirstById($filter->sanitize($request->id, "string")); 

        if(!$price) {
            $response->setStatusCode(400,"Not found");
            return $response->setContent(json_encode("Price Not Found",false));
        }      

        $price->setValue($filter->sanitize($request->value, "float"));
        $price->setStartDate($filter->sanitize($request->start_date, "string"));
        $price->setEndDate($filter->sanitize($request->end_date, "string"));
        $price->setProductId($filter->sanitize($request->product_id, "string"));

        if (!$price->save()) {
            $response->setStatusCode(400,"Bad Request");
            $totalMessage = [];
            foreach ($price->getMessages() as $message) {
                array_push($totalMessage, $message->getMessage());
            }
            return $response->setContent(json_encode($totalMessage, false));
        }
        $row = $price->toArray();
        $response = array( 
            'title' => "Excelente", 
            'message' => "Solicitud procesada", 
            'domain' => $row, 
            'error' => null 
        ); 
        return json_encode($response); 
    }
    /**
     * Elimina un Price dado un ID
     *
     */
    public function deleteAction($id)
    {
        $response = new Response();
        $request = $this->request->getJsonRawBody();
        $filter = new Filter(); 
        $model = new Price();
        $price = $model->findFirstById($filter->sanitize($id, "string"));

        if (!$price) {
            $response->setStatusCode(400,"Not found");
            return $response->setContent(json_encode("Price Not Found",false));
        }

        if (!$price->delete()) {
            $response->setStatusCode(400,"Bad Request");
            $totalMessage = [];
            foreach ($price->getMessages() as $message) {
                array_push($totalMessage, $message);
            }
            return $response->setContent(json_encode($totalMessage, false));
        }

        $response->setStatusCode(200,"OK");
        return $response->setContent(json_encode("OK Delete", false));
    }
}