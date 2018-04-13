/**
 * View de CustomerAssign
 */
var CustomerAssignView = BaseView.extend({
    rootTemplate: "customer",
    template:     "content-customer-assign",
    tableId:     "#table-customers_assign",
    tableInstance:     true,
    formId:        "#form-customer",
    urlList: "/customer_assign/list",
    getTableColums: [
        {"node": "customer_assign", "attribute": "customer"},
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
        {"target": 6,"visible": true,"searchable": true},
        {"target": 7,"visible": true,"searchable": true},
        {"target": 7,"visible": true,"searchable": true},
        {"target": 8,"visible": true,"searchable": true}
    ],
    getTableActions: [false, true, false],
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
            self.buildCustomerNotAssign(
                { selector: '#select_seller', url: '/user/seller_list', placeholder: "<span data-i18n='tables.default.select_all'></span>" },
                { selector: '#select_customer', url: '/customer_assign/not_assign', placeholder: "<span data-i18n='tables.default.select_all'></span>" },
                false
            );
            self.$el.find("#loadCustomers").off("click");
            self.$el.find("#loadCustomers").on("click", function(evt){
                self.loadCustomers(evt);
            });
            self.$el.find("#assignCustomer").off("click");
            self.$el.find("#assignCustomer").on("click", function(evt){
                self.onCreate(evt);
            });
        });
    },
    /**
     * @name onDelete
     */
    onDelete: function (aData, table, rowObject) {
        var callback = function () {
            var model = new CustomerAssignModel(aData);
            model.executeDestroy("/customer_assign/delete", { table: table, rowObject: rowObject });
        }
        DomainAlertMessages.AlertCustom(i18next.t("message:message.alert.title.customer_assign.delete"), i18next.t("message:message.alert.text.customer_assign.delete"), "warning", callback)
    },
    /**
     * @name loadCustomers
     */
    loadCustomers: function (){
        var self = this;
        DomainObject.buttomLoading(self.$el.find("#loadCustomers"), ENUMS.GENERAL.COMPARATION.DISABLE);
        var seller = self.$el.find("#select_seller").val();
        if (seller!==''){
            var template = {
                name: "content-table-customers-assign",
                container: "#container-table-assign"
            }
            self.loadTemplate({}, function () {
                if (typeof (self.tableInstance) == typeof (true))
                    self.urlList = self.urlList + "/" + seller;
                self.renderTable();
                DomainObject.buttomLoading(self.$el.find("#loadCustomers"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.customer.load"));
            }, template);
        }else{
            DomainObject.buttomLoading(self.$el.find("#loadCustomers"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.customer.load"));
            DomainAlertMessages.MessageCustom(i18next.t("message:message.pnotify.data_empty.error.title"), i18next.t("message:message.pnotify.data_empty.error.message"), "error");
        }
    },
    /**
     * @name onCreate
     */
    onCreate: function (evt) {
        var self = this;
        if (self.$el.find("#select_seller").val() !== '' && self.$el.find("#select_customer").val()!==''){            
            var aData = {
                user_id: self.$el.find("#select_seller").val(),
                customer_id: self.$el.find("#select_customer").val()
            };
            var model = new CustomerAssignModel(aData);
    
            model.save("/customer_assign/assign_seller", {},
                {
                    type: "POST",
                    success: function (data, response) {
                        self.$el.find("#select_customer option[value='" + aData.customer_id + "']").remove();
                        DomainObject.buttomLoading(self.$el.find("#assignCustomer"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.customer_assign.create"));
                        // self.reloadSelfTable(true);
                        if (typeof (self.tableInstance) != typeof (true)){
                            var dataRow = self.setTableAttributes(response);
                            var table = self.tableInstance;
                            DomainDataTables.Insert(dataRow[0], table);
                            $("#"+table.settings()[0].sTableId).localize();
                        }
                        DomainAlertMessages.MessageCustom(i18next.t("message:message.pnotify.request.success.title"), i18next.t("message:message.pnotify.request.success.message"), "success");
                        $('#principalModal').modal('hide');
                    },
                    error: function (model, error) {
                        DomainAlertMessages.MessageCustom(i18next.t("message:message.pnotify.request.error.title"), i18next.t("message:message.pnotify.request.error.message"), "error");
                        DomainObject.buttomLoading(self.$el.find("#assignCustomer"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.customer_assign.create"));
                    }
                });
        }else{
            DomainAlertMessages.MessageCustom(i18next.t("message:message.pnotify.data_empty.error.title"), i18next.t("message:message.pnotify.data_empty.error.message"), "error");
        }
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
                status: customer_assign.status == 1 ? '<span class="label label-success">' + i18next.t("tables.customer_assign." + ENUMS.GENERAL.INFO.ASSIGN) + '</span>' : '<span class="label label-warning">' + i18next.t("tables.customer_assign." + ENUMS.GENERAL.INFO.PENDDING) + '</span>',
                date_updated: customer_assign.date_updated,
                user_updated: customer_assign.user_updated,
                user_id: customer_assign.user_id
            };
        });
        return rows;
    }
});