<?php
use Phalcon\Mvc\View; 
use App\Library\ExceptionsEnums as ExcEnums;
class IndexController extends ControllerBase
{
    public function indexAction()
    {

    }
    public function testAction()
    {
        if(!$this->auth->getUser()) {
            // assuming that auth param is initialized after login
            $this->flash->error('Please login into the application');
            var_dump($this->session);
            var_dump($this->auth->getUser());die;
            return json_encode([4, 5, 6]);
        }
        $view = new View();
        // Disable several levels
        $view->disableLevel(
            [
                View::LEVEL_LAYOUT      => true,
                View::LEVEL_MAIN_LAYOUT => true
            ]
        );
        //Instanciar Enums Exceptions
        $excm = new ExcEnums;
        //Obtener COD y MESSAGE de una Exception
        $test = $excm->getExcMsg(excEnums::EXC_FIELD_001);
        $response = array(
                'title' => "title",
                'message' => "message",
                'domain' => array(
                    "token key" => $this->security->getTokenKey(),
                    "token" => $this->security->getToken()
                ),
                'error' => array(
                    'message' => $test[1],
                    'execCode' => $test[0])
                );
        return json_encode($response);
    }

}

