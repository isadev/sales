<?php 

use Phalcon\Db\Column;
use Phalcon\Db\Index;
use Phalcon\Db\Reference;
use Phalcon\Mvc\Model\Migration;

/**
 * Class RoleMigration_110
 */
class RoleMigration_110 extends Migration
{
    /**
     * Define the table structure
     *
     * @return void
     */
    public function morph()
    {
        $this->morphTable('role', [
                'columns' => [
                    new Column(
                        'id',
                        [
                            'type' => Column::TYPE_INTEGER,
                            'notNull' => true,
                            'autoIncrement' => true,
                            'size' => 11,
                            'first' => true
                        ]
                    ),
                    new Column(
                        'name',
                        [
                            'type' => Column::TYPE_VARCHAR,
                            'notNull' => true,
                            'size' => 20,
                            'after' => 'id'
                        ]
                    ),
                    new Column(
                        'enable',
                        [
                            'type' => Column::TYPE_INTEGER,
                            'notNull' => true,
                            'size' => 1,
                            'after' => 'name'
                        ]
                    ),
                    new Column(
                        'user_created',
                        [
                            'type' => Column::TYPE_VARCHAR,
                            'size' => 38,
                            'after' => 'enable'
                        ]
                    ),
                    new Column(
                        'date_updated',
                        [
                            'type' => Column::TYPE_DATETIME,
                            'notNull' => true,
                            'size' => 1,
                            'after' => 'user_created'
                        ]
                    ),
                    new Column(
                        'date_created',
                        [
                            'type' => Column::TYPE_DATETIME,
                            'notNull' => true,
                            'size' => 1,
                            'after' => 'date_updated'
                        ]
                    ),
                    new Column(
                        'user_updated',
                        [
                            'type' => Column::TYPE_VARCHAR,
                            'size' => 38,
                            'after' => 'date_created'
                        ]
                    )
                ],
                'indexes' => [
                    new Index('PRIMARY', ['id'], 'PRIMARY'),
                    new Index('role_ibfk_1', ['user_created'], null),
                    new Index('role_ibfk_2', ['user_updated'], null)
                ],
                'references' => [
                    new Reference(
                        'role_ibfk_1',
                        [
                            'referencedTable' => 'user',
                            'referencedSchema' => 'salesDB',
                            'columns' => ['user_created'],
                            'referencedColumns' => ['id'],
                            'onUpdate' => 'SET NULL',
                            'onDelete' => 'SET NULL'
                        ]
                    ),
                    new Reference(
                        'role_ibfk_2',
                        [
                            'referencedTable' => 'user',
                            'referencedSchema' => 'salesDB',
                            'columns' => ['user_updated'],
                            'referencedColumns' => ['id'],
                            'onUpdate' => 'SET NULL',
                            'onDelete' => 'SET NULL'
                        ]
                    )
                ],
                'options' => [
                    'TABLE_TYPE' => 'BASE TABLE',
                    'AUTO_INCREMENT' => '4',
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
        $this->batchInsert('role', [
                'id',
                'name',
                'enable',
                'user_created',
                'date_updated',
                'date_created',
                'user_updated'
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
        $this->batchDelete('role');
    }

}
