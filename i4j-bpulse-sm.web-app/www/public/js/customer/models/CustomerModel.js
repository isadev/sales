/**
 * ModelCustomer correspondiente al modelo de la entidad Usuarios
 */
var CustomerModel = BaseModel.extend({

    initialize: function(){
        // _.bindAll(this);
    },

    defaults: {
        name: "",
        phone: "",
        address: "",
        postal_code: "",
        nit: "",
        city_id: "",
        geolocation: "",
        client_id: ""
    },

    url: function(){
        return app.API + '/customer';
    }

});

