/**
 * View de Customer
 */
var CustomerView = BaseView.extend({
    rootTemplate: "customer",
    template:     "content-customer",
    tableId:     "#table-customers",
    formId:        "#form-customer",
    urlList: "/customer/list",
    getTableColums: [
        {"node": "customers", "attribute": "name"},
        {"node": "customers", "attribute": "phone"},
        {"node": "customers", "attribute": "address"},
        {"node": "customers", "attribute": "postal_code"},
        {"node": "customers", "attribute": "city_id"}
    ],
    getTableColumnDefs: [
        {"target": 0,"visible": false,"searchable": false},
        {"target": 1,"visible": false,"searchable": false},
        {"target": 2,"visible": false,"searchable": false},
        {"target": 3,"visible": false,"searchable": false},
        {"target": 4,"visible": true,"searchable": true},
        {"target": 5,"visible": true,"searchable": true},
        {"target": 6,"visible": true,"searchable": true},
        {"target": 7,"visible": true,"searchable": true},
        {"target": 8,"visible": true,"searchable": true}
    ],
    getTableActions: [true, true, false, true],
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
     * @name onDelete
     */
    onDelete: function (aData, table, rowObject){
        var callback = function () {
            var model = new CustomerModel(aData);
            model.executeDestroy("/customer/delete", { table: table, rowObject: rowObject });
        }
        DomainAlertMessages.AlertCustom(i18next.t("message:message.alert.title.customers.delete"), i18next.t("message:message.alert.text.customers.delete"), "warning", callback)
    },
    /**
     * @name onCreate
     */
    onCreate: function (table) {
        var self = this;
        var form = $(self.formId);
        var aData = self.fromToJSON(self.formId);
        aData = JSON.parse(aData);
        var model = new CustomerModel(aData);

        if (form.valid()) {
            model.save("/customer/create", {},
                {
                    success: function (data, response) {
                        DomainObject.buttomLoading($("#principalModal").find("#modal-btn-save"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.customer.create"));
                        response.domain = [response.domain];
                        var dataRow = self.setTableAttributes(response);
                        DomainDataTables.Insert(dataRow[0], table);
                        DomainAlertMessages.MessageCustom(i18next.t("message:message.pnotify.request.success.title"), i18next.t("message:message.pnotify.request.success.message"), "success");
                        $('#principalModal').modal('hide');
                    },
                    error: function (model, error) {
                        DomainAlertMessages.MessageCustom(i18next.t("message:message.pnotify.request.error.title"), i18next.t("message:message.pnotify.request.error.message"), "error");
                        DomainObject.buttomLoading($("#principalModal").find("#modal-btn-save"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.customer.create"));
                    }
                });
        } else {
            DomainObject.buttomLoading($("#principalModal").find("#modal-btn-save"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.customer.create"));
        }
        //
    },
    /**
     * @name onEdit
     */
    onEdit: function (table, rowObject){
        var self = this;
        var form = $(self.formId);
        var aData = self.fromToJSON(self.formId);
        aData = JSON.parse(aData);
        var model = new CustomerModel(aData);

        if (form.valid()) {
            model.save("/customer/update", { method: "PUT" },
                {
                    success: function (data, response) {
                        DomainObject.buttomLoading($("#principalModal").find("#modal-btn-save"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.customer.edit"));
                        response.domain = [response.domain];
                        var dataRow = self.setTableAttributes(response);
                        DomainDataTables.Update(dataRow[0], table, rowObject);
                        DomainAlertMessages.MessageCustom(i18next.t("message:message.pnotify.request.success.title"), i18next.t("message:message.pnotify.request.success.message"), "success");
                        $('#principalModal').modal('hide');
                    },
                    error: function (model, error) {
                        DomainAlertMessages.MessageCustom(i18next.t("message:message.pnotify.request.error.title"), i18next.t("message:message.pnotify.request.error.message"), "error");
                        DomainObject.buttomLoading($("#principalModal").find("#modal-btn-save"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.customer.edit"));
                    }
                });
        } else {
            DomainObject.buttomLoading($("#principalModal").find("#modal-btn-save"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.customer.edit"));
        }
    },
    /**
     * @name renderModal
     */
    renderModal: function (aData, table, rowObject, action){
        var self = this, html="";
        switch (action) {
            case "edit":
                var literal1 = "modals.title.customer.edit";
                var literal2 = "modals.buttons.customer.close";
                var literal3 = "modals.buttons.customer.edit";
                // Contenido del formilario 
                var aData = aData; 
                var template= {
                    name: "content-modal",
                    container: "#modal-content-body"
                }
                self.$el.parent().find("#modal-btn-save").off("click");
                self.$el.parent().find("#modal-btn-save").on("click", function (evt) {
                    DomainObject.buttomLoading($(evt.currentTarget), ENUMS.GENERAL.COMPARATION.DISABLE);
                    self.onEdit(table, rowObject)
                });
                break;
            case "create":
                var literal1 = "modals.title.customer.create"
                var literal2 = "modals.buttons.customer.close"
                var literal3 = "modals.buttons.customer.create"            
                var aData = {
                    id: "",
                    city: {},
                    province: {},
                    country: {},
                    name: "",
                    phone: "",
                    address: "",
                    postal_code: "",
                    nit: "",
                    city_id: ""
                }
                var template = {
                    name: "content-modal",
                    container: "#modal-content-body"
                }
                self.$el.parent().find("#modal-btn-save").off("click");
                self.$el.parent().find("#modal-btn-save").on("click", function (evt) {
                    DomainObject.buttomLoading($(evt.currentTarget), ENUMS.GENERAL.COMPARATION.DISABLE);
                    self.onCreate(table);
                });
                break;
            default:
                console.warn("Not select translate");
                break;
            }
            self.loadTemplate({ customer: aData }, function(){
                self.buildSelectlocation(
                    { selector: '#country_select_ajax', url: '/country/list', placeholder: i18next.t("selects.placeholder.select_country") },
                    { selector: '#province_select_ajax', url: '/province/list', placeholder: i18next.t("selects.placeholder.select_province") },
                    { selector: '#city_select_ajax', url: '/city/list', placeholder: i18next.t("selects.placeholder.select_city") },
                    $('#modal-content-body')
                )
            }, template);
            self.$el.parent().find("#modal-content-body").html(html);
            self.setTextModal(literal1, literal2, literal3);
            $("#principalModal").on('shown.bs.modal', function (event) {
                self.createRulesForm();
            });
            $('#principalModal').modal('show');
    },
    /**
    * @name setTableAttributes
    */
    setTableAttributes: function(data){
        var self = this;
        var rows = _.map(data.domain,function(customer){
            return {
                id: customer.id,
                city: customer.city,
                province: customer.province,
                country: customer.country,
                name: customer.name,
                phone: customer.phone,
                address: customer.address,
                postal_code: customer.postal_code,
                nit: customer.nit,
                city_id: customer.city.name
            };
        });
        return rows;
    },
    /**
     * @name createRulesForm
     */
    createRulesForm: function (aData) {
        var self = this;
        var form = $(self.formId);
        var rulesForm = {
            name: {
                required: true,
                minlength: 2,
                maxlength: 50,
                normalizer: function (value) {
                    return $.trim(value);
                }
            },
            phone: {
                required: true,
                maxlength: 12,
                normalizer: function (value) {
                    return $.trim(value);
                }
            },
            address: {
                required: true,
                maxlength: 150,
                normalizer: function (value) {
                    return $.trim(value);
                }
            },
            postal_code: {
                required: true,
                normalizer: function (value) {
                    return $.trim(value);
                }
            },
            nit: {
                required: true,
                maxlength: 38,
                normalizer: function (value) {
                    return $.trim(value);
                }
            },
            country_id: {
                required: true,
                normalizer: function (value) {
                    return $.trim(value);
                }
            },
            province_id: {
                required: true,
                normalizer: function (value) {
                    return $.trim(value);
                }
            },
            city_id: {
                required: true,
                normalizer: function (value) {
                    return $.trim(value);
                }
            }
        };
        self.onSetRulesForm(form, rulesForm);
    }
});