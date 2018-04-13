<?php
namespace App\Models;
class City extends \Phalcon\Mvc\Model
{

    /**
     *
     * @var integer
     * @Primary
     * @Identity
     * @Column(type="integer", length=11, nullable=false)
     */
    protected $id;

    /**
     *
     * @var string
     * @Column(type="string", length=255, nullable=false)
     */
    protected $name;

    /**
     *
     * @var integer
     * @Column(type="integer", length=11, nullable=false)
     */
    protected $province_id;

    /**
     * Method to set the value of field id
     *
     * @param integer $id
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
     * Method to set the value of field province_id
     *
     * @param integer $province_id
     * @return $this
     */
    public function setProvinceId($province_id)
    {
        $this->province_id = $province_id;

        return $this;
    }

    /**
     * Returns the value of field id
     *
     * @return integer
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
     * Returns the value of field province_id
     *
     * @return integer
     */
    public function getProvinceId()
    {
        return $this->province_id;
    }

    /**
     * Initialize method for model.
     */
    public function initialize()
    {
        $this->setSchema("salesDB");
        $this->setSource("city");
        $this->hasMany('id', 'App\Models\Client', 'city_id', ['alias' => 'Client']);
        $this->hasMany('id', 'App\Models\Customer', 'city_id', ['alias' => 'Customer']);
        $this->hasMany('id', 'App\Models\Invoice', 'city_id', ['alias' => 'Invoice']);
        $this->hasMany('id', 'App\Models\Itinerary', 'city_id', ['alias' => 'Itinerary']);
        $this->belongsTo('province_id', 'App\Models\Province', 'id', ['alias' => 'Province']);
    }

    /**
     * Returns table name mapped in the model.
     *
     * @return string
     */
    public function getSource()
    {
        return 'city';
    }

    /**
     * Allows to query a set of records that match the specified conditions
     *
     * @param mixed $parameters
     * @return City[]|City|\Phalcon\Mvc\Model\ResultSetInterface
     */
    public static function find($parameters = null)
    {
        return parent::find($parameters);
    }

    /**
     * Allows to query the first record that match the specified conditions
     *
     * @param mixed $parameters
     * @return City|\Phalcon\Mvc\Model\ResultInterface
     */
    public static function findFirst($parameters = null)
    {
        return parent::findFirst($parameters);
    }

}
