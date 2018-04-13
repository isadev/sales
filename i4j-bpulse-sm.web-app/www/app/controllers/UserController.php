<?php
use Phalcon\Filter;
use App\Models\User;
use Phalcon\Mvc\View; 
use Phalcon\Http\Response;
use App\Library\ExceptionsEnums as ExcEnums;

class UserController extends ControllerBase
{
    public function listAction()
    {
        $view = new View();
        $excm = new ExcEnums;
        $user = new User();
        $filter = new Filter();
        $results = [];
        // $users = $user->findByClientId($this->auth->getUser()->getClientId());
        $users = $user->query()
                    ->where('enabled = :status:')
                    ->andwhere('client_id = :client:')
                    ->andwhere('id != :user:')
                    ->bind(['status' => 1, 'client' => $this->auth->getUser()->getClientId(), 'user' => $this->auth->getUser()->getId()])
                    ->execute();
        foreach ($users as $key => $value) {
            $row = $value->toArray();
            unset($row['password'], $row['salt'], $row['bpulse_user_token'], $row['google_push_token']);
            $row["role"]=array("id" => $value->getRoleId(), "name" => $value->getRole()->getName());
            $row["name"]=$value->getFirstName()." ".$value->getLastName();
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
    public function sellerListAction()
    {
        $view = new View();
        $excm = new ExcEnums;
        $user = new User();
        $filter = new Filter();
        $results = [];
        $query = $filter->sanitize($this->request->getQuery("query"), "string");
        $users = $user->query()
                    ->where('enabled = :status:')
                    ->andwhere('client_id = :client:')
                    ->andwhere('first_name LIKE :query: OR last_name LIKE :query:')
                    ->andwhere('role_id = :role:')
                    ->bind(['status' => 1, 'client' => $this->auth->getUser()->getClientId(), 'role' => 3, 'query' => "%".$query."%"])
                    ->execute();
        foreach ($users as $key => $value) {
            $row = $value->toArray();
            $row["role"]=array("id" => $value->getRoleId(), "name" => $value->getRole()->getName());
            $row["name"]=$value->getFirstName()." ".$value->getLastName();
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
    public function impersonateAction() {
        $request = $this->request;
        $excm = new ExcEnums;
        $filter = new Filter();

         $data = $request->getJsonRawBody();
         $this->setJsonResponse();
         $domain = [];
         if ($request->isAjax() && $request->isPost() && !empty($data->email)) {
             if($this->auth->getUser()){
                 $email = $filter->sanitize($data->email, "email");
                 $result = $this->auth->impersonateUser($email);
                 if($result){
                     $domain = $this->auth->getUser();
                     $response = array(
                         'title' => "Excelente",
                         'message' => "Operación realizada",
                         'domain' => $domain,
                         'error' => null
                         );
                     return json_encode($response);
                 }
             }
         }
        $exec = empty($data->email) ? $excm->getExcMsg(excEnums::EXC_FIELD_001) : $excm->getExcMsg(excEnums::EXC_RQ_001);
        $response = array(
            'title' => "Lo siento",
            'message' => "Ha ocurrido un error",
            'domain' => $domain,
            'error' => array(
                'message' => $exec[1],
                'execCode' => $exec[0]
                )
            );
        return json_encode($response);
    }

    public function updateAction()
    {
        $response = new Response();
        $filter = new Filter(); 
        $request = $this->request->getJsonRawBody();

        $model = new User();       
        $user = $model->findFirstById($filter->sanitize($request->id, "string"));

        if (!$user) { 
            $response->setStatusCode(400,"Not Found"); 
            return $response->setContent(json_encode("User Not found",false)); 
        }
        
        $user->setEmail($filter->sanitize($request->email, "string"));
        $user->setFirstName($filter->sanitize($request->first_name, "string"));
        $user->setLastName($filter->sanitize($request->last_name, "string"));
        $user->setEnabled($filter->sanitize($request->enabled, "string"));
        
        if (!$user->save()) {
            $allErrors = [];
            foreach ($user->getMessages() as $message) {
                array_push($allErrors, $message->getMessage());
            }
            $response->setStatusCode(400,"Bad Request");
            $response->setContent(json_encode($allErrors));

            return $response;
        }
        $row = $user->toArray();
        $row["role"]=array("id" => $user->getRoleId(), "name" => $user->getRole()->getName());
        $response = array( 
            'title' => "Excelente", 
            'message' => "Solicitud procesada", 
            'domain' => $row, 
            'error' => null 
        ); 
        return json_encode($response);
    }

    public function createAction()
    {
        $response = new Response();
        $filter = new Filter(); 
        $request = $this->request->getJsonRawBody();

        $user = new User();
        $conditions = ['email'=>$filter->sanitize($request->email, "email")];            
        $model = $user->findFirst([
            'conditions' => 'email=:email:',
            'bind' => $conditions,
        ]);

        if ($model) { 
            $response->setStatusCode(400,"Found"); 
            return $response->setContent(json_encode("user Exist",false)); 
        } 
        
        $user->setEmail($filter->sanitize($request->email, "string"));
        $user->setFirstName($filter->sanitize($request->first_name, "string"));
        $user->setLastName($filter->sanitize($request->last_name, "string"));
        $user->setEnabled($filter->sanitize($request->enabled, "string"));
        $user->setRoleId($filter->sanitize($request->role_id, "int"));
        $user->setPassword($filter->sanitize($this->getUserMgr()->encryptPassword($request->password), "string"));
        
        if(!$user->save()){
            $allErrors = [];
            foreach ($user->getMessages() as $message) {
                array_push($allErrors, $message->getMessage());
            }
            $response->setStatusCode(400,"Bad Request");
            $response->setContent(json_encode($allErrors));

            return $response;
        }
        $row = $user->toArray();
        $row["role"]=array("id" => $user->getRoleId(), "name" => $user->getRole()->getName());
        $response = array( 
            'title' => "Excelente", 
            'message' => "Solicitud procesada", 
            'domain' => $row, 
            'error' => null 
        ); 
        return json_encode($response);
    }

    public function deleteAction($id)
    {
        $response = new Response();
        $model = new User();
        $filter = new Filter();
        $user = $model->findFirstById($filter->sanitize($id, "string"));

        if (!$user) {
            $response->setStatusCode(400,"Bad Request");
            return $response->setContent(json_encode("User Not Found",false));
        }

        $user->setEnabled(0);

        if (!$user->save()) {
            $response->setStatusCode(403,"Bad Request");
            $totalMessage = [];
            foreach ($user->getMessages() as $message) {
                array_push($totalMessage, $message);
            }
            return $response->setContent(json_encode($totalMessage, false));
        }

        $response->setStatusCode(200,"OK");
        return $response->setContent(json_encode("OK delete", false));
    }

}

