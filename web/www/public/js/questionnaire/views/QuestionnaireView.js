/**
 * View de Questionnaire
 */
var QuestionnaireView = BaseView.extend({
    rootTemplate: "questionnaire",
    template:     "content-questionnaire",
    tableId:     "#table-questionnaires",
    formId:        "#form-questionnaire",
    urlList: "/questionnaire/list",
    getTableColums: [
        {"node": "questionnaires", "attribute": "label"},
        {"node": "questionnaires", "attribute": "status"},
        {"node": "questionnaires", "attribute": "itinerary_type_id"}
    ],
    getTableColumnDefs: [
        {"target": 0,"visible": false,"searchable": false},
        {"target": 1,"visible": false,"searchable": false},
        {"target": 2,"visible": false,"searchable": false},
        {"target": 3,"visible": true,"searchable": true},
        {"target": 4,"visible": true,"searchable": true},
        {"target": 5,"visible": true,"searchable": true}
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
            var model = new QuestionnaireModel(aData);
            model.executeDestroy("/questionnaire/delete", { table: table, rowObject: rowObject });
        }
        DomainAlertMessages.AlertCustom(i18next.t("message:message.alert.title.questionnaires.delete"), i18next.t("message:message.alert.text.questionnaires.delete"), "warning", callback)
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
        var model = new QuestionnaireModel(aData);

        if (form.valid()) {
            model.save("/questionnaire/create", {},
                {
                    success: function (data, response) {
                        DomainObject.buttomLoading($("#principalModal").find("#modal-btn-save"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.questionnaire.create"));
                        response.domain = [response.domain];
                        var dataRow = self.setTableAttributes(response);
                        DomainDataTables.Insert(dataRow[0], table);
                        DomainAlertMessages.MessageCustom(i18next.t("message:message.pnotify.request.success.title"), i18next.t("message:message.pnotify.request.success.message"), "success");
                        $('#principalModal').modal('hide');
                    },
                    error: function (model, error) {
                        DomainAlertMessages.MessageCustom(i18next.t("message:message.pnotify.request.error.title"), i18next.t("message:message.pnotify.request.error.message"), "error");
                        DomainObject.buttomLoading($("#principalModal").find("#modal-btn-save"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.questionnaire.create"));
                    }
                });
        } else {
            DomainObject.buttomLoading($("#principalModal").find("#modal-btn-save"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.questionnaire.create"));
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
        var model = new QuestionnaireModel(aData);

        if (form.valid()) {
            model.save("/questionnaire/update", { method: "PUT" },
                {
                    success: function (data, response) {
                        DomainObject.buttomLoading($("#principalModal").find("#modal-btn-save"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.questionnaire.edit"));
                        response.domain = [response.domain];
                        var dataRow = self.setTableAttributes(response);
                        DomainDataTables.Update(dataRow[0], table, rowObject);
                        DomainAlertMessages.MessageCustom(i18next.t("message:message.pnotify.request.success.title"), i18next.t("message:message.pnotify.request.success.message"), "success");
                        $('#principalModal').modal('hide');
                    },
                    error: function (model, error) {
                        DomainAlertMessages.MessageCustom(i18next.t("message:message.pnotify.request.error.title"), i18next.t("message:message.pnotify.request.error.message"), "error");
                        DomainObject.buttomLoading($("#principalModal").find("#modal-btn-save"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.questionnaire.edit"));
                    }
                });
        } else {
            DomainObject.buttomLoading($("#principalModal").find("#modal-btn-save"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.questionnaire.edit"));
        }
    },
    /**
     * @name renderModal
     */
    renderModal: function (aData, table, rowObject, action){
        var self = this, html="";
        switch (action) {
            case "edit":
                var literal1 = "modals.title.questionnaire.edit";
                var literal2 = "modals.buttons.questionnaire.close";
                var literal3 = "modals.buttons.questionnaire.edit";
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
                var literal1 = "modals.title.questionnaire.create"
                var literal2 = "modals.buttons.questionnaire.close"
                var literal3 = "modals.buttons.questionnaire.create"            
                var aData = {
                    id: "",
                    itinerary_type: {},
                    label: "",
                    enabled: "",
                    status: "",
                    itinerary_type_id: ""
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
            self.loadTemplate({ questionnaire: aData }, function(){
                self.buildSelect("#select_itinerary_type", null, i18next.t("selects.placeholder.select_itinerary_type"), $('#modal-content-body'), { url: "/itinerary_type/list", query: "", selected: aData.itinerary_type.id });
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
        var rows = _.map(data.domain,function(questionnaire){
            return {
                id: questionnaire.id,
                itinerary_type: questionnaire.itinerary_type,
                label: questionnaire.label,
                enabled: questionnaire.enabled,
                status: questionnaire.enabled == 1 ? ENUMS.GENERAL.INFO.ACTIVE : ENUMS.GENERAL.INFO.INACTIVE,
                itinerary_type_id: questionnaire.itinerary_type.name
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
            label: {
                required: true,
                maxlength: 20,
                normalizer: function (value) {
                    return $.trim(value);
                }
            },
            itinerary_type_id: {
                required: true,
                normalizer: function (value) {
                    return $.trim(value);
                }
            }
        };
        self.onSetRulesForm(form, rulesForm);
    }
});