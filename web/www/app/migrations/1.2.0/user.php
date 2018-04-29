<?php 

use Phalcon\Db\Column;
use Phalcon\Db\Index;
use Phalcon\Db\Reference;
use Phalcon\Mvc\Model\Migration;

/**
 * Class UserMigration_120
 */
class UserMigration_120 extends Migration
{
    /**
     * Define the table structure
     *
     * @return void
     */
    public function morph()
    {
        $this->morphTable('user', [
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
                        'first_name',
                        [
                            'type' => Column::TYPE_VARCHAR,
                            'notNull' => true,
                            'size' => 50,
                            'after' => 'id'
                        ]
                    ),
                    new Column(
                        'last_name',
                        [
                            'type' => Column::TYPE_VARCHAR,
                            'notNull' => true,
                            'size' => 50,
                            'after' => 'first_name'
                        ]
                    ),
                    new Column(
                        'email',
                        [
                            'type' => Column::TYPE_VARCHAR,
                            'notNull' => true,
                            'size' => 255,
                            'after' => 'last_name'
                        ]
                    ),
                    new Column(
                        'password',
                        [
                            'type' => Column::TYPE_VARCHAR,
                            'notNull' => true,
                            'size' => 255,
                            'after' => 'email'
                        ]
                    ),
                    new Column(
                        'salt',
                        [
                            'type' => Column::TYPE_VARCHAR,
                            'size' => 255,
                            'after' => 'password'
                        ]
                    ),
                    new Column(
                        'enabled',
                        [
                            'type' => Column::TYPE_INTEGER,
                            'size' => 1,
                            'after' => 'salt'
                        ]
                    ),
                    new Column(
                        'bpulse_user_token',
                        [
                            'type' => Column::TYPE_VARCHAR,
                            'size' => 255,
                            'after' => 'enabled'
                        ]
                    ),
                    new Column(
                        'google_push_token',
                        [
                            'type' => Column::TYPE_VARCHAR,
                            'size' => 255,
                            'after' => 'bpulse_user_token'
                        ]
                    ),
                    new Column(
                        'user_created',
                        [
                            'type' => Column::TYPE_VARCHAR,
                            'size' => 38,
                            'after' => 'google_push_token'
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
                        'role_id',
                        [
                            'type' => Column::TYPE_INTEGER,
                            'size' => 11,
                            'after' => 'date_updated'
                        ]
                    ),
                    new Column(
                        'client_id',
                        [
                            'type' => Column::TYPE_VARCHAR,
                            'size' => 38,
                            'after' => 'role_id'
                        ]
                    )
                ],
                'indexes' => [
                    new Index('PRIMARY', ['id'], 'PRIMARY'),
                    new Index('user_ibfk_1', ['client_id'], null),
                    new Index('user_ibfk_2', ['user_updated'], null),
                    new Index('user_ibfk_3', ['user_created'], null),
                    new Index('user_ibfk_4', ['role_id'], null)
                ],
                'references' => [
                    new Reference(
                        'user_ibfk_1',
                        [
                            'referencedTable' => 'client',
                            'referencedSchema' => 'salesDB',
                            'columns' => ['client_id'],
                            'referencedColumns' => ['id'],
                            'onUpdate' => 'SET NULL',
                            'onDelete' => 'SET NULL'
                        ]
                    ),
                    new Reference(
                        'user_ibfk_2',
                        [
                            'referencedTable' => 'user',
                            'referencedSchema' => 'salesDB',
                            'columns' => ['user_updated'],
                            'referencedColumns' => ['id'],
                            'onUpdate' => 'SET NULL',
                            'onDelete' => 'SET NULL'
                        ]
                    ),
                    new Reference(
                        'user_ibfk_3',
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
                        'user_ibfk_4',
                        [
                            'referencedTable' => 'role',
                            'referencedSchema' => 'salesDB',
                            'columns' => ['role_id'],
                            'referencedColumns' => ['id'],
                            'onUpdate' => 'SET NULL',
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
        $this->batchInsert('user', [
                'id',
                'first_name',
                'last_name',
                'email',
                'password',
                'salt',
                'enabled',
                'bpulse_user_token',
                'google_push_token',
                'user_created',
                'user_updated',
                'date_created',
                'date_updated',
                'role_id',
                'client_id'
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
        $this->batchDelete('user');
    }

}
