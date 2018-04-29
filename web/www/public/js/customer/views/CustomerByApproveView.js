/**
 * View de CustomerByApprove
 */
var CustomerByApproveView = BaseView.extend({
    rootTemplate: "customer",
    template:     "content-customer-approve",
    tableId:     "#table-customers_approve",
    formId:        "#form-customer-approve",
    urlList: "/customer_assign/list",
    getTableColums: [
        {"node": "customer_assign", "attribute": "customer"},
        {"node": "customer_assign", "attribute": "seller"},
        {"node": "customer_assign", "attribute": "status"},
        {"node": "customer_assign", "attribute": "date_created"},
        {"node": "customer_assign", "attribute": "date_updated"}
    ],
    getTableColumnDefs: [
        {"target": 0,"visible": false,"searchable": false},
        {"target": 1,"visible": false,"searchable": false},
        {"target": 2,"visible": false,"searchable": false},
        {"target": 3,"visible": false,"searchable": false},
        {"target": 4,"visible": false,"searchable": false},
        {"target": 5,"visible": false,"searchable": false},
        {"target": 5,"visible": true,"searchable": true},
        {"target": 6,"visible": true,"searchable": true},
        {"target": 7,"visible": true,"searchable": true},
        {"target": 7,"visible": true,"searchable": true},
        {"target": 8,"visible": true,"searchable": true}
    ],
    getTableActions: [false, false, false, false, true],
    /**
     * @name initialize_child
     * @description Método de inicialización
     */
    initialize_child: function () {
        var self = this;
    },
    /**
     * @name render
     */
    render:function () {
        var self = this;
        self.loadTemplate({}, function(){
            self.renderTable();
        });
    },
    /**
     * @name onApprove
     */
    onApprove: function (aData, table, rowObject) {
        var callback = function () {
            var model = new CustomerAssignModel(aData);
            model.save("/customer_assign/approve", {},
                {
                    type: "PUT",
                    success: function (data, response) {
                        DomainDataTables.Delete(table, rowObject)
                        DomainAlertMessages.MessageCustom(i18next.t("message:message.pnotify.request.success.title"), i18next.t("message:message.pnotify.request.success.message"), "success");
                    },
                    error: function (model, error) {
                        DomainAlertMessages.MessageCustom(i18next.t("message:message.pnotify.request.error.title"), i18next.t("message:message.pnotify.request.error.message"), "error");
                    }
                });
        }
        DomainAlertMessages.AlertCustom(i18next.t("message:message.alert.title.customer_assign.approve"), i18next.t("message:message.alert.text.customer_assign.approve"), "warning", callback)
    },
    /**
    * @name setTableAttributes
    */
    setTableAttributes: function(data){
        var self = this;
        var rows = _.map(data.domain,function(customer_assign){
            return {
                id: customer_assign.id,
                date_created: customer_assign.date_created,
                user_created: customer_assign.user_created,
                customer: customer_assign.customer.name,
                customer_id: customer_assign.customer_id,
                seller: customer_assign.user.name,
                status: customer_assign.status == 1 ? '<span class="label label-success">' + i18next.t("tables.customer_assign." + ENUMS.GENERAL.INFO.ASSIGN) + '</span>' : '<span class="label label-warning">' + i18next.t("tables.customer_assign." + ENUMS.GENERAL.INFO.PENDDING) + '</span>',
                date_updated: customer_assign.date_updated,
                user_updated: customer_assign.user_updated,
                user_id: customer_assign.user_id
            };
        });
        return rows;
    }
});