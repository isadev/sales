<?php
namespace App\Models;


class Itinerary extends BaseModel
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
     * @Column(type="string", length=255, nullable=false)
     */
    protected $address;

    /**
     *
     * @var string
     * @Column(type="string", nullable=false)
     */
    protected $date_time;

    /**
     *
     * @var integer
     * @Column(type="integer", length=11, nullable=true)
     */
    protected $city_id;

    /**
     *
     * @var string
     * @Column(type="string", length=100, nullable=true)
     */
    protected $geolocation;

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
    protected $user_id;

    /**
     *
     * @var string
     * @Column(type="string", length=38, nullable=true)
     */
    protected $customer_id;

    /**
     *
     * @var integer
     * @Column(type="integer", length=11, nullable=true)
     */
    protected $itinerary_type_id;

    /**
     *
     * @var integer
     * @Column(type="integer", length=11, nullable=true)
     */
    protected $status_id;

    /**
     *
     * @var string
     * @Column(type="string", length=38, nullable=true)
     */
    protected $customer_contact_id;

    /**
     *
     * @var string
     * @Column(type="string", length=38, nullable=true)
     */
    protected $client_id;

    /**
     *
     * @var string
     * @Column(type="string", length=255, nullable=true)
     */
    protected $observation;

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
     * Method to set the value of field address
     *
     * @param string $address
     * @return $this
     */
    public function setAddress($address)
    {
        $this->address = $address;

        return $this;
    }

    /**
     * Method to set the value of field date_time
     *
     * @param string $date_time
     * @return $this
     */
    public function setDateTime($date_time)
    {
        
        $datetime = new \DateTime($date_time);
        $this->date_time = $datetime->format('Y-m-d H:i:s');

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
     * Method to set the value of field geolocation
     *
     * @param string $geolocation
     * @return $this
     */
    public function setGeolocation($geolocation)
    {
        $this->geolocation = $geolocation;

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
     * Method to set the value of field user_id
     *
     * @param string $user_id
     * @return $this
     */
    public function setUserId($user_id)
    {
        $this->user_id = $user_id;

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
     * Method to set the value of field itinerary_type_id
     *
     * @param integer $itinerary_type_id
     * @return $this
     */
    public function setItineraryTypeId($itinerary_type_id)
    {
        $this->itinerary_type_id = $itinerary_type_id;

        return $this;
    }

    /**
     * Method to set the value of field status_id
     *
     * @param integer $status_id
     * @return $this
     */
    public function setStatusId($status_id)
    {
        $this->status_id = $status_id;

        return $this;
    }

    /**
     * Method to set the value of field customer_contact_id
     *
     * @param string $customer_contact_id
     * @return $this
     */
    public function setCustomerContactId($customer_contact_id)
    {
        $this->customer_contact_id = $customer_contact_id;

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
     * Method to set the value of field observation
     *
     * @param string $observation
     * @return $this
     */
    public function setObservation($observation)
    {
        $this->observation = $observation;

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
     * Returns the value of field address
     *
     * @return string
     */
    public function getAddress()
    {
        return $this->address;
    }

    /**
     * Returns the value of field date_time
     *
     * @return string
     */
    public function getDateTime()
    {
        $datetime = new \Datetime($this->date_time);
        
        return $datetime->format('d-m-Y H:i:s');
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
     * Returns the value of field geolocation
     *
     * @return string
     */
    public function getGeolocation()
    {
        return $this->geolocation;
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
     * Returns the value of field user_id
     *
     * @return string
     */
    public function getUserId()
    {
        return $this->user_id;
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
     * Returns the value of field itinerary_type_id
     *
     * @return integer
     */
    public function getItineraryTypeId()
    {
        return $this->itinerary_type_id;
    }

    /**
     * Returns the value of field status_id
     *
     * @return integer
     */
    public function getStatusId()
    {
        return $this->status_id;
    }

    /**
     * Returns the value of field customer_contact_id
     *
     * @return string
     */
    public function getCustomerContactId()
    {
        return $this->customer_contact_id;
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
     * Returns the value of field observation
     *
     * @return string
     */
    public function getObservation()
    {
        return $this->observation;
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
        $this->setSource("itinerary");
        $this->hasMany('id', 'App\Models\Answer', 'itinerary_id', ['alias' => 'Answer']);
        $this->hasMany('id', 'App\Models\Expense', 'itinerary_id', ['alias' => 'Expense']);
        $this->hasMany('id', 'App\Models\Invoice', 'itinerary_id', ['alias' => 'Invoice']);
        $this->belongsTo('user_created', 'App\Models\User', 'id', ['alias' => 'UserCreated']);
        $this->belongsTo('user_updated', 'App\Models\User', 'id', ['alias' => 'UserUpdated']);
        $this->belongsTo('sync_status_id', 'App\Models\SyncStatus', 'id', ['alias' => 'SyncStatus']);
        $this->belongsTo('user_id', 'App\Models\User', 'id', ['alias' => 'User']);
        $this->belongsTo('itinerary_type_id', 'App\Models\ItineraryType', 'id', ['alias' => 'ItineraryType']);
        $this->belongsTo('client_id', 'App\Models\Client', 'id', ['alias' => 'Client']);
        $this->belongsTo('status_id', 'App\Models\Status', 'id', ['alias' => 'Status']);
        $this->belongsTo('customer_contact_id', 'App\Models\CustomerContact', 'id', ['alias' => 'CustomerContact']);
        $this->belongsTo('customer_id', 'App\Models\Customer', 'id', ['alias' => 'Customer']);
        $this->belongsTo('city_id', 'App\Models\City', 'id', ['alias' => 'City']);
    }

    /**
     * Returns table name mapped in the model.
     *
     * @return string
     */
    public function getSource()
    {
        return 'itinerary';
    }

    /**
     * Allows to query a set of records that match the specified conditions
     *
     * @param mixed $parameters
     * @return Itinerary[]|Itinerary|\Phalcon\Mvc\Model\ResultSetInterface
     */
    public static function find($parameters = null)
    {
        return parent::find($parameters);
    }

    /**
     * Allows to query the first record that match the specified conditions
     *
     * @param mixed $parameters
     * @return Itinerary|\Phalcon\Mvc\Model\ResultInterface
     */
    public static function findFirst($parameters = null)
    {
        return parent::findFirst($parameters);
    }

}
