/**
 * ModelProductCategory correspondiente al modelo de la entidad Usuarios
 */
var ProductCategoryModel = BaseModel.extend({

    initialize: function(){
        // _.bindAll(this);
    },

    defaults: {
        id: "",
        name: "",
        client_id: ""
    },

    url: function(){
        return app.API + '/product_category';
    }

});

