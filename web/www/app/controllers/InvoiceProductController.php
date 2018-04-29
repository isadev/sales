<?php

use App\Models\InvoiceProduct;
use Phalcon\Mvc\View; 
use App\Library\ExceptionsEnums as ExcEnums;
use Phalcon\Filter;
use Phalcon\Http\Response as Response;

class InvoiceProductController extends ControllerBase
{
    public function listAction()
    {
        $view = new View();
        $excm = new ExcEnums;
        $filter = new Filter(); 
        $invoiceproduct = new InvoiceProduct();
        $results = [];
        if($filter->sanitize($this->request->getQuery("dateLastSync"), "int")){
            $dateTimestamp = $filter->sanitize($this->request->getQuery("dateLastSync"), "int");
            $dateLastSync = date('Y-m-d H:i:s', $dateTimestamp);
        }else{
            $dateLastSync = null;
        }
        $invoiceproducts = $invoiceproduct->query()    
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
                'domain' => $invoiceproducts,
                'error' => null
        );
        return json_encode($response);
    }
    /**
     * Funcion encargada de devolver los datos de un InvoiceProduct dado su guId
     *
     * @return Response
     */
    public function searchByIdAction($invoiceProductId)
    {

        $invoiceProduct = new InvoiceProduct();
        $invoiceProduct = $invoiceProduct->findById($invoiceProductId);

        $response = new Response();
        $this->view->disable();

        if (count($invoiceProduct) > 0) {
            $response->setStatusCode(200, "OK");
            $response->setContent(json_encode($invoiceProduct[0]));
            return $response;
        }   
        $response->setStatusCode(404, "Bad Request");
        $response->setContent(json_encode("Param not found"));
        return $response;
    }
    /**
     * Crear una InvoiceProduct
     *
     */
    public function createAction()
    {
        $response = new Response();
        $filter = new Filter(); 
        $request = $this->request->getJsonRawBody();

        // create the invoiceProduct
        $invoiceProduct = new InvoiceProduct();
        $invoiceProduct->setInvoiceId($filter->sanitize($request->invoice_id, "string"));
        $invoiceProduct->setProductId($filter->sanitize($request->question_type_id, "int"));
        $invoiceProduct->setDiscount($filter->sanitize($request->discount, "int"));
        $invoiceProduct->setOrderPrice($filter->sanitize($request->order_price, "float"));
        $invoiceProduct->setQuantity($filter->sanitize($request->quantity, "float"));
        
        if (!$invoiceProduct->save()) {
            $response->setStatusCode(400,"Bad Request");
            $totalMessage = [];
            foreach ($invoiceProduct->getMessages() as $message) {
                array_push($totalMessage, $message->getMessage());
            }
            return $response->setContent(json_encode($totalMessage, false));
        }
        $row = $invoiceProduct->toArray(); 
 
        $response = array( 
            'title' => "Excelente", 
            'message' => "Solicitud procesada", 
            'domain' => $row, 
            'error' => null 
        ); 
        return json_encode($response); 
    }
    /**
     * Actualizar los datos existentes de un InvoiceProduct a partir de su ID
     *
     */
    public function updateAction()
    {        
        $response = new Response();
        $filter = new Filter(); 

        $request = $this->request->getJsonRawBody();

        $model = new InvoiceProduct();
        $invoiceProduct = $model->findFirstById($filter->sanitize($request->id, "string"));
        if (!$invoiceProduct) {
            $response->setStatusCode(404,"Not found");
            return $response->setContent(json_encode("InvoiceProduct Not Found",false));
        }        

        $invoiceProduct->setInvoiceId($filter->sanitize($request->invoice_id, "string"));
        $invoiceProduct->setProductId($filter->sanitize($request->question_type_id, "int"));
        $invoiceProduct->setDiscount($filter->sanitize($request->discount, "int"));
        $invoiceProduct->setOrderPrice($filter->sanitize($request->order_price, "float"));
        $invoiceProduct->setQuantity($filter->sanitize($request->quantity, "float"));

        if (!$invoiceProduct->save()) {
            $response->setStatusCode(400,"Bad Request");
            $totalMessage = [];
            foreach ($invoiceProduct->getMessages() as $message) {
                array_push($totalMessage, $message->getMessage());
            }
            return $response->setContent(json_encode($totalMessage, false));
        }
        $row = $invoiceProduct->toArray();  
        $response = array( 
            'title' => "Excelente", 
            'message' => "Solicitud procesada", 
            'domain' => $row, 
            'error' => null 
        ); 
        return json_encode($response); 
    }
    /**
     * Elimina un InvoiceProduct dado un ID
     *
     */
    public function deleteAction($id)
    {
        $response = new Response();
        $request = $this->request->getJsonRawBody();
        $filter = new Filter(); 
        $model = new InvoiceProduct();
        $invoiceProduct = $model->findFirstById($filter->sanitize($id, "string"));

        if (!$invoiceProduct) {
            $response->setStatusCode(400,"Not found");
            return $response->setContent(json_encode("InvoiceProduct Not Found",false));
        }

        if (!$invoiceProduct->delete()) {
            $response->setStatusCode(400,"Bad Request");
            $totalMessage = [];
            foreach ($invoiceProduct->getMessages() as $message) {
                array_push($totalMessage, $message);
            }
            return $response->setContent(json_encode($totalMessage, false));
        }

        $response->setStatusCode(200,"OK");
        return $response->setContent(json_encode("OK Delete", false));
    }
}