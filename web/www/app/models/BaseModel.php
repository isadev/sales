<?php
namespace App\Models;


use Phalcon\Validation;
use Phalcon\Mvc\Model\MetaData\Memory;
use Phalcon\Validation\Validator\Email as EmailValidator;

class BaseModel extends \Phalcon\Mvc\Model
{
    const STATUS_CREATED = 1;
    const STATUS_UPDATED = 2;
    const STATUS_DELETED = 3;
    
    use modelUpdates;
    /**
     * Initialize method for model.
     */
    public function initialize()
    {
        $metaData = new \Phalcon\Mvc\Model\MetaData\Memory();
        $attributes = $metaData->getAttributes($this);
        if(in_array("sync_status_id", $attributes))
        {
            $this->addBehavior(new \Phalcon\Mvc\Model\Behavior\SoftDelete(
                [
                    'field' => 'sync_status_id',
                    'value' => BaseModel::STATUS_DELETED
                ]
            ));
        }
    }
    public function getRelationModel()
    {
        $modelRelations      = $this->getModelsManager()->getRelations(get_class($this));
        $modelRelationsArray = [];

        /**
         * @var ModelRelation $modelRelation
         */
        foreach ($modelRelations as $modelRelation) {
            $options = $modelRelation->getOptions();
            if($modelRelation->getType()==2){
                $modelRelationsArray[] = $options['alias'];
            }
        }

        return $modelRelationsArray;
    }
}
trait modelUpdates 
{
    /** 
     * beforeCreate 
     * 
     * @return void 
     */ 
    public function beforeCreate() 
    {
        $metaData = new Memory();
        $attributes = $metaData->getAttributes($this);
        $request = $this->di->get('request')->getJsonRawBody();
        $fromMobileApp = $this->fromMobileApp(); 

        if(in_array("id", $attributes))
        {
            $this->id = !$fromMobileApp ? trim($this->di->get('guid')->generate(), '{}') : $request->id;
        }
        if(in_array("user_id", $attributes))
        {
            $this->user_id = !$fromMobileApp ? $this->di->get('auth') ? $this->di->get('auth')->getUser()->getId() : null : $request->user_id;
        }
        if(in_array("date_created", $attributes))
        {
            $this->date_created = !$fromMobileApp ? date('Y-m-d H:i:s') : $request->date_created;
        }
        if(in_array("date_updated", $attributes))
        {
            $this->date_updated = !$fromMobileApp ? date('Y-m-d H:i:s') : $request->date_updated;
        }
        if(in_array("client_id", $attributes))
        {
            $this->client_id = !$fromMobileApp ? $this->di->get('auth') ? $this->di->get('auth')->getUser()->getClientId() : null : $request->client_id;
        }
        if(in_array("user_created", $attributes))
        {
            $this->user_created = !$fromMobileApp ? $this->di->get('auth') ? $this->di->get('auth')->getUser()->getId() : null : $request->user_created;
        }
        if(in_array("user_updated", $attributes))
        {
            $this->user_updated = !$fromMobileApp ? $this->di->get('auth') ? $this->di->get('auth')->getUser()->getId() : null : $request->user_updated;
        }
        if(in_array("sync_status_id", $attributes))
        {
            $this->sync_status_id = !$fromMobileApp ? BaseModel::STATUS_CREATED : $request->sync_status_id;
        }
    } 
 
    /** 
     * beforeUpdate 
     * 
     * @return void 
     */ 
    public function beforeUpdate() 
    { 
        $metaData = new Memory();
        $attributes = $metaData->getAttributes($this);

        $this->date_updated = date('Y-m-d H:i:s');
        if(in_array("user_updated", $attributes) && empty($this->user_updated))
        {
            $this->user_updated = $this->di->get('auth') ? $this->di->get('auth')->getUser()->getId() : null;
        }
        if(in_array("sync_status_id", $attributes) && $this->sync_status_id !== BaseModel::STATUS_DELETED)
        {
            $this->sync_status_id = BaseModel::STATUS_UPDATED;
        }
    }

    /** 
     * beforeDelete 
     * 
     * @return void 
     */ 
    public function beforeDelete() 
    { 
        $metaData = new \Phalcon\Mvc\Model\MetaData\Memory();
        $attributes = $metaData->getAttributes($this);
        if(in_array("sync_status_id", $attributes))
        {
            $related = 0;
            foreach ($this->getRelationModel() as $key => $value) {
                $count = count($this->getRelated($value));
                if($count>0){
                    $related = $related + $count;
                }
            }
            if($related>0){
                return false;
            }
        }
    }

    private function fromMobileApp()  
    { 
        $dispatcher = $this->di->get('dispatcher'); 
 
        return $dispatcher->getPreviousControllerName() == 'rest_api'; 
    } 
}
