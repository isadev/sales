/**
 * CustomerContact Collection de donde extienden las demas colecciones
 */
var CustomerContactCollection = BaseCollection.extend({
	model : CustomerContactModel,
	/**
	 * Variable donde se almacena la URL original del modelo cuando se consulta
	 * con parametros en la URL.
	 */
	url: "/customer_contact/list",
	/**
	 * Función que ejecuta el callback luego de la carga de la collection.
	 * 
	 */
	initialize: function () {
		var self = this;
	}
});