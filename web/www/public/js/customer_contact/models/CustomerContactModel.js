/**
 * ModelCustomerContact correspondiente al modelo de la entidad Usuarios
 */
var CustomerContactModel = BaseModel.extend({

    initialize: function(){
        // _.bindAll(this);
    },

    defaults: {
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        mobile: "",
        job_title: "",
        customer_id: ""
    },

    url: function(){
        return app.API + '/customer_contact';
    }

});

