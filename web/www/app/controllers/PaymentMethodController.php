<?php
 
use Phalcon\Mvc\Model\Criteria;
use Phalcon\Mvc\View; 
use Phalcon\Paginator\Adapter\Model as Paginator;
use App\Models\PaymentMethod;
use Phalcon\Http\Response as Response;
use Phalcon\Filter;
use App\Library\ExceptionsEnums as ExcEnums;

class PaymentMethodController extends ControllerBase
{
    public function listAction()
    {
        $view = new View();
        $excm = new ExcEnums;
        $paymentMethod = new PaymentMethod();
        $filter = new Filter();

        if($filter->sanitize($this->request->getQuery("dateLastSync"), "int")){
            $dateTimestamp = $filter->sanitize($this->request->getQuery("dateLastSync"), "int");
            $dateLastSync = date('Y-m-d H:i:s', $dateTimestamp);
        }else{
            $dateLastSync = null;
        }
        $paymentMethods = $paymentMethod->query()    
                ->where('client_id = :client:')
                ->andWhere("date_updated >= :last_sync:")
                ->bind(array(
                    'client' => $this->auth->getUser()->getClientId(),
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
                'domain' => $paymentMethods,
                'error' => null
        );
        return json_encode($response);
    }
    /**
     * Funcion encargada de devolver los datos de un PaymentMethod dado su guId
     *
     * @return Response
     */
    public function searchByIdAction($paymentMethodId)
    {
        $response = new Response();
        $this->view->disable();
        $paymentMethod = new PaymentMethod();
        $paymentMethod = $paymentMethod->findByid($paymentMethodId);

        if (count($paymentMethod) > 0) {
            $response->setStatusCode(200, "OK");
            $response->setContent(json_encode($paymentMethod[0]));
            return $response;
        }
        $response->setStatusCode(404, "Bad Request");
        $response->setContent(json_encode("Param not found"));
        return $response;
    }

    /**
     * Crea un nuevo PaymentMethod a partir de un json
     *
     */
    public function createAction()
    {
        $response = new Response();
        $filter = new Filter(); 
        $request = $this->request->getJsonRawBody();

        $paymentMethod = new PaymentMethod();
        $conditions = ['name'=>$filter->sanitize($request->name, "string"), 'client'=>$filter->sanitize($request->client_id, "string")];            
        $model = $paymentMethod->findFirst([
            'conditions' => 'name=:name: AND client_id=:client:',
            'bind' => $conditions,
        ]);

        if ($model) { 
            $response->setStatusCode(400,"Found"); 
            return $response->setContent(json_encode("PaymentMethod Exist",false)); 
        } 

        $paymentMethod->setName($filter->sanitize($request->name, "string"));
        $paymentMethod->setClientId($filter->sanitize($request->client_id, "string"));

        if (!$paymentMethod->save()) {
            $response->setStatusCode(400,"Bad Request");
            $totalMessage = [];
            foreach ($paymentMethod->getMessages() as $message) {
                array_push($totalMessage, $message->getMessage());
            }
            return $response->setContent(json_encode($totalMessage, false));
        }
        $row = $paymentMethod->toArray();
        $response = array( 
            'title' => "Excelente", 
            'message' => "Solicitud procesada", 
            'domain' => $row, 
            'error' => null 
        ); 
        return json_encode($response); 
    }
    /**
     * Actualizar los datos existentes de un PaymentMethod a partir de su ID
     *
     */
    public function updateAction()
    {
        $response = new Response();
        $filter = new Filter(); 
        $request = $this->request->getJsonRawBody();
        $model = new PaymentMethod();
        $paymentMethod = $model->findFirstById($filter->sanitize($request->id, "string")); 

        if(!$paymentMethod) {
            $response->setStatusCode(400,"Not found");
            return $response->setContent(json_encode("PaymentMethod Not Found",false));
        }
        $paymentMethod->setName($filter->sanitize($request->name, "string"));
        $paymentMethod->setClientId($filter->sanitize($request->client_id, "string"));

        if (!$paymentMethod->save()) {
            $response->setStatusCode(400,"Bad Request");
            $totalMessage = [];
            foreach ($paymentMethod->getMessages() as $message) {
                array_push($totalMessage, $message->getMessage());
            }
            return $response->setContent(json_encode($totalMessage, false));
        }
        $row = $paymentMethod->toArray();
        $response = array( 
            'title' => "Excelente", 
            'message' => "Solicitud procesada", 
            'domain' => $row, 
            'error' => null 
        ); 
        return json_encode($response); 
    }
    /**
     * Elimina un PaymentMethod dado un ID
     *
     */
    public function deleteAction()
    {
        $response = new Response();
        $request = $this->request->getJsonRawBody();
        $filter = new Filter(); 
        $model = new PaymentMethod();
        $paymentMethod = $model->findFirstById($filter->sanitize($id, "string"));

        if (!$paymentMethod) {
            $response->setStatusCode(400,"Bad Request");
            return $response->setContent(json_encode("PaymentMethod Not Found",false));
        }
        if (!$paymentMethod->delete()) {
            $response->setStatusCode(400,"Bad Request");
            $totalMessage = [];
            foreach ($paymentMethod->getMessages() as $message) {
                array_push($totalMessage, $message);
            }
            return $response->setContent(json_encode($totalMessage, false));
        }

        $response->setStatusCode(200,"OK");
        return $response->setContent(json_encode("OK Delete", false));
    }
}
