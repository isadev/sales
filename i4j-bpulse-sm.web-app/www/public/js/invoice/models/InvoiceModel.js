/**
 * ModelInvoice correspondiente al modelo de la entidad Usuarios
 */
var InvoiceModel = BaseModel.extend({

    initialize: function(){
        // _.bindAll(this);
    },

    defaults: {
        customer_id: "",
        itinerary_id: "",
        code: "",
        discount: "",
        order_date_time: "",
        delivery_date_time: "",
        delivery_address: "",
        city_id: "",
        client_id: "",
        payment_method_id: ""
    },

    url: function(){
        return '/invoice/search/'+this.get("id");
    }

});

