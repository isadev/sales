/**
 * Itinerary Collection de donde extienden las demas colecciones
 */
var ItineraryCollection = BaseCollection.extend({
	model : ItineraryModel,
	/**
	 * Variable donde se almacena la URL original del modelo cuando se consulta
	 * con parametros en la URL.
	 */
	url: "/itinerary/list",
	/**
	 * Función que ejecuta el callback luego de la carga de la collection.
	 * 
	 */
	initialize: function () {
		var self = this;
	}
});