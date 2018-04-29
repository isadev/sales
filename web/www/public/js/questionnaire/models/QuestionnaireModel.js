/**
 * ModelQuestionnaire correspondiente al modelo de la entidad Usuarios
 */
var QuestionnaireModel = BaseModel.extend({

    initialize: function(){
        // _.bindAll(this);
    },

    defaults: {
        "label": "",
        "enabled": "",
        "itinerary_type_id": "",
        "client_id": ""
    },

    url: function(){
        return app.API + '/questionnaire';
    }

});

