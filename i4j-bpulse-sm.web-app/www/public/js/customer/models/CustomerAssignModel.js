/**
 * ModelCustomerAssign correspondiente al modelo de la entidad Usuarios
 */
var CustomerAssignModel = BaseModel.extend({

    initialize: function(){
        // _.bindAll(this);
    },

    defaults: {
        id: "",
        date_created: "",
        user_created: "",
        customer: "",
        customer_id: "",
        status: "",
        date_updated: "",
        user_updated: "",
        user_id: ""
    },

    url: function(){
        return app.API + '/customer';
    }

});

