<?php 

use Phalcon\Db\Column;
use Phalcon\Db\Index;
use Phalcon\Db\Reference;
use Phalcon\Mvc\Model\Migration;

/**
 * Class ItineraryMigration_110
 */
class ItineraryMigration_110 extends Migration
{
    /**
     * Define the table structure
     *
     * @return void
     */
    public function morph()
    {
        $this->morphTable('itinerary', [
                'columns' => [
                    new Column(
                        'id',
                        [
                            'type' => Column::TYPE_VARCHAR,
                            'default' => "",
                            'notNull' => true,
                            'size' => 38,
                            'first' => true
                        ]
                    ),
                    new Column(
                        'address',
                        [
                            'type' => Column::TYPE_VARCHAR,
                            'notNull' => true,
                            'size' => 255,
                            'after' => 'id'
                        ]
                    ),
                    new Column(
                        'date_time',
                        [
                            'type' => Column::TYPE_DATETIME,
                            'notNull' => true,
                            'size' => 1,
                            'after' => 'address'
                        ]
                    ),
                    new Column(
                        'city_id',
                        [
                            'type' => Column::TYPE_INTEGER,
                            'size' => 11,
                            'after' => 'date_time'
                        ]
                    ),
                    new Column(
                        'geolocation',
                        [
                            'type' => Column::TYPE_VARCHAR,
                            'size' => 100,
                            'after' => 'city_id'
                        ]
                    ),
                    new Column(
                        'user_created',
                        [
                            'type' => Column::TYPE_VARCHAR,
                            'size' => 38,
                            'after' => 'geolocation'
                        ]
                    ),
                    new Column(
                        'user_updated',
                        [
                            'type' => Column::TYPE_VARCHAR,
                            'size' => 38,
                            'after' => 'user_created'
                        ]
                    ),
                    new Column(
                        'date_created',
                        [
                            'type' => Column::TYPE_DATETIME,
                            'size' => 1,
                            'after' => 'user_updated'
                        ]
                    ),
                    new Column(
                        'date_updated',
                        [
                            'type' => Column::TYPE_DATETIME,
                            'size' => 1,
                            'after' => 'date_created'
                        ]
                    ),
                    new Column(
                        'user_id',
                        [
                            'type' => Column::TYPE_VARCHAR,
                            'size' => 38,
                            'after' => 'date_updated'
                        ]
                    ),
                    new Column(
                        'customer_id',
                        [
                            'type' => Column::TYPE_VARCHAR,
                            'size' => 38,
                            'after' => 'user_id'
                        ]
                    ),
                    new Column(
                        'itinerary_type_id',
                        [
                            'type' => Column::TYPE_INTEGER,
                            'size' => 11,
                            'after' => 'customer_id'
                        ]
                    ),
                    new Column(
                        'status_id',
                        [
                            'type' => Column::TYPE_INTEGER,
                            'size' => 11,
                            'after' => 'itinerary_type_id'
                        ]
                    ),
                    new Column(
                        'customer_contact_id',
                        [
                            'type' => Column::TYPE_VARCHAR,
                            'size' => 38,
                            'after' => 'status_id'
                        ]
                    ),
                    new Column(
                        'client_id',
                        [
                            'type' => Column::TYPE_VARCHAR,
                            'size' => 38,
                            'after' => 'customer_contact_id'
                        ]
                    ),
                    new Column(
                        'observation',
                        [
                            'type' => Column::TYPE_VARCHAR,
                            'size' => 255,
                            'after' => 'client_id'
                        ]
                    )
                ],
                'indexes' => [
                    new Index('PRIMARY', ['id'], 'PRIMARY'),
                    new Index('itinerary_ibfk_9', ['city_id'], null),
                    new Index('itinerary_ibfk_1', ['user_created'], null),
                    new Index('itinerary_ibfk_2', ['user_updated'], null),
                    new Index('itinerary_ibfk_3', ['user_id'], null),
                    new Index('itinerary_ibfk_8', ['customer_id'], null),
                    new Index('itinerary_ibfk_4', ['itinerary_type_id'], null),
                    new Index('itinerary_ibfk_6', ['status_id'], null),
                    new Index('itinerary_ibfk_7', ['customer_contact_id'], null),
                    new Index('itinerary_ibfk_5', ['client_id'], null)
                ],
                'references' => [
                    new Reference(
                        'itinerary_ibfk_1',
                        [
                            'referencedTable' => 'user',
                            'referencedSchema' => 'salesDB',
                            'columns' => ['user_created'],
                            'referencedColumns' => ['id'],
                            'onUpdate' => 'CASCADE',
                            'onDelete' => 'SET NULL'
                        ]
                    ),
                    new Reference(
                        'itinerary_ibfk_2',
                        [
                            'referencedTable' => 'user',
                            'referencedSchema' => 'salesDB',
                            'columns' => ['user_updated'],
                            'referencedColumns' => ['id'],
                            'onUpdate' => 'CASCADE',
                            'onDelete' => 'SET NULL'
                        ]
                    ),
                    new Reference(
                        'itinerary_ibfk_3',
                        [
                            'referencedTable' => 'user',
                            'referencedSchema' => 'salesDB',
                            'columns' => ['user_id'],
                            'referencedColumns' => ['id'],
                            'onUpdate' => 'CASCADE',
                            'onDelete' => 'SET NULL'
                        ]
                    ),
                    new Reference(
                        'itinerary_ibfk_4',
                        [
                            'referencedTable' => 'itinerary_type',
                            'referencedSchema' => 'salesDB',
                            'columns' => ['itinerary_type_id'],
                            'referencedColumns' => ['id'],
                            'onUpdate' => 'CASCADE',
                            'onDelete' => 'SET NULL'
                        ]
                    ),
                    new Reference(
                        'itinerary_ibfk_5',
                        [
                            'referencedTable' => 'client',
                            'referencedSchema' => 'salesDB',
                            'columns' => ['client_id'],
                            'referencedColumns' => ['id'],
                            'onUpdate' => 'CASCADE',
                            'onDelete' => 'SET NULL'
                        ]
                    ),
                    new Reference(
                        'itinerary_ibfk_6',
                        [
                            'referencedTable' => 'status',
                            'referencedSchema' => 'salesDB',
                            'columns' => ['status_id'],
                            'referencedColumns' => ['id'],
                            'onUpdate' => 'CASCADE',
                            'onDelete' => 'SET NULL'
                        ]
                    ),
                    new Reference(
                        'itinerary_ibfk_7',
                        [
                            'referencedTable' => 'customer_contact',
                            'referencedSchema' => 'salesDB',
                            'columns' => ['customer_contact_id'],
                            'referencedColumns' => ['id'],
                            'onUpdate' => 'CASCADE',
                            'onDelete' => 'SET NULL'
                        ]
                    ),
                    new Reference(
                        'itinerary_ibfk_8',
                        [
                            'referencedTable' => 'customer',
                            'referencedSchema' => 'salesDB',
                            'columns' => ['customer_id'],
                            'referencedColumns' => ['id'],
                            'onUpdate' => 'CASCADE',
                            'onDelete' => 'SET NULL'
                        ]
                    ),
                    new Reference(
                        'itinerary_ibfk_9',
                        [
                            'referencedTable' => 'city',
                            'referencedSchema' => 'salesDB',
                            'columns' => ['city_id'],
                            'referencedColumns' => ['id'],
                            'onUpdate' => 'CASCADE',
                            'onDelete' => 'SET NULL'
                        ]
                    )
                ],
                'options' => [
                    'TABLE_TYPE' => 'BASE TABLE',
                    'AUTO_INCREMENT' => '',
                    'ENGINE' => 'InnoDB',
                    'TABLE_COLLATION' => 'utf8_general_ci'
                ],
            ]
        );
    }

    /**
     * Run the migrations
     *
     * @return void
     */
    public function up()
    {
        $this->batchInsert('itinerary', [
                'id',
                'address',
                'date_time',
                'city_id',
                'geolocation',
                'user_created',
                'user_updated',
                'date_created',
                'date_updated',
                'user_id',
                'customer_id',
                'itinerary_type_id',
                'status_id',
                'customer_contact_id',
                'client_id',
                'observation'
            ]
        );
    }

    /**
     * Reverse the migrations
     *
     * @return void
     */
    public function down()
    {
        $this->batchDelete('itinerary');
    }

}
