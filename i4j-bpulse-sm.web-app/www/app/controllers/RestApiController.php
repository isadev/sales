<?php
use Phalcon\Filter;
use App\Models\City; 
use App\Models\Price;
use App\Models\Answer;
use App\Models\Expense;
use App\Models\Invoice;
use App\Models\Product;
use App\Models\WorkDay;
use App\Models\Country; 
use App\Models\Customer;
use App\Models\Question;
use App\Models\Itinerary;
use App\Models\Province; 
use Phalcon\Mvc\Controller;
use App\Models\PaymentMethod;
use App\Models\Questionnaire;
use App\Models\CustomerAssign;
use App\Models\InvoiceProduct;
use App\Models\CustomerContact;
use App\Models\ProductCategory;
use App\Models\QuestionnaireType;
use Phalcon\Translate\Adapter\NativeArray;
use App\Library\ExceptionsEnums as ExcEnums;

class RestApiController extends ControllerBase
{
    public function indexAction($master, $action)
    {
        $user = $this->request->getServer('PHP_AUTH_USER');
        $password = $this->request->getServer('PHP_AUTH_PW');
        if($user!=='' && $password!==''){
            $result = $this->auth->logIn($user, $password);
            if($result){
                $permissionApi = self::getPermissionAPI($this->auth->getUser()->getRoleId(), $master, $action);
                if($permissionApi){
                    $this->dispatcher->forward(
                        [
                            "controller" => $master,
                            "action"     => $action
                        ]
                    );
                }
            }
        }
        $excm = new ExcEnums;
        $exec = $excm->getExcMsg(excEnums::EXC_RQ_003);
        $response = array( 
            'title' => "I sorry", 
            'message' => "Permission denied", 
            'domain' => null, 
            'error' => array(
                    'message' => $exec[1],
                    'execCode' => $exec[0]
                    ) 
        ); 
        return json_encode($response); 
    }
    public function loadAction()
    {
        $filter = new Filter();
        $user = $this->request->getServer('PHP_AUTH_USER');
        $password = $this->request->getServer('PHP_AUTH_PW');
        if($user!=='' && $password!==''){
            $result = $this->auth->logIn($user, $password);
            if($result){
                if($filter->sanitize($this->request->getQuery("dateLastSync"), "int")){
                    $dateTimestamp = $filter->sanitize($this->request->getQuery("dateLastSync"), "int");
                    $dateLastSync = date('Y-m-d H:i:s', $dateTimestamp);
                }else{
                    $dateLastSync = null;
                }
                // var_dump($this->validateDate($dateTimestamp));die;
                // TODO: Crear el servicio que retorne un JSON con Todos los maestros a Sincronizar
                // Mejorar el Performan de éste código
                $customer = new Customer;
                    $customerList = $customer->query()
                                        ->andWhere("client_id = :client:")
                                        ->andWhere("date_updated >= :last_sync:")
                                        ->bind(array(
                                            "last_sync" => $dateLastSync ? $dateLastSync : '%',
                                            "client" => $this->auth->getUser()->getClientId()
                                        ))->execute();
                $customerContact = new CustomerContact;
                    $customerContactList = $customerContact->query()
                                        ->andWhere("date_updated >= :last_sync:")
                                        ->bind(array(
                                            "last_sync" => $dateLastSync ? $dateLastSync : '%'
                                        ))->execute();
                $itinerary = new Itinerary;
                    $itineraryList = $itinerary->query()
                                        ->where("user_id = :user:")
                                        ->andWhere("client_id = :client:")
                                        ->andWhere("date_updated >= :last_sync:")
                                        ->bind(array(
                                            "user" => $this->auth->getUser()->getId(),
                                            "last_sync" => $dateLastSync ? $dateLastSync : '%',
                                            "client" => $this->auth->getUser()->getClientId()
                                        ))->execute();
                $expense = new Expense;
                    $expenseList = $expense->query()
                                        ->where("user_id = :user:")
                                        ->andWhere("date_updated >= :last_sync:")
                                        ->bind(array(
                                            "last_sync" => $dateLastSync ? $dateLastSync : '%',
                                            "user" => $this->auth->getUser()->getId()
                                        ))->execute();
                $answer = new Answer;
                    $answerList = $answer->query()
                                        ->andWhere("date_updated >= :last_sync:")
                                        ->bind(array(
                                            "last_sync" => $dateLastSync ? $dateLastSync : '%'
                                        ))->execute();

                $invoice = new Invoice;
                    $invoiceList = $invoice->query()
                                        ->andWhere("client_id = :client:")
                                        ->andWhere("date_updated >= :last_sync:")
                                        ->bind(array(
                                            "last_sync" => $dateLastSync ? $dateLastSync : '%',
                                            "client" => $this->auth->getUser()->getClientId()
                                        ))->execute();

                $invoiceProduct = new InvoiceProduct;
                    $invoiceProductList = $invoiceProduct->query()
                                        ->andWhere("date_updated >= :last_sync:")
                                        ->bind(array(
                                            "last_sync" => $dateLastSync ? $dateLastSync : '%'
                                        ))->execute();

                $workday = new WorkDay;
                    $workdayList = $workday->query()
                                        ->where("user_id = :user:")
                                        ->andWhere("date_updated >= :last_sync:")
                                        ->bind(array(
                                            "last_sync" => $dateLastSync ? $dateLastSync : '%',
                                            "user" => $this->auth->getUser()->getId()
                                        ))->execute();
                $product = new Product;
                    $productList = $product->query()
                                        ->where("client_id = :client:")
                                        ->andWhere("date_updated >= :last_sync:")
                                        ->bind(array(
                                            "last_sync" => $dateLastSync ? $dateLastSync : '%',
                                            "client" => $this->auth->getUser()->getClientId()
                                        ))->execute();
                $productCategory = new ProductCategory;
                    $productCategoryList = $productCategory->query()
                                        ->where("client_id = :client:")
                                        ->andWhere("date_updated >= :last_sync:")
                                        ->bind(array(
                                            "last_sync" => $dateLastSync ? $dateLastSync : '%',
                                            "client" => $this->auth->getUser()->getClientId()
                                        ))->execute();
                $price = new Price;
                    $priceList = $price->query()
                                        ->andWhere("date_updated >= :last_sync:")
                                        ->bind(array(
                                            "last_sync" => $dateLastSync ? $dateLastSync : '%'
                                        ))->execute();
                $questionnaire = new Questionnaire;
                    $questionnaireList = $questionnaire->query()
                                        ->where("client_id = :client:")
                                        ->andWhere("date_updated >= :last_sync:")
                                        ->bind(array(
                                            "last_sync" => $dateLastSync ? $dateLastSync : '%',
                                            "client" => $this->auth->getUser()->getClientId()
                                        ))->execute();
                $questionnaireType = new QuestionnaireType;
                    $questionnaireTypeList = $questionnaireType->find();
                $question = new Question;
                    $questionList = $question->query()
                                        ->andWhere("date_updated >= :last_sync:")
                                        ->bind(array(
                                            "last_sync" => $dateLastSync ? $dateLastSync : '%'
                                        ))->execute();
                $paymentMethod = new PaymentMethod;
                    $paymentMethodList = $paymentMethod->query()
                                        ->where("client_id = :client:")
                                        ->andWhere("date_updated >= :last_sync:")
                                        ->bind(array(
                                            "last_sync" => $dateLastSync ? $dateLastSync : '%',
                                            "client" => $this->auth->getUser()->getClientId()
                                        ))->execute();

                $customerAssign = new CustomerAssign;
                    $customerAssignList = $customerAssign->query()
                                        ->where("user_id = :user:")
                                        ->andWhere("date_updated >= :last_sync:")
                                        ->bind(array(
                                            "last_sync" => $dateLastSync ? $dateLastSync : '%',
                                            "user" => $this->auth->getUser()->getId()
                                        ))->execute();

                    $countryList = [ $this->auth->getUser()->getClient()->getCity()->getProvince()->getCountry() ]; 
                    $provinceList = Province::find([ 
                        "country_id = '{$countryList[0]->getId()}'"  
                    ]); 
                    $provinceIds = array_map(function ($province) { 
                        return $province['id']; 
                    }, $provinceList->toArray()); 
                    $provinceIds = "(".implode(",", $provinceIds).")"; 
                    $cityList = City::find([ 
                        "province_id in {$provinceIds}" 
                    ]); 
                    if(!$this->request->getQuery("dateLastSync")){
                        $user = $this->auth->getUser()->toArray();
                        $user['client']['id'] = $this->auth->getUser()->getClientId();
                        $user['client']['name'] = $this->auth->getUser()->getClient()->getName();
                        $user['client']['city_id'] = $this->auth->getUser()->getClient()->getCityId();
                        $results = [
                            "customer" => self::getArrayMaster($customerList),
                            "customer_contact" => self::getArrayMaster($customerContactList),
                            "itinerary" => self::getArrayMaster($itineraryList),
                            "expense" => self::getArrayMaster($expenseList),
                            "answer" => self::getArrayMaster($answerList),
                            "invoice" => self::getArrayMaster($invoiceList),
                            "invoice_product" => self::getArrayMaster($invoiceProductList),
                            "workday" => self::getArrayMaster($workdayList),
                            "product" => self::getArrayMaster($productList),
                            "product_category" => self::getArrayMaster($productCategoryList),
                            "price" => self::getArrayMaster($priceList),
                            "questionnaire" => self::getArrayMaster($questionnaireList),
                            "questionnaire_type" => self::getArrayMaster($questionnaireTypeList),
                            "question" => self::getArrayMaster($questionList),
                            "payment_method" => self::getArrayMaster($paymentMethodList),
                            "customer_assign" => self::getArrayMaster($customerAssignList),
                            "city" => $cityList->toArray(), 
                            "province" => self::getArrayMaster($provinceList), 
                            "country" => self::getArrayMaster($countryList), 
                            "user" => $user
                        ];
                    }else{
                        $results = [
                            "customer" => self::getArrayMaster($customerList),
                            "customer_contact" => self::getArrayMaster($customerContactList),
                            "itinerary" => self::getArrayMaster($itineraryList),
                            "expense" => self::getArrayMaster($expenseList),
                            "answer" => self::getArrayMaster($answerList),
                            "invoice" => self::getArrayMaster($invoiceList),
                            "invoice_product" => self::getArrayMaster($invoiceProductList),
                            "workday" => self::getArrayMaster($workdayList),
                            "product" => self::getArrayMaster($productList),
                            "product_category" => self::getArrayMaster($productCategoryList),
                            "price" => self::getArrayMaster($priceList),
                            "questionnaire" => self::getArrayMaster($questionnaireList),
                            "questionnaire_type" => self::getArrayMaster($questionnaireTypeList),
                            "question" => self::getArrayMaster($questionList),
                            "payment_method" => self::getArrayMaster($paymentMethodList),
                            "customer_assign" => self::getArrayMaster($customerAssignList)
                        ];

                    }
                    self::setJsonResponse();
                    $response = array( 
                        'title' => "Excelente", 
                        'message' => "La petición ha sido procesada", 
                        'domain' => $results, 
                        'error' => null
                    ); 
                    return json_encode($response); 
            }
        }
        $excm = new ExcEnums;
        $exec = $excm->getExcMsg(excEnums::EXC_RQ_003);
        $response = array( 
            'title' => "I sorry", 
            'message' => "Permission denied", 
            'domain' => null, 
            'error' => array(
                    'message' => $exec[1],
                    'execCode' => $exec[0]
                    ) 
        ); 
        return json_encode($response); 
    }

    public function getArrayMaster($master){
        $row = [];
        foreach ($master as $key => $value) {
            $row[$key] = $value->toArray();
        }
        return $row;
    }
    public function getPermissionAPI($role, $master, $action){
        $masters = [
            "customer" => [
                "permission" => [1, 2, 3],
                "actions" => [
                    "create" => [1, 2, 3],
                    "list" => [1, 2, 3],
                    "searchById" => [1, 2, 3],
                    "update" => [1, 2, 3],
                    "delete" => [1, 2, 3]
                ]
            ],
            "product" => [
                "permission" => [1, 2, 3],
                "actions" => [
                    "list" => [1, 2, 3],
                    "searchById" => [1, 2, 3]
                ]
            ],
            "customer_contact" => [
                "permission" => [1, 2, 3],
                "actions" => [
                    "create" => [1, 2, 3],
                    "list" => [1, 2, 3],
                    "searchById" => [1, 2, 3],
                    "update" => [1, 2, 3],
                    "delete" => [1, 2, 3]
                ]
            ],
            "itinerary" => [
                "permission" => [1, 2, 3],
                "actions" => [
                    "create" => [1, 2, 3],
                    "list" => [1, 2, 3],
                    "searchById" => [1, 2, 3],
                    "update" => [1, 2, 3],
                    "delete" => [1, 2, 3]
                ]
            ],
            "expense" => [
                "permission" => [1, 2, 3],
                "actions" => [
                    "create" => [1, 2, 3],
                    "searchById" => [1, 2, 3],
                    "update" => [1, 2, 3],
                    "delete" => [1, 2, 3],
                    "list" => [1, 2, 3]
                ]
            ],
            "answer" => [
                "permission" => [1, 2, 3],
                "actions" => [
                    "list" => [1, 2, 3],
                    "create" => [1, 2, 3],
                    "searchById" => [1, 2, 3],
                    "update" => [1, 2, 3],
                    "delete" => [1, 2, 3]
                ]
            ],
            "invoice" => [
                "permission" => [1, 2, 3],
                "actions" => [
                    "create" => [1, 2, 3],
                    "list" => [1, 2, 3],
                    "searchById" => [1, 2, 3],
                    "update" => [1, 2, 3],
                    "delete" => [1, 2, 3]
                ]
            ],
            "invoice_product" => [
                "permission" => [1, 2, 3],
                "actions" => [
                    "list" => [1, 2, 3],
                    "create" => [1, 2, 3],
                    "searchById" => [1, 2, 3],
                    "update" => [1, 2, 3],
                    "delete" => [1, 2, 3]
                ]
            ],
            "user" => [
                "permission" => [1, 2, 3],
                "actions" => [
                    "create" => [1],
                    "searchById" => [1],
                    "update" => [1, 2, 3],
                    "delete" => []
                ]
            ],
            "workday" => [
                "permission" => [1, 2, 3],
                "actions" => [
                    "create" => [1, 2, 3],
                    "searchById" => [1, 2, 3],
                    "update" => [1, 2, 3],
                    "delete" => [1, 2, 3],
                    "list" => [1, 2, 3]
                ]
            ],
            "price" => [
                "permission" => [1, 2, 3],
                "actions" => [
                    "create" => [1, 2, 3],
                    "searchById" => [1, 2, 3],
                    "update" => [1, 2, 3],
                    "delete" => [1, 2, 3],
                    "list" => [1, 2, 3]
                ]
            ],
            "questionnaire" => [
                "permission" => [1, 2, 3],
                "actions" => [
                    "create" => [1, 2, 3],
                    "searchById" => [1, 2, 3],
                    "update" => [1, 2, 3],
                    "delete" => [1, 2, 3],
                    "list" => [1, 2, 3]
                ]
            ],
            "question" => [
                "permission" => [1, 2, 3],
                "actions" => [
                    "create" => [1, 2, 3],
                    "searchById" => [1, 2, 3],
                    "update" => [1, 2, 3],
                    "delete" => [1, 2, 3],
                    "list" => [1, 2, 3]
                ]
            ],
            "payment_method" => [
                "permission" => [1, 2, 3],
                "actions" => [
                    "create" => [1, 2, 3],
                    "searchById" => [1, 2, 3],
                    "update" => [1, 2, 3],
                    "delete" => [1, 2, 3],
                    "list" => [1, 2, 3]
                ]
            ],
            "product_category" => [
                "permission" => [1, 2, 3],
                "actions" => [
                    "list" => [1, 2, 3],
                    "create" => [1, 2, 3],
                    "searchById" => [1, 2, 3],
                    "update" => [1, 2, 3],
                    "delete" => [1, 2, 3],
                    "list" => [1, 2, 3]
                ]
            ]
        ];
        if(!isset($masters[$master]) || !isset($masters[$master]["actions"][$action])){
            return false;
        }
        return (in_array($role, $masters[$master]["permission"]) && in_array($role, $masters[$master]["actions"][$action]));
    }
}
