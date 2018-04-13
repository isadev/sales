/**
 * Base Collection de donde extienden las demas colecciones
 */
var BaseCollection = Backbone.Collection.extend({
	baseModel : BaseModel,
	/**
	 * Variable donde se almacena la URL original del modelo cuando se consulta
	 * con parametros en la URL.
	 */
	urlBase : "",

	/**
	 * Funci&oacute;n que limpia la URL despues de usarse la obtenci&oacute; con
	 * parametros.
	 * 
	 * @function
	 * @private
	 * @name: cleanUrlOfParams
	 * @return {void}
	 */
	cleanUrlOfParams : function() {
		var self = this;
		if (self.urlBase !== null && self.urlBase !== undefined && self.urlBase !== '') {
			self.url = self.urlBase;
		}
	},
	/**
	 * Función que ejecuta el callback luego de la carga de la collection.
	 * 
	 */
	done : function(callback) {
		var self = this;
		self.fnCallback = callback;
	},
	/**
	 * Funci&oacute;n que sobreescribe la funci&oacute;n fetch para hacer uso
	 * del modelo base para recuperar la data.
	 * 
	 */
	fetch : function(options) {
		var self = this;
		self.fnAdd = self.fnAddCollection;
		self.baseModel = new BaseModel();

		return self.runFetch(options);
	},
	/**
	 * Funci&oacute;n que se intera que sobreescribe en BaseCollection
	 * seg&uacute;n la petici&oacute;n de datos con fetch.
	 */
	fnAdd : null,
	/**
	 * Funci&oacute;n que debe ser definida cuando se extiende de BaseCollection
	 * ya que es la que se ejecuta cuando se obtienen los datos con fetch.
	 */
	fnAddCollection: function (data) {
		var self = this;

		if (data && data.error === null && data.domain !== null) {
			self.add(data.domain);
		}
	},
	/**
	 * Funci&oacute;n que debe ser definida cuando se extiende de BaseCollection
	 * ya que es la que se ejecuta cuando se obtienen los datos con fetch de un
	 * registro unico.
	 */
	fnAddUniqueModel : null,
	/**
	 * Funci&oacute;n que se define cuando se hace uso de .done() para agregar
	 * callbaks al obtener.
	 */
	fnCallback : null,
	/**
	 * Funci&oacute;n que permite obtener un modelo por el Id.
	 * 
	 */
	getById : function(modelId) {
		var self = this;
		self.fnAdd = self.fnAddUniqueModel;
		self.baseModel = new BaseModel({
			id : modelId
		});

		return self.runFetch();
	},
	/**
	 * Funci&oacute;n que permite obtener del modelo base que lo implemente.
	 * 
	 */
	runFetch : function(options) {
		var self = this;
		self.reset();
		self.baseModel.urlRoot += self.url;
		var fullOptions = _.extend(options || {}, {
			success: function (colection, response, jqXHR) {
				if (response !== null) {
					self.fnAdd(response);
				}
				self.cleanUrlOfParams();
				if (self.fnCallback !== null) {
					self.fnCallback();
				}
			},
			error: function (err) {
				console.war("Has been error Fetch: ", err)
			}
		});
		self.baseModel.fetch(fullOptions);
		return self;
	}	
});