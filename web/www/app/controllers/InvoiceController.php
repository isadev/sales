<?php

use App\Models\Invoice;
use Phalcon\Mvc\View; 
use App\Library\ExceptionsEnums as ExcEnums;
use Phalcon\Http\Response as Response;
use Phalcon\Filter;

class InvoiceController extends ControllerBase
{
    public function listAction()
    {
        $view = new View();
        $excm = new ExcEnums;
        $filter = new Filter();
        $invoice = new Invoice();
        $results = [];
        if($filter->sanitize($this->request->getQuery("dateLastSync"), "int")){
            $dateTimestamp = $filter->sanitize($this->request->getQuery("dateLastSync"), "int");
            $dateLastSync = date('Y-m-d H:i:s', $dateTimestamp);
        }else{
            $dateLastSync = null;
        }
        $invoices = $invoice->query()    
            ->where('client_id LIKE :client:')
            ->andWhere("date_updated >= :last_sync:")
            ->bind(array('client' => $this->auth->getUser()->getClientId(), "last_sync" => $dateLastSync ? $dateLastSync : '%'))
            ->execute();
        foreach ($invoices as $key => $value) {
            $row = $value->toArray();
            $row["order_date_time"]=$value->getOrderDateTime();
            $row["delivery_date_time"]=$value->getDeliveryDateTime();
            $row["customer"]=array("id" => $value->getCustomerId(), "name" => $value->getCustomer()->getName()); 
            $row["payment_method"]=array("id" => $value->getPaymentMethodId(), "name" => $value->getPaymentMethod()->getName()); 
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
    /**
     * Funcion encargada de devolver los datos de un Invoice dado su guId
     *
     * @return Response
     */
    public function searchByIdAction($invoiceId)
    {

        $model = new Invoice();
        $response = new Response();
        $filter = new Filter();
        $this->setJsonResponse();
        $this->view->disable();
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
        $invoice = $model->findById($filter->sanitize($invoiceId, "string"));

        $data = [];
        if (count($invoice) > 0) {
            $row = $invoice[0]->toArray();
            $row["order_date_time"]=$invoice[0]->getOrderDateTime();
            $row["delivery_date_time"]=$invoice[0]->getDeliveryDateTime();
            $row["customer"]=array("id" => $invoice[0]->getCustomerId(), "name" => $invoice[0]->getCustomer()->getName()); 
            $row["payment_method"]=array("id" => $invoice[0]->getPaymentMethodId(), "name" => $invoice[0]->getPaymentMethod()->getName()); 
            $row["city"]=array("id" => $invoice[0]->getCityId(), "name" => $invoice[0]->getCity()->getName());
            $row["province"] = array("id" => $invoice[0]->getCity()->getProvince()->getId(), "name" => $invoice[0]->getCity()->getProvince()->getName());
            $row["country"] = array("id" => $invoice[0]->getCity()->getProvince()->getCountry()->getId(), "name" => $invoice[0]->getCity()->getProvince()->getCountry()->getName());
            $products = [];
            foreach ($invoice[0]->getInvoiceProduct() as $key => $value) {
                # code...
                $products[$key] = $value->toArray();
                $products[$key]['product'] = $value->getProduct()->toArray();
                $products[$key]['product']['product_category'] = $value->getProduct()->getProductCategory();
            }
            $row["invoice_products"] = $products;
            $results[]= $row;
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
     * Crear una Invoice
     *
     */
    public function createAction()
    {
        $response = new Response();
        $filter = new Filter(); 
        $request = $this->request->getJsonRawBody();

        // create the invoice
        $invoice = new Invoice();
        $invoice->setCustomerId($filter->sanitize($request->customer_id, "string"));
        $invoice->setItineraryId($filter->sanitize($request->itinerary_id, "string"));
        $invoice->setCode($filter->sanitize($request->code, "string"));
        $invoice->setDiscount($filter->sanitize($request->discount, "string"));
        $invoice->setOrderDateTime($filter->sanitize($request->order_date_time, "string"));
        $invoice->setDeliveryDateTime($filter->sanitize($request->delivery_date_time, "string"));
        $invoice->setDeliveryAddress($filter->sanitize($request->delivery_address, "string"));
        $invoice->setCityId($filter->sanitize($request->city_id, "int"));
        $invoice->setPaymentMethodId($filter->sanitize($request->payment_method_id, "int"));
        
        if (!$invoice->save()) {
            $response->setStatusCode(400,"Bad Request");
            $totalMessage = [];
            foreach ($invoice->getMessages() as $message) {
                array_push($totalMessage, $message->getMessage());
            }
            return $response->setContent(json_encode($totalMessage, false));
        }
        $row = $invoice->toArray(); 
        $row["order_date_time"]=$invoice->getOrderDateTime();
        $row["delivery_date_time"]=$invoice->getDeliveryDateTime();
        $row["customer"]=array("id" => $invoice->getCustomerId(), "name" => $invoice->getCustomer()->getName()); 
        $row["payment_method"]=array("id" => $invoice->getPaymentMethodId(), "name" => $invoice->getPaymentMethod()->getName()); 
        $row["city"]=array("id" => $invoice->getCityId(), "name" => $invoice->getCity()->getName()); 
        $row["province"] = array("id" => $invoice->getCity()->getProvince()->getId(), "name" => $invoice->getCity()->getProvince()->getName()); 
        $row["country"] = array("id" => $invoice->getCity()->getProvince()->getCountry()->getId(), "name" => $invoice->getCity()->getProvince()->getCountry()->getName()); 
 
        $response = array( 
            'title' => "Excelente", 
            'message' => "Solicitud procesada", 
            'domain' => $row, 
            'error' => null 
        ); 
        return json_encode($response); 
    }
    /**
     * Actualizar los datos existentes de un Invoice a partir de su ID
     *
     */
    public function updateAction()
    {
        $response = new Response();
        $filter = new Filter(); 
        $request = $this->request->getJsonRawBody();
        $model = new Invoice();
        $invoice = $model->findFirstById($filter->sanitize($request->id, "string")); 
        if (!$invoice) {
            $response->setStatusCode(400,"Not found");
            return $response->setContent(json_encode("Invoice Not Found",false));
        }        

        $invoice->setCustomerId($filter->sanitize($request->customer_id, "string"));
        $invoice->setItineraryId($filter->sanitize($request->itinerary_id, "string"));
        $invoice->setCode($filter->sanitize($request->code, "string"));
        $invoice->setDiscount($filter->sanitize($request->discount, "string"));
        $invoice->setOrderDateTime($filter->sanitize($request->order_date_time, "string"));
        $invoice->setDeliveryDateTime($filter->sanitize($request->delivery_date_time, "string"));
        $invoice->setDeliveryAddress($filter->sanitize($request->delivery_address, "string"));
        $invoice->setCityId($filter->sanitize($request->city_id, "int"));
        $invoice->setPaymentMethodId($filter->sanitize($request->payment_method_id, "int"));

        if (!$invoice->save()) {
            $response->setStatusCode(400,"Bad Request");
            $totalMessage = [];
            foreach ($invoice->getMessages() as $message) {
                array_push($totalMessage, $message->getMessage());
            }
            return $response->setContent(json_encode($totalMessage, false));
        }
        $row = $invoice->toArray(); 
        $row["order_date_time"]=$invoice->getOrderDateTime();
        $row["delivery_date_time"]=$invoice->getDeliveryDateTime();
        $row["customer"]=array("id" => $invoice->getCustomerId(), "name" => $invoice->getCustomer()->getName()); 
        $row["payment_method"]=array("id" => $invoice->getPaymentMethodId(), "name" => $invoice->getPaymentMethod()->getName()); 
        $row["city"]=array("id" => $invoice->getCityId(), "name" => $invoice->getCity()->getName()); 
        $row["province"] = array("id" => $invoice->getCity()->getProvince()->getId(), "name" => $invoice->getCity()->getProvince()->getName()); 
        $row["country"] = array("id" => $invoice->getCity()->getProvince()->getCountry()->getId(), "name" => $invoice->getCity()->getProvince()->getCountry()->getName()); 
 
        $response = array( 
            'title' => "Excelente", 
            'message' => "Solicitud procesada", 
            'domain' => $row, 
            'error' => null 
        ); 
        return json_encode($response); 
    }
    /**
     * Elimina un Invoice dado un ID
     *
     */
    public function deleteAction($id)
    {
        $filter = new Filter(); 
        
        $response = new Response();
        $request = $this->request->getJsonRawBody();
        $model = new Invoice(); 
        $invoice = $model->findFirstById($filter->sanitize($id, "string"));

        if (!$invoice) {
            $response->setStatusCode(400,"Not found");
            return $response->setContent(json_encode("Invoice Not Found",false));
        }

        if (!$invoice->delete()) {
            $response->setStatusCode(403,"Bad Request");
            $totalMessage = [];
            foreach ($invoice->getMessages() as $message) {
                array_push($totalMessage, $message);
            }
            return $response->setContent(json_encode($totalMessage, false));
        }

        $response->setStatusCode(200,"OK");
        return $response->setContent(json_encode("OK Delete", false));
    }
}