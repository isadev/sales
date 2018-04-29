/**
 * View de Invoice
 */
var InvoiceView = BaseView.extend({
    rootTemplate: "invoice",
    template:     "content-invoice",
    tableId:     "#table-invoices",
    formId:        "#form-invoice",
    urlList: "/invoice/list",
    getTableColums: [
        { "node": "invoices", "attribute": "customer_id"},
        { "node": "invoices", "attribute": "itinerary_id"},
        { "node": "invoices", "attribute": "code"},
        { "node": "invoices", "attribute": "discount"},
        { "node": "invoices", "attribute": "order_date_time"},
        { "node": "invoices", "attribute": "delivery_date_time"},
        { "node": "invoices", "attribute": "delivery_address"},
        { "node": "invoices", "attribute": "city_id"},
        { "node": "invoices", "attribute": "delivery_date_time"},
        { "node": "invoices", "attribute": "payment_method_id" }
    ],
    getTableColumnDefs: [
        {"target": 0,"visible": false,"searchable": false},
        {"target": 1,"visible": false,"searchable": false},
        {"target": 2,"visible": false,"searchable": false},
        {"target": 3,"visible": false,"searchable": false},
        {"target": 3,"visible": false,"searchable": false},
        {"target": 4,"visible": false,"searchable": false},
        {"target": 5,"visible": true,"searchable": true},
        {"target": 6,"visible": true,"searchable": true},
        {"target": 7,"visible": true,"searchable": true},
        {"target": 8,"visible": true,"searchable": true},
        {"target": 9,"visible": true,"searchable": true},
        {"target": 10,"visible": true,"searchable": true},
        {"target": 11,"visible": true,"searchable": true},
        {"target": 12,"visible": true,"searchable": true},
        {"target": 13,"visible": true,"searchable": true},
        {"target": 14,"visible": true,"searchable": true}
    ],
    getTableActions: [true, true],
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
            var selected = [];
            self.$el.find(self.tableId).on('dblclick', 'tr', function (evt) {
                var nRow = $(evt.currentTarget)[0];
                var aData = self.$el.find(self.tableId).DataTable().row(nRow).data();
                BaseRouter.navigate("/invoice_details/" + aData.id, true);
            });
        });
    },
    /**
     * @name onDelete
     */
    onDelete: function (aData, table, rowObject){
        var callback = function () {
            var model = new InvoiceModel(aData);
            model.executeDestroy("/invoice/delete", { table: table, rowObject: rowObject });
        }
        DomainAlertMessages.AlertCustom(i18next.t("message:message.alert.title.invoices.delete"), i18next.t("message:message.alert.text.invoices.delete"), "warning", callback)
    },
    /**
     * @name onCreate
     */
    onCreate: function (table) {
        var self = this;
        var form = $(self.formId);
        var aData = self.fromToJSON(self.formId);
        aData = JSON.parse(aData);
        var model = new InvoiceModel(aData);

        if (form.valid()) {
            model.save("/invoice/create", {},
                {
                    success: function (data, response) {
                        DomainObject.buttomLoading($("#principalModal").find("#modal-btn-save"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.invoice.create"));
                        response.domain = [response.domain];
                        var dataRow = self.setTableAttributes(response);
                        DomainDataTables.Insert(dataRow[0], table);
                        DomainAlertMessages.MessageCustom(i18next.t("message:message.pnotify.request.success.title"), i18next.t("message:message.pnotify.request.success.message"), "success");
                        $('#principalModal').modal('hide');
                    },
                    error: function (model, error) {
                        DomainAlertMessages.MessageCustom(i18next.t("message:message.pnotify.request.error.title"), i18next.t("message:message.pnotify.request.error.message"), "error");
                        DomainObject.buttomLoading($("#principalModal").find("#modal-btn-save"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.invoice.create"));
                    }
                });
        } else {
            DomainObject.buttomLoading($("#principalModal").find("#modal-btn-save"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.invoice.create"));
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
        var model = new InvoiceModel(aData);

        if (form.valid()) {
            model.save("/invoice/update", { method: "PUT" },
                {
                    success: function (data, response) {
                        DomainObject.buttomLoading($("#principalModal").find("#modal-btn-save"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.invoice.edit"));
                        response.domain = [response.domain];
                        var dataRow = self.setTableAttributes(response);
                        DomainDataTables.Update(dataRow[0], table, rowObject);
                        DomainAlertMessages.MessageCustom(i18next.t("message:message.pnotify.request.success.title"), i18next.t("message:message.pnotify.request.success.message"), "success");
                        $('#principalModal').modal('hide');
                    },
                    error: function (model, error) {
                        DomainAlertMessages.MessageCustom(i18next.t("message:message.pnotify.request.error.title"), i18next.t("message:message.pnotify.request.error.message"), "error");
                        DomainObject.buttomLoading($("#principalModal").find("#modal-btn-save"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.invoice.edit"));
                    }
                });
        } else {
            DomainObject.buttomLoading($("#principalModal").find("#modal-btn-save"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.invoice.edit"));
        }
    },
    /**
     * @name renderModal
     */
    renderModal: function (aData, table, rowObject, action){
        var self = this, html="";
        switch (action) {
            case "edit":
                var literal1 = "modals.title.invoice.edit";
                var literal2 = "modals.buttons.invoice.close";
                var literal3 = "modals.buttons.invoice.edit";
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
                var literal1 = "modals.title.invoice.create"
                var literal2 = "modals.buttons.invoice.close"
                var literal3 = "modals.buttons.invoice.create"            
                var aData = {
                    customer_id: "",
                    itinerary_id: "",
                    code: "",
                    discount: "",
                    order_date_time: "",
                    delivery_date_time: "",
                    delivery_address: "",
                    city_id: "",
                    payment_method_id: ""
                }
                var template = {
                    name: "content-modal",
                    container: "#modal-content-body"
                }
                self.$el.parent().find("#modal-btn-save").off("click");
                break;
            default:
                console.warn("Not select translate");
                break;
            }
            self.loadTemplate({ invoice: aData }, function(){
                self.buildSelectlocation(
                    { selector: '#country_select_ajax', url: '/country/list', placeholder: i18next.t("selects.placeholder.select_country") },
                    { selector: '#province_select_ajax', url: '/province/list', placeholder: i18next.t("selects.placeholder.select_province") },
                    { selector: '#city_select_ajax', url: '/city/list', placeholder: i18next.t("selects.placeholder.select_city") },
                    $('#modal-content-body')
                );
                self.buildSelect("#select_customer", null, i18next.t("selects.placeholder.select_customer"), $('#modal-content-body'), { url: "/customer/list", query: "", selected: aData.customer.id }); 
                $('#order_date_time_datetimepicker, #delivery_date_time_datetimepicker').datetimepicker({
                    format: 'DD-MM-YYYY H:m:s',
                    locale: i18next.language
                });
                self.buildSelect("#select_payment_method", null, i18next.t("selects.placeholder.select_payment_method"), $('#modal-content-body'), { url: "/payment_method/list", query: "", selected: aData.payment_method.id }); 
                self.buildSelect("#select_itinerary", null, i18next.t("selects.placeholder.select_itinerary"), $('#modal-content-body'), { url: "/itinerary/list", query: "", selected: aData.itinerary_id }); 
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
        var rows = _.map(data.domain,function(invoice){
            return {
                id: invoice.id,
                customer: invoice.customer,
                city: invoice.city,
                province: invoice.province,
                country: invoice.country,
                payment_method: invoice.payment_method,
                customer_id: invoice.customer.name,
                itinerary_id: invoice.itinerary_id,
                code: invoice.code,
                discount: invoice.discount,
                order_date_time: invoice.order_date_time,
                delivery_date_time: invoice.delivery_date_time,
                delivery_address: invoice.delivery_address,
                city_id: invoice.city.name,
                delivery_date_time: invoice.delivery_date_time,
                payment_method_id: invoice.payment_method.name
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
            customer_id: {
                required: true,
                normalizer: function (value) {
                    return $.trim(value);
                }
            },
            code: {
                required: true,
                maxlength: 20,
                normalizer: function (value) {
                    return $.trim(value);
                }
            },
            itinerary_id: {
                required: true,
                normalizer: function (value) {
                    return $.trim(value);
                }
            },
            discount: {
                required: true,
                maxlength: 11,
                normalizer: function (value) {
                    return $.trim(value);
                }
            },
            order_date_time: {
                required: true,
                normalizer: function (value) {
                    return $.trim(value);
                }
            },
            delivery_date_time: {
                required: true,
                normalizer: function (value) {
                    return $.trim(value);
                }
            },
            delivery_address: {
                required: true,
                maxlength: 100,
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
            },
            payment_method_id: {
                required: true,
                normalizer: function (value) {
                    return $.trim(value);
                }
            }
        };
        self.onSetRulesForm(form, rulesForm);
    }
});