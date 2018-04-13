/**
 * View de InvoiceDetails
 */
var InvoiceDetailsView = BaseView.extend({
    rootTemplate: "invoice",
    template:     "content-invoice-details",
    formId:        "#form-invoice-details",
    /**
     * @name initialize_child
     * @description Método de inicialización
     */
    initialize_child: function (options) {
        var self = this;
        self.options = options || {};
    },
    /**
     * @name render
     */
    render:function () {
        var self = this;
        var invoiceModel = new InvoiceModel({ id: self.options.id });
        invoiceModel.fetch({
            success: function (colection, response, jqXHR) {
                if (response !== null) {
                    self.loadTemplate({ invoice: response.domain[0]});
                }
            },
            error: function (err) {
                console.war("Has been error Fetch: ", err)
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
    }
});