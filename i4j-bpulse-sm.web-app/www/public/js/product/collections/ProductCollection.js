/**
 * Product Collection de donde extienden las demas colecciones
 */
var ProductCollection = BaseCollection.extend({
	model : ProductModel,
	/**
	 * Variable donde se almacena la URL original del modelo cuando se consulta
	 * con parametros en la URL.
	 */
	url: "/product/list",
	/**
	 * Función que ejecuta el callback luego de la carga de la collection.
	 * 
	 */
	initialize: function () {
		var self = this;
	}
});