/**
 * ModelClient correspondiente al modelo de la entidad Usuarios
 */
var ClientModel = BaseModel.extend({

    initialize: function(){
        // _.bindAll(this);
    },

    defaults: {
        name: "",
        contact_first_name: "",
        contact_last_name: "",
        phone: "",
        address: "",
        postel_code: "",
        email: "",
        bpulse_url: "",
        city_id: "",
        enable: ""
    },

    url: '/client/create'
});

