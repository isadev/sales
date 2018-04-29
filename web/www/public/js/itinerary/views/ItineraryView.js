/**
 * View de Itinerary
 */
var ItineraryView = BaseView.extend({
    rootTemplate: "itinerary",
    template:     "content-itinerary",
    tableId:     "#table-itineraries",
    formId:        "#form-itinerary",
    urlList: "/itinerary/list",
    getTableColums: [
        {"node": "itineraries", "attribute": "address"},
        {"node": "itineraries", "attribute": "date_time"},
        {"node": "itineraries", "attribute": "city_id"},
        {"node": "itineraries", "attribute": "customer_id"},
        {"node": "itineraries", "attribute": "itinerary_type_id"},
        {"node": "itineraries", "attribute": "status_id"},
        {"node": "itineraries", "attribute": "customer_contact_id"}
    ],
    getTableColumnDefs: [
        {"target": 0,"visible": false,"searchable": false},
        {"target": 1,"visible": false,"searchable": false},
        {"target": 2,"visible": false,"searchable": false},
        {"target": 3,"visible": false,"searchable": false},
        {"target": 4,"visible": false,"searchable": false},
        {"target": 5,"visible": false,"searchable": false},
        {"target": 6,"visible": false,"searchable": false},
        {"target": 7,"visible": true,"searchable": true},
        {"target": 8,"visible": true,"searchable": true},
        {"target": 9,"visible": true,"searchable": true},
        {"target": 10,"visible": true,"searchable": true},
        {"target": 11,"visible": true,"searchable": true},
        {"target": 12,"visible": true,"searchable": true},
        {"target": 13,"visible": true,"searchable": true}
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
        });
    },
    /**
     * @name onDelete
     */
    onDelete: function (aData, table, rowObject){
        var callback = function () {
            var model = new ItineraryModel(aData);
            model.executeDestroy("/itinerary/delete", { table: table, rowObject: rowObject });
        }
        DomainAlertMessages.AlertCustom(i18next.t("message:message.alert.title.itineraries.delete"), i18next.t("message:message.alert.text.itineraries.delete"), "warning", callback)
    },
    /**
     * @name onCreate
     */
    onCreate: function (table) {
        var self = this;
        var form = $(self.formId);
        var aData = self.fromToJSON(self.formId);
        aData = JSON.parse(aData);
        var model = new ItineraryModel(aData);

        if (form.valid()) {
            model.save("/itinerary/create", {},
                {
                    success: function (data, response) {
                        DomainObject.buttomLoading($("#principalModal").find("#modal-btn-save"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.itinerary.create"));
                        response.domain = [response.domain];
                        var dataRow = self.setTableAttributes(response);
                        DomainDataTables.Insert(dataRow[0], table);
                        DomainAlertMessages.MessageCustom(i18next.t("message:message.pnotify.request.success.title"), i18next.t("message:message.pnotify.request.success.message"), "success");
                        $('#principalModal').modal('hide');
                    },
                    error: function (model, error) {
                        DomainAlertMessages.MessageCustom(i18next.t("message:message.pnotify.request.error.title"), i18next.t("message:message.pnotify.request.error.message"), "error");
                        DomainObject.buttomLoading($("#principalModal").find("#modal-btn-save"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.itinerary.create"));
                    }
                });
        } else {
            DomainObject.buttomLoading($("#principalModal").find("#modal-btn-save"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.itinerary.create"));
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
        var model = new ItineraryModel(aData);

        if (form.valid()) {
            model.save("/itinerary/update", { method: "PUT" },
                {
                    success: function (data, response) {
                        DomainObject.buttomLoading($("#principalModal").find("#modal-btn-save"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.itinerary.edit"));
                        response.domain = [response.domain];
                        var dataRow = self.setTableAttributes(response);
                        DomainDataTables.Update(dataRow[0], table, rowObject);
                        DomainAlertMessages.MessageCustom(i18next.t("message:message.pnotify.request.success.title"), i18next.t("message:message.pnotify.request.success.message"), "success");
                        $('#principalModal').modal('hide');
                    },
                    error: function (model, error) {
                        DomainAlertMessages.MessageCustom(i18next.t("message:message.pnotify.request.error.title"), i18next.t("message:message.pnotify.request.error.message"), "error");
                        DomainObject.buttomLoading($("#principalModal").find("#modal-btn-save"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.itinerary.edit"));
                    }
                });
        } else {
            DomainObject.buttomLoading($("#principalModal").find("#modal-btn-save"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.itinerary.edit"));
        }
    },
    /**
     * @name renderModal
     */
    renderModal: function (aData, table, rowObject, action){
        var self = this, html="";
        switch (action) {
            case "edit":
                var literal1 = "modals.title.itinerary.edit";
                var literal2 = "modals.buttons.itinerary.close";
                var literal3 = "modals.buttons.itinerary.edit";
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
                var literal1 = "modals.title.itinerary.create"
                var literal2 = "modals.buttons.itinerary.close"
                var literal3 = "modals.buttons.itinerary.create"            
                var aData = {
                    id: "",
                    city: {},
                    province: {},
                    country: {},
                    itinerary_type: {},
                    status: {},
                    customer: {},
                    customer_contact: {},
                    address: "",
                    date_time: "",
                    city_id: "",
                    user_id: "",
                    customer_id: "",
                    itinerary_type_id: "",
                    status_id: "",
                    customer_contact_id: "",
                    observation: ""
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
        self.loadTemplate({ itinerary: aData }, function () {
            self.buildSelectlocation(
                { selector: '#country_select_ajax', url: '/country/list', placeholder: i18next.t("selects.placeholder.select_country") },
                { selector: '#province_select_ajax', url: '/province/list', placeholder: i18next.t("selects.placeholder.select_province") },
                { selector: '#city_select_ajax', url: '/city/list', placeholder: i18next.t("selects.placeholder.select_city") },
                $('#modal-content-body')
            );
            self.buildCustomerContactSelect(
                { selector: '#select_customer', url: '/customer/list', placeholder: i18next.t("selects.placeholder.select_customer") },
                { selector: '#select_customer_contact', url: '/customer_contact/list', placeholder: i18next.t("selects.placeholder.select_customer_contact") },
                $('#modal-content-body')
            );
            $('#datetime_datetimepicker').datetimepicker({
                format: 'DD-MM-YYYY H:m:s',
                locale: i18next.language
            });
            self.buildSelect("#select_itinerary_type", null, i18next.t("selects.placeholder.select_itinerary_type"), $('#modal-content-body'), { url: "/itinerary_type/list", query: "", selected: aData.itinerary_type.id });
            self.buildSelect("#select_status", null, i18next.t("selects.placeholder.select_status"), $('#modal-content-body'), { url: "/status/list", query: "", selected: aData.status.id });
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
        var rows = _.map(data.domain,function(itinerary){
            return {
                id: itinerary.id,
                city: itinerary.city,
                province: itinerary.province,
                country: itinerary.country,
                itinerary_type: itinerary.itinerary_type,
                status: itinerary.status,
                customer: itinerary.customer,
                customer_contact: itinerary.customer_contact,
                address: itinerary.address,
                date_time: self.toISODateTime(itinerary.date_time),
                city_id: itinerary.city.name,
                user_id: itinerary.user_id,
                customer_id: itinerary.customer.name,
                itinerary_type_id: itinerary.itinerary_type.name,
                status_id: itinerary.status.name,
                customer_contact_id: itinerary.customer_contact.name,
                observation: itinerary.observation
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
            itinerary_type: {
                required: true,
                normalizer: function (value) {
                    return $.trim(value);
                }
            },
            status_id: {
                required: true,
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
            customer_id: {
                required: true,
                normalizer: function (value) {
                    return $.trim(value);
                }
            },
            customer_contact_id: {
                required: true,
                normalizer: function (value) {
                    return $.trim(value);
                }
            },
            itinerary_type_id: {
                required: true,
                normalizer: function (value) {
                    return $.trim(value);
                }
            },
            date_time: {
                required: true,
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
            observation: {
                maxlength: 255,
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