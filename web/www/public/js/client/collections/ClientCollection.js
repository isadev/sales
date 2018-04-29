/**
 * Client Collection de donde extienden las demas colecciones
 */
var ClientCollection = BaseCollection.extend({
	model : ClientModel,
	/**
	 * Variable donde se almacena la URL original del modelo cuando se consulta
	 * con parametros en la URL.
	 */
	url: "/client/list",
	/**
	 * Función que ejecuta el callback luego de la carga de la collection.
	 * 
	 */
	initialize: function () {
		var self = this;
	}
});