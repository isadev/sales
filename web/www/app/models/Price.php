<?php
namespace App\Models;

class Price extends BaseModel
{

    /**
     *
     * @var string
     * @Column(type="string", length=38, nullable=true)
     */
    protected $id;

    /**
     *
     * @var double
     * @Column(type="double", nullable=false)
     */
    protected $value;

    /**
     *
     * @var string
     * @Column(type="string", nullable=false)
     */
    protected $start_date;

    /**
     *
     * @var string
     * @Column(type="string", nullable=false)
     */
    protected $end_date;

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
    protected $product_id;

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
     * Method to set the value of field value
     *
     * @param double $value
     * @return $this
     */
    public function setValue($value)
    {
        $this->value = $value;

        return $this;
    }

    /**
     * Method to set the value of field start_date
     *
     * @param string $start_date
     * @return $this
     */
    public function setStartDate($start_date)
    {
        $this->start_date = $start_date;

        return $this;
    }

    /**
     * Method to set the value of field end_date
     *
     * @param string $end_date
     * @return $this
     */
    public function setEndDate($end_date)
    {
        $this->end_date = $end_date;

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
     * Method to set the value of field product_id
     *
     * @param string $product_id
     * @return $this
     */
    public function setProductId($product_id)
    {
        $this->product_id = $product_id;

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
     * Returns the value of field value
     *
     * @return double
     */
    public function getValue()
    {
        return $this->value;
    }

    /**
     * Returns the value of field start_date
     *
     * @return string
     */
    public function getStartDate()
    {
        return $this->start_date;
    }

    /**
     * Returns the value of field end_date
     *
     * @return string
     */
    public function getEndDate()
    {
        return $this->end_date;
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
     * Returns the value of field product_id
     *
     * @return string
     */
    public function getProductId()
    {
        return $this->product_id;
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
        $this->setSource("price");
        $this->belongsTo('product_id', 'App\Models\Product', 'id', ['alias' => 'Product']);
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
        return 'price';
    }

    /**
     * Allows to query a set of records that match the specified conditions
     *
     * @param mixed $parameters
     * @return Price[]|Price|\Phalcon\Mvc\Model\ResultSetInterface
     */
    public static function find($parameters = null)
    {
        return parent::find($parameters);
    }

    /**
     * Allows to query the first record that match the specified conditions
     *
     * @param mixed $parameters
     * @return Price|\Phalcon\Mvc\Model\ResultInterface
     */
    public static function findFirst($parameters = null)
    {
        return parent::findFirst($parameters);
    }

}
