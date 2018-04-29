<?php
use Phalcon\Mvc\Controller;
use Phalcon\Translate\Adapter\NativeArray;

class ControllerBase extends Controller
{
    CONST extIMG = array("image/png", "image/jpg", "image/jpeg");

    public function initialize()
    {
    }
    /**
     * Set Content JsonResponse
     *
     * @return void
     */
    protected function setJsonResponse() {
        $this->view->disable();
        $this->response->setContentType('application/json');
    }
    /**
     * Retorna el Servicio UserManager
     * @return UserManager
     */
    protected function getUserMgr() {
        return $this->di->get('userMgr');
    }
    /**
     * @return Auth
     */
    protected function getAuth() {
        return $this->di->get('auth');
    }
    /**
     * @return Mail
     */
    protected function getMail() {
        return $this->di->get('mail');
    }
    /**
     * @return Mail
     */
    protected function getCurrentFullUrl() {
        $url = 'http://' . $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];
        return $url;
    }

    protected function getTranslation()
    {
        // Ask browser what is the best language
        $userLanguage = "es";
        $language = ($userLanguage) ? $userLanguage : $this->request->getBestLanguage();
        $translationFile = $this->config->application->translationsDir.$language.".php";
        // Check if we have a translation file for that lang
        if (file_exists($translationFile)) {
            require $translationFile;
        } else {
            // Fallback to some default
            require $this->config->application->translationsDir."es.php";
        }
        // Return a translation object
        return new NativeArray(
            [
                "content" => $messages,
            ]
        );
    }
}
