<?php
namespace App\Library;

use App\Library\ComponentBase;

/**
 * @name: ExceptionsEnums
 * @description:  Class que maneja los Exceptions Enums
 */
class ExceptionsEnums extends ComponentBase
{
    //Definición de Constantes
    const EXC_FIELD_001    = "Field Empty";
    const EXC_FIELD_002    = "Field Invalid";
    const EXC_FIELD_003    = "Field Null";
    const EXC_QUERY_001    = "Not Found";
    const EXC_QUERY_002    = "Register Duplicate";
    const EXC_RQ_001    = "Request Invalid";
    const EXC_RQ_002    = "Method Invalid";
    const EXC_RQ_003    = "Permission Denied";

    /** @var array Asignación de datos a Constantes */
    protected static $excMsg = [
        self::EXC_FIELD_001    => ['exc_field_001','Has ben error, the field is empty'],
        self::EXC_FIELD_002 => ['exc_field_002','Has ben error, the Field is invalid'],
        self::EXC_FIELD_003 => ['exc_field_003','Has ben error, the Field is null'],
        self::EXC_QUERY_001  => ['exc_query_001','Has ben error, the register not found'],
        self::EXC_QUERY_002    => ['exc_query_002','Has ben error, the register is duplicate'],
        self::EXC_RQ_001 => ['exc_rq_001','Has ben error, the request is invalid'],
        self::EXC_RQ_002 => ['exc_rq_002','Has ben error, the request method is invalid'],
        self::EXC_RQ_003  => ['exc_rq_003','Has ben error, you not have authorization']
    ];

    /**
     * @name: getExcMsg
     * @description:  Método que retorna el mensaje de la Excepción
     * @param  string $excShortName
     * @return string
     */
    public static function getExcMsg($excShortName)
    {
        if (!isset(static::$excMsg[$excShortName])) {
            return "Unknown type (".$excShortName.")";
        }

        return static::$excMsg[$excShortName];
    }

    /**
     * @name: getExcEnums
     * @description:  Método que retorna el Array Excepciones
     * @return array
     */
    public static function getExcEnums()
    {
        return static::$excMsg;
    }
}