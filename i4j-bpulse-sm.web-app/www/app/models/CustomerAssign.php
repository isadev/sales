<?php
namespace App\Models;

class CustomerAssign extends BaseModel
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
    protected $user_id;

    /**
     *
     * @var integer
     * @Column(type="integer", length=1, nullable=false)
     */
    protected $status;

    /**
     *
     * @var string
     * @Column(type="string", length=38, nullable=true)
     */
    protected $user_created;

    /**
     *
     * @var string
     * @Column(type="string", nullable=true)
     */
    protected $date_created;

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
    protected $date_updated;

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
     * Method to set the value of field status
     *
     * @param integer $status
     * @return $this
     */
    public function setStatus($status)
    {
        $this->status = $status;

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
     * Returns the value of field user_id
     *
     * @return string
     */
    public function getUserId()
    {
        return $this->user_id;
    }

    /**
     * Returns the value of field status
     *
     * @return integer
     */
    public function getStatus()
    {
        return $this->status;
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
     * Returns the value of field date_created
     *
     * @return string
     */
    public function getDateCreated()
    {
        return $this->date_created;
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
     * Returns the value of field date_updated
     *
     * @return string
     */
    public function getDateUpdated()
    {
        return $this->date_updated;
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
        $this->setSource("customer_assign");
        $this->belongsTo('customer_id', 'App\Models\Customer', 'id', ['alias' => 'Customer']);
        $this->belongsTo('user_id', 'App\Models\User', 'id', ['alias' => 'User']);
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
        return 'customer_assign';
    }

    /**
     * Allows to query a set of records that match the specified conditions
     *
     * @param mixed $parameters
     * @return CustomerAssign[]|CustomerAssign|\Phalcon\Mvc\Model\ResultSetInterface
     */
    public static function find($parameters = null)
    {
        return parent::find($parameters);
    }

    /**
     * Allows to query the first record that match the specified conditions
     *
     * @param mixed $parameters
     * @return CustomerAssign|\Phalcon\Mvc\Model\ResultInterface
     */
    public static function findFirst($parameters = null)
    {
        return parent::findFirst($parameters);
    }

}
