/**
 * Invoice Collection de donde extienden las demas colecciones
 */
var InvoiceCollection = BaseCollection.extend({
	model : InvoiceModel,
	/**
	 * Variable donde se almacena la URL original del modelo cuando se consulta
	 * con parametros en la URL.
	 */
	url: "/invoice/list",
	/**
	 * Función que ejecuta el callback luego de la carga de la collection.
	 * 
	 */
	initialize: function () {
		var self = this;
	}
});