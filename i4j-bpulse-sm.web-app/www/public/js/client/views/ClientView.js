/**
 * View de Client
 */
var ClientView = BaseView.extend({
    rootTemplate: "client",
    template:     "content-client",
    tableId:     "#table-clients",
    formId:        "#form-client",
    urlList: "/client/list",
    urlImpersonate: "/client/impersonate",
    getTableColums: [
        {"node": "clients", "attribute": "name"},
        {"node": "clients", "attribute": "contact_first_name"},
        {"node": "clients", "attribute": "contact_last_name"},
        {"node": "clients", "attribute": "phone"},
        {"node": "clients", "attribute": "address"},
        {"node": "clients", "attribute": "postel_code"},
        {"node": "clients", "attribute": "email"},
        {"node": "clients", "attribute": "bpulse_url"},
        {"node": "clients", "attribute": "city_id"},
        {"node": "clients", "attribute": "status"}
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
        {"target": 8,"visible": true,"searchable": true},
        {"target": 9,"visible": true,"searchable": true},
        {"target": 10,"visible": true,"searchable": true},
        {"target": 11,"visible": true,"searchable": true},
        {"target": 12,"visible": true,"searchable": true},
        {"target": 13,"visible": true,"searchable": true}
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
        var callback = function(){
            var model = new ClientModel(aData);
            model.executeDestroy("/client/delete", { table: table, rowObject: rowObject});
        }
        DomainAlertMessages.AlertCustom(i18next.t("message:message.alert.title.clients.delete"), i18next.t("message:message.alert.text.clients.delete"), "warning", callback)
    },
    /**
     * @name onCreate
     */
    onCreate: function (table) {
        var self = this;
        var form = $(self.formId);
        var aData = self.fromToJSON(self.formId);
        aData = JSON.parse(aData);
        form.find("#enable").is(":checked") ? aData.enable = 1 : aData.enable = 0;
        var model = new ClientModel(aData);

        if (form.valid()) {
            model.save("/client/create", {},
                {
                    success: function (data, response) {
                        DomainObject.buttomLoading($("#principalModal").find("#modal-btn-save"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.client.create"));
                        response.domain = [response.domain];
                        var dataRow = self.setTableAttributes(response);
                        DomainDataTables.Insert(dataRow[0], table);
                        DomainAlertMessages.MessageCustom(i18next.t("message:message.pnotify.request.success.title"), i18next.t("message:message.pnotify.request.success.message"), "success");
                        $('#principalModal').modal('hide');
                    },
                    error: function (model, error) {
                        DomainAlertMessages.MessageCustom(i18next.t("message:message.pnotify.request.error.title"), i18next.t("message:message.pnotify.request.error.message"), "error");
                        DomainObject.buttomLoading($("#principalModal").find("#modal-btn-save"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.client.create"));
                    }
                });
        } else {
            DomainObject.buttomLoading($("#principalModal").find("#modal-btn-save"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.client.create"));
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
        form.find("#enable").is(":checked") ? aData.enable = 1 : aData.enable = 0;
        var model = new ClientModel(aData);

        if (form.valid()) {
            model.save("/client/update", { method: "PUT" }, 
            {
                success: function (data, response) {
                    DomainObject.buttomLoading($("#principalModal").find("#modal-btn-save"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.client.edit"));
                    response.domain = [response.domain];
                    var dataRow = self.setTableAttributes(response);
                    DomainDataTables.Update(dataRow[0], table, rowObject);
                    DomainAlertMessages.MessageCustom(i18next.t("message:message.pnotify.request.success.title"), i18next.t("message:message.pnotify.request.success.message"), "success");
                    $('#principalModal').modal('hide');
                },
                error: function (model, error) {
                    DomainAlertMessages.MessageCustom(i18next.t("message:message.pnotify.request.error.title"), i18next.t("message:message.pnotify.request.error.message"), "error");
                    DomainObject.buttomLoading($("#principalModal").find("#modal-btn-save"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.client.edit"));
                }
            });
        }else{
            DomainObject.buttomLoading($("#principalModal").find("#modal-btn-save"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.client.edit"));
        }
        //
    },
    /**
     * @name onImpersonate
     */
    onImpersonate: function (aData) {
        var self = this;
        Backbone.ajax({
            contentType: 'application/json',
            dataType: "json",
            type: "POST",
            url: self.urlImpersonate, //Replace your URL here
            data: JSON.stringify({ clientId: aData.id }), //add your data
            success: function (response) {
                //code after success
                app.session.clean();
                BaseRouter.navigate("/home", true);
            },
            error: function () {
                // Code After Erroe
            }
        });
    },
    /**
     * @name renderModal
     */
    renderModal: function (aData, table, rowObject, action){
        var self = this, html="";
        switch (action) {
            case "edit":
                var literal1 = "modals.title.client.edit";
                var literal2 = "modals.buttons.client.close";
                var literal3 = "modals.buttons.client.edit";
                // Contenido del formilario 
                var aData = aData; 
                var template= {
                    name: "content-modal",
                    container: "#modal-content-body"
                }
                self.$el.parent().find("#modal-btn-save").off("click");
                self.$el.parent().find("#modal-btn-save").on("click", function(evt){
                    DomainObject.buttomLoading($(evt.currentTarget), ENUMS.GENERAL.COMPARATION.DISABLE);
                    self.onEdit(table, rowObject)
                });
                break;
            case "create":
                var literal1 = "modals.title.client.create"
                var literal2 = "modals.buttons.client.close"
                var literal3 = "modals.buttons.client.create"            
                var aData = {
                    city: {},
                    province: {},
                    country: {},
                    enable: "",
                    name: "",
                    contact_first_name: "",
                    contact_last_name: "",
                    phone: "",
                    address: "",
                    postel_code: "",
                    email: "",
                    bpulse_url: "",
                    city_id: "",
                    enable: "",
                    id: ""
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
            self.loadTemplate({ client: aData }, function(){
                self.buildSelectlocation(
                    { selector: '#country_select_ajax', url: '/country/list', placeholder: i18next.t("selects.placeholder.select_country")}, 
                    { selector: '#province_select_ajax', url: '/province/list', placeholder: i18next.t("selects.placeholder.select_province")}, 
                    { selector: '#city_select_ajax', url: '/city/list', placeholder: i18next.t("selects.placeholder.select_city")}, 
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
        var rows = _.map(data.domain,function(client){
            return {
                city: client.city,
                province: client.province,
                country: client.country,
                enable: client.enable,
                name: client.name,
                contact_first_name: client.contact_first_name,
                contact_last_name: client.contact_last_name,
                phone: client.phone,
                address: client.address,
                postel_code: client.postel_code,
                email: client.email,
                bpulse_url: client.bpulse_url,
                city_id: client.city.name,
                status: client.enable==1 ? ENUMS.GENERAL.INFO.ACTIVE : ENUMS.GENERAL.INFO.INACTIVE,
                id: client.id
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
            address: {
                required: true,
                minlength: 2,
                maxlength: 50,
                normalizer: function (value) {
                    return $.trim(value);
                }
            },
            bpulse_url: {
                required: true,
                maxlength: 255,
                url: true,
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
            contact_first_name: {
                required: true,
                minlength: 2,
                maxlength: 50,
                normalizer: function (value) {
                    return $.trim(value);
                }
            },
            contact_last_name: {
                required: true,
                minlength: 2,
                maxlength: 50,
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
            email: {
                required: true,
                email: true,
                normalizer: function (value) {
                    return $.trim(value);
                }
            },
            id: {
                required: true,
                normalizer: function (value) {
                    return $.trim(value);
                }
            },
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
                normalizer: function (value) {
                    return $.trim(value);
                }
            },
            postel_code: {
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
        };
        self.onSetRulesForm(form, rulesForm);
    },
});