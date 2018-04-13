<?php
namespace App\Models;
class ItineraryType extends \Phalcon\Mvc\Model
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
     * @Column(type="string", length=50, nullable=false)
     */
    protected $name;

    /**
     *
     * @var integer
     * @Column(type="integer", length=1, nullable=false)
     */
    protected $with_email_to_contact;

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
     * Method to set the value of field with_email_to_contact
     *
     * @param integer $with_email_to_contact
     * @return $this
     */
    public function setWithEmailToContact($with_email_to_contact)
    {
        $this->with_email_to_contact = $with_email_to_contact;

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
     * Returns the value of field with_email_to_contact
     *
     * @return integer
     */
    public function getWithEmailToContact()
    {
        return $this->with_email_to_contact;
    }

    /**
     * Initialize method for model.
     */
    public function initialize()
    {
        $this->setSchema("salesDB");
        $this->setSource("itinerary_type");
        $this->hasMany('id', 'App\Models\Itinerary', 'itinerary_type_id', ['alias' => 'Itinerary']);
        $this->hasMany('id', 'App\Models\Questionnaire', 'itinerary_type_id', ['alias' => 'Questionnaire']);
    }

    /**
     * Returns table name mapped in the model.
     *
     * @return string
     */
    public function getSource()
    {
        return 'itinerary_type';
    }

    /**
     * Allows to query a set of records that match the specified conditions
     *
     * @param mixed $parameters
     * @return ItineraryType[]|ItineraryType|\Phalcon\Mvc\Model\ResultSetInterface
     */
    public static function find($parameters = null)
    {
        return parent::find($parameters);
    }

    /**
     * Allows to query the first record that match the specified conditions
     *
     * @param mixed $parameters
     * @return ItineraryType|\Phalcon\Mvc\Model\ResultInterface
     */
    public static function findFirst($parameters = null)
    {
        return parent::findFirst($parameters);
    }

}
