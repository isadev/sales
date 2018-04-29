<?php 

use Phalcon\Db\Column;
use Phalcon\Db\Index;
use Phalcon\Db\Reference;
use Phalcon\Mvc\Model\Migration;

/**
 * Class InvoiceMigration_110
 */
class InvoiceMigration_110 extends Migration
{
    /**
     * Define the table structure
     *
     * @return void
     */
    public function morph()
    {
        $this->morphTable('invoice', [
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
                        'customer_id',
                        [
                            'type' => Column::TYPE_VARCHAR,
                            'size' => 38,
                            'after' => 'id'
                        ]
                    ),
                    new Column(
                        'itinerary_id',
                        [
                            'type' => Column::TYPE_VARCHAR,
                            'size' => 38,
                            'after' => 'customer_id'
                        ]
                    ),
                    new Column(
                        'code',
                        [
                            'type' => Column::TYPE_VARCHAR,
                            'notNull' => true,
                            'size' => 20,
                            'after' => 'itinerary_id'
                        ]
                    ),
                    new Column(
                        'discount',
                        [
                            'type' => Column::TYPE_INTEGER,
                            'notNull' => true,
                            'size' => 11,
                            'after' => 'code'
                        ]
                    ),
                    new Column(
                        'order_date_time',
                        [
                            'type' => Column::TYPE_DATETIME,
                            'notNull' => true,
                            'size' => 1,
                            'after' => 'discount'
                        ]
                    ),
                    new Column(
                        'delivery_date_time',
                        [
                            'type' => Column::TYPE_DATETIME,
                            'notNull' => true,
                            'size' => 1,
                            'after' => 'order_date_time'
                        ]
                    ),
                    new Column(
                        'delivery_address',
                        [
                            'type' => Column::TYPE_VARCHAR,
                            'notNull' => true,
                            'size' => 100,
                            'after' => 'delivery_date_time'
                        ]
                    ),
                    new Column(
                        'city_id',
                        [
                            'type' => Column::TYPE_INTEGER,
                            'size' => 11,
                            'after' => 'delivery_address'
                        ]
                    ),
                    new Column(
                        'user_created',
                        [
                            'type' => Column::TYPE_VARCHAR,
                            'size' => 38,
                            'after' => 'city_id'
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
                        'client_id',
                        [
                            'type' => Column::TYPE_VARCHAR,
                            'size' => 38,
                            'after' => 'date_updated'
                        ]
                    ),
                    new Column(
                        'payment_method_id',
                        [
                            'type' => Column::TYPE_INTEGER,
                            'size' => 11,
                            'after' => 'client_id'
                        ]
                    )
                ],
                'indexes' => [
                    new Index('PRIMARY', ['id'], 'PRIMARY'),
                    new Index('invoice_ibfk_4', ['customer_id'], null),
                    new Index('invoice_ibfk_3', ['itinerary_id'], null),
                    new Index('invoice_ibfk_5', ['city_id'], null),
                    new Index('invoice_ibfk_1', ['user_created'], null),
                    new Index('invoice_ibfk_2', ['user_updated'], null),
                    new Index('invoice_ibfk_7', ['client_id'], null),
                    new Index('invoice_ibfk_6', ['payment_method_id'], null)
                ],
                'references' => [
                    new Reference(
                        'invoice_ibfk_1',
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
                        'invoice_ibfk_2',
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
                        'invoice_ibfk_3',
                        [
                            'referencedTable' => 'itinerary',
                            'referencedSchema' => 'salesDB',
                            'columns' => ['itinerary_id'],
                            'referencedColumns' => ['id'],
                            'onUpdate' => 'CASCADE',
                            'onDelete' => 'SET NULL'
                        ]
                    ),
                    new Reference(
                        'invoice_ibfk_4',
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
                        'invoice_ibfk_5',
                        [
                            'referencedTable' => 'city',
                            'referencedSchema' => 'salesDB',
                            'columns' => ['city_id'],
                            'referencedColumns' => ['id'],
                            'onUpdate' => 'CASCADE',
                            'onDelete' => 'SET NULL'
                        ]
                    ),
                    new Reference(
                        'invoice_ibfk_6',
                        [
                            'referencedTable' => 'payment_method',
                            'referencedSchema' => 'salesDB',
                            'columns' => ['payment_method_id'],
                            'referencedColumns' => ['id'],
                            'onUpdate' => 'CASCADE',
                            'onDelete' => 'SET NULL'
                        ]
                    ),
                    new Reference(
                        'invoice_ibfk_7',
                        [
                            'referencedTable' => 'client',
                            'referencedSchema' => 'salesDB',
                            'columns' => ['client_id'],
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
        $this->batchInsert('invoice', [
                'id',
                'customer_id',
                'itinerary_id',
                'code',
                'discount',
                'order_date_time',
                'delivery_date_time',
                'delivery_address',
                'city_id',
                'user_created',
                'user_updated',
                'date_created',
                'date_updated',
                'client_id',
                'payment_method_id'
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
        $this->batchDelete('invoice');
    }

}
