<?php

use Phalcon\Mvc\Router;

$router = new Router(false);
$router->removeExtraSlashes(true);
$router->setUriSource(Router::URI_SOURCE_SERVER_REQUEST_URI);
// Set 404 paths
$router->notFound(['controller' => "errors", "action" => "show404"]);

$router->add("/email", ['controller' => 'email', 'action' => 'send'])
    ->via(["GET"]);
// RestAPI Routers
$router->add(
    '/api/{master}/{list}', 
    [
        'controller' => 'rest_api', 
        'action' => 'index'
    ]
);
$router->add(
    '/api/load/masters', 
    [
        'controller' => 'rest_api', 
        'action' => 'load'
    ]
)->via(["GET"]);

$router->add('/user/list', ['controller' => 'user', 'action' => 'list']);
$router->add('/user/create', ['controller' => 'user', 'action' => 'create']);
$router->add('/user/update', ['controller' => 'user', 'action' => 'update']);
$router->add('/user/delete/{id}', ['controller' => 'user', 'action' => 'delete']);
$router->add('/user/impersonate', ['controller' => 'user', 'action' => 'impersonate'])->via(['POST']);
$router->add('/user/seller_list', ['controller' => 'user', 'action' => 'sellerList'])->via(['GET']);

// Rutas de Configuración de Session de usuario
$router->add('/', ['controller' => 'session', 'action' => 'index']);
$router->add('/auth/login', ['controller' => 'session', 'action' => 'login'])
->via(['POST']);
$router->add('/auth', ['controller' => 'session', 'action' => 'auth'])
->via(['GET']);
$router->add('/auth/logout', ['controller' => 'session', 'action' => 'logout']);
$router->add('/auth/recovery_password', ['controller' => 'session', 'action' => 'recoveryPassword']);
$router->add('/role/list', ['controller' => 'role', 'action' => 'list']);
$router->add('/side_menu', ['controller' => 'session', 'action' => 'load']);

// Rutas de CRUD Client
$router->add('/client/list', ['controller' => 'client', 'action' => 'list']);
$router->add('/client/create', ['controller' => 'client', 'action' => 'create']);
$router->add('/client/search/{clientId}', ['controller' => 'client', 'action' => 'searchById']);
$router->add('/client/update', ['controller' => 'client', 'action' => 'update']);
$router->add('/client/delete/{id}', ['controller' => 'client', 'action' => 'delete']);
$router->add('/client/impersonate', ['controller' => 'client', 'action' => 'impersonate'])->via(['POST']);
// Rutas de CRUD Product
$router->add('/product/list', ['controller' => 'product', 'action' => 'list']);
$router->add('/product/create', ['controller' => 'product', 'action' => 'create']);
$router->add('/product/search/{productId}', ['controller' => 'product', 'action' => 'searchById']);
$router->add('/product/update', ['controller' => 'product', 'action' => 'update']);
$router->add('/product/delete/{id}', ['controller' => 'product', 'action' => 'delete']);
// Rutas de CRUD ProductCategory
$router->add('/product_category/list', ['controller' => 'product_category', 'action' => 'list']);
$router->add('/product_category/create', ['controller' => 'product_category', 'action' => 'create']);
$router->add('/product_category/search/{productCategoryId}', ['controller' => 'product_category', 'action' => 'searchById']);
$router->add('/product_category/update', ['controller' => 'product_category', 'action' => 'update']);
$router->add('/product_category/delete/{id}', ['controller' => 'product_category', 'action' => 'delete']);
// Rutas de CRUD Question
$router->add('/question/create', ['controller' => 'question', 'action' => 'create']);
$router->add('/question/search/{questionId}', ['controller' => 'question', 'action' => 'searchById']);
$router->add('/question/update', ['controller' => 'question', 'action' => 'update']);
$router->add('/question/delete/{id}', ['controller' => 'question', 'action' => 'delete']);
// Rutas de CRUD Questionnaire
$router->add('/questionnaire/list', ['controller' => 'questionnaire', 'action' => 'list']);
$router->add('/questionnaire/create', ['controller' => 'questionnaire', 'action' => 'create']);
$router->add('/questionnaire/search/{questionnaireId}', ['controller' => 'questionnaire', 'action' => 'searchById']);
$router->add('/questionnaire/update', ['controller' => 'questionnaire', 'action' => 'update']);
$router->add('/questionnaire/delete/{id}', ['controller' => 'questionnaire', 'action' => 'delete']);
// Rutas de CRUD Price
$router->add('/price/create', ['controller' => 'price', 'action' => 'create']);
$router->add('/price/search/{priceId}', ['controller' => 'price', 'action' => 'searchById']);
$router->add('/price/update', ['controller' => 'price', 'action' => 'update']);
$router->add('/price/delete/{id}', ['controller' => 'price', 'action' => 'delete']);
// Rutas de CRUD PymentMethod
$router->add('/payment_method/list', ['controller' => 'payment_method', 'action' => 'list']);
$router->add('/payment_method/create', ['controller' => 'payment_method', 'action' => 'create']);
$router->add('/payment_method/search/{paymentmethodId}', ['controller' => 'payment_method', 'action' => 'searchById']);
$router->add('/payment_method/update', ['controller' => 'payment_method', 'action' => 'update']);
$router->add('/payment_method/delete/{id}', ['controller' => 'payment_method', 'action' => 'delete']);
// Rutas de CRUD Customer
$router->add('/customer/list', ['controller' => 'customer', 'action' => 'list'])->via(['GET']);
$router->add('/customer/create', ['controller' => 'customer', 'action' => 'create']);
$router->add('/customer/search/{customerId}', ['controller' => 'customer', 'action' => 'searchById']);
$router->add('/customer/update', ['controller' => 'customer', 'action' => 'update']);
$router->add('/customer/delete/{id}', ['controller' => 'customer', 'action' => 'delete']);

// Rutas de CRUD CustomerAssign
$router->add('/customer_assign/not_assign', ['controller' => 'customer_assign', 'action' => 'listCustomerNoAssign']);
$router->add('/customer_assign/assign_seller', ['controller' => 'customer_assign', 'action' => 'assignSeller']);
$router->add('/customer_assign/list/{sellerId}', ['controller' => 'customer_assign', 'action' => 'listAssign']);
$router->add('/customer_assign/list', ['controller' => 'customer_assign', 'action' => 'listAssignComplete']);
$router->add('/customer_assign/approve', ['controller' => 'customer_assign', 'action' => 'approve']);
$router->add('/customer_assign/delete/{Id}', ['controller' => 'customer_assign', 'action' => 'deleteAssign']);
// Rutas de CRUD CustomerContact
$router->add('/customer_contact/list', ['controller' => 'customer_contact', 'action' => 'list']);
$router->add('/customer_contact/create', ['controller' => 'customer_contact', 'action' => 'create']);
$router->add('/customer_contact/search/{customerContactId}', ['controller' => 'customer_contact', 'action' => 'searchById']);
$router->add('/customer_contact/update', ['controller' => 'customer_contact', 'action' => 'update']);
$router->add('/customer_contact/delete/{id}', ['controller' => 'customer_contact', 'action' => 'delete']);
// Rutas de CRUD Expense
$router->add('/expense/create', ['controller' => 'expense', 'action' => 'create']);
$router->add('/expense/search/{expenseId}', ['controller' => 'expense', 'action' => 'searchById']);
$router->add('/expense/update', ['controller' => 'expense', 'action' => 'update']);
$router->add('/expense/delete/{id}', ['controller' => 'expense', 'action' => 'delete']);
$router->add('/expense/list', ['controller' => 'expense', 'action' => 'list']);
// Rutas de CRUD Itinerary
$router->add('/itinerary/list', ['controller' => 'itinerary', 'action' => 'list']);
$router->add('/itinerary/create', ['controller' => 'itinerary', 'action' => 'create']);
$router->add('/itinerary/search/{itineraryId}', ['controller' => 'itinerary', 'action' => 'searchById']);
$router->add('/itinerary/update', ['controller' => 'itinerary', 'action' => 'update']);
$router->add('/itinerary/delete/{id}', ['controller' => 'itinerary', 'action' => 'delete']);
// Rutas de CRUD Answer
$router->add('/answer/create', ['controller' => 'answer', 'action' => 'create']);
$router->add('/answer/search/{answerId}', ['controller' => 'answer', 'action' => 'searchById']);
$router->add('/answer/update', ['controller' => 'answer', 'action' => 'update']);
$router->add('/answer/delete/{id}', ['controller' => 'answer', 'action' => 'delete']);
$router->add('/answer/list', ['controller' => 'answer', 'action' => 'list']);
// Rutas de CRUD Observation
$router->add('/observation/create', ['controller' => 'observation', 'action' => 'create']);
$router->add('/observation/search/{observationId}', ['controller' => 'observation', 'action' => 'searchById']);
$router->add('/observation/update', ['controller' => 'observation', 'action' => 'update']);
$router->add('/observation/delete/{id}', ['controller' => 'observation', 'action' => 'delete']);
// Rutas de CRUD Invoice
$router->add('/invoice/list', ['controller' => 'invoice', 'action' => 'list']);
$router->add('/invoice/create', ['controller' => 'invoice', 'action' => 'create']);
$router->add('/invoice/search/{id}', ['controller' => 'invoice', 'action' => 'searchById']);
$router->add('/invoice/update', ['controller' => 'invoice', 'action' => 'update']);
$router->add('/invoice/delete/{id}', ['controller' => 'invoice', 'action' => 'delete']);
// Rutas de CRUD InvoiceProduct
$router->add('/invoice_product/create', ['controller' => 'invoice_product', 'action' => 'create']);
$router->add('/invoice_product/search/{invoiceProductId}', ['controller' => 'invoice_product', 'action' => 'searchById']);
$router->add('/invoice_product/update', ['controller' => 'invoice_product', 'action' => 'update']);
$router->add('/invoice_product/delete/{id}', ['controller' => 'invoice_product', 'action' => 'delete']);
$router->add('/invoice_product/list', ['controller' => 'invoice_product', 'action' => 'list']);
// Rutas de CRUD WorkDay
$router->add('/workday/create', ['controller' => 'workday', 'action' => 'create']);
$router->add('/workday/search/{workDayId}', ['controller' => 'workday', 'action' => 'searchById']);
$router->add('/workday/update', ['controller' => 'workday', 'action' => 'update']);
$router->add('/workday/delete/{id}', ['controller' => 'workday', 'action' => 'delete']);
$router->add('/workday/list', ['controller' => 'workday', 'action' => 'list']);
// Rutas de Country
$router->add('/country/list', ['controller' => 'country', 'action' => 'list']);
// Rutas de Province
$router->add('/province/list', ['controller' => 'province', 'action' => 'list']);
// Rutas de City
$router->add('/city/list', ['controller' => 'city', 'action' => 'list']);
// Rutas de ItineraryType
$router->add('/itinerary_type/list', ['controller' => 'itinerary_type', 'action' => 'list']);
// Rutas de Status
$router->add('/status/list', ['controller' => 'status', 'action' => 'list']);

$router->add('/sendEmail', array(
    'controller' => 'email',
    'action' => 'send'
));

return $router;
