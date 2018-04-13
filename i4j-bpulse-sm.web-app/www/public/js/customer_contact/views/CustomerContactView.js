/**
 * View de CustomerContact
 */
var CustomerContactView = BaseView.extend({
    rootTemplate: "customer_contact",
    template:     "content-customer_contact",
    tableId:     "#table-customer_contacts",
    formId:        "#form-customer_contact",
    urlList: "/customer_contact/list",
    getTableColums: [
        {"node": "customer_contacts", "attribute": "first_name"},
        {"node": "customer_contacts", "attribute": "last_name"},
        {"node": "customer_contacts", "attribute": "email"},
        {"node": "customer_contacts", "attribute": "phone"},
        {"node": "customer_contacts", "attribute": "mobile"},
        {"node": "customer_contacts", "attribute": "job_attribute"},
        {"node": "customer_contacts", "attribute": "customer_id"}
    ],
    getTableColumnDefs: [
        {"target": 0,"visible": true,"searchable": true},
        {"target": 1,"visible": true,"searchable": true},
        {"target": 2,"visible": true,"searchable": true},
        {"target": 3,"visible": true,"searchable": true},
        {"target": 4,"visible": true,"searchable": true},
        {"target": 5,"visible": true,"searchable": true},
        {"target": 6,"visible": true,"searchable": true}
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
        var callback = function(){
            DomainDataTables.Delete(table, rowObject);
        }
        DomainAlertMessages.AlertCustom(i18next.t("message:message.alert.title.customer_contacts.delete"), i18next.t("message:message.alert.text.customer_contacts.delete"), "warning", callback)
    },
    /**
     * @name onEdit
     */
    onEdit: function (table, rowObject){
        var self = this;
        var aData = self.fromToJSON(self.formId);
         aData = JSON.parse(aData);
        DomainDataTables.Update(aData, table, rowObject);
        $('#principalModal').modal('hide');
    },
    /**
     * @name renderModal
     */
    renderModal: function (aData, table, rowObject, action){
        var self = this, html="";
        switch (action) {
            case "edit":
                var literal1 = "modals.title.customer_contact.edit";
                var literal2 = "modals.buttons.customer_contact.close";
                var literal3 = "modals.buttons.customer_contact.edit";
                // Contenido del formilario 
                var aData = aData; 
                var template= {
                    name: "content-modal",
                    container: "#modal-content-body"
                }
                self.$el.parent().find("#modal-btn-save").on("click", function(){
                    self.onEdit(table, rowObject)
                });
                break;
            case "create":
                var literal1 = "modals.title.customer_contact.create"
                var literal2 = "modals.buttons.customer_contact.close"
                var literal3 = "modals.buttons.customer_contact.create"            
                var aData = {
                    id: "",
                    name: "",
                    client_id: ""
                }
                var template = {
                    name: "content-modal",
                    container: "#modal-content-body"
                }
                break;
            default:
                console.warn("Not select translate");
                break;
            }
            self.loadTemplate({ customer_contact: aData }, null, template);
            self.$el.parent().find("#modal-content-body").html(html);
            self.setTextModal(literal1, literal2, literal3);
            $('#principalModal').modal('show');
        },
    /**
    * @name setTableAttributes
    */
    setTableAttributes: function(data){
        var self = this;
        var rows = _.map(data.domain,function(customer_contact){
            return {
                first_name: customer_contact.first_name,
                last_name: customer_contact.last_name,
                email: customer_contact.email,
                phone: customer_contact.phone,
                mobile: customer_contact.mobile,
                job_title: customer_contact.job_title,
                customer_id: customer_contact.customer_id
            };
        });
        return rows;
    }
});