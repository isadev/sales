<?php
 
use Phalcon\Mvc\Model\Criteria;
use Phalcon\Paginator\Adapter\Model as Paginator;
use App\Models\Product;
use Phalcon\Mvc\View; 
use App\Library\ExceptionsEnums as ExcEnums;
use Phalcon\Http\Response as Response;
use Phalcon\Filter;

class ProductController extends ControllerBase
{
    public function listAction()
    {
        $view = new View();
        $excm = new ExcEnums;
        $product = new Product();
        $results = [];
        $products = $product->findByClientId($this->auth->getUser()->getClientId());
        foreach ($products as $key => $value) {
            $row = $value->toArray();
            $row["product_category"]=array("id" => $value->getProductCategoryId(), "name" => $value->getProductCategory()->getName());
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
     * Funcion encargada de devolver los datos de un producto dado su guId
     *
     * @return Response
     */
    public function searchByIdAction()
    {
        $request = $this->request->getJsonRawBody();
        $productId = $request['productId'];
        $response = new Response();
        $this->view->disable();

        $product = new Product();
        $product = $product->findById($productId);

        if (count($product) > 0) {
            $response->setStatusCode(200, "OK");
            $response->setContent(json_encode($product[0]));
            return $response;
        }
        $response->setStatusCode(404, "Bad Request");
        $response->setContent(json_encode("Param not found"));
        return $response;
    }
    /**
     * Actualiza las caracteristicas de un producto
     *
     */
    public function createAction()
    {
        $error= null;
        $response = new Response();
        $filter = new Filter(); 
        $request = $this->request;
        
        $product = new Product();
        $conditions = ['name'=>$filter->sanitize($request->getPost('name'), "string"), 'client'=>$filter->sanitize($request->getPost('client_id'), "string")];            
        $model = $product->findFirst([
            'conditions' => 'name=:name: AND client_id=:client:',
            'bind' => $conditions,
        ]);
        
        if ($model) { 
            $response->setStatusCode(400,"Found"); 
            return $response->setContent(json_encode("Product Exist",false)); 
        } 
        
        
        // are there  files ?
        if($this->request->hasFiles() == true)
        {
            foreach( $this->request->getUploadedFiles() as $file)
            {           
                $Name      = preg_replace("/[^A-Za-z0-9.]/", "-", $file->getName());
                $product->setCode($filter->sanitize($request->getPost('code'), "string"));
                $product->setBarcode($filter->sanitize($request->getPost('barcode'), "string"));
                $product->setName($filter->sanitize($request->getPost('name'), "string"));
                $product->setCustomImage($filter->sanitize($Name, "string"));
                $product->setProductCategoryId($filter->sanitize($request->getPost('product_category_id'), "string"));
            
                if (!$product->save()) {
                    $allErrors = [];
                    foreach ($product->getMessages() as $message) {
                        array_push($allErrors, $message->getMessage());
                    }
                    $response->setStatusCode(400,"Bad Request");
                    $response->setContent(json_encode($allErrors));
                
                    return $response;
                }
                //  File Product
                $dirName = $this->config->application->uploadsDir."products/";
                $filenameDIR = $dirName."".$product->getId();
                if (!file_exists($filenameDIR)) {
                    mkdir($filenameDIR, 0755);
                }
                // is it a valid extension?
                if ( in_array($file->getType() , self::extIMG) && $file->getError() == 0 )
                {
                    $FileName  = $filenameDIR."/".$Name; 
                    switch( strtolower($file->getExtension()) ){
                        case "png" || "jpg" || "jpeg":
                            // move file to needed path";
                            if(!$file->moveTo($FileName))
                            {   
                                // something  goes worong
                                $error = "Error in image";
                            }
                            // all fine the file has been moved
                            break;
                    }
                    // do some thing
                }
            }
        
            $row = $product->toArray();
            $row["product_category"]=array("id" => $product->getProductCategoryId(), "name" => $product->getProductCategory()->getName());
            $row["client"]=array("id" => $product->getClientId(), "name" => $product->getClient()->getName());
            $response = array( 
                'title' => "Excelente", 
                'message' => "Solicitud procesada", 
                'domain' => $row, 
                'error' => $error 
            ); 
            return json_encode($response); 
        }
    }
    /**
     * Actualiza las caracteristicas de un producto
     *
     */
    public function updateAction()
    {
        var_dump($this->request->getPost());
        die();
        
        $response = new Response();
        $filter = new Filter(); 
        $request = $this->request;
        $model = new Product();
        $product = $model->findFirstById($filter->sanitize($request->getPost('id'), "string")); 

        if(!$product) {
            $response->setStatusCode(400,"Not found");
            return $response->setContent(json_encode("Product Not Found",false));
        }

        // are there  files ?
        if($this->request->hasFiles() == true)
        {
            foreach( $this->request->getUploadedFiles() as $file)
            {           
                $Name      = preg_replace("/[^A-Za-z0-9.]/", "-", $file->getName());
                $product->setCode($filter->sanitize($request->getPost('code'), "string"));
                $product->setBarcode($filter->sanitize($request->getPost('barcode'), "string"));
                $product->setName($filter->sanitize($request->getPost('name'), "string"));
                $product->setCustomImage($filter->sanitize($Name, "string"));
                $product->setProductCategoryId($filter->sanitize($request->getPost('product_category_id'), "string"));
            
                if (!$product->save()) {
                    $allErrors = [];
                    foreach ($product->getMessages() as $message) {
                        array_push($allErrors, $message->getMessage());
                    }
                    $response->setStatusCode(400,"Bad Request");
                    $response->setContent(json_encode($allErrors));

                    return $response;
                }
                //  File Product
                $dirName = $this->config->application->uploadsDir."products/";
                $filenameDIR = $dirName."".$product->getId();
                if (!file_exists($filenameDIR)) {
                    mkdir($filenameDIR, 0755);
                }
                // is it a valid extension?
                if ( in_array($file->getType() , self::extIMG) && $file->getError() == 0 )
                {
                    $FileName  = $filenameDIR."/".$Name; 
                    switch( strtolower($file->getExtension()) ){
                        case "png" || "jpg" || "jpeg":
                            // move file to needed path";
                            if(!$file->moveTo($FileName))
                            {   
                                // something  goes worong
                                $error = "Error in image";
                            }
                            // all fine the file has been moved
                            break;
                    }
                    // do some thing
                }
            }
        
            $row = $product->toArray();
            $row["product_category"]=array("id" => $product->getProductCategoryId(), "name" => $product->getProductCategory()->getName());
            $row["client"]=array("id" => $product->getClientId(), "name" => $product->getClient()->getName());
            $response = array( 
                'title' => "Excelente", 
                'message' => "Solicitud procesada", 
                'domain' => $row, 
                'error' => null 
            ); 
            return json_encode($response); 
        }
    }
    /**
     * Elimina un Producto dado el guid pasado por json
     */
    public function deleteAction($id)
    {
        $response = new Response();
        $filter = new Filter(); 
        $model = new Product();
        $product = $model->findFirstById($filter->sanitize($id, "string"));

        if (!$product) {
            $response->setStatusCode(400,"Bad Request");
            return $response->setContent(json_encode("Product Not Found",false));
        }

        if (!$product->delete()) {
            $allErrors = [];
            foreach ($product->getMessages() as $message) {
                array_push($allErrors, $message->getMessage());
            }
            $response->setStatusCode(400,"Bad Request");
            $response->setContent(json_encode($allErrors));

            return $response;
        }
        $response->setStatusCode(200,"OK");
        $response->setContent(json_encode('OK Delete'));
        return $response;
    }
}