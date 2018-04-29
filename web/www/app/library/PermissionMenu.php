<?php

namespace App\Library;
/**
 * @name: PermissionMenu
 * @description:  Class que maneja los permisos en Menus y sections
 */
class PermissionMenu
{
    //Definición de Constantes MENU
    const CONTROLLERS    = "controllers";
    const SECTION_SYSTEM    = "SECT_SYST";

    protected static $menu_sections = [
        self::SECTION_SYSTEM => [
            "permission" => [1, 2, 3],
            "side_menu" => [
                [
                    "name" => "home",
                    "currentPage" => "home",
                    "icon" => "fa fa-home",
                    "permission" => [1, 2, 3],
                    "child_menu" => []
                ],
                [
                    "name" => "clients",
                    "currentPage" => "clientlist",
                    "icon" => "fa fa-user",
                    "permission" => [1, 2],
                    "child_menu" => []
                ],
                [
                    "name" => "users",
                    "currentPage" => "userlist",
                    "icon" => "fa fa-cog",
                    "permission" => [1, 2],
                    "child_menu" => []
                ],
                [
                    "name" => "products",
                    "currentPage" => "productlist",
                    "icon" => "fa fa-users",
                    "permission" => [1, 2, 3],
                    "child_menu" => []
                ],
                [
                    "name" => "product_categories",
                    "currentPage" => "productcategorylist",
                    "icon" => "fa fa-users",
                    "permission" => [1, 2, 3],
                    "child_menu" => []
                ],
                [
                    "name" => "customers",
                    "currentPage" => "customerlist",
                    "target" => "subPagesCustomer",
                    "icon" => "fa fa-address-card",
                    "permission" => [1, 2, 3],
                    "child_menu" => [
                        [
                            "name" => "customer_list",
                            "permission" => [1, 2, 3]
                        ],
                        [
                            "name" => "approve_customer",
                            "permission" => [1]
                        ],
                        [
                            "name" => "assign_customer",
                            "permission" => [1, 2]
                        ]
                    ]
                ],
                [
                    "name" => "itineraries",
                    "currentPage" => "itinerarylist",
                    "icon" => "fa fa-list-ol",
                    "target" => "subPagesItinerary",
                    "permission" => [1, 2, 3],
                    "child_menu" => [
                        [
                            "name" => "itinerary_list",
                            "permission" => [1, 2, 3]
                        ],
                        [
                            "name" => "itinerary_calendar",
                            "permission" => [1, 2, 3]
                        ]
                    ]
                ],
                [
                    "name" => "questionnaires",
                    "currentPage" => "questionnairelist",
                    "icon" => "fa fa-book",
                    "permission" => [1, 2, 3],
                    "child_menu" => []
                ],
                [
                    "name" => "invoices",
                    "currentPage" => "invoicelist",
                    "icon" => "fa fa-shopping-basket",
                    "permission" => [1, 2, 3],
                    "child_menu" => []
                ],
                [
                    "name" => "sales",
                    "currentPage" => "",
                    "icon" => "fa fa-shopping-bag",
                    "permission" => [1, 2, 3],
                    "child_menu" => []
                ]
            ]
        ]
    ];
    protected static $permission_by_role = [
        self::CONTROLLERS => [
            "email" => [
                "permission" => [1, 2, 3],
                "actions" => [
                    "send" => [
                        "permission" => [1, 2, 3]
                    ]
                ]
            ],
            "answer" => [
                "permission" => [1, 2, 3],
                "actions" => [
                    "list" => [
                        "permission" => [1, 2, 3]
                    ],
                    "create" => [
                        "permission" => [1, 2, 3]
                    ],
                    "update" => [
                        "permission" => [1, 2, 3]
                    ],
                    "delete" => [
                        "permission" => [1, 2, 3]
                    ]
                ]
            ],
            "city" => [
                "permission" => [1, 2, 3],
                "actions" => [
                    "list" => [
                        "permission" => [1, 2, 3]
                    ]
                ]
            ],
            "client" => [
                "permission" => [1],
                "actions" => [
                    "list" => [
                        "permission" => [1]
                    ],
                    "create" => [
                        "permission" => [1]
                    ],
                    "update" => [
                        "permission" => [1]
                    ],
                    "delete" => [
                        "permission" => [1]
                    ],
                    "impersonate" => [
                        "permission" => [1]
                    ],
                    "searchById" => [
                        "permission" => [1]
                    ]
                ]
            ],
            "country" => [
                "permission" => [1, 2, 3],
                "actions" => [
                    "list" => [
                        "permission" => [1, 2, 3]
                    ]
                ]
            ],
            "customer_contact" => [
                "permission" => [1, 2],
                "actions" => [
                    "list" => [
                        "permission" => [1, 2]
                    ],
                    "create" => [
                        "permission" => [1, 2]
                    ],
                    "update" => [
                        "permission" => [1, 2]
                    ],
                    "delete" => [
                        "permission" => [1, 2]
                    ],
                    "searchById" => [
                        "permission" => [1, 2]
                    ]
                ]
            ],
            "customer" => [
                "permission" => [1, 2],
                "actions" => [
                    "list" => [
                        "permission" => [1, 2]
                    ],
                    "create" => [
                        "permission" => [1, 2]
                    ],
                    "update" => [
                        "permission" => [1, 2]
                    ],
                    "delete" => [
                        "permission" => [1, 2]
                    ],
                    "searchById" => [
                        "permission" => [1, 2]
                    ]
                ]
            ],
            "customer_assign" => [
                "permission" => [1, 2],
                "actions" => [
                    "listAssign" => [
                        "permission" => [1, 2]
                    ],
                    "listCustomerNoAssign" => [
                        "permission" => [1, 2]
                    ],
                    "assignSeller" => [
                        "permission" => [1, 2]
                    ],
                    "listAssignComplete" => [
                        "permission" => [1, 2]
                    ],
                    "approve" => [
                        "permission" => [1]
                    ],
                    "deleteAssign" => [
                        "permission" => [1, 2]
                    ]
                ]
            ],
            "expense" => [
                "permission" => [1, 2, 3],
                "actions" => [
                    "list" => [
                        "permission" => [1, 2, 3]
                    ],
                    "create" => [
                        "permission" => [1, 2, 3]
                    ],
                    "update" => [
                        "permission" => [1, 2, 3]
                    ],
                    "delete" => [
                        "permission" => [1, 2, 3]
                    ],
                    "searchById" => [
                        "permission" => [1, 2, 3]
                    ]
                ]
            ],
            "invoice" => [
                "permission" => [1, 2, 3],
                "actions" => [
                    "list" => [
                        "permission" => [1, 2, 3]
                    ],
                    "create" => [
                        "permission" => [1, 2, 3]
                    ],
                    "update" => [
                        "permission" => [1, 2, 3]
                    ],
                    "delete" => [
                        "permission" => [1, 2, 3]
                    ],
                    "searchById" => [
                        "permission" => [1, 2, 3]
                    ]
                ]
            ],
            "invoice_product" => [
                "permission" => [1, 2, 3],
                "actions" => [
                    "list" => [
                        "permission" => [1, 2, 3]
                    ],
                    "create" => [
                        "permission" => [1, 2, 3]
                    ],
                    "update" => [
                        "permission" => [1, 2, 3]
                    ],
                    "delete" => [
                        "permission" => [1, 2, 3]
                    ],
                    "searchById" => [
                        "permission" => [1, 2, 3]
                    ]
                ]
            ],
            "itinerary" => [
                "permission" => [1, 2, 3],
                "actions" => [
                    "list" => [
                        "permission" => [1, 2, 3]
                    ],
                    "create" => [
                        "permission" => [1, 2, 3]
                    ],
                    "update" => [
                        "permission" => [1, 2, 3]
                    ],
                    "delete" => [
                        "permission" => [1, 2, 3]
                    ],
                    "searchById" => [
                        "permission" => [1, 2, 3]
                    ]
                ]
            ],
            "itinerary_type" => [
                "permission" => [1, 2, 3],
                "actions" => [
                    "list" => [
                        "permission" => [1, 2, 3]
                    ]
                ]
            ],
            "observation" => [
                "permission" => [1, 2, 3],
                "actions" => [
                    "create" => [
                        "permission" => [1, 2, 3]
                    ],
                    "update" => [
                        "permission" => [1, 2, 3]
                    ],
                    "delete" => [
                        "permission" => [1, 2, 3]
                    ],
                    "searchById" => [
                        "permission" => [1, 2, 3]
                    ]
                ]
            ],
            "payment_method" => [
                "permission" => [1, 2, 3],
                "actions" => [
                    "list" => [
                        "permission" => [1, 2, 3]
                    ],
                    "create" => [
                        "permission" => [1, 2, 3]
                    ],
                    "update" => [
                        "permission" => [1, 2, 3]
                    ],
                    "delete" => [
                        "permission" => [1, 2, 3]
                    ],
                    "searchById" => [
                        "permission" => [1, 2, 3]
                    ]
                ]
            ],
            "price" => [
                "permission" => [1, 2, 3],
                "actions" => [
                    "list" => [
                        "permission" => [1, 2, 3]
                    ],
                    "create" => [
                        "permission" => [1, 2, 3]
                    ],
                    "update" => [
                        "permission" => [1, 2, 3]
                    ],
                    "delete" => [
                        "permission" => [1, 2, 3]
                    ],
                    "searchById" => [
                        "permission" => [1, 2, 3]
                    ]
                ]
            ],
            "product_category" => [
                "permission" => [1, 2, 3],
                "actions" => [
                    "list" => [
                        "permission" => [1, 2, 3]
                    ],
                    "create" => [
                        "permission" => [1, 2, 3]
                    ],
                    "update" => [
                        "permission" => [1, 2, 3]
                    ],
                    "delete" => [
                        "permission" => [1, 2, 3]
                    ],
                    "searchById" => [
                        "permission" => [1, 2, 3]
                    ]
                ]
            ],
            "product" => [
                "permission" => [1, 2, 3],
                "actions" => [
                    "list" => [
                        "permission" => [1, 2, 3]
                    ],
                    "create" => [
                        "permission" => [1, 2, 3]
                    ],
                    "update" => [
                        "permission" => [1, 2, 3]
                    ],
                    "delete" => [
                        "permission" => [1, 2, 3]
                    ],
                    "searchById" => [
                        "permission" => [1, 2, 3]
                    ]
                ]
            ],
            "province" => [
                "permission" => [1, 2, 3],
                "actions" => [
                    "list" => [
                        "permission" => [1, 2, 3]
                    ]
                ]
            ],
            "question" => [
                "permission" => [1, 2, 3],
                "actions" => [
                    "list" => [
                        "permission" => [1, 2, 3]
                    ],
                    "create" => [
                        "permission" => [1, 2, 3]
                    ],
                    "update" => [
                        "permission" => [1, 2, 3]
                    ],
                    "delete" => [
                        "permission" => [1, 2, 3]
                    ],
                    "searchById" => [
                        "permission" => [1, 2, 3]
                    ]
                ]
            ],
            "questionnaire" => [
                "permission" => [1, 2, 3],
                "actions" => [
                    "list" => [
                        "permission" => [1, 2, 3]
                    ],
                    "create" => [
                        "permission" => [1, 2, 3]
                    ],
                    "update" => [
                        "permission" => [1, 2, 3]
                    ],
                    "delete" => [
                        "permission" => [1, 2, 3]
                    ],
                    "searchById" => [
                        "permission" => [1, 2, 3]
                    ]
                ]
            ],
            "role" => [
                "permission" => [1, 2],
                "actions" => [
                    "list" => [
                        "permission" => [1, 2]
                    ]
                ]
            ],
            "status" => [
                "permission" => [1, 2, 3],
                "actions" => [
                    "list" => [
                        "permission" => [1, 2, 3]
                    ]
                ]
            ],
            "user" => [
                "permission" => [1, 2],
                "actions" => [
                    "list" => [
                        "permission" => [1, 2]
                    ],
                    "create" => [
                        "permission" => [1]
                    ],
                    "update" => [
                        "permission" => [1]
                    ],
                    "delete" => [
                        "permission" => [1]
                    ],
                    "impersonate" => [
                        "permission" => [1]
                    ],
                    "searchById" => [
                        "permission" => [1]
                    ],
                    "sellerList" => [
                        "permission" => [1, 2]
                    ]
                ]
            ],
            "workday" => [
                "permission" => [1, 2, 3],
                "actions" => [
                    "list" => [
                        "permission" => [1, 2, 3]
                    ],
                    "create" => [
                        "permission" => [1, 2, 3]
                    ],
                    "update" => [
                        "permission" => [1, 2, 3]
                    ],
                    "delete" => [
                        "permission" => [1, 2, 3]
                    ],
                    "searchById" => [
                        "permission" => [1, 2, 3]
                    ]
                ]
            ]
        ]
    ];
    /**
     * @name: getSectionByName
     * @description:  Método que retorna el la section por Nombre
     * @param  string $sectionShortMame
     * @return string
     */
    public static function getSectionByName($sectionShortMame)
    {
        if (!isset(static::$menu_sections[$sectionShortMame])) {
            return "Unknown type (".$sectionShortMame.")";
        }

        return static::$menu_sections[$sectionShortMame];
    }

    /**
     * @name: getSections
     * @description:  Método que retorna el Array Sections
     * @return array
     */
    public static function getSections()
    {
        return static::$menu_sections;
    }

    /**
     * @name: getSectionsByRole
     * @description:  Método que retorna el Array Sections
     * @return array
     */
    public static function getSectionsByRole($role)
    {
        try{
            $sections = static::$menu_sections;
            $rows = [];
            $sides = [];
            $childs = [];
            foreach ($sections as $key => $value) {
                if(in_array($role, $sections[$key]["permission"])){
                    $name = $key;
                    $rows[$name] = $sections[$key];
                    unset($rows[$name]["permission"]);
                    $sides = [];
                    $counter = 0;
                    foreach ($rows[$name]["side_menu"] as $keySide => $value) {
                        if(in_array($role, $rows[$name]["side_menu"][$keySide]["permission"])){
                            $sides[$counter] = $rows[$name]["side_menu"][$keySide];
                            unset($sides[$counter]["permission"]);
                            $childs = [];
                            $counter2 = 0;
                            foreach ($sides[$counter]["child_menu"] as $keyChild => $value) {
                                    if(in_array($role, $sides[$counter]["child_menu"][$keyChild]["permission"])){
                                        $childs[$counter2] = $sides[$counter]["child_menu"][$keyChild];
                                        unset($childs[$counter2]["permission"]);
                                        $counter2 ++;
                                    }
                            }
                            $sides[$counter]["child_menu"] = $childs;
                            $counter++;
                        }
                    }
                    $rows[$name]["side_menu"] = $sides;
                }
            }
            return $rows;

        }catch(\Exception $e){
            return $e->getMessage();
        }
    }
    /**
     * @name: getPermissionByRole
     * @description:  Método que retorna true si el usuario tiene permisos en la ruta
     * @return boolean
     */
    public static function getPermissionByRole($role, $controller, $action)
    {
        try{
                $permisionController = in_array($role, static::$permission_by_role[self::CONTROLLERS][$controller]["permission"]);
                $permisionAction = in_array($role, static::$permission_by_role[self::CONTROLLERS][$controller]["actions"][$action]["permission"]);
                $result = $permisionController && $permisionAction ? true : false;
            return $result;

        }catch(\Exception $e){
            return $e->getMessage();
        }
    }
}