/**
 * CustomerAssign Collection de donde extienden las demas colecciones
 */
var CustomerAssignCollection = BaseCollection.extend({
	model : CustomerAssignModel,
	/**
	 * Variable donde se almacena la URL original del modelo cuando se consulta
	 * con parametros en la URL.
	 */
	url: "/customer/list_assign",
	/**
	 * Función que ejecuta el callback luego de la carga de la collection.
	 * 
	 */
	initialize: function () {
		var self = this;
	}
});