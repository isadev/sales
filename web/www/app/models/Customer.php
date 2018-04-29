<?php
namespace App\Models;


class Customer extends BaseModel
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
     * @Column(type="string", length=50, nullable=false)
     */
    protected $name;

    /**
     *
     * @var string
     * @Column(type="string", length=12, nullable=false)
     */
    protected $phone;

    /**
     *
     * @var string
     * @Column(type="string", length=150, nullable=false)
     */
    protected $address;

    /**
     *
     * @var string
     * @Column(type="string", length=10, nullable=false)
     */
    protected $postal_code;

    /**
     *
     * @var string
     * @Column(type="string", length=38, nullable=true)
     */
    protected $nit;

    /**
     *
     * @var integer
     * @Column(type="integer", length=11, nullable=true)
     */
    protected $city_id;

    /**
     *
     * @var string
     * @Column(type="string", length=50, nullable=true)
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
    protected $client_id;

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
     * Method to set the value of field name
     *
     * @param string $name
     * @return $this
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Method to set the value of field phone
     *
     * @param string $phone
     * @return $this
     */
    public function setPhone($phone)
    {
        $this->phone = $phone;

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
     * Method to set the value of field postal_code
     *
     * @param string $postal_code
     * @return $this
     */
    public function setPostalCode($postal_code)
    {
        $this->postal_code = $postal_code;

        return $this;
    }

    /**
     * Method to set the value of field nit
     *
     * @param string $nit
     * @return $this
     */
    public function setNit($nit)
    {
        $this->nit = $nit;

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
     * Returns the value of field name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Returns the value of field phone
     *
     * @return string
     */
    public function getPhone()
    {
        return $this->phone;
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
     * Returns the value of field postal_code
     *
     * @return string
     */
    public function getPostalCode()
    {
        return $this->postal_code;
    }

    /**
     * Returns the value of field nit
     *
     * @return string
     */
    public function getNit()
    {
        return $this->nit;
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
     * Returns the value of field client_id
     *
     * @return string
     */
    public function getClientId()
    {
        return $this->client_id;
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
        $this->setSource("customer");
        $this->hasMany('id', 'App\Models\CustomerAssign', 'customer_id', ['alias' => 'CustomerAssign']);
        $this->hasMany('id', 'App\Models\CustomerContact', 'customer_id', ['alias' => 'CustomerContact']);
        $this->hasMany('id', 'App\Models\Invoice', 'customer_id', ['alias' => 'Invoice']);
        $this->hasMany('id', 'App\Models\Itinerary', 'customer_id', ['alias' => 'Itinerary']);
        $this->belongsTo('client_id', 'App\Models\Client', 'id', ['alias' => 'Client']);
        $this->belongsTo('city_id', 'App\Models\City', 'id', ['alias' => 'City']);
        $this->belongsTo('user_created', 'App\Models\User', 'id', ['alias' => 'UserCreated']);
        $this->belongsTo('user_updated', 'App\Models\User', 'id', ['alias' => 'UserUpdated']);
        $this->belongsTo('sync_status_id', 'App\Models\SyncStatus', 'id', ['alias' => 'SyncStatus']);
    }

    /**
     * Returns table name mapped in the model.
     *
     * @return string
     */
    public function getSource()
    {
        return 'customer';
    }

    /**
     * Allows to query a set of records that match the specified conditions
     *
     * @param mixed $parameters
     * @return Customer[]|Customer|\Phalcon\Mvc\Model\ResultSetInterface
     */
    public static function find($parameters = null)
    {
        return parent::find($parameters);
    }

    /**
     * Allows to query the first record that match the specified conditions
     *
     * @param mixed $parameters
     * @return Customer|\Phalcon\Mvc\Model\ResultInterface
     */
    public static function findFirst($parameters = null)
    {
        return parent::findFirst($parameters);
    }
}
