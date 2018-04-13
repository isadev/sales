/**
 * ModelItinerary correspondiente al modelo de la entidad Usuarios
 */
var ItineraryModel = BaseModel.extend({

    initialize: function(){
        // _.bindAll(this);
    },

    defaults: {
        address: "",
        date_time: "",
        city_id: "",
        geolocation: "",
        user_id: "",
        customer_id: "",
        itinerary_type_id: "",
        status_id: "",
        customer_contact_id: "",
        observation: "",
        client_id: ""
    },

    url: function(){
        return app.API + '/itinerary';
    }

});

