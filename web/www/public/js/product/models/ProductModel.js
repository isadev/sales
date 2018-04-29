/**
 * ModelProduct correspondiente al modelo de la entidad Usuarios
 */
var ProductModel = BaseModel.extend({

    initialize: function(){
        // _.bindAll(this);
    },

    defaults: {
        code: "",
        barcode: "",
        name: "",
        custom_image: "",
        product_category_id: "",
        client_id: ""
    },

    url: function(){
        return app.API + '/product';
    }

});

