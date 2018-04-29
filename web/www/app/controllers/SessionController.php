<?php

use Phalcon\Mvc\View;
use App\Models\User;
use App\Library\PermissionMenu;
use App\Library\ExceptionsEnums as ExcEnums;
use Phalcon\Filter;
use Phalcon\Security\Random;


class SessionController extends ControllerBase
{
    public function authAction() {
        $view = new View();
        $excm = new ExcEnums;
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
            $user = $this->auth->getUser()->toArray();
            $user["language"] = $this->auth->getUser()->getLanguage();
            $user["impersonate"] = $this->auth->getUser()->getImpersonate();
        $response = array(
                'title' => "Session activa",
                'message' => "su session está activa exitosamente",
                'domain' => $user,
                'error' => null
        );
        return json_encode($response);
    }
    public function loadAction()
    {
            //Instanciar Enums Exceptions
            $excm = new ExcEnums;
            $permisionsMenu = new PermissionMenu;
            if($this->auth->getUser()){
                $data = $this->auth->getUser()->getRoleId();
                $domain = $permisionsMenu->getSectionsByRole($data);
                $error = null;
            }else{
                $domain = null;
                $excm = $excm->getExcMsg(excEnums::EXC_RQ_003);
                $error = array(
                    'message' => $excm[1],
                    'execCode' => $excm[0]
                );
            }
            $response = array(
                'title' => "Lo siento",
                'message' => "Ha ocurrido un error",
                'domain' => $domain,
                'error' => $error
            );
            return json_encode($response);
    }
    public function indexAction() {
            $language = explode("-", $this->request->getBestLanguage());
            $this->assets->addCss('assets/vendor/bootstrap/dist/css/bootstrap.min.css')
                        ->addCss('assets/vendor/linearicons/dist/web-font/style.css')
                        ->addCss('assets/vendor/components-font-awesome/css/font-awesome.min.css');
            $colectionAssetsCss = $this->assets
                // Este CSS es ubicado en el Head de la página
                ->collection('cssAssets')
                ->addCss('assets/vendor/bootstrap-fileinput/css/fileinput.min.css')
                ->addCss('assets/vendor/datatables.net-bs/css/dataTables.bootstrap.min.css')
                ->addCss('assets/vendor/components-font-awesome/css/font-awesome.min.css')
                ->addCss('assets/vendor/bootstrap-calendar/css/calendar.min.css')
                ->addCss('assets/vendor/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css')
                ->addCss('assets/vendor/sweetalert2/dist/sweetalert2.min.css')
                ->addCss('assets/vendor/select2/dist/css/select2.min.css')
                ->addCss('assets/vendor/pnotify/dist/pnotify.css', false, false)
                ->addCss('assets/vendor/animate.css/animate.min.css');
            $colectionCss = $this->assets
                // Este CSS es ubicado en el Head de la página
                ->collection('cssAplication') 
                    // Estos son todos los recursos
                    ->addCss('css/custom/css/main.css')
                    ->addCss('css/custom/css/demo.css')
                    ->addCss('css/main.css');
            $colectionAssetsJs = $this->assets
                // Este JavaScripts es ubicado en el final de la página
                ->collection('jsAssets') 
                    // Estos son todos los recursos
                    ->addJs('assets/vendor/jquery/dist/jquery.min.js')
                    ->addJs('assets/vendor/bootstrap/dist/js/bootstrap.min.js')
                    ->addJs('assets/vendor/bootstrap-fileinput/js/fileinput.min.js')
                    ->addJs('assets/vendor/jquery-validation/dist/jquery.validate.min.js')
                    ->addJs('assets/vendor/jquery-validation/src/localization/messages_'.$language[0].'.js')
                    ->addJs('assets/vendor/jquery-slimscroll/jquery.slimscroll.min.js')
                    ->addJs('assets/vendor/dom-to-image/src/dom-to-image.js')
                    ->addJs('assets/vendor/file-saver/FileSaver.min.js')
                    ->addJs('assets/vendor/i18next/i18next.min.js')
                    ->addJs('assets/vendor/i18next-xhr-backend/i18nextXHRBackend.min.js')
                    ->addJs('assets/vendor/jquery-i18next/jquery-i18next.min.js')
                    ->addJs('assets/vendor/select2/dist/js/select2.min.js')
                    ->addJs('assets/vendor/underscore/underscore-min.js')
                    ->addJs('assets/vendor/backbone/backbone-min.js')
                    ->addJs('assets/vendor/backbone-localstorage/backbone-localstorage.min.js')
                    ->addJs('assets/vendor/moment/min/moment.min.js')
                    ->addJs('assets/vendor/moment-timezone/builds/moment-timezone.min.js')
                    ->addJs('assets/vendor/moment-timezone/builds/moment-timezone-with-data-2012-2022.min.js')
                    ->addJs('assets/vendor/moment/locale/es.js')
                    ->addJs('assets/vendor/moment/locale/en-au.js')
                    ->addJs('assets/vendor/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js')
                    ->addJs('assets/vendor/bootstrap-calendar/js/calendar.min.js')
                    ->addJs('assets/vendor/bootstrap-calendar/js/language/es-ES.js')
                    ->addJs('assets/vendor/datatables.net/js/jquery.dataTables.min.js')
                    ->addJs('assets/vendor/datatables.net-bs/js/dataTables.bootstrap.min.js')
                    ->addJs('assets/vendor/datatables.net-responsive/js/dataTables.responsive.min.js')
                    ->addJs('assets/vendor/sweetalert2/dist/sweetalert2.min.js')
                    ->addJs('assets/vendor/pnotify/dist/pnotify.js');
            $colectionJs = $this->assets
                // Este JavaScripts es ubicado en el final de la página
                ->collection('jsAplication') 
                    // Estos son todos los recursos
                    ->addJs('js/enums/enums.general.js')
                    ->addJs('js/domain/DomainAlertMessages.js')
                    ->addJs('js/domain/DomainObject.js')
                    ->addJs('js/domain/DomainDataTables.js')
                    ->addJs('js/domain/model/BaseModel.js')
                    ->addJs('js/domain/collection/BaseCollection.js')
                    ->addJs('js/domain/view/BaseView.js')
                    ->addJs('js/domain/view/NavbarView.js')
                    ->addJs('js/domain/view/SidebarView.js')
                    ->addJs('js/domain/view/FooterView.js')
                    ->addJs('js/scripts/klorofil-common.js')
                    ->addJs('js/user/models/UserModel.js')
                    ->addJs('js/user/collections/UserCollection.js')
                    ->addJs('js/user/views/ProfileView.js')
                    ->addJs('js/user/views/UserView.js')
                    ->addJs('js/client/models/ClientModel.js')
                    ->addJs('js/client/collections/ClientCollection.js')
                    ->addJs('js/client/views/ClientView.js')
                    ->addJs('js/product/models/ProductModel.js')
                    ->addJs('js/product/collections/ProductCollection.js')
                    ->addJs('js/product/views/ProductView.js')
                    ->addJs('js/product_category/models/ProductCategoryModel.js')
                    ->addJs('js/product_category/collections/ProductCategoryCollection.js')
                    ->addJs('js/product_category/views/ProductCategoryView.js')
                    ->addJs('js/questionnaire/models/QuestionnaireModel.js')
                    ->addJs('js/questionnaire/collections/QuestionnaireCollection.js')
                    ->addJs('js/questionnaire/views/QuestionnaireView.js')
                    ->addJs('js/customer/models/CustomerModel.js')
                    ->addJs('js/customer/models/CustomerAssignModel.js')
                    ->addJs('js/customer/collections/CustomerCollection.js')
                    ->addJs('js/customer/collections/CustomerAssignCollection.js')
                    ->addJs('js/customer/views/CustomerView.js')
                    ->addJs('js/customer/views/CustomerAssignView.js')
                    ->addJs('js/customer/views/CustomerByApproveView.js')
                    ->addJs('js/customer_contact/models/CustomerContactModel.js')
                    ->addJs('js/customer_contact/collections/CustomerContactCollection.js')
                    ->addJs('js/customer_contact/views/CustomerContactView.js')
                    ->addJs('js/itinerary/models/ItineraryModel.js')
                    ->addJs('js/itinerary/collections/ItineraryCollection.js')
                    ->addJs('js/itinerary/views/ItineraryView.js')
                    ->addJs('js/itinerary/views/CalendarView.js')
                    ->addJs('js/invoice/models/InvoiceModel.js')
                    ->addJs('js/invoice/collections/InvoiceCollection.js')
                    ->addJs('js/invoice/views/InvoiceView.js')
                    ->addJs('js/invoice/views/InvoiceDetailsView.js')
                    ->addJs('js/session/models/SessionModel.js')
                    ->addJs('js/session/views/LoginView.js')
                    ->addJs('js/home/views/HomeView.js')
                    ->addJs('js/domain/router/BaseRouter.js');

            if ($this->config->environment === 'production') {
                $colectionCss->setTargetPath('css/app.min.css')
                    // La etiqueta del CSS es generado con esta URI
                    ->setTargetUri('css/app.min.css')
                    ->join(true)
                    // Usar el filtro incorporado Csssmin
                    ->addFilter(
                        new Phalcon\Assets\Filters\Cssmin()
                );
                $colectionAssetsCss->setTargetPath('css/assets.min.css')
                    // La etiqueta del CSS es generado con esta URI
                    ->setTargetUri('css/assets.min.css')
                    ->join(true)
                    // Usar el filtro incorporado Csssmin
                    ->addFilter(
                        new Phalcon\Assets\Filters\Cssmin()
                );
                $colectionAssetsJs->setTargetPath('js/assets.min.js')
                    // La etiqueta del script es generado con esta URI
                    ->setTargetUri('js/assets.min.js')
                    ->join(true)
                    // Usar el filtro incorporado Jsmin
                    ->addFilter(
                        new Phalcon\Assets\Filters\Jsmin()
                    );
                $colectionJs->setTargetPath('js/app.min.js')
                    // La etiqueta del script es generado con esta URI
                    ->setTargetUri('js/app.min.js')
                    ->join(true)
                    // Usar el filtro incorporado Jsmin
                    ->addFilter(
                        new Phalcon\Assets\Filters\Jsmin()
                    );
            }

        $view = $this->view;
        // disable the main layout
        $view->disableLevel([
            View::LEVEL_LAYOUT      => true,
            View::LEVEL_MAIN_LAYOUT => true
        ]);

        $this->view->setVar("TOKEN_KEY", $this->security->getTokenKey());
    }
    public function loginAction() {
        $request = $this->request;
        $view = $this->view;
        $excm = new ExcEnums;
        $filter = new Filter();
        // disable the main layout
        $view->disableLevel([
            View::LEVEL_LAYOUT      => true,
            View::LEVEL_MAIN_LAYOUT => true
        ]);

        $this->setJsonResponse();
        if($this->auth->getUser()) {
            $this->auth->logOut();
        }
        $data = $request->getJsonRawBody();
        if ($request->isAjax() && $request->isPost() && !empty($data->email) && !empty($data->password)) {
            $email = $filter->sanitize($data->email, "email");
            $password = $filter->sanitize($data->password, "string");
            $result = $this->auth->logIn($email, $password);
            if ($result) {
                $user = $this->auth->getUser()->toArray();
                $user["language"] = $this->auth->getUser()->getLanguage();
                $response = array(
                    'title' => "Excelente",
                    'message' => "La petición ha sido procesada",
                    'domain' => $user,
                    'error' => null
                );
                return json_encode($response);
            }
        }
        $exec = empty($data->email) || empty($data->password) ? $excm->getExcMsg(excEnums::EXC_FIELD_001) : $excm->getExcMsg(excEnums::EXC_RQ_001);
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

    public function logoutAction() {
        $this->auth->logOut();
        return $this->response->redirect('/');
    }

    public function recoveryPasswordAction() {
        $request = $this->request;
        $view = $this->view;
        $excm = new ExcEnums;
        $filter = new Filter();
        // disable the main layout
        $view->disableLevel([
            View::LEVEL_LAYOUT      => true,
            View::LEVEL_MAIN_LAYOUT => true
        ]);

        $data = $request->getJsonRawBody();
        if ($request->isAjax() && $request->isPost() && !empty($data->email)) {
            $email = $filter->sanitize($data->email, "email");
            $user = new User();
            $random = new Random();
            $result = $user->findFirstByEmail($email);
            if ($result) {
                $token = $random->base64(50);
                $result->setSalt($token);
                if($result->save()){
                    
                    $defaults = [
                        "url" => $this->getCurrentFullUrl()."?token_security=".$token, 
                        "TitleRecoveryPassword"=> $this->getTranslation()->_("textRecoveryPassword"),
                        "textRecoveryPassword"=> $this->getTranslation()->_("textRecoveryPassword"),
                        "buttonCenter"=> $this->getTranslation()->_("buttonToken")
                    ];
                    $email = $this->getMail()->send($result->getEmail(), $this->getTranslation()->_("RecoveryPasswordSubject"), "recoveryPassword", $defaults);
                }
                $response = array(
                    'title' => "Excelente",
                    'message' => "La petición ha sido procesada",
                    'domain' => $result,
                    'error' => null
                );
                return json_encode($response);
            }
        }


    }

    public function completeAction() {
        $this->view->disable();
        $token = $this->request->get('token');
        $this->getUserMgr()->expireEmailValidationToken($token);
        $this->response->redirect('/login');
    }
}