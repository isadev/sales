<?php
namespace App\Models;


use Phalcon\Validation;
use Phalcon\Validation\Validator\Email as EmailValidator;

class User extends BaseModel
{

    const ERR_SECURITY          = -1;
    const ERR_EXISTING_USER     = -2;
    
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
     * @Column(type="string", nullable=true)
     */
    protected $language = "es";

    /**
     *
     * @var string
     * @Column(type="boolean", nullable=true)
     */
    protected $impersonate = false;

    /**
     *
     * @var string
     * @Column(type="string", length=50, nullable=false)
     */
    protected $first_name;

    /**
     *
     * @var string
     * @Column(type="string", length=50, nullable=false)
     */
    protected $last_name;

    /**
     *
     * @var string
     * @Column(type="string", length=255, nullable=false)
     */
    protected $email;

    /**
     *
     * @var string
     * @Column(type="string", length=255, nullable=false)
     */
    protected $password;

    /**
     *
     * @var string
     * @Column(type="string", length=255, nullable=true)
     */
    protected $salt;

    /**
     *
     * @var integer
     * @Column(type="integer", length=1, nullable=true)
     */
    protected $enabled;

    /**
     *
     * @var string
     * @Column(type="string", length=255, nullable=true)
     */
    protected $bpulse_user_token;

    /**
     *
     * @var string
     * @Column(type="string", length=255, nullable=true)
     */
    protected $google_push_token;

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
    protected $role_id;

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
     * Method to set the value of field first_name
     *
     * @param string $first_name
     * @return $this
     */
    public function setFirstName($first_name)
    {
        $this->first_name = $first_name;

        return $this;
    }

    /**
     * Method to set the value of field last_name
     *
     * @param string $last_name
     * @return $this
     */
    public function setLastName($last_name)
    {
        $this->last_name = $last_name;

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
     * Method to set the value of field password
     *
     * @param string $password
     * @return $this
     */
    public function setPassword($password)
    {
        $this->password = $password;

        return $this;
    }

    /**
     * Method to set the value of field salt
     *
     * @param string $salt
     * @return $this
     */
    public function setSalt($salt)
    {
        $this->salt = $salt;

        return $this;
    }

    /**
     * Method to set the value of field enabled
     *
     * @param integer $enabled
     * @return $this
     */
    public function setEnabled($enabled)
    {
        $this->enabled = $enabled;

        return $this;
    }

    /**
     * Method to set the value of field bpulse_user_token
     *
     * @param string $bpulse_user_token
     * @return $this
     */
    public function setBpulseUserToken($bpulse_user_token)
    {
        $this->bpulse_user_token = $bpulse_user_token;

        return $this;
    }

    /**
     * Method to set the value of field google_push_token
     *
     * @param string $google_push_token
     * @return $this
     */
    public function setGooglePushToken($google_push_token)
    {
        $this->google_push_token = $google_push_token;

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
     * Method to set the value of field role_id
     *
     * @param integer $role_id
     * @return $this
     */
    public function setRoleId($role_id)
    {
        $this->role_id = $role_id;

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
     * Method to set the value of field language
     *
     * @param string $language
     * @return $this
     */
    public function setLanguage($language)
    {
        $this->language = $language;
        return $this;
    }
    /**
     * Method to set the value of field impersonate
     *
     * @param string $impersonate
     * @return $this
     */
    public function setImpersonate($impersonate)
    {
        $this->impersonate = $impersonate;
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
     * Returns the value of field first_name
     *
     * @return string
     */
    public function getFirstName()
    {
        return $this->first_name;
    }

    /**
     * Returns the value of field last_name
     *
     * @return string
     */
    public function getLastName()
    {
        return $this->last_name;
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
     * Returns the value of field password
     *
     * @return string
     */
    public function getPassword()
    {
        return $this->password;
    }

    /**
     * Returns the value of field salt
     *
     * @return string
     */
    public function getSalt()
    {
        return $this->salt;
    }

    /**
     * Returns the value of field enabled
     *
     * @return integer
     */
    public function getEnabled()
    {
        return $this->enabled;
    }

    /**
     * Returns the value of field bpulse_user_token
     *
     * @return string
     */
    public function getBpulseUserToken()
    {
        return $this->bpulse_user_token;
    }

    /**
     * Returns the value of field google_push_token
     *
     * @return string
     */
    public function getGooglePushToken()
    {
        return $this->google_push_token;
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
     * Returns the value of field role_id
     *
     * @return integer
     */
    public function getRoleId()
    {
        return $this->role_id;
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
     * Returns the value of field language
     *
     * @return string
     */
    public function getLanguage()
    {
        return $this->language;
    }
    
    /**
     * Returns the value of field impersonate
     *
     * @return string
     */
    public function getImpersonate()
    {
        return $this->impersonate;
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
       $this->skipAttributes(
            [
                'language',
                'impersonate'
            ]
        );

        parent::initialize();
        $this->setSchema("salesDB");
        $this->setSource("user");
        $this->hasMany('id', 'App\Models\Answer', 'user_created', ['alias' => 'AnswerUserCreated']);
        $this->hasMany('id', 'App\Models\Answer', 'user_updated', ['alias' => 'AnswerUserUpdated']);
        $this->hasMany('id', 'App\Models\Client', 'user_updated', ['alias' => 'ClientUserUpdated']);
        $this->hasMany('id', 'App\Models\Client', 'user_created', ['alias' => 'ClientUserCreated']);
        $this->hasMany('id', 'App\Models\Customer', 'user_created', ['alias' => 'CustomerUserCreated']);
        $this->hasMany('id', 'App\Models\Customer', 'user_updated', ['alias' => 'CustomerUserUpdated']);
        $this->hasMany('id', 'App\Models\CustomerContact', 'user_created', ['alias' => 'CustomerContactUserCreated']);
        $this->hasMany('id', 'App\Models\CustomerContact', 'user_updated', ['alias' => 'CustomerContactUserUpdated']);
        $this->hasMany('id', 'App\Models\Expense', 'user_id', ['alias' => 'Expenseuser_id']);
        $this->hasMany('id', 'App\Models\Expense', 'user_created', ['alias' => 'ExpenseUserCreated']);
        $this->hasMany('id', 'App\Models\Expense', 'user_updated', ['alias' => 'ExpenseUserUpdated']);
        $this->hasMany('id', 'App\Models\Invoice', 'user_created', ['alias' => 'InvoiceUserCreated']);
        $this->hasMany('id', 'App\Models\Invoice', 'user_updated', ['alias' => 'InvoiceUserUpdated']);
        $this->hasMany('id', 'App\Models\InvoiceProduct', 'user_created', ['alias' => 'InvoiceProductUserCreated']);
        $this->hasMany('id', 'App\Models\InvoiceProduct', 'user_updated', ['alias' => 'InvoiceProductUserUpdated']);
        $this->hasMany('id', 'App\Models\Itinerary', 'user_created', ['alias' => 'ItineraryUserCreated']);
        $this->hasMany('id', 'App\Models\Itinerary', 'user_updated', ['alias' => 'ItineraryUserUpdated']);
        $this->hasMany('id', 'App\Models\Itinerary', 'user_id', ['alias' => 'ItineraryUserId']);
        $this->hasMany('id', 'App\Models\Observation', 'user_created', ['alias' => 'ObservationUserCreated']);
        $this->hasMany('id', 'App\Models\Observation', 'user_updated', ['alias' => 'ObservationUserUpdated']);
        $this->hasMany('id', 'App\Models\Price', 'user_created', ['alias' => 'PriceUserCreated']);
        $this->hasMany('id', 'App\Models\Price', 'user_updated', ['alias' => 'PriceUserUpdated']);
        $this->hasMany('id', 'App\Models\Product', 'user_created', ['alias' => 'ProductUserCreated']);
        $this->hasMany('id', 'App\Models\Product', 'user_updated', ['alias' => 'ProductUserUpdated']);
        $this->hasMany('id', 'App\Models\ProductCategory', 'user_updated', ['alias' => 'ProductCategoryUserUpdated']);
        $this->hasMany('id', 'App\Models\ProductCategory', 'user_created', ['alias' => 'ProductCategoryUserCreated']);
        $this->hasMany('id', 'App\Models\Question', 'user_created', ['alias' => 'QuestionUserCreated']);
        $this->hasMany('id', 'App\Models\Question', 'user_updated', ['alias' => 'QuestionUserUpdated']);
        $this->hasMany('id', 'App\Models\Questionnaire', 'user_created', ['alias' => 'QuestionnaireUserCreated']);
        $this->hasMany('id', 'App\Models\Questionnaire', 'user_updated', ['alias' => 'QuestionnaireUserUpdated']);
        $this->hasMany('id', 'App\Models\Role', 'user_created', ['alias' => 'RoleUserCreated']);
        $this->hasMany('id', 'App\Models\Role', 'user_updated', ['alias' => 'RoleUserUpdated']);
        $this->hasMany('id', 'App\Models\User', 'user_updated', ['alias' => 'UserUserUpdated']);
        $this->hasMany('id', 'App\Models\User', 'user_created', ['alias' => 'UserUserCreated']);
        $this->hasMany('id', 'App\Models\WorkDay', 'user_created', ['alias' => 'WorkDayUserCreated']);
        $this->hasMany('id', 'App\Models\WorkDay', 'user_updated', ['alias' => 'WorkDayUserUpdated']);
        $this->hasMany('id', 'App\Models\WorkDay', 'user_id', ['alias' => 'WorkDayUserId']);
        $this->belongsTo('client_id', 'App\Models\Client', 'id', ['alias' => 'Client']);
        $this->belongsTo('user_updated', 'App\Models\User', 'id', ['alias' => 'UserUpdated']);
        $this->belongsTo('user_created', 'App\Models\User', 'id', ['alias' => 'UserCreate']);
        $this->belongsTo('role_id', 'App\Models\Role', 'id', ['alias' => 'Role']);
        $this->belongsTo('sync_status_id', 'App\Models\SyncStatus', 'id', ['alias' => 'SyncStatus']);
    }

    /**
     * Returns table name mapped in the model.
     *
     * @return string
     */
    public function getSource()
    {
        return 'user';
    }

    /**
     * Allows to query a set of records that match the specified conditions
     *
     * @param mixed $parameters
     * @return User[]|User|\Phalcon\Mvc\Model\ResultSetInterface
     */
    public static function find($parameters = null)
    {
        return parent::find($parameters);
    }

    /**
     * Allows to query the first record that match the specified conditions
     *
     * @param mixed $parameters
     * @return User|\Phalcon\Mvc\Model\ResultInterface
     */
    public static function findFirst($parameters = null)
    {
        return parent::findFirst($parameters);
    }
}
