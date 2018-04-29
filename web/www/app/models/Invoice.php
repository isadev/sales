<?php
namespace App\Models;


class Invoice extends BaseModel
{

    /**
     *
     * @var string
     * @Primary
     * @Column(type="string", length=38, nullable=false)
     */
    protected $id;

    /**
     *
     * @var string
     * @Column(type="string", length=38, nullable=true)
     */
    protected $customer_id;

    /**
     *
     * @var string
     * @Column(type="string", length=38, nullable=true)
     */
    protected $itinerary_id;

    /**
     *
     * @var string
     * @Column(type="string", length=20, nullable=false)
     */
    protected $code;

    /**
     *
     * @var integer
     * @Column(type="integer", length=11, nullable=false)
     */
    protected $discount;

    /**
     *
     * @var string
     * @Column(type="string", nullable=false)
     */
    protected $order_date_time;

    /**
     *
     * @var string
     * @Column(type="string", nullable=false)
     */
    protected $delivery_date_time;

    /**
     *
     * @var string
     * @Column(type="string", length=100, nullable=false)
     */
    protected $delivery_address;

    /**
     *
     * @var integer
     * @Column(type="integer", length=11, nullable=true)
     */
    protected $city_id;

    /**
     *
     * @var string
     * @Column(type="string", length=38, nullable=true)
     */
    protected $user_created;

    /**
     *
     * @var string
     * @Column(type="string", length=38, nullable=true)
     */
    protected $user_updated;

    /**
     *
     * @var string
     * @Column(type="string", nullable=true)
     */
    protected $date_created;

    /**
     *
     * @var string
     * @Column(type="string", nullable=true)
     */
    protected $date_updated;

    /**
     *
     * @var string
     * @Column(type="string", length=38, nullable=true)
     */
    protected $client_id;

    /**
     *
     * @var integer
     * @Column(type="integer", length=11, nullable=true)
     */
    protected $payment_method_id;

    /**
     *
     * @var integer
     * @Column(type="integer", length=11, nullable=true)
     */
    protected $sync_status_id;

    /**
     * Method to set the value of field id
     *
     * @param string $id
     * @return $this
     */
    public function setId($id)
    {
        $this->id = $id;

        return $this;
    }

    /**
     * Method to set the value of field customer_id
     *
     * @param string $customer_id
     * @return $this
     */
    public function setCustomerId($customer_id)
    {
        $this->customer_id = $customer_id;

        return $this;
    }

    /**
     * Method to set the value of field itinerary_id
     *
     * @param string $itinerary_id
     * @return $this
     */
    public function setItineraryId($itinerary_id)
    {
        $this->itinerary_id = $itinerary_id;

        return $this;
    }

    /**
     * Method to set the value of field code
     *
     * @param string $code
     * @return $this
     */
    public function setCode($code)
    {
        $this->code = $code;

        return $this;
    }

    /**
     * Method to set the value of field discount
     *
     * @param integer $discount
     * @return $this
     */
    public function setDiscount($discount)
    {
        $this->discount = $discount;

        return $this;
    }

    /**
     * Method to set the value of field order_date_time
     *
     * @param string $order_date_time
     * @return $this
     */
    public function setOrderDateTime($order_date_time)
    {
        $datetime = new \DateTime($order_date_time);
        $this->order_date_time = $datetime->format('Y-m-d H:i:s');

        return $this;
    }

    /**
     * Method to set the value of field delivery_date_time
     *
     * @param string $delivery_date_time
     * @return $this
     */
    public function setDeliveryDateTime($delivery_date_time)
    {
        $datetime = new \DateTime($delivery_date_time);
        $this->delivery_date_time = $datetime->format('Y-m-d H:i:s');
        

        return $this;
    }

    /**
     * Method to set the value of field delivery_address
     *
     * @param string $delivery_address
     * @return $this
     */
    public function setDeliveryAddress($delivery_address)
    {
        $this->delivery_address = $delivery_address;

        return $this;
    }

    /**
     * Method to set the value of field city_id
     *
     * @param integer $city_id
     * @return $this
     */
    public function setCityId($city_id)
    {
        $this->city_id = $city_id;

        return $this;
    }

    /**
     * Method to set the value of field user_created
     *
     * @param string $user_created
     * @return $this
     */
    public function setUserCreated($user_created)
    {
        $this->user_created = $user_created;

        return $this;
    }

    /**
     * Method to set the value of field user_updated
     *
     * @param string $user_updated
     * @return $this
     */
    public function setUserUpdated($user_updated)
    {
        $this->user_updated = $user_updated;

        return $this;
    }

    /**
     * Method to set the value of field date_created
     *
     * @param string $date_created
     * @return $this
     */
    public function setDateCreated($date_created)
    {
        $this->date_created = $date_created;

        return $this;
    }

    /**
     * Method to set the value of field date_updated
     *
     * @param string $date_updated
     * @return $this
     */
    public function setDateUpdated($date_updated)
    {
        $this->date_updated = $date_updated;

        return $this;
    }

    /**
     * Method to set the value of field client_id
     *
     * @param string $client_id
     * @return $this
     */
    public function setClientId($client_id)
    {
        $this->client_id = $client_id;

        return $this;
    }

    /**
     * Method to set the value of field payment_method_id
     *
     * @param integer $payment_method_id
     * @return $this
     */
    public function setPaymentMethodId($payment_method_id)
    {
        $this->payment_method_id = $payment_method_id;

        return $this;
    }

    /**
     * Method to set the value of field sync_status_id
     *
     * @param integer $sync_status_id
     * @return $this
     */
    public function setSyncStatusId($sync_status_id)
    {
        $this->sync_status_id = $sync_status_id;

        return $this;
    }

    /**
     * Returns the value of field id
     *
     * @return string
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Returns the value of field customer_id
     *
     * @return string
     */
    public function getCustomerId()
    {
        return $this->customer_id;
    }

    /**
     * Returns the value of field itinerary_id
     *
     * @return string
     */
    public function getItineraryId()
    {
        return $this->itinerary_id;
    }

    /**
     * Returns the value of field code
     *
     * @return string
     */
    public function getCode()
    {
        return $this->code;
    }

    /**
     * Returns the value of field discount
     *
     * @return integer
     */
    public function getDiscount()
    {
        return $this->discount;
    }

    /**
     * Returns the value of field order_date_time
     *
     * @return string
     */
    public function getOrderDateTime()
    {
        $datetime = new \Datetime($this->order_date_time);
        
        return $datetime->format('d-m-Y H:i:s');
    }

    /**
     * Returns the value of field delivery_date_time
     *
     * @return string
     */
    public function getDeliveryDateTime()
    {
        $datetime = new \Datetime($this->delivery_date_time);
        
        return $datetime->format('d-m-Y H:i:s');
    }

    /**
     * Returns the value of field delivery_address
     *
     * @return string
     */
    public function getDeliveryAddress()
    {
        return $this->delivery_address;
    }

    /**
     * Returns the value of field city_id
     *
     * @return integer
     */
    public function getCityId()
    {
        return $this->city_id;
    }

    /**
     * Returns the value of field user_created
     *
     * @return string
     */
    public function getUserCreated()
    {
        return $this->user_created;
    }

    /**
     * Returns the value of field user_updated
     *
     * @return string
     */
    public function getUserUpdated()
    {
        return $this->user_updated;
    }

    /**
     * Returns the value of field date_created
     *
     * @return string
     */
    public function getDateCreated()
    {
        return $this->date_created;
    }

    /**
     * Returns the value of field date_updated
     *
     * @return string
     */
    public function getDateUpdated()
    {
        return $this->date_updated;
    }

    /**
     * Returns the value of field client_id
     *
     * @return string
     */
    public function getClientId()
    {
        return $this->client_id;
    }

    /**
     * Returns the value of field payment_method_id
     *
     * @return integer
     */
    public function getPaymentMethodId()
    {
        return $this->payment_method_id;
    }

    /**
     * Returns the value of field sync_status_id
     *
     * @return integer
     */
    public function getSyncStatusId()
    {
        return $this->sync_status_id;
    }

    /**
     * Initialize method for model.
     */
    public function initialize()
    {
        parent::initialize();
        $this->setSchema("salesDB");
        $this->setSource("invoice");
        $this->hasMany('id', 'App\Models\InvoiceProduct', 'invoice_id', ['alias' => 'InvoiceProduct']);
        $this->belongsTo('user_created', 'App\Models\User', 'id', ['alias' => 'UserCreated']);
        $this->belongsTo('user_updated', 'App\Models\User', 'id', ['alias' => 'UserUpdated']);
        $this->belongsTo('itinerary_id', 'App\Models\Itinerary', 'id', ['alias' => 'Itinerary']);
        $this->belongsTo('customer_id', 'App\Models\Customer', 'id', ['alias' => 'Customer']);
        $this->belongsTo('city_id', 'App\Models\City', 'id', ['alias' => 'City']);
        $this->belongsTo('payment_method_id', 'App\Models\PaymentMethod', 'id', ['alias' => 'PaymentMethod']);
        $this->belongsTo('client_id', 'App\Models\Client', 'id', ['alias' => 'Client']);
        $this->belongsTo('sync_status_id', 'App\Models\SyncStatus', 'id', ['alias' => 'SyncStatus']);
    }

    /**
     * Returns table name mapped in the model.
     *
     * @return string
     */
    public function getSource()
    {
        return 'invoice';
    }

    /**
     * Allows to query a set of records that match the specified conditions
     *
     * @param mixed $parameters
     * @return Invoice[]|Invoice|\Phalcon\Mvc\Model\ResultSetInterface
     */
    public static function find($parameters = null)
    {
        return parent::find($parameters);
    }

    /**
     * Allows to query the first record that match the specified conditions
     *
     * @param mixed $parameters
     * @return Invoice|\Phalcon\Mvc\Model\ResultInterface
     */
    public static function findFirst($parameters = null)
    {
        return parent::findFirst($parameters);
    }

}
