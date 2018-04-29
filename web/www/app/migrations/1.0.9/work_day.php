<?php 

use Phalcon\Db\Column;
use Phalcon\Db\Index;
use Phalcon\Db\Reference;
use Phalcon\Mvc\Model\Migration;

/**
 * Class WorkDayMigration_109
 */
class WorkDayMigration_109 extends Migration
{
    /**
     * Define the table structure
     *
     * @return void
     */
    public function morph()
    {
        $this->morphTable('work_day', [
                'columns' => [
                    new Column(
                        'id',
                        [
                            'type' => Column::TYPE_VARCHAR,
                            'notNull' => true,
                            'size' => 38,
                            'first' => true
                        ]
                    ),
                    new Column(
                        'item_type',
                        [
                            'type' => Column::TYPE_VARCHAR,
                            'notNull' => true,
                            'size' => 20,
                            'after' => 'id'
                        ]
                    ),
                    new Column(
                        'start_date',
                        [
                            'type' => Column::TYPE_DATE,
                            'notNull' => true,
                            'size' => 1,
                            'after' => 'item_type'
                        ]
                    ),
                    new Column(
                        'end_date',
                        [
                            'type' => Column::TYPE_DATE,
                            'notNull' => true,
                            'size' => 1,
                            'after' => 'start_date'
                        ]
                    ),
                    new Column(
                        'user_created',
                        [
                            'type' => Column::TYPE_VARCHAR,
                            'size' => 38,
                            'after' => 'end_date'
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
                    )
                ],
                'indexes' => [
                    new Index('PRIMARY', ['id'], 'PRIMARY'),
                    new Index('work_day_ibfk_1', ['user_created'], null),
                    new Index('work_day_ibfk_2', ['user_updated'], null),
                    new Index('work_day_ibfk_3', ['user_id'], null)
                ],
                'references' => [
                    new Reference(
                        'work_day_ibfk_1',
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
                        'work_day_ibfk_2',
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
                        'work_day_ibfk_3',
                        [
                            'referencedTable' => 'user',
                            'referencedSchema' => 'salesDB',
                            'columns' => ['user_id'],
                            'referencedColumns' => ['id'],
                            'onUpdate' => 'CASCADE',
                            'onDelete' => 'CASCADE'
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
        $this->batchInsert('work_day', [
                'id',
                'item_type',
                'start_date',
                'end_date',
                'user_created',
                'user_updated',
                'date_created',
                'date_updated',
                'user_id'
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
        $this->batchDelete('work_day');
    }

}
