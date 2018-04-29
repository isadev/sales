/**
 * Questionnaire Collection de donde extienden las demas colecciones
 */
var QuestionnaireCollection = BaseCollection.extend({
	model : QuestionnaireModel,
	/**
	 * Variable donde se almacena la URL original del modelo cuando se consulta
	 * con parametros en la URL.
	 */
	url: "/questionnaire/list",
	/**
	 * Función que ejecuta el callback luego de la carga de la collection.
	 * 
	 */
	initialize: function () {
		var self = this;
	}
});