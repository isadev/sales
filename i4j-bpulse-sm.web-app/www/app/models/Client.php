<?php
namespace App\Models;

use Phalcon\Validation;
use Phalcon\Validation\Validator\Email as EmailValidator;

class Client extends BaseModel
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
    protected $code;

    /**
     *
     * @var string
     * @Column(type="string", length=50, nullable=false)
     */
    protected $name;

    /**
     *
     * @var string
     * @Column(type="string", length=255, nullable=false)
     */
    protected $custom_image;

    /**
     *
     * @var integer
     * @Column(type="integer", length=1, nullable=true)
     */
    protected $enable;

    /**
     *
     * @var string
     * @Column(type="string", length=50, nullable=false)
     */
    protected $contact_first_name;

    /**
     *
     * @var string
     * @Column(type="string", length=50, nullable=false)
     */
    protected $contact_last_name;

    /**
     *
     * @var string
     * @Column(type="string", length=50, nullable=false)
     */
    protected $phone;

    /**
     *
     * @var string
     * @Column(type="string", length=50, nullable=false)
     */
    protected $address;

    /**
     *
     * @var string
     * @Column(type="string", length=15, nullable=false)
     */
    protected $postel_code;

    /**
     *
     * @var string
     * @Column(type="string", length=50, nullable=false)
     */
    protected $email;

    /**
     *
     * @var string
     * @Column(type="string", length=255, nullable=false)
     */
    protected $bpulse_url;

    /**
     *
     * @var string
     * @Column(type="string", length=255, nullable=false)
     */
    protected $bpulse_app_token;

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
     * @var integer
     * @Column(type="integer", length=11, nullable=true)
     */
    protected $city_id;

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
     * Method to set the value of field custom_image
     *
     * @param string $custom_image
     * @return $this
     */
    public function setCustomImage($custom_image)
    {
        $this->custom_image = $custom_image;

        return $this;
    }

    /**
     * Method to set the value of field enable
     *
     * @param integer $enable
     * @return $this
     */
    public function setEnable($enable)
    {
        $this->enable = $enable;

        return $this;
    }

    /**
     * Method to set the value of field contact_first_name
     *
     * @param string $contact_first_name
     * @return $this
     */
    public function setContactFirstName($contact_first_name)
    {
        $this->contact_first_name = $contact_first_name;

        return $this;
    }

    /**
     * Method to set the value of field contact_last_name
     *
     * @param string $contact_last_name
     * @return $this
     */
    public function setContactLastName($contact_last_name)
    {
        $this->contact_last_name = $contact_last_name;

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
     * Method to set the value of field postel_code
     *
     * @param string $postel_code
     * @return $this
     */
    public function setPostelCode($postel_code)
    {
        $this->postel_code = $postel_code;

        return $this;
    }

    /**
     * Method to set the value of field email
     *
     * @param string $email
     * @return $this
     */
    public function setEmail($email)
    {
        $this->email = $email;

        return $this;
    }

    /**
     * Method to set the value of field bpulse_url
     *
     * @param string $bpulse_url
     * @return $this
     */
    public function setBpulseUrl($bpulse_url)
    {
        $this->bpulse_url = $bpulse_url;

        return $this;
    }

    /**
     * Method to set the value of field bpulse_app_token
     *
     * @param string $bpulse_app_token
     * @return $this
     */
    public function setBpulseAppToken($bpulse_app_token)
    {
        $this->bpulse_app_token = $bpulse_app_token;

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
     * Returns the value of field id
     *
     * @return string
     */
    public function getId()
    {
        return $this->id;
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
     * Returns the value of field name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Returns the value of field custom_image
     *
     * @return string
     */
    public function getCustomImage()
    {
        return $this->custom_image;
    }

    /**
     * Returns the value of field enable
     *
     * @return integer
     */
    public function getEnable()
    {
        return $this->enable;
    }

    /**
     * Returns the value of field contact_first_name
     *
     * @return string
     */
    public function getContactFirstName()
    {
        return $this->contact_first_name;
    }

    /**
     * Returns the value of field contact_last_name
     *
     * @return string
     */
    public function getContactLastName()
    {
        return $this->contact_last_name;
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
     * Returns the value of field postel_code
     *
     * @return string
     */
    public function getPostelCode()
    {
        return $this->postel_code;
    }

    /**
     * Returns the value of field email
     *
     * @return string
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * Returns the value of field bpulse_url
     *
     * @return string
     */
    public function getBpulseUrl()
    {
        return $this->bpulse_url;
    }

    /**
     * Returns the value of field bpulse_app_token
     *
     * @return string
     */
    public function getBpulseAppToken()
    {
        return $this->bpulse_app_token;
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
     * Returns the value of field city_id
     *
     * @return integer
     */
    public function getCityId()
    {
        return $this->city_id;
    }

    /**
     * Validations and business logic
     *
     * @return boolean
     */
    public function validation()
    {
        $validator = new Validation();

        $validator->add(
            'email',
            new EmailValidator(
                [
                    'model'   => $this,
                    'message' => 'Please enter a correct email address',
                ]
            )
        );

        return $this->validate($validator);
    }

    /**
     * Initialize method for model.
     */
    public function initialize()
    {
        $this->setSchema("salesDB");
        $this->setSource("client");
        $this->hasMany('id', 'App\Models\Customer', 'client_id', ['alias' => 'Customer']);
        $this->hasMany('id', 'App\Models\Invoice', 'client_id', ['alias' => 'Invoice']);
        $this->hasMany('id', 'App\Models\Itinerary', 'client_id', ['alias' => 'Itinerary']);
        $this->hasMany('id', 'App\Models\PaymentMethod', 'client_id', ['alias' => 'PaymentMethod']);
        $this->hasMany('id', 'App\Models\Product', 'client_id', ['alias' => 'Product']);
        $this->hasMany('id', 'App\Models\ProductCategory', 'client_id', ['alias' => 'ProductCategory']);
        $this->hasMany('id', 'App\Models\Questionnaire', 'client_id', ['alias' => 'Questionnaire']);
        $this->hasMany('id', 'App\Models\User', 'client_id', ['alias' => 'User']);
        $this->belongsTo('user_updated', 'App\Models\User', 'id', ['alias' => 'UserUpdated']);
        $this->belongsTo('user_created', 'App\Models\User', 'id', ['alias' => 'UserCreated']);
        $this->belongsTo('city_id', 'App\Models\City', 'id', ['alias' => 'City']);
    }

    /**
     * Returns table name mapped in the model.
     *
     * @return string
     */
    public function getSource()
    {
        return 'client';
    }

    /**
     * Allows to query a set of records that match the specified conditions
     *
     * @param mixed $parameters
     * @return Client[]|Client|\Phalcon\Mvc\Model\ResultSetInterface
     */
    public static function find($parameters = null)
    {
        return parent::find($parameters);
    }

    /**
     * Allows to query the first record that match the specified conditions
     *
     * @param mixed $parameters
     * @return Client|\Phalcon\Mvc\Model\ResultInterface
     */
    public static function findFirst($parameters = null)
    {
        return parent::findFirst($parameters);
    }

}
