/**
 * View de ProductCategory
 */
var ProductCategoryView = BaseView.extend({
    rootTemplate: "product_category",
    template:     "content-product_category",
    tableId:     "#table-product_categories",
    formId:        "#form-product_category",
    urlList: "/product_category/list",
    getTableColums: [
        {"node": "product_categories", "attribute": "name"},
        {"node": "product_categories", "attribute": "client_id"}
    ],
    getTableColumnDefs: [
        {"target": 0,"visible": false,"searchable": false},
        {"target": 1,"visible": true,"searchable": true},
        {"target": 2,"visible": true,"searchable": true}
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
            var model = new ProductCategoryModel(aData);
            model.executeDestroy("/product_category/delete", { table: table, rowObject: rowObject });
        }
        DomainAlertMessages.AlertCustom(i18next.t("message:message.alert.title.product_categories.delete"), i18next.t("message:message.alert.text.product_categories.delete"), "warning", callback)
    },
    /**
     * @name onCreate
     */
    onCreate: function (table) {
        var self = this;
        var form = $(self.formId);
        var aData = self.fromToJSON(self.formId);
        aData = JSON.parse(aData);
        var model = new ProductCategoryModel(aData);

        if (form.valid()) {
            model.save("/product_category/create", {},
                {
                    success: function (data, response) {
                        DomainObject.buttomLoading($("#principalModal").find("#modal-btn-save"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.product_category.create"));
                        response.domain = [response.domain];
                        var dataRow = self.setTableAttributes(response);
                        DomainDataTables.Insert(dataRow[0], table);
                        DomainAlertMessages.MessageCustom(i18next.t("message:message.pnotify.request.success.title"), i18next.t("message:message.pnotify.request.success.message"), "success");
                        $('#principalModal').modal('hide');
                    },
                    error: function (model, error) {
                        DomainAlertMessages.MessageCustom(i18next.t("message:message.pnotify.request.error.title"), i18next.t("message:message.pnotify.request.error.message"), "error");
                        DomainObject.buttomLoading($("#principalModal").find("#modal-btn-save"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.product_category.create"));
                    }
                });
        } else {
            DomainObject.buttomLoading($("#principalModal").find("#modal-btn-save"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.product_category.create"));
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
        var model = new ProductCategoryModel(aData);

        if (form.valid()) {
            model.save("/product_category/update", { method: "PUT" },
                {
                    success: function (data, response) {
                        DomainObject.buttomLoading($("#principalModal").find("#modal-btn-save"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.product_category.edit"));
                        response.domain = [response.domain];
                        var dataRow = self.setTableAttributes(response);
                        DomainDataTables.Update(dataRow[0], table, rowObject);
                        DomainAlertMessages.MessageCustom(i18next.t("message:message.pnotify.request.success.title"), i18next.t("message:message.pnotify.request.success.message"), "success");
                        $('#principalModal').modal('hide');
                    },
                    error: function (model, error) {
                        DomainAlertMessages.MessageCustom(i18next.t("message:message.pnotify.request.error.title"), i18next.t("message:message.pnotify.request.error.message"), "error");
                        DomainObject.buttomLoading($("#principalModal").find("#modal-btn-save"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.product_category.edit"));
                    }
                });
        } else {
            DomainObject.buttomLoading($("#principalModal").find("#modal-btn-save"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.product_category.edit"));
        }
    },
    /**
     * @name renderModal
     */
    renderModal: function (aData, table, rowObject, action){
        var self = this, html="";
        switch (action) {
            case "edit":
                var literal1 = "modals.title.product_category.edit";
                var literal2 = "modals.buttons.product_category.close";
                var literal3 = "modals.buttons.product_category.edit";
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
                var literal1 = "modals.title.product_category.create"
                var literal2 = "modals.buttons.product_category.close"
                var literal3 = "modals.buttons.product_category.create"            
                var aData = {
                    id: "",
                    name: "",
                    client_id: ""
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
            self.loadTemplate({ product_category: aData }, null, template);
            self.$el.parent().find("#modal-content-body").html(html);
            self.setTextModal(literal1, literal2, literal3);
            $("#principalModal").on('shown.bs.modal', function (event) {
                self.createRulesForm();
            });
            $('#principalModal').modal('show');
        },
        /**
         * @name renderTable
         */
    renderTable: function(evt){
        var self = this;
        config = {
            "ajax": {
                "url": self.urlList,
                "method": "GET",
                "dataType": "JSON",
                dataSrc: function(data){
                    var rows = _.map(data.domain,function(product_category){
                        return {
                            id: product_category.id,
                            name: product_category.name,
                            client: product_category.client.name
                        };
                    });
                    return rows;
                }
            },
            "info": false,
            "aLengthMenu": [[10, 25, 50, 75, -1], [10, 25, 50, 75, "All"]],
            "columns": [
                { "title": "<span data-i18n='tables.product_categories.name'>name</span>", "name": "name", "data": "name"},
                { "title": "<span data-i18n='tables.product_categories.client_id'>client_id</span>", "name": "client_id", "data": "client"}
            ],
            "columnDefs": [
                {"target": 0,"visible": false,"searchable": false},
                {"target": 1,"visible": true,"searchable": true},
                {"target": 2,"visible": true,"searchable": true}
            ]
        };
        DomainDataTables.initTable(self.tableId, config, self,  [true, true]);
    },
    /**
    * @name setTableAttributes
    */
    setTableAttributes: function(data){
        var self = this;
        var rows = _.map(data.domain,function(product_category){
            return {
                id: product_category.id,
                name: product_category.name,
                client: product_category.client.name
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
            }
        };
        self.onSetRulesForm(form, rulesForm);
    }
});