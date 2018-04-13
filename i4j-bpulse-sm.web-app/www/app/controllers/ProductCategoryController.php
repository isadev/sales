<?php
 
use Phalcon\Mvc\Model\Criteria;
use Phalcon\Paginator\Adapter\Model as Paginator;
use App\Models\ProductCategory;
use Phalcon\Mvc\View; 
use App\Library\ExceptionsEnums as ExcEnums;
use Phalcon\Http\Response as Response;
use Phalcon\Filter;

class ProductCategoryController extends ControllerBase
{
    public function listAction()
    {
        $view = new View();
        $excm = new ExcEnums;
        $productCategory = new ProductCategory();
        $filter = new Filter();
        $results = [];
        if($filter->sanitize($this->request->getQuery("dateLastSync"), "int")){
            $dateTimestamp = $filter->sanitize($this->request->getQuery("dateLastSync"), "int");
            $dateLastSync = date('Y-m-d H:i:s', $dateTimestamp);
        }else{
            $dateLastSync = null;
        }
        $categories = $productCategory->query()    
            ->where("client_id = :client:")
            ->andWhere("date_updated >= :last_sync:")
            ->bind(array(
                "last_sync" => $dateLastSync ? $dateLastSync : '%',
                "client" => $this->auth->getUser()->getClientId()
            ))
            ->execute();
        foreach ($categories as $key => $value) {
            $row = $value->toArray();
            $row["client"]=array("id" => $value->getClientId(), "name" => $value->getClient()->getName());
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
     * Funcion encargada de devolver los datos de un ProductCategory dado su guId
     *
     * @return Response
     */
    public function searchByIdAction($productCategoryId)
    {
        $response = new Response();
        $this->view->disable();
        $productCategory = new ProductCategory();
        $productCategory = $productCategory->findByid($productCategoryId);

        if (count($productCategory) > 0) {
            $response->setStatusCode(200, "OK");
            $response->setContent(json_encode($productCategory[0]));
            return $response;
        }
        $response->setStatusCode(404, "Bad Request");
        $response->setContent(json_encode("Param not found"));
        return $response;
    }

    /**
     * Crea un nuevo ProductCategory a partir de un json
     *
     */
    public function createAction()
    {

        $productCategoryNew = new ProductCategory();


        $response = new Response();
        $filter = new Filter(); 
        $request = $this->request->getJsonRawBody();
        $productCategory = new ProductCategory();
        $conditions = ['name'=>$filter->sanitize($request->name, "string"), 'client'=>$filter->sanitize($request->client_id, "string")];            
        $model = $productCategory->findFirst([
            'conditions' => 'name=:name: AND client_id=:client:',
            'bind' => $conditions,
        ]);

        if ($model) { 
            $response->setStatusCode(400,"Found"); 
            return $response->setContent(json_encode("ProductCategory Exist",false)); 
        } 

        // create the productCategory
        $productCategory->setName($filter->sanitize($request->name, "string"));


        if (!$productCategory->save()) {
            $response->setStatusCode(400,"Bad Request");
            $totalMessage = [];
            foreach ($productCategory->getMessages() as $message) {
                array_push($totalMessage, $message->getMessage());
            }
            return $response->setContent(json_encode($totalMessage, false));
        }
        $row = $productCategory->toArray();
        $row["client"]=array("id" => $productCategory->getClientId(), "name" => $productCategory->getClient()->getName());
        $response = array( 
            'title' => "Excelente", 
            'message' => "Solicitud procesada", 
            'domain' => $row, 
            'error' => null 
        ); 
        return json_encode($response); 
    }
    /**
     * Actualizar los datos existentes de un ProductCategory a partir de su ID
     *
     */
    public function updateAction()
    {
        $response = new Response();
        $filter = new Filter(); 
        $request = $this->request->getJsonRawBody();
        $model = new ProductCategory();
        $productCategory = $model->findFirstById($filter->sanitize($request->id, "string")); 

        if(!$productCategory) {
            $response->setStatusCode(400,"Not found");
            return $response->setContent(json_encode("ProductCategory Not Found",false));
        }

        $productCategory->setName($filter->sanitize($request->name, "string"));

        if (!$productCategory->save()) {
            $response->setStatusCode(400,"Bad Request");
            $totalMessage = [];
            foreach ($productCategory->getMessages() as $message) {
                array_push($totalMessage, $message->getMessage());
            }
            return $response->setContent(json_encode($totalMessage, false));
        }
        $row = $productCategory->toArray();
        $row["client"]=array("id" => $productCategory->getClientId(), "name" => $productCategory->getClient()->getName());
        $response = array( 
            'title' => "Excelente", 
            'message' => "Solicitud procesada", 
            'domain' => $row, 
            'error' => null 
        ); 
        return json_encode($response); 
    }
    /**
     * Elimina un ProductCategory dado un ID
     *
     */
    public function deleteAction($id)
    {
        $response = new Response();
        $filter = new Filter(); 
        $model = new ProductCategory();
        $productCategory = $model->findFirstById($filter->sanitize($id, "string"));

        if (!$productCategory) {
            $response->setStatusCode(400,"Bad Request");
            return $response->setContent(json_encode("ProductCategory Not Found",false));
        }

        if (!$productCategory->delete()) {
            $response->setStatusCode(400,"Bad Request");
            $totalMessage = [];
            foreach ($productCategory->getMessages() as $message) {
                array_push($totalMessage, $message);
            }
            return $response->setContent(json_encode($totalMessage, false));
        }

        $response->setStatusCode(200,"OK");
        return $response->setContent(json_encode("OK Delete", false));
    }
}
