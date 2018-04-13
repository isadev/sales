/**
 * View de Product
 */
var ProductView = BaseView.extend({
    rootTemplate: "product",
    template:     "content-product",
    tableId:     "#table-products",
    formId:        "#form-product",
    "urlUpload":   "/files/uploads/products",
    urlList: "/product/list",
    getTableColums: [
        {"node": "products", "attribute": "code"},
        {"node": "products", "attribute": "barcode"},
        {"node": "products", "attribute": "name"},
        {"node": "products", "attribute": "image"},
        {"node": "products", "attribute": "product_category_id"},
        {"node": "products", "attribute": "client_id"}
    ],
    getTableColumnDefs: [
        {"target": 0,"visible": false,"searchable": true},
        {"target": 1,"visible": false,"searchable": false},
        {"target": 2,"visible": true,"searchable": true},
        {"target": 3,"visible": true,"searchable": true},
        {"target": 4,"visible": true,"searchable": true},
        {"target": 5,"visible": true,"searchable": true},
        {"target": 6,"visible": true,"searchable": true},
        {"target": 7,"visible": true,"searchable": true},
        {"target": 8,"visible": true,"searchable": true}
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
            var model = new ProductModel(aData);
            model.executeDestroy("/product/delete", { table: table, rowObject: rowObject });
        }
        DomainAlertMessages.AlertCustom(i18next.t("message:message.alert.title.products.delete"), i18next.t("message:message.alert.text.products.delete"), "warning", callback)
    },
    /**
     * @name onCreate
     */
    onCreate: function (table) {
        var self = this;
        var form = $(self.formId);
        var aData = new FormData(form[0]);

        if (form.valid()) {
            if (form.find("#custom_image")[0].files.length>0) {
                Backbone.ajax({
                    type: "POST",
                    url: "/product/create",
                    data: aData,
                    cache: false,
                    dataType: "json",
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        DomainObject.buttomLoading($("#principalModal").find("#modal-btn-save"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.product.create"));
                        var response = [];
                        response.domain = [data.domain];
                        var dataRow = self.setTableAttributes(response);
                        DomainDataTables.Insert(dataRow[0], table);
                        DomainAlertMessages.MessageCustom(i18next.t("message:message.pnotify.request.success.title"), i18next.t("message:message.pnotify.request.success.message"), "success");
                        $('#principalModal').modal('hide');
                    },
                    error: function (model, error) {
                        DomainAlertMessages.MessageCustom(i18next.t("message:message.pnotify.request.error.title"), i18next.t("message:message.pnotify.request.error.message"), "error");
                        DomainObject.buttomLoading($("#principalModal").find("#modal-btn-save"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.product.create"));
                    }
                });
            } else {
                DomainAlertMessages.MessageCustom(i18next.t("message:message.pnotify.upload.error.title"), i18next.t("message:message.pnotify.upload.error.message"), "error");
                DomainObject.buttomLoading($("#principalModal").find("#modal-btn-save"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.product.create"));
            }
        } else {
            DomainObject.buttomLoading($("#principalModal").find("#modal-btn-save"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.product.create"));
        }
    },
    /**
     * @name onEdit
     */
    onEdit: function (table, rowObject){
        var self = this;
        var form = $(self.formId);
        var aData = new FormData(form[0]);

        if (form.valid()) {
            if (form.find("#custom_image")[0].files.length > 0) {
                Backbone.ajax({
                    type: "POST",
                    url: "/product/update",
                    data: aData,
                    cache: false,
                    dataType: "json",
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        DomainObject.buttomLoading($("#principalModal").find("#modal-btn-save"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.product.create"));
                        var response = [];
                        response.domain = [data.domain];
                        var dataRow = self.setTableAttributes(response);
                        DomainDataTables.Update(dataRow[0], table, rowObject);
                        DomainAlertMessages.MessageCustom(i18next.t("message:message.pnotify.request.success.title"), i18next.t("message:message.pnotify.request.success.message"), "success");
                        $('#principalModal').modal('hide');
                    },
                    error: function (model, error) {
                        DomainAlertMessages.MessageCustom(i18next.t("message:message.pnotify.request.error.title"), i18next.t("message:message.pnotify.request.error.message"), "error");
                        DomainObject.buttomLoading($("#principalModal").find("#modal-btn-save"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.product.create"));
                    }
                });
            } else {
                DomainAlertMessages.MessageCustom(i18next.t("message:message.pnotify.upload.error.title"), i18next.t("message:message.pnotify.upload.error.message"), "error");
                DomainObject.buttomLoading($("#principalModal").find("#modal-btn-save"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.product.create"));
            }
        } else {
            DomainObject.buttomLoading($("#principalModal").find("#modal-btn-save"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.product.create"));
        }
    },
    /**
     * @name renderModal
     */
    renderModal: function (aData, table, rowObject, action){
        var self = this, html="";
        switch (action) {
            case "edit":
                var literal1 = "modals.title.product.edit";
                var literal2 = "modals.buttons.product.close";
                var literal3 = "modals.buttons.product.edit";
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
                var literal1 = "modals.title.product.create"
                var literal2 = "modals.buttons.product.close"
                var literal3 = "modals.buttons.product.create"            
                var aData = {
                    id: "",
                    client: {},
                    product_category: {},
                    code: "",
                    barcode: "",
                    name: "",
                    image: "",
                    custom_image: "",
                    product_category_id: "",
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
            self.loadTemplate({ product: aData }, function(){
                var image = aData.custom_image && self.fileExist(self.urlUpload + "/"+aData.id + "/" + aData.custom_image) ? self.urlUpload+"/"+aData.id +"/"+aData.custom_image : "/img/camera_icon.png";
                var uploadFile = $("#custom_image").fileinput({
                    overwriteInitial: true,
                    maxFileSize: 500,
                    showClose: false,
                    showUpload: false,
                    showCaption: false,
                    browseOnZoneClick: true,
                    browseLabel: '',
                    removeLabel: '',
                    browseIcon: '<i class="glyphicon glyphicon-folder-open"></i>',
                    removeIcon: '<i class="glyphicon glyphicon-remove"></i>',
                    removeTitle: '' + i18next.t('defaults.product.click_cancel_select'),
                    elErrorContainer: '#kv-avatar-errors-1',
                    msgErrorClass: 'alert alert-block alert-danger',
                    defaultPreviewContent: '<img style="max-width: 200px;" src="' + image + '" alt="' + i18next.t('defaults.product.image') + '"><h6 class="text-muted">' + i18next.t('defaults.product.click_select') + '</h6>',
                    allowedFileExtensions: ["jpg", "png", "jpeg"]
                });
                if (aData.custom_image!==''){
                    var img = new Image();
                    img.src = self.urlUpload + aData.id + "/" + aData.custom_image;
                    var splitSTR = aData.custom_image.split(".");
                    var file = new File([img.src], aData.custom_image, {
                        lastModified: Date.parse(new Date()),
                        type: "image/" + splitSTR[splitSTR.length-1]
                    });
                    uploadFile.fileinput('addToStack', [file]);
                }

                self.buildSelect("#select_product_category", null, i18next.t("selects.placeholder.select_category"), $('#modal-content-body'), { url: "/product_category/list", query: "", selected: aData.product_category.id});
            }, template);
            self.$el.parent().find("#modal-content-body").html(html);
            self.setTextModal(literal1, literal2, literal3);
            $("#principalModal").on('shown.bs.modal', function (event) {
                self.createRulesForm();
            }).
            on('show.bs.modal', function (event) {
                $(event.currentTarget).find(".modal-dialog").addClass('modal-lg')
            }).
            on('hide.bs.modal', function (event) {
                $(event.currentTarget).find(".modal-dialog").removeClass('modal-lg')
            });
            $('#principalModal').modal('show');
    },
    /**
    * @name setTableAttributes
    */
    setTableAttributes: function(data){
        var self = this;
        var rows = _.map(data.domain,function(product){
            return {
                id: product.id,
                client: product.client,
                product_category: product.product_category,
                code: product.code,
                barcode: product.barcode,
                name: product.name,
                custom_image: product.custom_image,
                image: "<img class='img-thumbnail' width='150' src='" + self.urlUpload + "/" +product.id+"/"+product.custom_image+"'/>",
                product_category_id: product.product_category.name,
                client_id: product.client.name
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
            barcode: {
                required: true,
                maxlength: 50,
                normalizer: function (value) {
                    return $.trim(value);
                }
            },
            code: {
                required: true,
                maxlength: 50,
                normalizer: function (value) {
                    return $.trim(value);
                }
            },
            product_category_id: {
                required: true,
                normalizer: function (value) {
                    return $.trim(value);
                }
            }
        };
        self.onSetRulesForm(form, rulesForm);
    }
});