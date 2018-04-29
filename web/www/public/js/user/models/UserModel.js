/**
 * ModelUser correspondiente al modelo de la entidad Usuarios
 */
var UserModel = BaseModel.extend({

    initialize: function(){
        // _.bindAll(this);
    },

    defaults: {
        id: 0,
        first_name: '',
        last_name: '',
        email: '',
        role_id: '',
        client_id: '',
        impersonate: false
    },

    url: function(){
        return app.API + '/user';
    }

});

