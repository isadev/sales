/**
 * ProductCategory Collection de donde extienden las demas colecciones
 */
var ProductCategoryCollection = BaseCollection.extend({
	model : ProductCategoryModel,
	/**
	 * Variable donde se almacena la URL original del modelo cuando se consulta
	 * con parametros en la URL.
	 */
	url: "/product_category/list",
	/**
	 * Función que ejecuta el callback luego de la carga de la collection.
	 * 
	 */
	initialize: function () {
		var self = this;
	}
});