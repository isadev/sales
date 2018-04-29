<?php
namespace App\Models;


class Questionnaire extends BaseModel
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
     * @Column(type="string", length=20, nullable=false)
     */
    protected $label;

    /**
     *
     * @var integer
     * @Column(type="integer", length=1, nullable=true)
     */
    protected $enabled;

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
    protected $itinerary_type_id;

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
    protected $questionnaire_type_id;

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
     * Method to set the value of field label
     *
     * @param string $label
     * @return $this
     */
    public function setLabel($label)
    {
        $this->label = $label;

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
     * Method to set the value of field questionnaire_type_id
     *
     * @param integer $questionnaire_type_id
     * @return $this
     */
    public function setQuestionnaireTypeId($questionnaire_type_id)
    {
        $this->questionnaire_type_id = $questionnaire_type_id;

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
     * Returns the value of field label
     *
     * @return string
     */
    public function getLabel()
    {
        return $this->label;
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
     * Returns the value of field itinerary_type_id
     *
     * @return integer
     */
    public function getItineraryTypeId()
    {
        return $this->itinerary_type_id;
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
     * Returns the value of field questionnaire_type_id
     *
     * @return integer
     */
    public function getQuestionnaireTypeId()
    {
        return $this->questionnaire_type_id;
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
        $this->setSource("questionnaire");
        $this->hasMany('id', 'App\Models\Question', 'questionnaire_id', ['alias' => 'Question']);
        $this->belongsTo('itinerary_type_id', 'App\Models\ItineraryType', 'id', ['alias' => 'ItineraryType']);
        $this->belongsTo('client_id', 'App\Models\Client', 'id', ['alias' => 'Client']);
        $this->belongsTo('user_created', 'App\Models\User', 'id', ['alias' => 'UserCreated']);
        $this->belongsTo('user_updated', 'App\Models\User', 'id', ['alias' => 'UserUpdated']);
        $this->belongsTo('questionnaire_type_id', 'App\Models\QuestionnaireType', 'id', ['alias' => 'QuestionnaireType']);
        $this->belongsTo('sync_status_id', 'App\Models\SyncStatus', 'id', ['alias' => 'SyncStatus']);
    }

    /**
     * Returns table name mapped in the model.
     *
     * @return string
     */
    public function getSource()
    {
        return 'questionnaire';
    }

    /**
     * Allows to query a set of records that match the specified conditions
     *
     * @param mixed $parameters
     * @return Questionnaire[]|Questionnaire|\Phalcon\Mvc\Model\ResultSetInterface
     */
    public static function find($parameters = null)
    {
        return parent::find($parameters);
    }

    /**
     * Allows to query the first record that match the specified conditions
     *
     * @param mixed $parameters
     * @return Questionnaire|\Phalcon\Mvc\Model\ResultInterface
     */
    public static function findFirst($parameters = null)
    {
        return parent::findFirst($parameters);
    }
}
