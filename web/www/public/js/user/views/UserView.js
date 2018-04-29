/**
 * View de User
 */
var UserView = BaseView.extend({
    rootTemplate: "user",
    template:     "content-user",
    tableId:     "#table-users",
    formId:        "#form-user",
    urlList: "/user/list",
    urlImpersonate: "/user/impersonate",
    getTableColums: [
        {"node": "users", "attribute": "name"},
        {"node": "users", "attribute": "email"},
        {"node": "users", "attribute": "role_id"},
        {"node": "users", "attribute": "status"}
    ],
    getTableColumnDefs: [
        {"target": 0,"visible": false,"searchable": false},
        {"target": 1,"visible": false,"searchable": false},
        {"target": 2,"visible": true,"searchable": true},
        {"target": 3,"visible": true,"searchable": true},
        {"target": 4,"visible": true,"searchable": true},
        {"target": 5,"visible": true,"searchable": true}
    ],
    getTableActions: [true, true, false, true],
    events: {
        'click #load': 'onLoadDashboard'
    },
    /**
     * @name initialize_child
     * @description Método de inicialización de la Vista Login
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
            var model = new UserModel(aData);
            model.executeDestroy("/user/delete", { table: table, rowObject: rowObject });
        }
        DomainAlertMessages.AlertCustom(i18next.t("message:message.alert.title.users.delete"), i18next.t("message:message.alert.text.users.delete"), "warning", callback);
    },
    /**
     * @name onCreate
     */
    onCreate: function (table) {
        var self = this;
        var form = $(self.formId);
        var aData = self.fromToJSON(self.formId);
        aData = JSON.parse(aData);
        form.find("#enabled").is(":checked") ? aData.enabled = 1 : aData.enabled = 0;
        var model = new UserModel(aData);

        if (form.valid()) {
            model.save("/user/create", {},
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
                        DomainObject.buttomLoading($("#principalModal").find("#modal-btn-save"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.user.create"));
                    }
                });
        } else {
            DomainObject.buttomLoading($("#principalModal").find("#modal-btn-save"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.user.create"));
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
        form.find("#enabled").is(":checked") ? aData.enabled = 1 : aData.enabled = 0;
        var model = new UserModel(aData);

        if (form.valid()) {
            model.save("/user/update", { method: "PUT" },
                {
                    success: function (data, response) {
                        DomainObject.buttomLoading($("#principalModal").find("#modal-btn-save"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.user.edit"));
                        response.domain = [response.domain];
                        var dataRow = self.setTableAttributes(response);
                        DomainDataTables.Update(dataRow[0], table, rowObject);
                        DomainAlertMessages.MessageCustom(i18next.t("message:message.pnotify.request.success.title"), i18next.t("message:message.pnotify.request.success.message"), "success");
                        $('#principalModal').modal('hide');
                    },
                    error: function (model, error) {
                        DomainAlertMessages.MessageCustom(i18next.t("message:message.pnotify.request.error.title"), i18next.t("message:message.pnotify.request.error.message"), "error");
                        DomainObject.buttomLoading($("#principalModal").find("#modal-btn-save"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.user.edit"));
                    }
                });
        } else {
            DomainObject.buttomLoading($("#principalModal").find("#modal-btn-save"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.user.edit"));
        }
    },
    /**
     * @name onImpersonate
     */
    onImpersonate: function (aData){
        var self = this;
        Backbone.ajax({
            contentType: 'application/json',
            dataType: "json",
            type: "POST",
            url: self.urlImpersonate, //Replace your URL here
            data: JSON.stringify({email: aData.email}), //add your data
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
                var literal1 = "modals.title.user.edit";
                var literal2 = "modals.buttons.user.close";
                var literal3 = "modals.buttons.user.edit";
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
                var literal1 = "modals.title.user.create"
                var literal2 = "modals.buttons.user.close"
                var literal3 = "modals.buttons.user.create"            
                var aData = {
                    full_name: "",
                    enabled: "",
                    first_name: "",
                    last_name: "",
                    email: "",
                    status: "",
                    role: {},
                    role_id: "",
                    password: true,
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
            self.loadTemplate({ user: aData }, function(){
                self.buildSelect("#select_role", null, i18next.t("selects.placeholder.select_role"), $('#modal-content-body'), { url: "/role/list", query: "", selected: aData.role.id});
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
        var rows = _.map(data.domain,function(user){
            return {
                name: user.first_name + " " + user.last_name,
                enabled: user.enabled, 
                first_name: user.first_name, 
                last_name: user.last_name, 
                email: user.email, 
                status: user.enabled == 1 ? ENUMS.GENERAL.INFO.ACTIVE : ENUMS.GENERAL.INFO.INACTIVE, 
                role: user.role, 
                role_id: user.role.name, 
                id: user.id 
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
            first_name: {
                required: true,
                minlength: 2,
                maxlength: 50,
                normalizer: function (value) {
                    return $.trim(value);
                }
            },
            role: {
                required: true,
                normalizer: function (value) {
                    return $.trim(value);
                }
            },
            last_name: {
                required: true,
                minlength: 2,
                maxlength: 50,
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
            password: {
                required: true,
                normalizer: function (value) {
                    return $.trim(value);
                }
            },
            repeatepassword: {
                equalTo: "#password"
            }
        };
        self.onSetRulesForm(form, rulesForm);
    },
});
